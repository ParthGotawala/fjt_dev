//copied as-is from resumable github
var fs = require('fs'), fsextra = require('fs-extra'), path = require('path'), util = require('util'), Stream = require('stream').Stream;



module.exports = resumable = function (temporaryFolder) {
  var $ = this;
  $.temporaryFolder = temporaryFolder;
  $.maxFileSize = null;
  $.fileParameterName = 'file';

  try {
    fs.mkdirSync($.temporaryFolder);
  } catch (e) { }


  var cleanIdentifier = function (identifier) {
    return identifier.replace(/^0-9A-Za-z_-/img, '');
  }

  var getChunkFilename = function (chunkNumber, identifier) {
    // Clean up the identifier
    identifier = cleanIdentifier(identifier);
    // What would the file name be?
    return path.join($.temporaryFolder, './resumable-' + identifier + '.' + chunkNumber);
  }

  var validateRequest = function (chunkNumber, chunkSize, totalSize, identifier, filename, fileSize) {
    // Clean up the identifier
    identifier = cleanIdentifier(identifier);

    // Check if the request is sane
    if (chunkNumber == 0 || chunkSize == 0 || totalSize == 0 || identifier.length == 0 || filename.length == 0) {
      return 'non_resumable_request';
    }
    var numberOfChunks = Math.max(Math.floor(totalSize / (chunkSize * 1.0)), 1);
    if (chunkNumber > numberOfChunks) {
      return 'invalid_resumable_request1';
    }

    // Is the file too big?
    if ($.maxFileSize && totalSize > $.maxFileSize) {
      return 'invalid_resumable_request2';
    }

    if (typeof (fileSize) != 'undefined') {
      if (chunkNumber < numberOfChunks && fileSize != chunkSize) {
        // The chunk in the POST request isn't the correct size
        return 'invalid_resumable_request3';
      }
      if (numberOfChunks > 1 && chunkNumber == numberOfChunks && fileSize != ((totalSize % chunkSize) + chunkSize)) {
        // The chunks in the POST is the last one, and the fil is not the correct size
        return 'invalid_resumable_request4';
      }
      if (numberOfChunks == 1 && fileSize != totalSize) {
        // The file is only a single chunk, and the data size does not fit
        return 'invalid_resumable_request5';
      }
    }

    return 'valid';
  }
  var appendLeadingZeroes = function (n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n
  }
  var getFormattedDate = function (dateObj) {
    return dateObj.getFullYear() + "-" + appendLeadingZeroes(dateObj.getMonth() + 1) + "-" + appendLeadingZeroes(dateObj.getDate());
  }
  var getCustomDate = function (day) {
    var customDate = new Date();
    customDate.setDate(customDate.getDate() - day);
    return getFormattedDate(customDate);
  }
  //
  $.removeChunkFile = function () {
    var files = fs.readdirSync($.temporaryFolder);
    fs.readdir($.temporaryFolder, function (err, list) {
      list.forEach(function (file) {
        var stats = fs.statSync($.temporaryFolder + "/" + file);
        if (typeof(stats) === "object") {
          var currentDate = new Date();
          currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, currentDate.getDate(), 0, 0, 0);

          stats.mtime.setHours(0, 0, 0);

          if (currentDate > stats.birthtime) {
            fs.unlinkSync($.temporaryFolder + "/" + file);
          }
        }
      })
    });
  }
  //'found', filename, original_filename, identifier
  //'not_found', null, null, null
  $.get = function (req, callback) {
    var chunkNumber = req.param('resumableChunkNumber', 0);
    var chunkSize = req.param('resumableChunkSize', 0);
    var totalSize = req.param('resumableTotalSize', 0);
    var identifier = req.param('resumableIdentifier', "");
    var filename = req.param('resumableFilename', "");

    if (validateRequest(chunkNumber, chunkSize, totalSize, identifier, filename) == 'valid') {
      var chunkFilename = getChunkFilename(chunkNumber, identifier);
      fs.exists(chunkFilename, function (exists) {
        if (exists) {
          callback('found', chunkFilename, filename, identifier);
        } else {
          callback('not_found', null, null, null);
        }
      });
    } else {
      callback('not_found', null, null, null);
    }
  }

  //'partly_done', filename, original_filename, identifier
  //'done', filename, original_filename, identifier
  //'invalid_resumable_request', null, null, null
  //'non_resumable_request', null, null, null
  $.post = function (req, callback) {

    var fields = req.body;
    var files = req.files;

    var chunkNumber = fields['resumableChunkNumber'];
    var chunkSize = fields['resumableChunkSize'];
    var totalSize = fields['resumableTotalSize'];
    var identifier = cleanIdentifier(fields['resumableIdentifier']);
    var filename = fields['resumableFilename'];

    var original_filename = fields['resumableIdentifier'];



    if (!files[$.fileParameterName] || !files[$.fileParameterName].size) {
      callback('invalid_resumable_request', null, null, null);
      return;
    }
    var validation = validateRequest(chunkNumber, chunkSize, totalSize, identifier, files[$.fileParameterName].size);
    if (validation == 'valid') {
      var chunkFilename = getChunkFilename(chunkNumber, identifier);

      // Save the chunk (TODO: OVERWRITE)      
      fsextra.move(files[$.fileParameterName].path, chunkFilename, function (isCreated) {
        // Do we have all the chunks?
        var currentTestChunk = 1;
        var numberOfChunks = Math.max(Math.floor(totalSize / (chunkSize * 1.0)), 1);
        var testChunkExists = function () {
          var chunkFileName = getChunkFilename(currentTestChunk, identifier);
          fs.exists(getChunkFilename(currentTestChunk, identifier), function (exists) {
            if (exists) {
              currentTestChunk++;
              //if(currentTestChunk == (numberOfChunks)) {
              if (currentTestChunk > numberOfChunks) {
                callback('done', filename, original_filename, identifier);
              } else {
                // Recursion
                testChunkExists();
              }
            } else {
              callback(200, filename, original_filename, identifier);
            }
          });
        }
        testChunkExists();
      });
    } else {
      callback(validation, filename, original_filename, identifier);
    }
  }


  // Pipe chunks directly in to an existsing WritableStream
  //   r.write(identifier, response);
  //   r.write(identifier, response, {end:false});
  //
  //   var stream = fs.createWriteStream(filename);
  //   r.write(identifier, stream);
  //   stream.on('data', function(data){...});
  //   stream.on('end', function(){...});
  $.write = function (req, identifier, writableStream, options) {
    options = options || {};
    options.end = (typeof options['end'] == 'undefined' ? true : options['end']);
    var fields = req.body;

    var totalSize = fields['resumableTotalChunks'];

    // Iterate over each chunk
    var pipeChunk = function (number) {

      var chunkFilename = getChunkFilename(number, identifier);
      fs.exists(chunkFilename, function (exists) {
        if (exists) {
          // If the chunk with the current number exists,
          // then create a ReadStream from the file
          // and pipe it to the specified writableStream.
          var sourceStream = fs.createReadStream(chunkFilename);
          sourceStream.pipe(writableStream, {
            end: false
          });
          sourceStream.on('end', function () {
            // When the chunk is fully streamed,
            // jump to the next one
            pipeChunk(number + 1);

            // Remove all File in case on last file read successfully 
            if (number > totalSize) {
              this.clean(identifier);
            }
            console.log("Number:" + number);
          });
        } else {
          // Remove all File in case on last file read successfully
          if (number > totalSize) {
            this.clean(identifier);
          }
          // When all the chunks have been piped, end the stream
          if (options.end) writableStream.end();
          if (options.onDone) options.onDone();
        }
      });
    }
    pipeChunk(1);
  }


  $.clean = function (identifier, options) {
    options = options || {};

    // Iterate over each chunk
    var pipeChunkRm = function (number) {

      var chunkFilename = getChunkFilename(number, identifier);

      //console.log('removing pipeChunkRm ', number, 'chunkFilename', chunkFilename);
      fs.exists(chunkFilename, function (exists) {
        if (exists) {

          console.log('exist removing ', chunkFilename);
          fs.unlink(chunkFilename, function (err) {
            if (err && options.onError) options.onError(err);
          });

          pipeChunkRm(number + 1);

        } else {

          if (options.onDone) options.onDone();

        }
      });
    }
    pipeChunkRm(1);
  }

  return $;
}

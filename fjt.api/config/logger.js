const jade = require('jade');
const _ = require('lodash');

let wld;

module.exports = (app, logger) => {
  // eslint-disable-next-line global-require
  wld = new (require('./lib/wld'))(logger);

  app.get('/logs', (req, res) => {
    res.redirect('/logs/1');
  });

  app.get('/logs/:page', (req, res) => {
    const itemsOnPage = 30;
    let page = _.get(req, 'params.page', 1);

    try {
      page = parseInt(page);
    } catch (e) {
      page = 1;
    }

    if (page < 1) {
      page = 1;
    }

    wld.list({
      limit: itemsOnPage,
      offset: (page - 1) * itemsOnPage,
      page: page
    }).then((logs) => {
        res.send(jade.renderFile(__dirname + '/views/logs.jade', {
        logs,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page + 1
      }, null));
    });
  });
};

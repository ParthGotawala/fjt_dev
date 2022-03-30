md D:\MongoDB\MongoDB4.0Data\WiredTiger
md D:\MongoDB\Log\

type NUL > "D:\MongoDB\Log\mongo.log"

echo logpath=D:\MongoDB\Log\Mongo.log >"C:\Program Files\MongoDB\Server\4.4\Mongod.cfg"

"C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe" --config "C:\Program Files\MongoDB\Server\4.4\Mongod.cfg" --dbpath "D:\MongoDB\MongoDB4.0Data\WiredTiger" --storageEngine wiredTiger --install
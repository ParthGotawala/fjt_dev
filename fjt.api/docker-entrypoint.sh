#!/bin/sh

npm install
n=0
until [ $n -ge 5 ]
do
	echo "Trying to migrate ($n)"
	npm run migrate && echo "Migration complete" && break
	n=$((n+1))
	sleep 10
done
echo "Install and migration finished."

exec "$@"

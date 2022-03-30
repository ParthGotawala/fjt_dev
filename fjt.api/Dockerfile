FROM mhart/alpine-node

ENTRYPOINT ["docker-entrypoint.sh"]

COPY ./docker-entrypoint.sh /usr/local/bin

COPY ./package.json /usr/src/app

RUN apk update \
	&& apk add curl git fontconfig ttf-liberation \
	&& rm /usr/src/app \
	&& mkdir -p /usr/src/app \
	&& chmod +x /usr/local/bin/docker-entrypoint.sh \
	&& curl -Ls https://github.com/fgrehm/docker-phantomjs2/releases/download/v2.0.0-20150722/dockerized-phantomjs.tar.gz | tar xz -C /

WORKDIR /usr/src/app/

EXPOSE 2003 9003

CMD ["npm", "start"]

FROM node:7.10.0

# Create app directory
WORKDIR /app

# Install app dependencies
ADD . /app

RUN yarn

# replace this with your application's default port
EXPOSE 8443

CMD ["yarn", "hot"]
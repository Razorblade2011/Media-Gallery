FROM node:alpine
WORKDIR /app
RUN apk update
RUN apk upgrade
RUN apk add --no-cache ffmpeg
COPY . .
RUN npm install
RUN mkdir -p /upload/original
RUN mkdir -p /upload/preview
EXPOSE 5000
CMD [ "npm", "run", "start" ]
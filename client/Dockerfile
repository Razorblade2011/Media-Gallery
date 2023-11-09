FROM node:alpine as build
ENV VITE_API_URL='http://localhost:5000/api'
ENV VITE_API_STATIC='http://localhost:5000'
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# production
FROM nginx:1.18
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/.nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
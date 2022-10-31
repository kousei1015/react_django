FROM node:16-alpine as build
WORKDIR /node
COPY . .
RUN npm run build

FROM nginx:latest
COPY --from=build /node/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
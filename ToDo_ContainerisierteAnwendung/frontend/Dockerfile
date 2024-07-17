# Stage 1
FROM node:21-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install -P
COPY . .
RUN npm run build

# Stage 2
FROM nginx:1.25.3-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

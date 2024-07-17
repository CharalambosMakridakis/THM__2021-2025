# Stage 1
FROM node:21-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install -P && npm install typescript -g
COPY . .
RUN tsc

# Stage 2
FROM node:21-alpine AS production
WORKDIR /app
COPY --from=build /app /app
EXPOSE 3000
CMD ["node", "./src/app.js"]

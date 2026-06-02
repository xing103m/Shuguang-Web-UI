FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/api/package.json apps/api/package.json
RUN npm install
COPY apps/api apps/api
RUN npm run build --workspace @pcdn/api

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/apps/api/dist dist
COPY apps/api/package.json package.json
EXPOSE 3000
CMD ["node", "dist/main.js"]

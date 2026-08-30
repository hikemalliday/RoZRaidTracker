FROM node:20-slim AS build

ARG VITE_MODE

COPY package*.json ./
RUN npm ci
COPY . .
RUN npx vite build --mode $VITE_MODE

FROM nginx:alpine
COPY --from=build /dist ./static/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

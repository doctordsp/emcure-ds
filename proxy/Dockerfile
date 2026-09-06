FROM node:22-alpine
WORKDIR /app
COPY package.json passcode.mjs complete.mjs server.mjs ./
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "server.mjs"]

FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Entrypoint pour lancer les migrations avant de démarrer
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY <<'EOS' /app/entrypoint.sh
#!/bin/sh
set -e
npx prisma migrate deploy
node dist/main.js
EOS
RUN chmod +x /app/entrypoint.sh
EXPOSE 3001
CMD ["/app/entrypoint.sh"]

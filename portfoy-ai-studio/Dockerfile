# Build stage - frontend only
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install Python and dependencies
RUN apk add --no-cache python3 py3-pip && \
    ln -sf python3 /usr/bin/python

COPY package*.json ./
RUN npm ci --omit=dev && npm install tsx

COPY --from=builder /app/dist ./dist
COPY server.ts ./
COPY services ./services
COPY src/lib/db.ts ./src/lib/db.ts
COPY src/lib/schema.ts ./src/lib/schema.ts

# Copy Python requirements and install packages
COPY requirements.txt ./
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# Copy Python scraper script
COPY scripts/scrape_tefas_historical.py ./scripts/

ENV NODE_ENV=production
ENV PORT=3000
ENV DB_HOST=db
ENV DB_PORT=5432
ENV DB_NAME=portfoy_ai
ENV DB_USER=postgres
ENV DB_PASSWORD=postgres

EXPOSE 3000

CMD ["npx", "tsx", "server.ts"]

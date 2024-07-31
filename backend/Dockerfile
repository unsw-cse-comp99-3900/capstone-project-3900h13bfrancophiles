FROM node:20 AS builder

# Set the current working directory inside the container
WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy backend source code
COPY . .

RUN yarn build

FROM node:20 AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY .env ./
COPY --from=builder /app/dist ./

EXPOSE 2000

ENV NODE_ENV production

CMD ["node", "src/index.js"]

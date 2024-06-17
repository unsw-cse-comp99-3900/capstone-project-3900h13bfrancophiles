FROM node:20.11-alpine as builder

# Set the current working directory inside the container
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy backend source code
COPY . .

RUN yarn build

FROM node:20.11-alpine as runner
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY .env ./
COPY --from=builder /app/dist ./

EXPOSE 2000

ENV NODE_ENV production

CMD ["node", "src/index.js"]

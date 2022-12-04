FROM node:16

# Create app dir
RUN mkdir ./app

# Copy files
COPY . ./app
WORKDIR /app

# Install dependencies
RUN npm install

# Transpile to js
RUN npm run build

# Set envs
ENV PORT=3000
ENV IP=0.0.0.0
ENV NODE_ENV=production
ENV ENABLE_LOGS=true

CMD [ "node", "dist/src/index.js" ]

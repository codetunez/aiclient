# AI Client
A React JS client app for using OpenAI

## Setup

1. Install [NodeJS](https://nodejs.org)

2. Clone this repo to a local folder

3. Register for an account from [OpenAI](https://openai.com/api/) and generate a new [API key](https://platform.openai.com/account/api-keys)

## Pre-Req

1. Open code file [config.ts](./src/config.ts) 

2. Update the OPEN_AI_KEY varaible with a dev key 

   from
   ```
   export const OPEN_AI_KEY = "<OpenAI developer key";
   ```
   to (example)
   ```
   export const OPEN_AI_KEY = "sk-7fh398fhd959dl295kf34kfzdsjfk32jfk25ddnndf445344";
   ```
## Running in dev mode

1. Open a command prompt in folder and run

   ```
   npm i && npm run start
   ```

2. Browser will automatically launch at http://localhost:3000

## Running in production mode

1. Open a command prompt in folder and run

   ```
   npm i && && npm run build && node index.js
   ```

2. Launch a Browser and goto http://localhost:3000

## Running as a Docker container
To run locally in a Docker container

1. Build the container locally

   ```
   docker build -t <myorg>/aiclient .
   ```

2. Run the container locally

   ```
   docker run --rm -d -p 3000:3000/tcp <myorg>/aiclient:latest
   ```
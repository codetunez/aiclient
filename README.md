# AI Client
A React JS client app for using OpenAI

## Setup

1. Install [NodeJS](https://nodejs.org)

2. Clone this repo to a local folder

3. Register for an account from [OpenAI](https://openai.com/api/) and generate a new [API key](https://platform.openai.com/account/api-keys)

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

1. Build the container locally (update myorg with any name you want)

   ```
   docker build -t <myorg>/aiclient .
   ```

2. Run the container locally

   ```
   docker run --rm -d -p 3000:3000/tcp <myorg>/aiclient:latest
   ```

3. Launch a Browser and goto http://localhost:3000


## Configuring API Keys in code
API keys can be provided in code and will override any added through the UX where the name of the API key matches. To add code level API keys

1. Open code file [config.ts](./src/config.ts) 

2. Add an entry to to the __ApiKeys__ array using the following example configuration

   ```
   export const ApiKeys: Array<ApiKey> = [
   {
        default: true,
        name: "Open AI #1",
        key: "sk-7fh398fhd959dl295kf34kfzdsjfk32jfk25ddnndf445344",
        service: "openai"
   }]
   ```

   Properties

   **default** Set to true to use the API Key as the default API. One must be set or will be automatically selected\
   **name** A friendly name for the API Key\
   **key** The secret key from OpenAI or Azure\
   **service** The service for the API key. Can only be _azure_ or _openai_


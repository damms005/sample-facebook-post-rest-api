# Sample Facebook Post API

![Project Art](https://banners.beyondco.de/Sample%20Facebook%20Post%20API.png?theme=light&packageManager=&packageName=A+RESTful+API+that+minimally+mimics+Facebook%27s+post+functionality.&pattern=architect&style=style_1&description=&md=1&showWatermark=1&fontSize=100px&images=speakerphone) This project aims to be a powerful RESTful implementation of the posts functionality of Facebook, with the major difference that this one is going to the moon 🚀🚀🚀.

It is an ExpressJS-powered Node application backend (server). Hence, you will need a client tool to interact with it.

## Setup

Please ensure to have the following set up and running:

- Node.js >= v15.14.0
- MySQL >= v8.0.25
- Terminal or Command Line
- [Postman](https://www.postman.com/downloads/) (to test our API with)
- [SendGrid](https://sendgrid.com) (for quick, scalable and reliable means of sending emails)

## Usage

1. Create an account with SendGrid, then follow [this guide](https://sendgrid.com/docs/ui/account-and-settings/api-keys/#creating-an-api-key) to get your SendGrid API keys
2. Create a database in MySQL
3. Clone this repo and `cd` into the cloned folder
4. Run `cp .env.example .env` from the terminal
5. UPDATE all `DATABASE_*` field in `.env` with the appropriate MySQL database details
6. Run `npm run setup-database`. This script creates the necessary database schema
7. Run `npm run dev` on the terminal to start the app. The app URL will be displayed on the terminal (e.g. `http://localhost:5000`)
8. Open Postman to interact with the app using the URL gotten in the step above.

## API Documentation
Postman documentation version of the API is [available here](https://documenter.getpostman.com/view/4254885/TzRa8Q7y)

## Test

`npm run test`

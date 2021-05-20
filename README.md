Please ensure to have the following set up and running:

- Node.js
- Terminal or Command Line
- Text Editor
- [Postman](https://blah-blah.com)
- [SendGrid](https://blah-blah.com)

Steps:

1. Follow this guide to get your SendGrid API keys https://sendgrid.com/docs/for-developers/sending-email/quickstart-nodejs/#prerequisites
2. Create database in MySQL and set its value in `.env`
3. Create a database in MySQL and update the `DATABASE_DATABASE` field in `.env` with the database name
4. `cd` to the clone folder and run `npm run setup-database`. This script creates the necessary database schema;

# TalentQL-Assessment

## Requirements
* Node v12.16 and later versions
* yarn
* MySQL version 8

## Setup steps
1) Clone repo by running 
```
git clone https://github.com/chygoz2/TalentQL-Assessment.git
```
2) Run `yarn install`
3) Copy contents of `.env.example` to `.env`
4) Create 2 new MYSQL databases, one for the application and one for running tests.
5) Set the MYSQL related values in the `.env` file to match what you have locally.
6) Set `TOKEN_SECRET` to any random alphanumeric string.
7) Run migrations using `yarn db:migrate`.
7) To start the server, run `yarn start`. If the `SERVER_PORT` variable was not changed in your `.env` file, then the application would be running on port 3000, and can be accessed at `http://127.0.0.1:3000`, otherwise it would run on the new port specified.
8) Run `yarn test` to run tests

## Note
Actual email sending requires configuration of a valid SMTP server. For the purpose of this project, preview of email on an Ethereal account would serve as test of email sending, unless you configure your own SMTP server account.

If you don't configure an SMTP server, then the preview of the email sent can be viewed by visiting the link logged on the console of your terminal where the application was started.

## API Documentation
The documentation of the various endpoints is available in the `reference` folder in the root directory. It was done using OpenApi v3.0.0, and can be viewed in a more user friendly manner by opening the folder using an application such as Stoplight Studio.
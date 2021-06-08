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
4) Create 2 new MYSQL databases, one for the application and one for running tests
5) Set the MYSQL related values in the `.env` file to match what you have locally
6) Set `TOKEN_SECRET` to any random alphanumeric string.
7) Run `yarn test` to run tests
8) To start the server, run `yarn start`. If the `SERVER_PORT` variable was not changed in your `.env` file, then the application would be running on port 3000, and can be accessed at `http://127.0.0.1:3000`, otherwise it would run on the new port specified.

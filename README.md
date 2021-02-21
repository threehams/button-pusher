# ludum-dare 46

Server and client for Ludum Dare 46 entry: (not yet named)

# Development

## Client

Install the latest stable version of node.js. Best done with NVM (node version manager).

[NVM for Windows](https://github.com/coreybutler/nvm-windows)
[NVM for everything else](https://github.com/creationix/nvm)

`$ nvm install 12.16.2`
`$ nvm use 12.16.2`

`$ npm install` to install all dependencies
`$ npm run dev` to start and open a dev server

## Tests

`$ npm run cy:open` to run Cypress (browser) tests against an existing server
`$ npm run cy:dev` to start a dev server and Cypress together (convenience!)

# Continuous Integration

Tests are run on CircleCI for all branches, and notify Github on
pending / success / failure. Results appear on pull requests.

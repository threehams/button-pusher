# nx-game-engine

Just a game engine made with nx, Next.js, Cypress, and a Web worker. There's a partially built game in here and a tiny/slow ECS thing.

# Development

## Client

Install the latest stable version of node.js. Best done with NVM (node version manager).

[NVM for Windows](https://github.com/coreybutler/nvm-windows)
[NVM for everything else](https://github.com/creationix/nvm)

`$ nvm install 12.16.2`
`$ nvm use 12.16.2`

`$ npm install` to install all dependencies
`$ npx nx serve frontend` to start and open a dev server

## Tests

`$ npx nx serve frontend-e2e` to run Cypress (browser) tests against an existing server

# Continuous Integration

Tests are run on CircleCI for all branches, and notify Github on
pending / success / failure. Results appear on pull requests.

# Blockchain-Enabled Storage and Delivery Prototype

A full-stack prototype exploring how Ethereum transactions can support order, stock and delivery workflows alongside a conventional web application.

## Features

- Client and provider dashboards
- User registration and login prototypes
- Stock, offer and order management
- PHP and MySQL data endpoints
- Ethereum wallet interaction through ethers.js
- Smart-contract ABI integration for order and delivery events

## Technology

React 19 · JavaScript · ethers.js · PHP · MySQL

## Local frontend

```bash
git clone https://github.com/BryanFinnon/storage-dapp.git
cd storage-dapp
npm install
npm start
```

The React application starts on [http://localhost:3000](http://localhost:3000).

## Repository structure

```text
src/pages/               client and provider interfaces
src/services/            blockchain integration
*.php                    experimental PHP endpoints
iot_datachain.sql        database schema
public/                  interface screenshots and static assets
```

## Project status

This is an exploratory prototype rather than a production dApp. The repository includes a contract ABI and address used by the client, but not the Solidity source or a reproducible contract deployment.

Before production use, the project would need:

- One documented backend architecture
- Environment-based API, database and contract configuration
- Contract source, deployment records and tests
- Authentication and access-control review
- Automated API, UI and integration tests

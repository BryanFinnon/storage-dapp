# Decentralised Storage dApp

An exploratory Web3 prototype for storing file metadata through a smart-contract-oriented workflow and retrieving content through a web interface.

## Project status

This repository is an early technical prototype. It contains useful experiments across frontend, backend, database, and Solidity code, but the architecture is not yet consolidated into a production-ready application.

## Current components

- React client for upload and retrieval workflows
- Experimental backend services
- Local database configuration
- Solidity contract prototype
- IPFS/Web3 integration experiments

## What this project demonstrates

- Connecting a browser interface to decentralised-storage concepts
- Modelling file metadata for on-chain references
- Exploring the boundary between blockchain state and off-chain content
- Comparing alternative backend approaches during prototyping

## Before running

Review the component-level configuration and choose one backend implementation. Local endpoints, database settings, contract addresses, and provider URLs must be supplied for your own environment; never commit private keys or credentials.

## Recommended next steps

- [ ] Select and document one supported architecture
- [ ] Complete and test the Solidity contract
- [ ] Replace local constants with environment configuration
- [ ] Add a root-level development command
- [ ] Add contract, API, and UI tests
- [ ] Document threat model and deployment process

## Limitations

This is not a production storage service. Security review, persistent deployment, access control, contract deployment records, and a reproducible end-to-end setup are still required.

## Author

Bryan Finnon — MSc Computer Science (Distinction), focused on applied AI and software engineering.

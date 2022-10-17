<img src="./Logo.png" alt="Decelium Logo" width="50" />

# Decelium Launchpad

[Decelium](https://www.decelium.com/) is a decentralized web hosting service. This repository contains tutorials to get you started using Decelium with a variety of kinds of web sites. The examples use React, Unity and Ethereum smart contracts. At the end of these tutorials you will have have an understanding of using the decentralized web with several important web technologies. 

Each directory folder contains a tutorial in the README.md file, and a subdirectory `final` which shows the final state of the project obtained after completing the tutorial.


## Tutorials

[**FirstReactApp**](./FirstReactApp/README.md) - Use the JavaScript UI-design library React to create a website showing the rotating React logo, and deploy it on Decelium.

[**FirstDApp**](./FirstDApp/README.md) - A decentralized app (dApp) in which you create and deploy an Ethereum smart contract with a variable stored on the blockchain, and create web and command-line interfaces using JavaScript to get and set the variable's value. The smart contract is written in the Ethereum smart contract language Solidity. The web interface is deployed on Decelium.

[**CryptocurrencyFaucet**](./CryptocurrencyFaucet/README.md) - Write and deploy an Ethereum smart contract and a JavaScript-based web interface to create your own cryptocurrency and mint funds from the currency to a website visitor. The smart contract is written in the Ethereum smart contract language Solidity. The web interface is deployed on Decelium.

[**NFT**](./NFT/README.md) - Write and deploy an Ethereum smart contract and a JavaScript-based web interface that allows visitors to issue themselves non-fungible tokens (NFTs) representing items in a video game. The smart contract is written in the Ethereum smart contract language Solidity. The web interface is deployed on Decelium.


## Recommended order

We recommend following the tutorials in this order:

1. FirstReactApp
2. FirstDApp
3. CryptocurrencyFaucet
4. NFT

## Testing

### Testing Prerequisites

Testing requires `node.js` to be installed. You must have Decelium installed, and have created a user and added some CPU to the user's account. You must have an Ethereum wallet with some Goerli test Ethereum in it. 
You must have an Infura account, and obtain an API key from the Dashboard.
You must create a file called `.env` in the root directory (i.e. the directory into which you cloned the Launchpad git repository) with the following contents:

        DECELIUM_PATH = 
        DECELIUM_WALLET_FILE =
        DECELIUM_WALLET_USER = 
        TEST_DEPLOY_URL = 
        INFURA_API_KEY = 
        WALLET_PRIVATE_KEY = 

where `DECELIUM_PATH` is the path to your Decelium directory, `DECELIUM_WALLET_FILE` is the path to your Decelium wallet file, `DECELIUM_WALLET_USER` is a user in your Decelium wallet, `TEST_DEPLOY_URL` should be `dev.paxfinancial.ai`, `INFURA_API_KEY` is the Infura API key you obtained earlier, and `WALLET_PRIVATE_KEY` is the private key of your Ethereum wallet.

### Running tests

To run the unit tests for all projects, cd into the root directory (i.e. the directory into which you cloned the git repository) and run `npm test`.

To run the test for a particular individual project, cd into that project's `final` directory and run `npm test`.




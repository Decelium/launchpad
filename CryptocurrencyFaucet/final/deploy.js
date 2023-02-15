#!/usr/local/bin/node

const fs = require('fs');
const ethers = require('ethers');


bytecode = fs.readFileSync('faucetContract_sol_Token.bin').toString();
abi = JSON.parse(fs.readFileSync('faucetContract_sol_Token.abi').toString());

const provider = new ethers.providers.InfuraProvider("goerli",INFURA_API_KEY);
const private_key = WALLET_PRIVATE_KEY;
const wallet = new ethers.Wallet(private_key);
const account = wallet.connect(provider);

const myContract = new ethers.ContractFactory(abi, bytecode, account);

async function main() {
    const contract = await myContract.deploy("DeceliumBucks","DecBUX");
    await contract.deployed();
    console.log(contract.address);
    console.log(contract.deployTransaction);
}

main();
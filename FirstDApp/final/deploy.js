#!/usr/local/bin/node

const fs = require('fs');
const ethers = require('ethers');
require('dotenv').config({path: __dirname+"/../../.env"});

bytecode = fs.readFileSync('mood_sol_MoodDiary.bin').toString();
abi = JSON.parse(fs.readFileSync('mood_sol_MoodDiary.abi').toString());

const provider = new ethers.providers.InfuraProvider("goerli",process.env.INFURA_API_KEY);
const private_key = process.env.WALLET_PRIVATE_KEY;
const wallet = new ethers.Wallet(private_key);
const account = wallet.connect(provider);

const myContract = new ethers.ContractFactory(abi, bytecode, account);

async function main() {
    const contract = await myContract.deploy();
    await contract.deployed();
    console.log(contract.address);
    console.log(contract.deployTransaction);
}

main();
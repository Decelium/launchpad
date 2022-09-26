#!/usr/local/bin/node

const fs = require('fs');
const ethers = require('ethers');


bytecode = fs.readFileSync('LW3Token_sol_LW3Token.bin').toString();
abi = JSON.parse(fs.readFileSync('LW3Token_sol_LW3Token.abi').toString());

const provider = new ethers.providers.WebSocketProvider(
    'wss://goerli.infura.io/ws/v3/555a93ec0c824ebe96a4d930dcf30124');
const private_key = 'f2b6c1ba66e25eae8e6b3fcbab8f02e94cb942549bbede6cbd02f1b7d60ccad2';
const wallet = new ethers.Wallet(private_key);
const account = wallet.connect(provider);

const myContract = new ethers.ContractFactory(abi, bytecode, account);

async function main() {
    const contract = await myContract.deploy("chemmingCoin","chemmC");
    
    console.log(contract.address);
    console.log(contract.deployTransaction);
}

main();
# Your first dApp

## Prerequisites

1. You should have Decelium installed.
2. You should have a Decelium wallet created.
3. You should have created a user in the Decelium wallet.
4. You should have added some CPU to the wallet from the Decelium test faucet.
5. You should have node.js installed.
6. You should have the node.js packages ethers and fs installed.
7. You should have the Solidity compile solcjs installed. You can install the compiler via node.js with the command `npm install -g solc`.
8. You should have created an Infura account.
9. You should have an Ethereum wallet, and have added some GoerliETH to the wallet using the Goerli faucet. This is most easily done with MetaMask.


## Create a project directory

## Create mood.sol in the project directory

Create the following Solidity program in your project directory using a text editor:

    // SPDX-License-Identifier:  MIT
    pragma solidity ^0.8.1;

    contract MoodDiary{
        string mood;
  
        //create a function that writes a mood to the smart contract
        function setMood(string memory _mood) public{
            mood = _mood;
        }

        //create a function that reads the mood from the smart contract
        function getMood() public view returns(string memory){
            return mood;
        }
    }

## Compile mood.sol

`solcjs --bin mood.sol`

`solcjs --abi mood.sol`


## Create deploy.js



    #!/usr/local/bin/node

    const fs = require('fs');
    const ethers = require('ethers');


    bytecode = fs.readFileSync('NAME_OF_BINARY_FILE.bin').toString();
    abi = JSON.parse(fs.readFileSync('NAME_OF_ABI_FILE.abi').toString());

    const provider = new ethers.providers.WebSocketProvider(
        'wss://goerli.infura.io/ws/v3/555a93ec0c824ebe96a4d930dcf30124');
    const private_key = 'YOUR_ETHEREUM_WALLET_PRIVATE_KEY';
    const wallet = new ethers.Wallet(private_key);
    const account = wallet.connect(provider);

    const myContract = new ethers.ContractFactory(abi, bytecode, account);

    async function main() {
        const contract = await myContract.deploy();
    
        console.log(contract.address);
        console.log(contract.deployTransaction);
    }

    main();

You need to get an endpoint from Infura.
You need to replace YOUR_ETHEREUM_WALLET_PRIVATE_KEY with your Ethereum wallet private key. Note that this is a security risk, and you should do it with a wallet that you only use for testing purposes.

## Deploy contract to Goerli Testnet

`node deploy.js`

Copy (e.g. to the clipboard or to a temporary text file) the contract address that is printed out.

## write index.html in dir website

index.html:

    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
      body {
        text-align: center;
        font-family: Arial, Helvetica, sans-serif;
      }

      div {
        width: 20%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
      }

      button {
        width: 100%;
        margin: 10px 0px 5px 0px;
      }
        </style>  
        <title>My First dApp</title>
      </head>
      <body>
        <script
            src="https://cdn.ethers.io/lib/ethers-5.6.umd.min.js"
            type="application/javascript"
        ></script>    
        <script>  
            const MoodContractAddress = "0x7c18621dad55Cf0C0254af0d8b966238808C22bc";
            const MoodContractABI = [{"inputs":[],
                                      "name":"getMood",
                                      "outputs": [{"internalType":"string",
                                                  "name":"",
                                                  "type":"string"}],
                                      "stateMutability":"view",
                                      "type":"function"},
                                     {"inputs":[{"internalType":"string",
                                                 "name":"_mood",
                                                 "type":"string"}],
                                      "name":"setMood",
                                      "outputs":[],
                                      "stateMutability":"nonpayable",
                                      "type":"function"}];
            let MoodContract;
            let signer;
         
            const provider = new ethers.providers.Web3Provider(window.ethereum, "goerli");
        
            provider.send("eth_requestAccounts", []).then(() => { 
                provider.listAccounts().then((accounts) => {
                    signer = provider.getSigner(accounts[0]);
                    MoodContract = new ethers.Contract(
                        MoodContractAddress,
                        MoodContractABI,
                        signer
                    );
                });
            });
        
            async function getMood() {
                const getMoodPromise = MoodContract.getMood();
                const Mood = await getMoodPromise;
                console.log(Mood);
            }
        
            async function setMood() {
                const mood = document.getElementById("mood").value;
                const setMoodPromise = MoodContract.setMood(mood);
                await setMoodPromise;
            }
        
        </script>    
        <div>
            <h1>This is my dApp!</h1>
            <p>Here we can set or get the mood:</p>
            <label for="mood">Input Mood:</label> <br />
            <input type="text" id="mood" />
            <button onclick="getMood()">Get Mood</button>
            <button onclick="setMood()">Set Mood</button>
        </div>
      </body>
    </html>


## deploy index.html on decelium

## test that you can set and get the mood via the website

## Create set.js, get.js


get.js:

    #!/usr/local/bin/node

    const ethers = require('ethers');

    const MoodContractAddress = "0x7c18621dad55Cf0C0254af0d8b966238808C22bc";
    const MoodContractABI =         [{"inputs":[],
                                      "name":"getMood",
                                      "outputs": [{"internalType":"string",
                                                  "name":"",
                                                  "type":"string"}],
                                      "stateMutability":"view",
                                      "type":"function"},
                                     {"inputs":[{"internalType":"string",
                                                 "name":"_mood",
                                                 "type":"string"}],
                                      "name":"setMood",
                                      "outputs":[],
                                      "stateMutability":"nonpayable",
                                      "type":"function"}];
    let MoodContract;
    let signer;

    const provider = new ethers.providers.WebSocketProvider(
        'wss://goerli.infura.io/ws/v3/555a93ec0c824ebe96a4d930dcf30124');

    MoodContract = new ethers.Contract(
        MoodContractAddress,
        MoodContractABI,
        provider
    );

    async function getMood() {
         const getMoodPromise = MoodContract.getMood();
         const Mood = await getMoodPromise;
         console.log(Mood);
    }

    async function main() {
        console.log("1");
        await getMood();
        console.log("2");
    }

    main();



set.js:

    #!/usr/local/bin/node

    const ethers = require('ethers');

    const MoodContractAddress = "0x7c18621dad55Cf0C0254af0d8b966238808C22bc";
    const MoodContractABI =         [{"inputs":[],
                                      "name":"getMood",
                                      "outputs": [{"internalType":"string",
                                                  "name":"",
                                                  "type":"string"}],
                                      "stateMutability":"view",
                                      "type":"function"},
                                     {"inputs":[{"internalType":"string",
                                                 "name":"_mood",
                                                 "type":"string"}],
                                      "name":"setMood",
                                      "outputs":[],
                                      "stateMutability":"nonpayable",
                                      "type":"function"}];
    let MoodContract;
    let signer;

    const provider = new ethers.providers.WebSocketProvider(
        'wss://goerli.infura.io/ws/v3/555a93ec0c824ebe96a4d930dcf30124');

    const private_key = 'f2b6c1ba66e25eae8e6b3fcbab8f02e94cb942549bbede6cbd02f1b7d60ccad2';
    const wallet = new ethers.Wallet(private_key);
    const account = wallet.connect(provider);

    MoodContract = new ethers.Contract(
        MoodContractAddress,
        MoodContractABI,
        account
    );

    async function setMood(mood) {
        const setMoodPromise = MoodContract.setMood(mood);
        await setMoodPromise;
    }

    async function main() {
        console.log("1");
        await setMood(process.argv[2]);
        console.log("2");
    }

    main();






test that you can set and get the mood via the command-line tools




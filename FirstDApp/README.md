<img src="../images/Logo.png" alt="Decelium Logo" width="50"/>

# Your first dApp

A decentralized application (dApp) is an application making use of decentralized technologies such as smart contracts.   Smart contracts can contain variables whose value is stored on the blockchain. In this tutorial you will write a contract, using the Ethereum smart contract language Solidity, that creates a variable on the blockchain and provides for its value to be set and read, and you will deploy this contract on the blockchain on a testing network.
You will also write a JavaScript-based web interface which allows a visitor to set and get the variable's value, as well as a Node.js command-line interface.

## Prerequisites

This tutorial assumes you have already:
1. Installed Decelium, created a wallet, created a user in the wallet, and added some CPU to the wallet from the Decelium test faucet.
2. Installed node.js.
3. Installed the Solidity compiler `solcjs`. You can install the compiler via node.js with the command `npm install -g solc`.
4. Created an Infura account.
5. Installed MetaMask.
6. Created an Ethereum wallet and added some GoerliETH to the wallet using the Goerli faucet. This is most easily done with MetaMask.

## Creating and deploying the dApp

### Create and compile the smart contract

1. Create a project directory
2. Create the following Solidity program, called `mood.sol`, in your project directory using a text editor:

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

3. Compile `mood.sol`  to `.bin` and `.abi` files with the following commands in your project directory:

        solcjs --bin mood.sol
        solcjs --abi mood.sol
    This will create files `mood_sol_MoodDiary.bin` and `mood_sol_MoodDiary.abi` in your project directory.


## Deploy the smart contract to the Goerli Testnet

1. Install the node.js packages `ethers` and `fs` in your project directory with the commands `npm install ethers` and `npm install fs` executed in your project directory.
2. In your project directory create a JavaScript program by the name of `deploy.js` with the following contents

        #!/usr/local/bin/node

        const fs = require('fs');
        const ethers = require('ethers');


        bytecode = fs.readFileSync('mood_sol_MoodDiary.bin').toString();
        abi = JSON.parse(fs.readFileSync('mood_sol_MoodDiary.abi').toString());

        const provider = new ethers.providers.WebSocketProvider(
            'wss://goerli.infura.io/ws/v3/INFURA_API_KEY');
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
    Replace `INFURA_API_KEY` with an Infura API key obtained from your Infura dashboard. Replace `YOUR_ETHEREUM_WALLET_PRIVATE_KEY` with your Ethereum wallet private key.
3. Deploy the contract to Goerli Testnet with the command `node deploy.js`, issued in your project directory. If the deployment is successful, the first line output will be the contract address. Copy the contract address to the clipboard or to a temporary text file; it will be needed in subsequent steps.

## Create the command line interface

1. In the project directory, create a JavaScript file `get.js` with the following contents:

        #!/usr/local/bin/node

        const ethers = require('ethers');

        const MoodContractAddress = "MOOD_CONTRACT_ADDRESS";
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
            'wss://goerli.infura.io/ws/v3/INFURA_API_KEY');

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
            await getMood();
        }

        main();
    Replace `MOOD_CONTRACT_ADDRESS` with the contract address that you copied after you deployed the contract.Replace `INFURA_API_KEY` with an Infura API key obtained from your Infura dashboard.

2. In the project directory, create a JavaScript file `set.js` with the following contents:

        #!/usr/local/bin/node

        const ethers = require('ethers');

        const MoodContractAddress = "MOOD_CONTRACT_ADDRESS";
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
            'wss://goerli.infura.io/ws/v3/INFURA_API_KEY');

        const private_key = 'YOUR_ETHEREUM_PRIVATE_KEY';
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
            await setMood(process.argv[2]);
        }

        main();
    Replace `MOOD_CONTRACT_ADDRESS` with the contract address that you copied after you deployed the contract. Replace `INFURA_API_KEY` with an Infura API key obtained from your Infura dashboard. Replace `YOUR_ETHEREUM_WALLET_PRIVATE_KEY` with your Ethereum wallet private key.
3. Set the mood by issuing, in the project directory, the command `node set [mood]` where `[mood]` is an appropriate mood such as `happy` or `sad` or whatever you prefer. If successful, MetaMask will open and ask you to approve the transaction.
4. After approving the transaction, wait 15 seconds or so to allow the blockchain to be updated, and then check that you can get the mood by issuing, in the project directory, the command `node get`. If successful, you will see the mood you entered previously printed out.
5. Practice setting and getting the mood.

## Creating a web interface

1. In your project directory created a directory called `static`. In the directory `static` create an HTML file with the following contents:

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
                const MoodContractAddress = "MOOD_CONTRACT_ADDRESS";
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
    Replace `MOOD_CONTRACT_ADDRESS` with the contract address that you copied after you deployed the contract. Note that the text defining the data structure `MoodContractABI` is the contents of the mood_sol_MoodDiary.abi file.
2. Check that the web interface works by serving it on a local webserver. A convenient choice is `lite-server`, which you install with `npm install -g lite-server`. Invoke lite-server by typing `lite-server` at the command line in the directory containing the HTML file, `[PROJECT_DIRECTORY]/static`.  You can then view the web page at `http://localhost:3000`. Enter a mood into the space and press the "Set mood" button. This should cause MetaMask to open and request you to confirm the transaction. Pressing the "Get mood" button will cause the mood to be printed out on the console of your web browser.

## Deploy the website on Decelium

1. `cd` to your `decelium/commands` directory. Deploy your website to Decelium with the command

    <pre> 
    python3 deploy.py <i>wallet_address</i> test.paxfinancial.ai <i>dest_path</i> <i>/[PATH]</i>/[PROJECT_DIRECTORY]/static/
    </pre>
The third argument, `dest_path` is a path that needs to begin with a slash and end with a `.ipfs` filename.     
Note that the trailing slash in the last argument is necessary.      
2.  Your website should be deployed to Decelium. If it has successfully deployed, you will see a line like `deployed...  obj-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  as  [filename]` where the `xxxx...` represents hexadecimal digits. This is an identifier unique to your deployment.
You should be able to view your website deployed on Decelium at `https://test.paxfinancial.ai/obj/obj-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/` (note the trailing slash).
 



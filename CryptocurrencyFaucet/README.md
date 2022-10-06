<img src="../Logo.png" alt="Decelium Logo" width="50" />

# Creating a Cryptocurrency Faucet on Decelium.com

A cryptocurrency faucet issues funds from a cryptocurrency to a user.  In this tutorial you will create your own cryptocurrency, use Solidity to write a contract for a faucet for the currency, use a JavaScript script to deploy the contract, and deploy the faucet website on Decelium.  At the end of the contract you will have a Decelium-deployed website which will issue amounts of your cryptocurrency to a user who visits the website.

## Prerequisites

Before you start this tutorial you should have done the following:

1. Installed Decelium.
2. Created a Decelium wallet, added a user to the wallet, and added some CPU to the user's account.
3. Installed node.js.
4. Installed the Solidity compiler, which is done with `npm install -g solc`.
5. Installed MetaMask.
6. Created an Ethereum wallet, which is most easily done with MetaMask.
7. Added some Goerli Testnet Ether to your Ethereum wallet, which can be done at this [faucet](https://faucets.chain.link/).
8. Created an account on Infura. 



## Creating the Faucet

### Write and compile the Faucet contract

1. Create a project directory named e.g. `CryptocurrencyFaucet`. `cd` into the project directory. 
2. Within the project directory, create a text file called `faucetContract.sol`.
3. Write the following Solidity program in `faucetContract.sol`:

        // SPDX-License-Identifier: MIT
        pragma solidity ^0.8.0;

        import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

        contract Token is ERC20 {
            constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {}

            function mint(uint _amount) public{
                _mint(msg.sender, _amount);
            }
        }    
 

4. In the project directory (e.g. `CryptocurrencyFaucet`) install the OpenZeppelin contracts by running `npm install @openzeppelin/contracts`.
5. Compile the contract to a `.bin` file by running

        solcjs --bin --include-path node_modules/ --base-path . faucetContract.sol
   This should create a file `faucetContract_sol_Token.bin`. It may also create other `.bin` files beginning with `@openzeppelin` (e.g. `@openzeppelin_contracts_token_ERC20_ERC20_sol_ERC20.bin` and similar names). These other files will not needed by us and can be ignored. 
6. Compile the contract to an `.abi` file by running

        solcjs --abi --include-path node_modules/ --base-path . faucetContract.sol
   This should create a file `faucetContract_sol_Token.abi`. It may also create other `.abi` files beginning with `@openzeppelin` (e.g. `@openzeppelin_contracts_token_ERC20_ERC20_sol_ERC20.abi` and similar names). These other files will not needed by us and can be ignored. 


### Deploy the contract on the Goerli Testnet

1. In the project directory create a JavaScript file called `deploy.js` with the following contents:

        #!/usr/local/bin/node

        const fs = require('fs');
        const ethers = require('ethers');


        bytecode = fs.readFileSync('faucetContract_sol_Token.bin').toString();
        abi = JSON.parse(fs.readFileSync('faucetContract_sol_Token.abi').toString());

        const provider = new ethers.providers.WebSocketProvider(
            'wss://goerli.infura.io/ws/v3/API_KEY');
        const private_key = 'YOUR_ETHEREUM_WALLET_PRIVATE_KEY';
        const wallet = new ethers.Wallet(private_key);
        const account = wallet.connect(provider);

        const myContract = new ethers.ContractFactory(abi, bytecode, account);

        async function main() {
            const contract = await myContract.deploy("DeceliumBucks","DecBUX");

            console.log(contract.address);
            console.log(contract.deployTransaction);
        }

        main();
    Replace `INFURA_API_KEY` with an Infura API key obtained from your Infura dashboard. Replace `YOUR_ETHEREUM_WALLET_PRIVATE_KEY` with your Ethereum wallet private key.
2. Our deploy script example as written sets the name and symbol for our cryptocurrency to `DeceliumBucks` and `DecBUX`, but you are free to change them to something you prefer by editing the line `const contract = await myContract.deploy("DeceliumBucks","DecBUX");` in the function `main()`.
3. Run the deploy script with `node deploy.js` in the project directory. If the deployment is successful, the first line output will be the contract address. Copy the contract address to the clipboard or to a temporary text file; it will be needed in subsequent steps. 
4. Import your currency to MetaMask by opening MetaMask, selecting "Import Tokens", and entering the contract address.

### Create the web interface

1. Within the project directory created a directory called `static` and `cd` into it.
2. Within `static`, create a file called `index.html`, with the following contents.  Replace `YOUR_CONTRACT_ADDRESS` with the contract address that was printed out when you deployed the Faucet contract. The data structure following `const MintContractABI =` is the contents of the file `faucetContract_sol_Token.abi` that was created when you compiled the Faucet contract. You can of course edit the HTML file to change the symbol DecBUX to the symbol for your cryptocurrency.

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
            <title>Mint yourself some DecBUX!</title>
          </head>
          <body>
            <script
                src="https://cdn.ethers.io/lib/ethers-5.6.umd.min.js"
                type="application/javascript"
            ></script>    
            <script>  
                const MintContractAddress = "YOUR_CONTRACT_ADDRESS";
                const MintContractABI =  
                      [{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
                      ;
                let MintContract;
                let signer;

                const provider = new ethers.providers.Web3Provider(window.ethereum, "goerli");

                provider.send("eth_requestAccounts", []).then(() => { 
                    provider.listAccounts().then((accounts) => {
                        signer = provider.getSigner(accounts[0]);
                        MintContract = new ethers.Contract(
                            MintContractAddress,
                            MintContractABI,
                            signer
                        );
                    });
                });

                async function mint() {
                    const cryptocurrencyQuantity = document.getElementById("cryptocurrencyQuantity").value;
                    console.log(cryptocurrencyQuantity);
                    const mintCryptocurrencyPromise = MintContract.mint(BigInt(crytpocurrencyQuantity * 1e18));
                    await mintCryptoCurrencyPromise;
                }

            </script>    
            <div>
                <h1>Mint yourself some DecBUX!</h1>
                <p>You will need MetaMask installed for this to work. Make sure MetaMask is set to the Goerli Testnet.</p>
                <p>Enter the amount of DecBUX to mint:</p>
                <label for="cryptocurrencyQuantity">DecBUX amount:</label> <br />
                <input type="number" step="any" min="0" id="cryptocurrencyQuantity">
                <button onclick="mint()">Mint</button>
                <p>To import the minted tokens into MetaMask you will need the Token Contract Address, 
                   which is YOUR_CONTRACT_ADDRESS.</p>       
            </div>
          </body>
        </html>
3. Check that the web page works by serving it on a local webserver. A convenient choice is `lite-server`, which you install with `npm install -g lite-server`. Invoke lite-server by typing `lite-server` at the command line in the directory containing the HTML file, `CryptocurrencyFaucet/static`.  You can then view the web page at `http://localhost:3000`. Entering a number into the form and pressing the button should cause MetaMask to open and request you to confirm the transaction. Once the transaction is confirmed, the tokens you have minted in your cryptocurrency should appear in your wallet.

### Deploy the web page to Decelium

1. `cd` to your `decelium/commands` directory. Deploy your website to Decelium with the command

    <pre> 
    python3 deploy.py <i>wallet_address</i> test.paxfinancial.ai <i>dest_path</i> <i>/[PATH]</i>/CryptocurrencyFaucet/static/
    </pre>
The third argument, `dest_path` is a path that needs to begin with a slash and end with a `.ipfs` filename.     
Note that the trailing slash in the last argument is necessary.      
2.  Your website should be deployed to Decelium. If it has successfully deployed, you will see a line like `deployed...  obj-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  as  [filename]` where the `xxxx...` represents hexadecimal digits. This is an identifier unique to your deployment.
You should be able to view your website deployed on Decelium at `https://test.paxfinancial.ai/obj/obj-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/` (note the trailing slash).     

## Acknowledgment

This tutorial is based on a tutorial from  [LearnWeb3](https://learnweb3.io).
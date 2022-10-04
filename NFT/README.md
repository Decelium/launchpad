<img src="../Logo.png" alt="Decelium Logo" width="50" />

# An NFT-issuing website on Decelium

In this tutorial we will create a website that will issue ERC-721 non-fungible tokens (NFTs), and deploy it on Decelium. NFTs are unique tokens, and each NFT has associated with it a URI which points to an online asset. Our online assets are data structures describing items in a (fictional) online game. The holder of the NFT is the owner of the game item. There are five different game items, so there will be five NFTs associated with the contract, each with a unique ID and a unique URI.  You will learn how to write an ERC-721 contract in Solidity and connect it to a JavaScript-based web interface that issues tokens from the contract.  At the end of this tutorial you will have a Decelium-deployed website that will allow a visitor to award themselves a game item, up to a maximum of five total items over all visitors.

## Prerequisites

Before starting this tutorial you should have:

1. Installed Decelium.
2. Created a Decelium wallet, added a user to the wallet, and added some CPU to the user's account.
3. Installed node.js.
4. Installed the Solidity compiler, which is done with `npm install -g solc`.
5. Installed MetaMask.
6. Created an Ethereum wallet, which is most easily done with MetaMask.
7. Added some Goerli Testnet Ether to your Ethereum wallet, which can be done at this [faucet](https://faucets.chain.link/).
8. Created an account on Infura. 

## Create the NFT-issuing website

### Create the assets for the NFTs

The electronic assets that our NFTs will point to are JSON structures describing items for a (fictitious) game.  These will be deployed on Decelium, and each NFT will contain the URI of its associated JSON.  There will be five of these items, and hence our website will issue a maximum of five NFTs.

1. Create a project directory. For this tutorial, ours will be named `NFT`. `cd` into the project directory.
2. In the project directory create a directory called `static`.
3. In the directory `static`, create files `1.json`, `2.json`, `3.json`, `4.json`, and `5.json` with the following contents.  We have structured them as JSON objects because this is a typical case for electronic assets associated with NFTs.The contents aren't important so feel free to change them as you wish.    

    Contents of 1.json: 
    
        { 
            "name": "Shield of Obscurity",
            "description": "Assailants tend to overlook the bearer of this shield, giving the bearer a defensive advantage.",
            "armor bonus": 4
        }

    Contents of 2.json:

        {
            "name": "Chalice of Lemuel",
            "description": "This cursed chalice is a magical dribble cup, inflicting humiliation damage upon those who drink from it.",
            "damage": 5
        }
        
    Contents of 3.json:

        {
            "name": "Boots of Darkness",
            "description": "These enchanted boots enable the wearer to blend into shadows and dark corners.",
            "stealth": 13
        }
        
    Contents of 4.json:

        {
            "name": "Flaming Sword",
            "descripton": "This sword inflicts fire damage, casts light, and can be used to start fires.",
            "damage": 10
        }

    Contents of 5.json:

        {
            "name": "Potion of Ennui",
            "description": "Consuming this potion puts the player in a state of jaded world-weariness, with all their activity levels reduced by half.",
            "damage": 4
        }

### Writing and compiling the Contract

1. In the project directory (`NFT` for us), create a text file called `NFTContract.sol` containing the following Solidity program.

        // contracts/GameItem.sol
        // SPDX-License-Identifier: MIT
        pragma solidity ^0.8.0;

        import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
        import "@openzeppelin/contracts/utils/Counters.sol";
        import "@openzeppelin/contracts/utils/Strings.sol";

        contract GameItem is ERC721URIStorage {
            using Counters for Counters.Counter;
            Counters.Counter private _tokenIds;

            string constant URIBase = "https://test.paxfinancial.ai/obj/obj-XXXXXXXXXX/";
            string constant URIExt = ".json";

            constructor() ERC721("GameItem", "ITM") {}

            function _concatenate(string memory a, string memory b, string memory c) 
                internal pure returns (string memory) {
                    return string(abi.encodePacked(a,b,c));
            }

            function awardItem()
                public
                returns (uint256)
            {
                uint256 newItemId = _tokenIds.current();

                if (newItemId < 5) {
                    _mint(msg.sender, newItemId);
                    _setTokenURI(newItemId, _concatenate(URIBase, Strings.toString(newItemId), URIExt));

                    _tokenIds.increment();
                }
                return newItemId;
            }
        }

2. In the file `NFT/NFTContract.sol`, replace the `XXXXXXXXXX` with an arbitrarily chosen (i.e. just make it up) string of hexadecimal digits.  These identifiers have to be unique, but there is no easy way to know if one has already been used. If you choose one that has already been used the deployment-to-Decelium step below will not be successful.  However, by choosing a long arbitrarily-chosen string, it is unlikely that you will choose one that has already been used.

3. In the project directory (e.g. `NFT`) install the OpenZeppelin contracts by running `npm install @openzeppelin/contracts`.

4. Compile the contract to a `.bin` file by running

        solcjs --bin --include-path node_modules/ --base-path . NFTContract.sol
   This should create a file `NFTContract_sol_Token.bin`. It may also create other `.bin` files beginning with `@openzeppelin` (e.g. `@openzeppelin_contracts_token_ERC721_ERC721_sol_ERC721.bin` and similar names). These other files will not needed by us and can be ignored. 
5. Compile the contract to an `.abi` file by running

        solcjs --abi --include-path node_modules/ --base-path . NFTContract.sol
   This should create a file `NFTContract_sol_Token.abi`. It may also create other `.abi` files beginning with `@openzeppelin` (e.g. `@openzeppelin_contracts_token_ERC721_ERC721_sol_ERC721.abi` and similar names). These other files will not needed by us and can be ignored.
   
### Write the deploy script and deploy the contract on the Goerli Testnet

1. In the project directory create a JavaScript file called `deploy.js` with the following contents:

        #!/usr/local/bin/node

        const fs = require('fs');
        const ethers = require('ethers');


        bytecode = fs.readFileSync('NFTContract_sol_GameItem.bin').toString();
        abi = JSON.parse(fs.readFileSync('NFTContract_sol_GameItem.abi').toString());

        const provider = new ethers.providers.WebSocketProvider(
            'wss://goerli.infura.io/ws/v3/API_KEY');
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
2. Run the deploy script with `node deploy.js` in the project directory. If the deployment is successful, the first line output will be the contract address. Copy the contract address to the clipboard or to a temporary text file; it will be needed in subsequent steps.
3. Import your tokens to MetaMask by opening MetaMask, selecting "Import Tokens", and entering the contract address. It should show that you have 0 ITM, which is correct since you haven't issued any tokens yet.

### Create the web interface

1. `cd` into `NFT/static`.
2. Within `static`, create a file called `index.html`, with the following contents.  Replace `YOUR_CONTRACT_ADDRESS` with the contract address that was printed out when you deployed the Faucet contract. The data structure following `const NFTContractABI =` is the contents of the file `NFTContract_sol_Token.abi` that was created when you compiled the NFT contract.

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
            <title>Award yourself a Game Item!</title>
          </head>
          <body>
            <script
                src="https://cdn.ethers.io/lib/ethers-5.6.umd.min.js"
                type="application/javascript"
            ></script>    
            <script>  
                const NFTContractAddress = "YOUR_CONTRACT_ADDRESS";
                const NFTContractABI =  
        [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"awardItem","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]
                      ;
                let NFTContract;
                let signer;

                const provider = new ethers.providers.Web3Provider(window.ethereum, "goerli");

                provider.send("eth_requestAccounts", []).then(() => { 
                    provider.listAccounts().then((accounts) => {
                        signer = provider.getSigner(accounts[0]);
                        NFTContract = new ethers.Contract(
                            NFTContractAddress,
                            NFTContractABI,
                            signer
                        );
                    });
                });

                async function awardItem() {
                    const awardNFTPromise = await NFTContract.awardItem();
                }

            </script>    
            <div>
                <h1>Award yourself a Game Item!</h1>
                <p>You will need MetaMask installed for this to work. Make sure MetaMask is set to the Goerli Testnet.</p>
                <p>Click the button to award yourself a Game Item (a total of 5 can be awarded, first come, first served):</p>
                <button onclick="awardItem()">Award Game Item</button>       
            </div>
          </body>
        </html>
4. Check that the web page works by serving it on a local webserver. A convenient choice is `lite-server`, which you install with `npm install -g lite-server`. Then you can invoke lite-server by typing `lite-server` at the command line in the directory containing the HTML file, `NFT/static`.  You can then view the web page at `http://localhost:3000`. Pressing the button should cause MetaMask to open and request you to confirm the transaction. Once the transaction is confirmed, the non-fungible token you have issued should appear in your wallet as 1 ITM. MetaMask will give you the option to view the transaction on Etherscan. If you do this, under "Tokens Transferred" you can see the token ID, which should be 0 for the first token.

### Deploy the web page and JSON files to Decelium

1. `cd` to your `decelium/commands` directory. Deploy your website and the JSON files containing the electronic assets to Decelium with the command

    <pre> 
    python3 deploy.py <i>wallet_address</i> test.paxfinancial.ai <i>dest_path</i> <i>/[PATH]</i>/NFT/static/ obj-XXXXXXXXXX
    </pre>
The third argument, `dest_path` is a path that needs to begin with a slash and end with a `.ipfs` filename.     
Note that the trailing slash in the fourth argument is necessary. In the fifth argument XXXXXXXXXX is the arbitrary string of hexadecimal digits you created and entered into the `NFTContract.sol` file.      
4.  Your website should be deployed to Decelium. If it has successfully deployed, you will see a line like `deployed...  obj-XXXXXXXXXX  as  [filename]`.
You should be able to view your website deployed on Decelium at `https://test.paxfinancial.ai/obj/obj-XXXXXXXXXX/` (note the trailing slash). You can view the electronic assets associated with your NFTs at `https://test.paxfinancial.ai/obj/obj-XXXXXXXXXX/[Id].json` where `[Id]` is the token ID of the NFT, which is a number from 0-4.
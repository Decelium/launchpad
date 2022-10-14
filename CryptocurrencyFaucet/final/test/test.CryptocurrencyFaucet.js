

const ethers       = require("ethers");
const chai         = require("chai");
const expect       = require("chai").expect;
const { execSync } = require('child_process');
const fs           = require('fs');
require('dotenv').config({path: __dirname+"/../../.env"});
chai.use(require('chai-bignumber')());

describe("First dApp", function() {

    xit("should compile", function() {
        
            const extensions = ["abi","bin"];
            
            extensions.forEach(ext => {
                
                console.log("ext="+ext);
                fileName = __dirname+"/../faucetContract_sol_Token."+ext;  
                if(fs.existsSync(fileName)){
                    execSync("rm "+fileName);   
                }    
                expect(fs.existsSync(fileName)).to.be.false;
                execSync("solcjs --"+ext+" --include-path node_modules/ --base-path . -o .  faucetContract.sol"); 
                expect(fs.existsSync(fileName)).to.be.true;
            });    
        
    }).timeout(60000);
    
    let contract_address;
    
    it("should deploy to the blockchain", function() {
       
            result = execSync("node deploy.js");
            contract_address = result.toString().split('\n')[0];
            console.log(contract_address);
                
    }).timeout(60000);
    
    it("should allow you to mint some cryptocurrency", function () {
        
        const abi = JSON.parse(fs.readFileSync('faucetContract_sol_Token.abi').toString());
        const provider = new ethers.providers.InfuraProvider("goerli", process.env.INFURA_API_KEY);
        const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY);
        const account = wallet.connect(provider);

        let CryptoContract = new ethers.Contract(contract_address, abi, account);  
        
        async function mintSomeCryptocurrency() {
            const mintCryptocurrencyPromise = await CryptoContract.mint(BigInt(0.1 * 1e18));
            const balance = await CryptoContract.balanceOf(account.address);
            console.log(balance);
            expect(balance).to.be.bignumber.eql(ethers.utils.parseUnits('0.1',18));
            //expect(balance).to.equal(BigInt(0.1 * 1e18));
        }
        
        mintSomeCryptocurrency();
    }).timeout(60000);
    
    it("should deploy the website to decelium", function() {

        htmlFileName = __dirname+'/../static/index.html';
        website_html = fs.readFileSync(htmlFileName).toString().replace(
                                             "0x450cd94ea85b68258084623DDd9df73934FA7c94", contract_address);
        console.log(website_html);
        fs.writeFileSync(htmlFileName, website_html);

        const deployCommand = "python3 " 
            + process.env.DECELIUM_PATH + "/commands/deploy.py "  
            + process.env.DECELIUM_WALLET_FILE + " "
            + process.env.DECELIUM_WALLET_USER + " " 
            + process.env.TEST_DEPLOY_URL + " "
            + "/test/testCryptocurrencyFaucet/test.ipfs "
            + __dirname + "/../static/ json";

         execSync( deployCommand, (err,stdout,stderr) => {   
            if (err) {
                console.error(err);
            } else {
                console.log(stdout);
            }    

            expect(stdout).to.be.a('string').that.includes('"self_id"');
            expect(stdout).to.be.a('string').that.includes('obj-');      

            const stdout_obj = JSON.parse(stdout);            
            expect(stdout_obj).to.have.property('self_id');

            console.log(stdout_obj['self_id']);
            const self_id = stdout_obj['self_id'];  
            expect(self_id).to.be.a('string').that.includes('obj-');

            const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

            response = fetch("https://"+process.env.TEST_DEPLOY_URL+"/obj/"+self_id+"/")
                           .then((response) => response.text())
                           .then( function (data) {
                                console.log(data);
                                console.log(typeof data);
                                expect(data).to.be.a('string').that.includes("<p>Enter the amount of DecBUX to mint:</p>");
                                expect(data).to.be.a('string').that.includes("const mintCryptocurrencyPromise = MintContract.mint(BigInt(cryptocurrencyQuantity * 1e18));");
                           });           
        });                   
    }).timeout(60000);
});
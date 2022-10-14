

const ethers       = require("ethers");
const chai         = require("chai");
const expect       = require("chai").expect;
const { execSync } = require('child_process');
const fs           = require('fs');
require('dotenv').config({path: __dirname+"/../../../.env"});
chai.use(require('chai-bignumber')());

describe("NFT", function() {

    xit("should compile", function() {
        
            const extensions = ["abi","bin"];
            
            extensions.forEach(ext => {
                
                console.log("ext="+ext);
                fileName = __dirname+"/../NFTContract_sol_GameItem."+ext;  
                if(fs.existsSync(fileName)){
                    execSync("rm "+fileName);   
                }    
                expect(fs.existsSync(fileName)).to.be.false;
                execSync("solcjs --"+ext+" --include-path node_modules/ --base-path . -o . NFTContract.sol"); 
                expect(fs.existsSync(fileName)).to.be.true;
            });    
        
    }).timeout(90000);   
    
    let contract_address;    
    
    it("should deploy on the blockchain", function() {

        result = execSync("node deploy.js");
        contract_address = result.toString().split('\n')[0];
        console.log(contract_address);
        
    }).timeout(60000);
    
    it("should allow you to award yourself a game item", function () {
        
        const abi = JSON.parse(fs.readFileSync('NFTContract_sol_GameItem.abi').toString());
        const provider = new ethers.providers.InfuraProvider("goerli", process.env.INFURA_API_KEY);
        const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY);
        const account = wallet.connect(provider);

        let NFTContract = new ethers.Contract(contract_address, abi, account);  
        
        async function awardItem() {
            const awardNFTPromise = await NFTContract.awardItem();
            await awardNFTPromise.wait();
            //await erc20contract.mint(ethers.utils.parseUnits('1000', 18));
            //expect(await erc20contract.balanceOf(deployer.address)).to.equal(ethers.utils.parseUnits('1000', 18));
            const balance = await NFTContract.balanceOf(account.address);
            console.log(balance);
            console.log("balance="+balance);
            console.log(typeof balance);
            console.log(ethers.utils.parseUnits('1',0));
            console.log("here1");
            //expect(true).to.be.false;
            //expect(1).to.equal(1);
            expect(balance).to.be.bignumber.eql(ethers.utils.parseUnits('1',0));
            console.log("here");
            const ownerOf0Address = await NFTContract.ownerOf(0);
            console.log("ownerof0Address="+ownerOf0Address);
            console.log(account.address);
            expect(ownerOf0Address).to.equal(account.address);
        }
        
        awardItem().then( function() {
          console.log("here2");                
        });
    }).timeout(60000);    
    
    it("should deploy the website to decelium", function() {

        htmlFileName = __dirname+'/../static/index.html';
        website_html = fs.readFileSync(htmlFileName).toString().replace(
                                             "0x145d7A8EB4D1Ae9c4ccef80d2295fdF76E345626", contract_address);
        console.log(website_html);
        fs.writeFileSync(htmlFileName, website_html);

        const createUserCommand = "python3 "
                                  + process.env.DECELIUM_PATH + "/commands/create_user.py "
                                  + process.env.DECELIUM_WALLET_FILE + " "
                                  + process.env.DECELIUM_WALLET_USER + " "
                                  + "test_user "
                                  + process.env.TEST_DEPLOY_URL + " ";
        
        execSync( createUserCommand, (err,stdout,stderr) => {console.log(stdout);});     
        
        const deployCommand = "python3 " 
            + process.env.DECELIUM_PATH+"/commands/deploy.py " 
            + process.env.DECELIUM_WALLET_FILE + " "
            + process.env.DECELIUM_WALLET_USER + " " 
            + process.env.TEST_DEPLOY_URL + " "
            + "/test/testNFT/test.ipfs "
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
                                expect(data).to.be.a('string').that.includes("<p>Click the button to award yourself a Game Item (a total of 5 can be awarded, first come, first served):</p>");
                                expect(data).to.be.a('string').that.includes("const awardNFTPromise = await NFTContract.awardItem();");
                           });           
        });
        const deleteUserCommand = "python3 "
                                  + process.env.DECELIUM_PATH + "/commands/delete_user.py "
                                  + process.env.DECELIUM_WALLET_FILE + " "
                                  + process.env.DECELIUM_WALLET_USER + " "
                                  + "test_user "
                                  + process.env.TEST_DEPLOY_URL + " ";
        
        execSync( deleteUserCommand, (err,stdout,stderr) => {console.log(stdout);});
    }).timeout(60000);    
    
});

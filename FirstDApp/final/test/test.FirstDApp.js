
const ethers       = require("ethers");
const expect       = require("chai").expect;
const { execSync } = require('child_process');
const fs           = require('fs');
require('dotenv').config({path: __dirname+"/../../.env"});

describe("First dApp", function() {
            
        it("should compile", function() {
        
            const extensions = ["abi","bin"];
            
            extensions.forEach(ext => {
                
                console.log("ext="+ext);
                fileName = __dirname+"/../mood_sol_MoodDiary."+ext;  
                if(fs.existsSync(fileName)){
                    execSync("rm "+fileName);   
                }    
                expect(fs.existsSync(fileName)).to.be.false;
                execSync("solcjs --"+ext+" --include-path node_modules/ --base-path . -o .  mood.sol"); 
                expect(fs.existsSync(fileName)).to.be.true;
  
            });
        }).timeout(60000);    
    
        let contract_address;
        
        it("should deploy on the blockchain", function() {
            
            result = execSync("node deploy.js");
            contract_address = result.toString().split('\n')[0];
            console.log(contract_address);
                
        }).timeout(60000);
    
        const sleep = ms => new Promise(r => setTimeout(r, ms));
    
        it("should allow setting and getting", function() {  
            
            async function testSetGet(mood) {
                console.log("mood="+mood); 
                let setMoodPromise = await MoodContract.setMood(mood);
                console.log(setMoodPromise);
                await setMoodPromise.wait();
                console.log(setMoodPromise);
                console.log("here1");
                
                let getMood = await MoodContract.getMood();
                console.log(getMood);

                //await gottenMood;
        
                console.log("gottenMood="+getMood);                
                //expect(gottenMood).to.be.a('string');
                //expect(gottenMood).to.equal(mood); 
            }
            
            const abi = JSON.parse(fs.readFileSync('mood_sol_MoodDiary.abi').toString());
            const provider = new ethers.providers.InfuraProvider("goerli", process.env.INFURA_API_KEY);
            const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY);
            const account = wallet.connect(provider);

            let MoodContract = new ethers.Contract(contract_address, abi, account);
            
            testSetGet("test");
            
        }).timeout(120000);
    
        it("should deploy the website to decelium", function() {

            htmlFileName = __dirname+'/../static/index.html';
            website_html = fs.readFileSync(htmlFileName).toString().replace(
                                                 "0x7c18621dad55Cf0C0254af0d8b966238808C22bc", contract_address);
            console.log(website_html);
            fs.writeFileSync(htmlFileName, website_html);
            
            const deployCommand = "python3 " 
                + process.env.DECELIUM_PATH + "/commands/deploy.py "  
                + process.env.DECELIUM_WALLET_FILE + " "
                + process.env.DECELIUM_WALLET_USER + " "
                + process.env.TEST_DEPLOY_URL + " "
                + "/test/testFirstReactApp/test.ipfs "
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
                                    expect(data).to.be.a('string').that.includes('<p>Here we can set or get the mood:</p>');
                                    expect(data).to.be.a('string').that.includes('<button onclick="getMood()">Get Mood</button>');
                               });           
            });                   
        }).timeout(60000);
}); 
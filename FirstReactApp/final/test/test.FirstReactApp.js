

const expect   = require("chai").expect;
const { exec } = require('child_process');
require('dotenv').config({path: __dirname+"/../../.env"}); 

describe("First React App", function() { 
    
    it("should deploy", function() {
        
        const deployCommand = "python3 " 
                                 + process.env.DECELIUM_PATH + "/commands/deploy.py "  
                                 + process.env.DECELIUM_WALLET_FILE + " "
                                 + process.env.DECELIUM_WALLET_USER + " "
                                 + process.env.TEST_DEPLOY_URL + " "
                                 + "/test/testFirstReactApp/test.ipfs "
                                 + __dirname + "/../build/ json";      
        
        exec( deployCommand, (err,stdout,stderr) => {   
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
            
        response = fetch("https://test.paxfinancial.ai/obj/"+self_id+"/")
                       .then((response) => response.text())
                       .then( function (data) {
                            console.log(data);
                            console.log(typeof data);
                            expect(data).to.be.a('string').that.includes('<title>React App</title>');
                            expect(data).to.be.a('string').that.includes('<!doctype html>');
                       });           
        });
    });    
});


const expect   = require("chai").expect;
const { execSync } = require('child_process');
require('dotenv').config({path: __dirname+"/../../../.env"}); 

describe("First React App", function() { 
    
    it("should deploy", function() {
        
        const createUserCommand = "python3 "
                                  + process.env.DECELIUM_PATH + "/commands/create_user.py "
                                  + process.env.DECELIUM_WALLET_FILE + " "
                                  + process.env.DECELIUM_WALLET_USER + " "
                                  + "test_user "
                                  + process.env.TEST_DEPLOY_URL + " ";
        
        execSync( createUserCommand, (err,stdout,stderr) => {console.log(stdout);});
        
        const deployCommand = "python3 " 
                                 + process.env.DECELIUM_PATH + "/commands/deploy.py "  
                                 + process.env.DECELIUM_WALLET_FILE + " "
                                 + process.env.DECELIUM_WALLET_USER + " "
                                 + process.env.TEST_DEPLOY_URL + " "
                                 + "/test/testFirstReactApp/test.ipfs "
                                 + __dirname + "/../build/ ";      
        
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
                            expect(data).to.be.a('string').that.includes('<title>React App</title>');
                            expect(data).to.be.a('string').that.includes('<!doctype html>');
                       });           
        });
        const deleteUserCommand = "python3 "
                                  + process.env.DECELIUM_PATH + "/commands/delete_user.py "
                                  + process.env.DECELIUM_WALLET_FILE + " "
                                  + process.env.DECELIUM_WALLET_USER + " "
                                  + "test_user "
                                  + process.env.TEST_DEPLOY_URL + " ";
        
        execSync( deleteUserCommand, (err,stdout,stderr) => {console.log(stdout);});
    }).timeout(90000);    
});


const expect   = require("chai").expect;
const { exec } = require('child_process');
const fs       = require('fs');
require('dotenv').config({path: __dirname+"/../../.env"});

describe("First dApp", function() {

    describe("compilation", function() {
        
        it("should compile", function() {
        
            const extensions = ["abi","bin"];
            
            for (let ext in extensions) {
                fileName = __directory+"/../mood_sol_MoodDiary."+ext;
                if (fs.existsSync(fileName)) {
                    exec("rm "+fileName, (err,stdout,stderr) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(stdout);
                        } 
                    });
                }
                expect(fs.existsSync(fileName)).to.be.false;
                
                exec("solcjs --"+ext+" "+ , (err,stdout,stderr) => {
                
                });
            }
            
    
        
        }); 
    
        
    });



}); 
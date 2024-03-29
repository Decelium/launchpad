#!/usr/local/bin/node

const ethers = require('ethers');
require('dotenv').config({path: __dirname+"/../../.env"});

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
    'wss://goerli.infura.io/ws/v3/'+process.env.INFURA_API_KEY);

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
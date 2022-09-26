#!/usr/local/bin/node

const ethers = require('ethers');

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
    'wss://goerli.infura.io/ws/v3/555a93ec0c824ebe96a4d930dcf30124');

const private_key = 'f2b6c1ba66e25eae8e6b3fcbab8f02e94cb942549bbede6cbd02f1b7d60ccad2';
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
    console.log("1");
    await setMood(process.argv[2]);
    console.log("2");
}

main();
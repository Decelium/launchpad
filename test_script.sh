#!/bin/bash

#for i in FirstReactApp FirstDApp CryptocurrencyFaucet NFT; do
for i in CryptocurrencyFaucet; do
cd $i/final
    npm test
    cd ../..
done

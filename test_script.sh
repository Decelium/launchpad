#!/bin/bash

for i in FirstReactApp FirstDApp CryptocurrencyFaucet NFT; do
cd $i/final
    npm test
    cd ../..
done

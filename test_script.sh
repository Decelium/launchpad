#!/bin/bash

for i in FirstReactApp; do
    cd $i
    npm test
    cd ..
done
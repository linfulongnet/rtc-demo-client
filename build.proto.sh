#!/usr/bin/env bash

BinDir="./node_modules/.bin"
Workspace="./src/protocol"
ProtoDir=${Workspace}/proto

for file in ${ProtoDir}/*.proto
do
  echo ${file}
done

${BinDir}/pbjs -t static-module -w commonjs --es6 -o ${Workspace}/rpc.js ${ProtoDir}/*.proto
${BinDir}/pbts -o ${Workspace}/rpc.d.ts ${Workspace}/rpc.js

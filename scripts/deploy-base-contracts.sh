#!/bin/bash

# Set the current directory to the project root
cd "$(dirname "$0")/.."

# Deploy FungibleToken contract
flow accounts add-contract FungibleToken src/services/flow/contracts/FungibleToken.cdc --network=testnet --signer testnet-account

# Deploy ProjectToken contract
flow accounts add-contract ProjectToken src/services/flow/contracts/ProjectToken.cdc --network=testnet --signer testnet-account

#!/bin/bash

# Initialize Flow project
flow init

# Configure testnet account
flow config add account testnet-account \
  --address 0x945c254064cc292c35FA8516AFD415a73A0b23A0 \
  --key 919cc2ae48808decd3fe50fd307800e6d1023afaea98057d814f54f0635aeea1 \
  --network testnet

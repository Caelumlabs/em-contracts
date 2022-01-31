#!/bin/bash
if [[ -z $1 ]];
then 
    echo "No parameter passed : start/stop"
else
    if [ $1 == 'start' ]
    then
      echo "Start Ganache and deploy a Registry"
      nohup ./node_modules/.bin/ganache-cli --account="0x3e139eae34f41cecf4b4adccbeaa3a51c0b05c695733d8416df121b5b6d5e79b, 1000000000000000000000"  <&- &>/dev/null &
      LOCALHOST_SEED=3e139eae34f41cecf4b4adccbeaa3a51c0b05c695733d8416df121b5b6d5e79b LOCALHOST_URL=http://localhost:8545 npx hardhat run ./scripts/deploy.ts --network localhost
      echo "Ganache CLI up and running: http://localhost:8545"
    fi
    if [ $1 == 'stop' ]
    then
      echo "Stop Ganache"
      ps -ef | grep ganache-cli | grep -v grep | awk '{print $2}' | xargs kill -9
    fi
    if [ $1 == 'transfer' ]
    then
      echo "Send tokens"
      ADDRESS_TO=$2 LOCALHOST_SEED=3e139eae34f41cecf4b4adccbeaa3a51c0b05c695733d8416df121b5b6d5e79b LOCALHOST_URL=http://localhost:8545 npx hardhat run ./scripts/transfer.ts --network localhost
    fi

fi

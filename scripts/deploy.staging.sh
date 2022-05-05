#!/bin/bash

SERVER_IP=$SERVER_IP
SERVER_FOLDER="issuer.ssi4.defispace.com"

npm install --force
npm run build
apt-get update -y
apt-get -y install rsync

echo "Deploying to ${SERVER_FOLDER}"
ssh gitlab@${SERVER_IP} "rm -rf /var/www/${SERVER_FOLDER}/*"

rsync -avzh build/* gitlab@${SERVER_IP}:/var/www/${SERVER_FOLDER}/

#ssh gitlab@${SERVER_IP} "mv /var/www/${SERVER_FOLDER}/build/* /var/www/${SERVER_FOLDER} ; mv /var/www/${SERVER_FOLDER_TEST}/build/* /var/www/${SERVER_FOLDER_TEST} ; rm -rf /var/www/${SERVER_FOLDER}/build ; rm -rf /var/www/${SERVER_FOLDER_TEST}/build"

echo "Finished copying the build files"

#!/bin/bash

#General Ubuntu check for updates
#sudo apt-get update

#Git install
#sudo apt-get install git

#NodeJS & NPM Install
#sudo apt-get install nodejs
#sudo apt-get install npm
#npm install

#R install
#sudo apt-get install r-base r-base-dev

rm tmp.R &> /dev/null
touch tmp.R

echo "install.packages('RMySQL')" >> tmp.R
echo "install.packages('arules')" >> tmp.R
echo "install.packages('reshape')" >> tmp.R

sudo Rscript tmp.R
rm tmp.R
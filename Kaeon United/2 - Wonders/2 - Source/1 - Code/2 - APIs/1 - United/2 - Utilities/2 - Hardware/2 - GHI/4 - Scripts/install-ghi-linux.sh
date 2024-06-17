#!/bin/bash

sudo curl -s -L https://raw.githubusercontent.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/master/Kaeon%20United/3%20-%20Wonders/2%20-%20Source/1%20-%20Code/2%20-%20APIs/1%20-%20United/2%20-%20Utilities/2%20-%20Hardware/2%20-%20GHI/4%20-%20Scripts/install-node-linux.sh | bash
sudo npm install -g ghi-server

if [$1 == "enable"]
	then
		sudo ghi enable
	fi
#!/bin/bash

ARM=$(uname -m)

if which node > /dev/null
	then
		echo "node is installed, skipping..."
	else
		if [ $ARM == "armv6l" ]
			then
				wget https://nodejs.org/dist/v11.15.0/node-v11.15.0-linux-armv6l.tar.xz
				tar -xJf node-v11.15.0-linux-armv6l.tar.xz
				sudo cp -r node-v11.15.0-linux-armv6l/* /usr/local/
				rm -r node-v11.15.0-linux-armv6l
				rm node-v11.15.0-linux-armv6l.tar.xz
			else
				wget https://nodejs.org/dist/v16.14.2/node-v16.14.2-linux-armv7l.tar.xz
				tar -xJf node-v16.14.2-linux-armv7l.tar.xz
				sudo cp -r node-v16.14.2-linux-armv7l/* /usr/
				rm -r node-v16.14.2-linux-armv7l
				rm node-v16.14.2-linux-armv7l.tar.xz
			fi
	fi
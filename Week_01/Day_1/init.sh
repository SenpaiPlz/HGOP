#!/bin/bash

#Current dependancies
dep="vim git"
if [ "$OSTYPE" = "linux-gnu" ]; then

	#check if the os or arch release in etc is present
	if [ -f /etc/arch-release ] || [ -f /etc/os-release ]; then
		#if its present load the contents of the etc file to variables
		. /etc/{os,arch}-release
		release=$NAME
	else
		#if its not present then we do not support the system
		echo "[$(date -u)] - Operating system is not supported" >> script-error.log
		exit 1
	fi
	
	#prompt the user with the welcome message
	printf "\nWelcome $(whoami) to this amazing init script.\nThe script currently supports Arch-Linux and Ubuntu.\nClient release OS: $release.\nThe script will prompt a re-/install of the following packages, $dep.\n\n"
	
	#prompt the user to continue or not
	read -p "Do you wish to continue? (y/n) : " cont

	if [ "$cont" = "Y" ] || [ "$cont" = "y" ]; then
		#init the starttime counter, used for calculations of runtime
		starttime=$(date +%s%N)
		printf "Script started at $(date -u)\n"

		#Is the release arch ? then use pacman
		if [ "$release" = "Arch Linux" ]; then
			sudo pacman -S $dep	
			exitstatus=$?

			#Check exit status of pacman, log if error ocurrs
			if [ $exitstatus -ne 0 ]; then
				echo "[$(date -u)] - pacman exited abnormally with code $exitstatus" >> script-error.log
				exit 1
			fi
		#Is the release ubuntu ? then use apt-get
		elif [ "$release" = "Ubuntu" ]; then
			sudo apt-get install $dep
			exitstatus=$?
			#Check exit status of apt-get, log if error ocurrs
			if [ $exitstatus -ne 0 ]; then
				echo "[$(date -u)] - apt-get exited abnormally with code $exitstatus" >> script-error.log
				exit 1
			fi
		else
			#If neither arch or ubuntu, log and exit
			echo "[$(date -u)] - Operating system is not supported" >> script-error.log
			exit 1
		fi
		#Compute runtime
		endtime=$(date +%s%N)
		runtime=$((endtime-starttime))
		runtime=$((runtime/1000000))
		#Bid the user farewell!
		printf "\nScipt completed in $runtime ms, have a good day!\n"
		echo "[$(date -u)] - Sucess! $dep installed sucessfully" >> script.log
	fi
else
	#If the user is not running a linux system.
	echo "[$(date -u)] - Operating system is not supported" >> script-error.log
	exit 1
fi


#!/bin/bash

#Current dependancies
dep="ncurses vim git"
if [ "$OSTYPE" = "linux-gnu" ]; then


	#check if the os or arch release in etc is present
	if [ -f /etc/arch-release ] || [ -f /etc/os-release ]; then
		. /etc/{os,arch}-release
		release=$NAME
	else
		echo "[$(date -u)] - Operating system is not supported" >> script-error.log
		exit 1
	fi
	
	#prompt the user with the welcome message
	printf "\nWelcome $(whoami) to this amazing init script.\nThe script currently supports Arch-Linux and Ubuntu.\nClient release OS: $release.\nThe script will prompt a re-/install of the following packages, $dep.\n\n"
	
	#prompt the user to continue or not
	read -p "Do you wish to continue? (y/n) : " cont

	if [ "$cont" = "Y" ] || [ "$cont" = "y" ]; then
		starttime=$(date +%s%N)
		printf "Script started at $(date -u)\n"
		if [ "$release" = "Arch Linux" ]; then
			sudo pacman -S $dep	
			exitstatus=$?
			if [ $exitstatus -ne 0 ]; then
				echo "[$(date -u)] - pacman exited abnormally with code $exitstatus" >> script-error.log
				exit 1
			fi
		elif [ "$release" = "Ubuntu" ]; then
			sudo apt-get install $dep
			exitstatus=$?
			if [ $exitstatus -ne 0 ]; then
				echo "[$(date -u)] - apt-get exited abnormally with code $exitstatus" >> script-error.log
				exit 1
			fi
		else
			echo "[$(date -u)] - Operating system is not supported" >> script-error.log
			exit 1
		fi
		endtime=$(date +%s%N)
		runtime=$((endtime-starttime))
		runtime=$((runtime/1000))
		printf "\nScipt completed in $runtime ms, have a good day!\n"
		echo "[$(date -u)] - Sucess! $dep installed sucessfully" >> script.log
	fi
fi


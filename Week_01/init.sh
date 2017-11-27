#!/bin/bash

if [ "$OSTYPE" = "linux-gnu" ]; then
	if [ -f /etc/arch-release ] || [ -f /etc/os-release ]; then
		. /etc/{os,arch}-release
		release=$PRETTY_NAME
	else
		(>&2 echo "Unsupported OS type.")
		exit 1
	fi
	echo "$(whoami) $release"
fi

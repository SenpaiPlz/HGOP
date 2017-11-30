#!/bin/bash
while ! test -e '/ec2-init-done.markerfile'
do
	echo testing for markerfile
    sleep 2
done

#!/bin/bash

echo "Building Docs Online Viewer to build/"

# Zip file name
outputZipFile="dov-current"

# Removed all previous uncompressed files
rm -r ../build/

# Copy files from src/ to build/uncompressed/
for f in $(find ../src -name '*.*' -not -name '.*'); do
	dest=`echo "$f" | sed 's:^../src/:../build/uncompressed/:'`;
	destpath=${dest%/*}
	mkdir -p $destpath
	echo "cp -f $f $dest"
	cp -f $f $dest
done;

# Remove all files starting with period (OS tmp files)
for f in $(find ../build/uncompressed -name '.*'); do
	rm $f
done

# Compress JS files
# NOTE: uglifyjs 2 should be installed for this to work
# uglifyjs is not yet compatible with ES6
# Disabled compression
# for f in $(find ../build/uncompressed -name '*.js'); do
# 	uglifyjs $f -o $f -c
# done

# Zip all source files
cd ../build/uncompressed
zip -r -9 ../$outputZipFile.zip *

# Create copy of zip file with .xpi extension
cp ../$outputZipFile.zip ../dov-current.xpi

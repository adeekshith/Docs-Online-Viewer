#!/bin/bash

echo "Building Docs Online Viewer to build/"

# Copy files from src/ to build/uncompressed/
for f in $(find ../src -name '*.*' -not -name '.*'); do
	dest=`echo "$f" | sed 's:^../src/:../build/uncompressed/:'`;
	destpath=${dest%/*}
	mkdir -p $destpath
	echo "cp -f $f $dest"
	cp -f $f $dest
done;

# Compress JS files
# NOTE: uglifyjs 2 should be installed for this to work
for f in $(find ../build/uncompressed -name '*.js'); do
	uglifyjs $f -o $f -c
done

# Zip all source files
cd ../build/uncompressed
zip -r -9 ../dov-current.zip *

# Create copy of zip file with .xpi extension
cp ../dov-current.zip ../dov-current.xpi

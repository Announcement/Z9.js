#!/bin/bash
INFILE=src/abyss.js
OUTFILE=dist/abyss.min.js
uglifyjs $INFILE --compress --mangle --screw-ie8 -o $OUTFILE.tmp
cat distheader.txt > $OUTFILE
cat $OUTFILE.tmp >> $OUTFILE
rm $OUTFILE.tmp

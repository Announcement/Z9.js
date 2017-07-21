#!/bin/bash
INFILE=src/ghost.js
OUTFILE=dist/ghost.min.js
uglifyjs $INFILE --compress --mangle --screw-ie8 -o $OUTFILE.tmp
cat distheader.txt > $OUTFILE
cat $OUTFILE.tmp >> $OUTFILE
rm $OUTFILE.tmp

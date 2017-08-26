#!/bin/bash
INFILE=src/Z9.js
OUTFILE=dist/Z9.min.js
uglifyjs $INFILE --compress --mangle --screw-ie8 -o $OUTFILE.tmp
cat distheader.txt > $OUTFILE
cat $OUTFILE.tmp >> $OUTFILE
rm $OUTFILE.tmp

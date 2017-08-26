@echo off
set "infile=src\Z9.js"
set "outfile=dist\Z9.min.js"
uglifyjs %infile% --compress --mangle --screw-ie8 -o %outfile%.tmp | more
type distheader.txt > %outfile%
type %outfile%.tmp >> %outfile%
del %outfile%.tmp

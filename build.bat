@echo off
set "infile=src\ghost.js"
set "outfile=dist\ghost.min.js"
uglifyjs %infile% --compress --mangle --screw-ie8 -o %outfile%.tmp | more
type distheader.txt > %outfile%
type %outfile%.tmp >> %outfile%
del %outfile%.tmp

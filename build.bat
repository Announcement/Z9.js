@echo off
set "infile=src\abyss.js"
set "outfile=dist\abyss.min.js"
uglifyjs %infile% --compress --mangle --screw-ie8 -o %outfile%.tmp | more
type distheader.txt > %outfile%
type %outfile%.tmp >> %outfile%
del %outfile%.tmp

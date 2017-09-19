Set-Variable -Name "INFILE" -Value "src\Z9.js"
Set-Variable -Name "OUTFILE" -Value "dist\Z9.min.js"
uglifyjs $INFILE --compress --mangle --screw-ie8 -o $OUTFILE.tmp
Get-Content distheader.txt | Out-File -FilePath $OUTFILE
Get-Content $OUTFILE.tmp | Out-File -FilePath $OUTFILE -Append
Remove-Item -Path $OUTFILE.tmp

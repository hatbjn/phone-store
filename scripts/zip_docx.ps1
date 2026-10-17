
Add-Type -AssemblyName System.IO.Compression.FileSystem
$source = 'C:/Users/JOKER/phone-store/scripts/temp_docx'
$destTemp = 'C:/Users/JOKER/phone-store/scripts/temp_repacked.zip'
if (Test-Path $destTemp) { Remove-Item -Force $destTemp }
[System.IO.Compression.ZipFile]::CreateFromDirectory($source, $destTemp, [System.IO.Compression.CompressionLevel]::Optimal, $false)

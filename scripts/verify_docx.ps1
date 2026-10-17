
Add-Type -AssemblyName System.IO.Compression.FileSystem
$dest = 'C:/Users/JOKER/phone-store/scripts/temp_verify'
if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
[System.IO.Compression.ZipFile]::ExtractToDirectory('C:/Users/JOKER/phone-store/Modele_rapport_stage_Technicien_informatique (1).docx', $dest)

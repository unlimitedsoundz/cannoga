Add-Type -AssemblyName System.Drawing
$logoPath = "c:\Users\eltig\OneDrive\Documents\penkka\public\logo.png"
$icoPath = "c:\Users\eltig\OneDrive\Documents\penkka\src\app\favicon.ico"

if (Test-Path $logoPath) {
    try {
        $bmpResized = [System.Drawing.Bitmap]::new(32, 32)
        $g = [System.Drawing.Graphics]::FromImage($bmpResized)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($bmpOriginal, 0, 0, 32, 32)
        $g.Dispose()

        # Save ICO
        $hIcon = $bmpResized.GetHicon()
        $icon = [System.Drawing.Icon]::FromHandle($hIcon)
        $fileStream = [System.IO.File]::Create($icoPath)
        $icon.Save($fileStream)
        $fileStream.Close()
        
        # Save 32x32 PNG
        $bmpResized.Save("c:\Users\eltig\OneDrive\Documents\penkka\public\favicon-32x32.png", [System.Drawing.Imaging.ImageFormat]::Png)
        
        # Save Apple Touch Icon (180x180)
        $bmpApple = [System.Drawing.Bitmap]::new(180, 180)
        $gApple = [System.Drawing.Graphics]::FromImage($bmpApple)
        $gApple.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $gApple.DrawImage($bmpOriginal, 0, 0, 180, 180)
        $gApple.Dispose()
        $bmpApple.Save("c:\Users\eltig\OneDrive\Documents\penkka\public\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
        
        $bmpApple.Dispose()
        $bmpResized.Dispose()
        $bmpOriginal.Dispose()
        Write-Host "Favicon variants successfully created."
    } catch {
        Write-Error "Failed to convert logo to ico: $_"
    }
} else {
    Write-Error "Logo not found at $logoPath"
}

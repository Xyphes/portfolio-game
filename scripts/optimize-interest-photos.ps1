$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$sourceRoot = [System.IO.Path]::GetFullPath((Join-Path $projectRoot 'src/assets/interests'))
$targetRoot = [System.IO.Path]::GetFullPath((Join-Path $projectRoot 'src/assets/interests-optimized'))

if (-not $targetRoot.StartsWith($projectRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Refusing to write outside the project: $targetRoot"
}

if (Test-Path -LiteralPath $targetRoot) {
  Remove-Item -LiteralPath $targetRoot -Recurse -Force
}
New-Item -ItemType Directory -Path $targetRoot | Out-Null

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' }
$qualityEncoder = [System.Drawing.Imaging.Encoder]::Quality
$encoderParameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($qualityEncoder, 80L)
$maxDimension = 1600

function Apply-ExifOrientation([System.Drawing.Image]$image) {
  try {
    $orientation = $image.GetPropertyItem(0x0112).Value[0]
    switch ($orientation) {
      3 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
      6 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
      8 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
    }
  } catch {
    # The image has no EXIF orientation field.
  }
}

$sourceFiles = Get-ChildItem -LiteralPath $sourceRoot -File -Recurse |
  Where-Object { $_.Extension -match '^\.(avif|jpe?g|png|webp)$' }

foreach ($file in $sourceFiles) {
  $relativePath = $file.FullName.Substring($sourceRoot.Length).TrimStart([System.IO.Path]::DirectorySeparatorChar)
  $relativeDirectory = [System.IO.Path]::GetDirectoryName($relativePath)
  $destinationDirectory = Join-Path $targetRoot $relativeDirectory
  New-Item -ItemType Directory -Path $destinationDirectory -Force | Out-Null

  if ($file.Extension -notmatch '^\.(jpe?g|png)$') {
    Copy-Item -LiteralPath $file.FullName -Destination (Join-Path $destinationDirectory $file.Name)
    continue
  }

  $sourceImage = [System.Drawing.Image]::FromFile($file.FullName)
  try {
    Apply-ExifOrientation $sourceImage
    $scale = [Math]::Min(1.0, [double]$maxDimension / [double][Math]::Max($sourceImage.Width, $sourceImage.Height))
    $targetWidth = [Math]::Max(1, [int][Math]::Round($sourceImage.Width * $scale))
    $targetHeight = [Math]::Max(1, [int][Math]::Round($sourceImage.Height * $scale))
    $bitmap = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      try {
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.DrawImage($sourceImage, 0, 0, $targetWidth, $targetHeight)
      } finally {
        $graphics.Dispose()
      }

      $extension = $file.Extension.ToLowerInvariant()
      if ($extension -eq '.png') {
        $destination = Join-Path $destinationDirectory $file.Name
        $bitmap.Save($destination, [System.Drawing.Imaging.ImageFormat]::Png)
      } else {
        $destination = Join-Path $destinationDirectory ([System.IO.Path]::GetFileNameWithoutExtension($file.Name) + '.jpg')
        $bitmap.Save($destination, $jpegCodec, $encoderParameters)
      }
    } finally {
      $bitmap.Dispose()
    }
  } finally {
    $sourceImage.Dispose()
  }
}

$sourceBytes = ($sourceFiles | Measure-Object Length -Sum).Sum
$optimizedFiles = Get-ChildItem -LiteralPath $targetRoot -File -Recurse
$optimizedBytes = ($optimizedFiles | Measure-Object Length -Sum).Sum
Write-Output ("Optimized {0} photos: {1:N2} MB -> {2:N2} MB" -f $sourceFiles.Count, ($sourceBytes / 1MB), ($optimizedBytes / 1MB))

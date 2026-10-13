Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Drawing.Imaging

$imgDir = "C:\Users\usman.ghani\Downloads\delete\noor-e-nikah-studio\src\images"

# ── helper: save bitmap ──
function Save-Bitmap($bmp, $path) {
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Output "saved: $path"
}

# ── 1) COUPLE SILHOUETTE (1200x1600, transparent) ──
$w = 1200; $h = 1600
$bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::Transparent)

$gold = New-Object System.Drawing.Color
$gold = [System.Drawing.Color]::FromArgb(255, 212, 175, 55)
$goldDark = [System.Drawing.Color]::FromArgb(255, 180, 140, 40)
$goldLight = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 255, 215, 0))
$goldBrush = New-Object System.Drawing.SolidBrush($gold)
$goldPen = New-Object System.Drawing.Pen($gold, 6)

# --- GROOM (left figure) ---
# body / sherwani (tall trapezoid-ish)
$groomBody = New-Object System.Drawing.PointF[] 7
$groomBody[0] = New-Object System.Drawing.PointF(280, 1500)
$groomBody[1] = New-Object System.Drawing.PointF(300, 700)
$groomBody[2] = New-Object System.Drawing.PointF(340, 620)
$groomBody[3] = New-Object System.Drawing.PointF(430, 620)
$groomBody[4] = New-Object System.Drawing.PointF(470, 700)
$groomBody[5] = New-Object System.Drawing.PointF(490, 1500)
$groomBody[6] = New-Object System.Drawing.PointF(280, 1500)
$g.FillPolygon($goldBrush, $groomBody)

# sherwani center line
$g.DrawLine($goldPen, 385, 640, 385, 1400)

# groom head
$g.FillEllipse($goldBrush, 340, 500, 90, 110)

# topi / cap
$capPts = New-Object System.Drawing.PointF[] 5
$capPts[0] = New-Object System.Drawing.PointF(345, 510)
$capPts[1] = New-Object System.Drawing.PointF(355, 470)
$capPts[2] = New-Object System.Drawing.PointF(385, 455)
$capPts[3] = New-Object System.Drawing.PointF(415, 470)
$capPts[4] = New-Object System.Drawing.PointF(425, 510)
$g.FillPolygon($goldBrush, $capPts)

# groom arms (slight)
$g.FillEllipse($goldBrush, 260, 750, 55, 220)
$g.FillEllipse($goldBrush, 470, 750, 55, 220)

# --- BRIDE (right figure) ---
# lehenga (wide skirt)
$brideSkirt = New-Object System.Drawing.PointF[] 7
$brideSkirt[0] = New-Object System.Drawing.PointF(640, 1500)
$brideSkirt[1] = New-Object System.Drawing.PointF(680, 800)
$brideSkirt[2] = New-Object System.Drawing.PointF(720, 720)
$brideSkirt[3] = New-Object System.Drawing.PointF(820, 720)
$brideSkirt[4] = New-Object System.Drawing.PointF(860, 800)
$brideSkirt[5] = New-Object System.Drawing.PointF(900, 1500)
$brideSkirt[6] = New-Object System.Drawing.PointF(640, 1500)
$g.FillPolygon($goldBrush, $brideSkirt)

# bride torso
$g.FillRectangle($goldBrush, 720, 600, 100, 160)

# bride head
$g.FillEllipse($goldBrush, 735, 490, 75, 100)

# dupatta / veil over head flowing down
$veil = New-Object System.Drawing.PointF[] 8
$veil[0] = New-Object System.Drawing.PointF(710, 530)
$veil[1] = New-Object System.Drawing.PointF(720, 470)
$veil[2] = New-Object System.Drawing.PointF(770, 440)
$veil[3] = New-Object System.Drawing.PointF(825, 470)
$veil[4] = New-Object System.Drawing.PointF(835, 530)
$veil[5] = New-Object System.Drawing.PointF(870, 900)
$veil[6] = New-Object System.Drawing.PointF(700, 900)
$veil[7] = New-Object System.Drawing.PointF(710, 530)
$veilBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(160, 255, 215, 0))
$g.FillPolygon($veilBrush, $veil)

# bride hands (joined near center)
$g.FillEllipse($goldBrush, 680, 820, 45, 70)
$g.FillEllipse($goldBrush, 795, 820, 45, 70)

# --- DECORATIVE: small hearts / rings between them ---
$ringPen = New-Object System.Drawing.Pen($gold, 5)
$g.DrawEllipse($ringPen, 555, 700, 50, 50)
$g.DrawEllipse($ringPen, 575, 700, 50, 50)

Save-Bitmap $bmp (Join-Path $imgDir "couple-silhouette.png")


# ── background generator ──
function New-Background($w, $h, $c1Hex, $c2Hex, $c3Hex, $goldR, $goldG, $goldB, $outPath) {
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

  # gradient background
  $c1 = [System.Drawing.ColorTranslator]::FromHtml($c1Hex)
  $c2 = [System.Drawing.ColorTranslator]::FromHtml($c2Hex)
  $c3 = [System.Drawing.ColorTranslator]::FromHtml($c3Hex)
  $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c3, 45)
  $g.FillRectangle($brush, $rect)

  # center darker radial-ish overlay
  $c2a = [System.Drawing.Color]::FromArgb(120, $c2.R, $c2.G, $c2.B)
  $ovBrush = New-Object System.Drawing.SolidBrush($c2a)
  $g.FillEllipse($ovBrush, [int]($w*0.1), [int]($h*0.1), [int]($w*0.8), [int]($h*0.8))

  # geometric islamic pattern (diamond lattice)
  $goldColor = [System.Drawing.Color]::FromArgb(30, $goldR, $goldG, $goldB)
  $pen = New-Object System.Drawing.Pen($goldColor, 1)
  $step = 90
  for ($x = -$step; $x -lt ($w + $step); $x += $step) {
    for ($y = -$step; $y -lt ($h + $step); $y += $step) {
      $pts = New-Object System.Drawing.PointF[] 5
      $pts[0] = New-Object System.Drawing.PointF($x + $step/2, $y)
      $pts[1] = New-Object System.Drawing.PointF($x + $step, $y + $step/2)
      $pts[2] = New-Object System.Drawing.PointF($x + $step/2, $y + $step)
      $pts[3] = New-Object System.Drawing.PointF($x, $y + $step/2)
      $pts[4] = New-Object System.Drawing.PointF($x + $step/2, $y)
      $g.DrawPolygon($pen, $pts)
      # inner circle
      $g.DrawEllipse($pen, $x + $step/2 - 16, $y + $step/2 - 16, 32, 32)
    }
  }

  # brighter gold accent lattice
  $goldColor2 = [System.Drawing.Color]::FromArgb(18, $goldR, $goldG, $goldB)
  $pen2 = New-Object System.Drawing.Pen($goldColor2, 1.5)
  $step2 = 180
  for ($x = 0; $x -lt ($w + $step2); $x += $step2) {
    for ($y = 0; $y -lt ($h + $step2); $y += $step2) {
      $g.DrawRectangle($pen2, $x - 40, $y - 40, 80, 80)
    }
  }

  # vignette corners (dark)
  $darkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(100, 0, 0, 0))
  $g.FillRectangle($darkBrush, 0, 0, [int]($w*0.12), $h)
  $g.FillRectangle($darkBrush, [int]($w*0.88), 0, [int]($w*0.12), $h)
  $g.FillRectangle($darkBrush, 0, 0, $w, [int]($h*0.08))
  $g.FillRectangle($darkBrush, 0, [int]($h*0.92), $w, [int]($h*0.08))

  $g.Dispose()
  Save-Bitmap $bmp $outPath
}

# Royal Red & Gold bg
New-Background 1080 1920 "#4A0E17" "#2B050B" "#1A0305" 255 215 0 (Join-Path $imgDir "bg-royal.png")
# Emerald & Gold bg
New-Background 1080 1920 "#0A3B2C" "#062018" "#031A12" 255 215 0 (Join-Path $imgDir "bg-emerald.png")
# Midnight Sapphire bg
New-Background 1080 1920 "#0F1B3D" "#091230" "#050A1F" 255 215 0 (Join-Path $imgDir "bg-sapphire.png")


# ── 3) GOLD CORNER ORNAMENT (600x600, transparent) ──
$ow = 600; $oh = 600
$obmp = New-Object System.Drawing.Bitmap($ow, $oh, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$og = [System.Drawing.Graphics]::FromImage($obmp)
$og.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$og.Clear([System.Drawing.Color]::Transparent)

$ornGold = [System.Drawing.Color]::FromArgb(230, 255, 215, 0)
$ornPen = New-Object System.Drawing.Pen($ornGold, 4)
$ornBrush = New-Object System.Drawing.SolidBrush($ornGold)

# scroll curves
$og.DrawArc($ornPen, 20, 20, 300, 300, 0, 90)
$og.DrawArc($ornPen, 60, 60, 220, 220, 0, 90)
$og.DrawArc($ornPen, 100, 100, 140, 140, 0, 90)

# corner dots
$og.FillEllipse($ornBrush, 15, 15, 18, 18)
$og.FillEllipse($ornBrush, 320, 15, 10, 10)
$og.FillEllipse($ornBrush, 15, 320, 10, 10)

# small leaf shapes
$leafPts = New-Object System.Drawing.PointF[] 4
$leafPts[0] = New-Object System.Drawing.PointF(340, 40)
$leafPts[1] = New-Object System.Drawing.PointF(380, 20)
$leafPts[2] = New-Object System.Drawing.PointF(400, 60)
$leafPts[3] = New-Object System.Drawing.PointF(340, 40)
$og.FillPolygon($ornBrush, $leafPts)

$leafPts2 = New-Object System.Drawing.PointF[] 4
$leafPts2[0] = New-Object System.Drawing.PointF(40, 340)
$leafPts2[1] = New-Object System.Drawing.PointF(20, 380)
$leafPts2[2] = New-Object System.Drawing.PointF(60, 400)
$leafPts2[3] = New-Object System.Drawing.PointF(40, 340)
$og.FillPolygon($ornBrush, $leafPts2)

$og.Dispose()
Save-Bitmap $obmp (Join-Path $imgDir "gold-corner.png")


# ── 4) GOLD ARCH FRAME (1080x1600, transparent) ──
$aw = 1080; $ah = 1600
$abmp = New-Object System.Drawing.Bitmap($aw, $ah, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$ag = [System.Drawing.Graphics]::FromImage($abmp)
$ag.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$ag.Clear([System.Drawing.Color]::Transparent)

$frameGold = [System.Drawing.Color]::FromArgb(220, 255, 215, 0)
$fpen = New-Object System.Drawing.Pen($frameGold, 5)
$fpen2 = New-Object System.Drawing.Pen($frameGold, 2)

# outer arch (rounded top rectangle)
$ag.DrawArc($fpen, 40, 40, 1000, 500, 180, 180)
$ag.DrawLine($fpen, 40, 290, 40, 1560)
$ag.DrawLine($fpen, 1040, 290, 1040, 1560)
$ag.DrawLine($fpen, 40, 1560, 1040, 1560)

# inner arch
$ag.DrawArc($fpen2, 70, 70, 940, 460, 180, 180)
$ag.DrawLine($fpen2, 70, 300, 70, 1530)
$ag.DrawLine($fpen2, 1010, 300, 1010, 1530)
$ag.DrawLine($fpen2, 70, 1530, 1010, 1530)

# top finial / star
$starPts = New-Object System.Drawing.PointF[] 10
$cx0 = 540; $cy0 = 50; $rOut = 30; $rIn = 12
for ($i = 0; $i -lt 10; $i++) {
  $r = if ($i % 2 -eq 0) { $rOut } else { $rIn }
  $a = ($i * 36 - 90) * [Math]::PI / 180
  $starPts[$i] = New-Object System.Drawing.PointF($cx0 + $r * [Math]::Cos($a), $cy0 + $r * [Math]::Sin($a))
}
$ag.FillPolygon($ornBrush, $starPts)

# bottom corner ornaments
$ag.FillEllipse($ornBrush, 30, 1540, 20, 20)
$ag.FillEllipse($ornBrush, 1030, 1540, 20, 20)

$ag.Dispose()
Save-Bitmap $abmp (Join-Path $imgDir "arch-frame.png")

Write-Output "ALL IMAGES DONE"
Get-ChildItem $imgDir -File | Select-Object Name, Length

# PWA Icons Generator

Pour générer les icônes PWA, vous pouvez utiliser un outil en ligne ou créer les icônes manuellement.

## Option 1 : Outil en ligne (Recommandé)

1. Visitez : https://www.pwabuilder.com/imageGenerator
2. Uploadez votre logo (512x512px minimum)
3. Téléchargez le package d'icônes
4. Extrayez dans `public/icons/`

## Option 2 : Avec ImageMagick (CLI)

```bash
# Installer ImageMagick
# Windows: choco install imagemagick
# Mac: brew install imagemagick

# Depuis votre logo source (remplacer logo.png)
convert logo.png -resize 72x72 public/icons/icon-72x72.png
convert logo.png -resize 96x96 public/icons/icon-96x96.png
convert logo.png -resize 128x128 public/icons/icon-128x128.png
convert logo.png -resize 144x144 public/icons/icon-144x144.png
convert logo.png -resize 152x152 public/icons/icon-152x152.png
convert logo.png -resize 192x192 public/icons/icon-192x192.png
convert logo.png -resize 384x384 public/icons/icon-384x384.png
convert logo.png -resize 512x512 public/icons/icon-512x512.png
```

## Option 3 : Utiliser le logo existant

Si vous avez déjà un logo dans `/public/images/logo_white.png` :

```bash
# PowerShell
$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)
foreach ($size in $sizes) {
    magick convert public/images/logo_white.png -resize ${size}x${size} public/icons/icon-${size}x${size}.png
}
```

## Tailles requises

- 72x72 - Petits appareils
- 96x96 - Appareils normaux
- 128x128 - Haute densité
- 144x144 - Microsoft
- 152x152 - iOS Safari
- 192x192 - Android standard
- 384x384 - Haute résolution
- 512x512 - Splash screen

## Fichiers créés

Après génération, vous devriez avoir :

```
public/
  icons/
    icon-72x72.png
    icon-96x96.png
    icon-128x128.png
    icon-144x144.png
    icon-152x152.png
    icon-192x192.png
    icon-384x384.png
    icon-512x512.png
```

## Note

Le fichier `manifest.json` est déjà configuré pour utiliser ces icônes.
Si vous générez les icônes, l'app PWA sera immédiatement fonctionnelle.

# Setting App Icon in React Native/Expo

## Your Project Type
You're using **Expo** with native Android directories (prebuild). Your icon is configured in `app.json` but needs to be regenerated in native files.

## Icon Requirements

### For Expo (app.json):
- **Main Icon**: `./assets/images/icon.png` - Should be **1024x1024 pixels**, PNG format, square
- **Android Adaptive Icon**: `./assets/images/adaptive-icon.png` - Should be **1024x1024 pixels**, PNG format
  - The foreground should be centered and safe area is outer 25% on all sides
  - Keep important content in the center 50% of the image

## Method 1: Regenerate Icons (Recommended for Expo)

Since you have native Android directories, you need to regenerate them:

### Step 1: Ensure Icon Files Exist
Your icons should be at:
- `./assets/images/icon.png` (1024x1024)
- `./assets/images/adaptive-icon.png` (1024x1024)

### Step 2: Regenerate Native Files
Run this command to regenerate Android icons:

```bash
npx expo prebuild --clean
```

This will:
- Delete existing native Android/iOS directories
- Regenerate them with your icon from `app.json`
- Apply your icon configuration

### Step 3: Rebuild Your App
```bash
# For Android
npm run android
# or
npx expo run:android

# For EAS Build
eas build --platform android
```

## Method 2: Manual Icon Replacement (If Method 1 doesn't work)

### For Android:
Replace icon files in these directories:

1. **Standard Icons** (for older Android versions):
   - `android/app/src/main/res/mipmap-mdpi/ic_launcher.png` (48x48)
   - `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` (72x72)
   - `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` (96x96)
   - `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` (144x144)
   - `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` (192x192)

2. **Adaptive Icons** (for Android 8.0+):
   - `android/app/src/main/res/mipmap-*/ic_launcher_foreground.png` (various sizes)
   - `android/app/src/main/res/mipmap-*/ic_launcher_background.png` (various sizes)

### Generate Different Sizes:
You can use online tools like:
- https://appicon.co/
- https://icon.kitchen/
- https://www.appicon.build/

Upload your 1024x1024 icon and download Android asset pack.

## Method 3: Using EAS Build (Easiest)

If you're using EAS Build, icons are automatically generated from `app.json`:

```bash
eas build --platform android
```

No need to run `expo prebuild` for EAS builds - it handles icons automatically.

## Troubleshooting

### Icon Not Showing After Build:
1. **Clear app data** and uninstall the old version completely
2. **Rebuild** the app (don't just reload)
3. **Check icon file size** - must be exactly 1024x1024 pixels
4. **Verify icon path** in `app.json` matches your file location
5. **Check icon format** - must be PNG, not JPG

### Verify Your Icon Configuration:
Your `app.json` should have:
```json
{
  "expo": {
    "icon": "./assets/images/icon.png",
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    }
  }
}
```

### Check Current Icon:
Run this to see what icon Expo is using:
```bash
npx expo config --type public
```

## Quick Fix Steps:

1. **Ensure icon files exist and are correct size** (1024x1024)
2. **Run**: `npx expo prebuild --clean`
3. **Rebuild**: `npm run android` or `eas build --platform android`
4. **Uninstall old app** from device/emulator
5. **Install new build**

## For iOS (if needed later):
iOS icons are handled automatically by Expo when you run `expo prebuild` or build with EAS.


# How to See Your Custom App Icon

## ⚠️ Important: Expo Go Limitation
**Expo Go does NOT show custom app icons**. It always displays the Expo Go icon. This is a limitation of Expo Go.

## ✅ Solution: Create a Development Build

To see your custom icon, you need to create a **Development Build** (custom dev client) or **Production Build**.

---

## Option 1: Development Build (Recommended for Development)

A development build lets you use your custom icon while still developing with hot reload.

### Step 1: Install EAS CLI (if not already installed)
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo
```bash
eas login
```

### Step 3: Create Development Build
```bash
eas build --profile development --platform android
```

This will:
- ✅ Build an APK with your custom icon
- ✅ Include all your native modules
- ✅ Allow you to develop with Expo Go-like experience
- ✅ Show your custom app icon

### Step 4: Install the Development Build
- Download the APK from the build link provided
- Install it on your Android device
- Open the app (it will show your custom icon!)

### Step 5: Start Development Server
```bash
npm start
```

Then scan the QR code with your development build app (not Expo Go).

---

## Option 2: Preview Build (For Testing)

For a preview APK with your custom icon:

```bash
eas build --profile preview --platform android
```

This creates an APK you can install directly with your custom icon.

---

## Option 3: Local Build (If you have Android Studio)

If you prefer building locally:

### Step 1: Regenerate Native Files with Your Icon
```bash
npx expo prebuild --clean
```

This applies your icon from `app.json` to the native Android project.

### Step 2: Build Locally
```bash
npx expo run:android
```

Or open `android` folder in Android Studio and build from there.

---

## Your Current Configuration

Your `app.json` is correctly configured:
- ✅ `icon: "./assets/images/icon.png"` (1024x1024)
- ✅ `adaptiveIcon.foregroundImage: "./assets/images/adaptive-icon.png"` (1024x1024)
- ✅ `adaptiveIcon.backgroundColor: "#ffffff"`

The icon files exist and are configured correctly. You just need to build the app to see them!

---

## Quick Comparison

| Method | Custom Icon? | Development Features | Build Time |
|--------|-------------|---------------------|------------|
| **Expo Go** | ❌ No | ✅ Full | Instant |
| **Development Build** | ✅ Yes | ✅ Full | ~15-20 min |
| **Preview Build** | ✅ Yes | ⚠️ Limited | ~15-20 min |
| **Production Build** | ✅ Yes | ❌ None | ~15-20 min |

---

## Recommended Workflow

1. **For initial development**: Use Expo Go (fast iteration)
2. **When you need custom icon**: Switch to Development Build
3. **For testing**: Use Preview Build
4. **For release**: Use Production Build

---

## Troubleshooting

### Icon still not showing after build?
1. **Uninstall old version completely** from device
2. **Clear app data** if reinstalling
3. **Check icon file size**: Must be exactly 1024x1024 pixels
4. **Verify file path**: `./assets/images/icon.png` (relative to project root)
5. **Rebuild**: Icons are baked into the build, so you need a fresh build

### Development Build Not Loading Code?
- Make sure you're using the development build app (not Expo Go)
- Check that your development server is running
- Verify the QR code is scanned with the correct app

---

## Next Steps

1. Run: `eas build --profile development --platform android`
2. Wait for build to complete (~15-20 minutes)
3. Download and install the APK
4. Open the app and see your custom icon! 🎉


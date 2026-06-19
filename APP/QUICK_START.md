# 🚀 PublicEye Quick Start - One Command

## **FASTEST WAY - Start Everything (Recommended)**

```powershell
cd d:\PublicEye-1
.\start-all.ps1
```

**This will automatically:**
1. ✅ Detect your machine IP
2. ✅ Update Android app configuration
3. ✅ Start Python backend on localhost:8000
4. ✅ Build and deploy Android app

---

## **Individual Commands**

### **Backend Only**
```powershell
cd d:\PublicEye-1
.\setup-backend.ps1
```
- Starts FastAPI on `http://localhost:8000`
- Opens at `http://localhost:8000/docs`

### **Android Build Only**
```powershell
cd d:\PublicEye-1
.\setup-android.ps1
```
- Builds APK
- Installs on connected emulator/device
- Shows your machine IP

---

## **Manual Setup (If Scripts Don't Work)**

### Terminal 1 - Backend
```powershell
cd d:\PublicEye-1\publiceye-backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 2 - Android
```powershell
cd d:\PublicEye-1
.\gradlew.bat clean build
.\gradlew.bat installDebug
```

---

## **Troubleshooting**

### Scripts won't run?
```powershell
# Enable script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Can't find emulator?
```powershell
# List devices
adb devices

# Start emulator
emulator -avd <your_emulator_name>
```

### Backend connection failed?
- Check IP in `app/src/main/java/com/publiceye/app/utils/Constants.kt`
- Ensure device is on same Wi-Fi
- Verify backend running: `http://<your-ip>:8000/docs`

---

## **Test Connection**

After everything starts:
1. Backend: Open `http://localhost:8000/docs` ✅
2. Android: App should fetch data from backend ✅
3. Check Android Studio Logcat for network logs ✅

---

**That's it! One command to run the whole project!** 🎉

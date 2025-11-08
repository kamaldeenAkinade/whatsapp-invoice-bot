# Troubleshooting Guide

## Bot Not Starting / Stuck on "Starting WhatsApp Invoice Bot..."

### Why This Happens
On **first run**, the bot needs to download Chromium browser (~170MB). This can take 1-5 minutes depending on your internet speed.

### Solutions

**Option 1: Just Wait (Recommended)**
- First startup takes 1-5 minutes
- You'll see "Starting WhatsApp Invoice Bot..." while downloading
- Be patient! It only happens once
- Next time it starts in ~10 seconds

**Option 2: Check If It's Actually Working**
1. Kill the current process (Ctrl+C)
2. Run with debug output:
```bash
node index.js
```
3. Watch for any error messages

**Option 3: Manual Chromium Install**
If the download keeps failing:
```bash
node node_modules/puppeteer/install.js
```

---

## Common Errors & Fixes

### Error: "EACCES: permission denied"
**Fix:** Run with proper permissions
```bash
npm start
```

### Error: "Cannot find module..."
**Fix:** Reinstall dependencies
```bash
rm -rf node_modules
npm install
```

### Error: "Authentication failure"
**Fix:** Delete auth folder and rescan QR
```bash
rm -rf .wwebjs_auth
npm start
```

### Bot Disconnects Randomly
**Causes:**
- Phone lost internet connection
- WhatsApp Web session expired
- Computer went to sleep

**Fix:**
1. Make sure your phone stays connected to internet
2. Keep computer awake while bot running
3. Just restart the bot: `npm start`
4. Rescan QR code

---

## Performance Issues

### Bot is Slow to Respond
- WhatsApp web can have delays (2-5 seconds is normal)
- Check your internet connection
- Restart the bot

### Computer Running Hot
- Normal - Chromium uses resources
- Consider closing other apps
- Bot uses ~200-400MB RAM

---

## QR Code Issues

### QR Code Not Showing
**Possible reasons:**
1. Still downloading Chromium (wait 1-5 min)
2. Terminal window too small (resize it)
3. Error occurred (check for error messages)

**Solutions:**
1. Wait longer (first time only)
2. Make terminal window bigger
3. Try running: `node index.js` to see errors
4. Check internet connection

### QR Code Expires Before Scanning
- You have ~20 seconds to scan
- If it expires, bot generates a new one automatically
- Just scan the new code

### "Invalid QR Code" Error
- Make sure you're using WhatsApp's "Linked Devices" feature
- NOT the payment QR scanner
- Path: Settings → Linked Devices → Link a Device

---

## Invoice Generation Issues

### PDF Not Generating
**Check:**
1. Does `invoices/` folder exist?
2. Do you have write permissions?
3. Check terminal for error messages

**Fix:**
```bash
mkdir invoices
chmod 755 invoices
```

### PDF is Blank or Corrupted
- Usually a rare bug
- Try generating another invoice
- If persists, restart bot

### Can't Open PDF
- Make sure you have a PDF reader
- Try sending to another device
- Check file isn't corrupted (size should be >10KB)

---

## Network Issues

### "Unable to reach phone"
**Causes:**
- Phone not connected to internet
- WhatsApp not running on phone
- Phone in airplane mode

**Fix:**
- Check phone's internet connection
- Open WhatsApp on phone
- Keep WhatsApp running in background

### "Connection Lost"
**Causes:**
- Computer lost internet
- Network firewall blocking
- WhatsApp servers down

**Fix:**
- Check your internet connection
- Try different network
- Restart bot
- Wait a few minutes (WhatsApp issue)

---

## macOS Specific Issues

### "Cannot Open Because Developer Cannot be Verified"
**Fix:**
- This shouldn't happen with Node.js apps
- If it does: System Preferences → Security → Allow

### Chromium Won't Launch
**Fix:**
```bash
xattr -cr node_modules/puppeteer/.local-chromium
```

---

## Quick Diagnostic Commands

**Check if Node.js is installed:**
```bash
node --version
```
Should show v14+ or higher

**Check if dependencies are installed:**
```bash
ls node_modules | wc -l
```
Should show ~150+ packages

**Check if bot file exists:**
```bash
cat index.js | head -5
```
Should show JavaScript code

**Test PDF generation:**
```bash
node -e "const PDFDocument = require('pdfkit'); console.log('PDF library works!');"
```

---

## Still Not Working?

### Last Resort Fixes

**Complete Fresh Install:**
```bash
# Backup invoices first!
cp -r invoices invoices_backup

# Clean everything
rm -rf node_modules package-lock.json .wwebjs_auth

# Reinstall
npm install

# Try again
npm start
```

**Check System Requirements:**
- macOS 10.13 or later
- Node.js 14 or later
- 500MB free disk space
- Active internet connection

---

## Getting More Help

**Enable Debug Mode:**
Edit `index.js` and add at the top:
```javascript
process.env.DEBUG = 'puppeteer:*';
```

Then run:
```bash
node index.js
```

This shows detailed logs to diagnose issues.

---

## Normal Behavior (Not Errors!)

✅ **First start takes 1-5 minutes** - Downloading Chromium
✅ **"deprecated" warnings during npm install** - Safe to ignore
✅ **Bot takes 10-20 seconds to start** - Loading browser
✅ **Messages have 1-2 second delay** - WhatsApp Web latency
✅ **QR code looks "pixelated"** - Normal for terminal display
✅ **Chromium uses 200-400MB RAM** - Normal browser usage

---

**Most issues are solved by just waiting longer on first run!** ⏰

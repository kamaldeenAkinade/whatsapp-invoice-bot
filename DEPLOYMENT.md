# Deployment Guide

This guide explains how to deploy your WhatsApp Invoice Bot for 24/7 operation.

## Option 1: Run as a Local Service (Recommended for Personal Use)

1. Install PM2 (Process Manager):
```bash
npm install -g pm2
```

2. Install dependencies:
```bash
npm install
```

3. Start the bot as a service:
```bash
npm run service
```

The bot will now run in the background and restart automatically if it crashes or if your computer restarts.

Useful commands:
- Check bot status: `npm run service:status`
- View logs: `npm run service:logs`
- Stop the bot: `npm run service:stop`

## Option 2: Deploy to Heroku

1. Install Heroku CLI:
   - Mac: `brew install heroku`
   - Windows: Download from Heroku website

2. Login to Heroku:
```bash
heroku login
```

3. Create a new Heroku app:
```bash
heroku create your-bot-name
```

4. Deploy:
```bash
git push heroku main
```

## Option 3: Deploy to Railway.app (Recommended for Production)

1. Create an account on Railway.app
2. Install Railway CLI:
```bash
npm i -g @railway/cli
```

3. Login:
```bash
railway login
```

4. Initialize and deploy:
```bash
railway init
railway up
```

## Important Notes

1. First-time setup:
   - You'll need to scan the QR code once when setting up on a new environment
   - After scanning, the session will be saved and persist across restarts

2. Storage:
   - Business profiles and session data are stored locally
   - For cloud deployment, consider using a database service

3. Monitoring:
   - Use `npm run service:logs` to monitor the bot
   - Set up notifications for any errors or issues

4. Security:
   - Keep your session files secure
   - Don't share your QR code
   - Use environment variables for sensitive data

## Troubleshooting

If the bot disconnects:
1. Check the logs: `npm run service:logs`
2. Restart the service: `npm run service:stop` then `npm run service`
3. If needed, delete the .wwebjs_auth folder and rescan QR code

For more help, check TROUBLESHOOTING.md
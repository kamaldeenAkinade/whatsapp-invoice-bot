# Quick Start Guide

## Get Your WhatsApp Invoice Bot Running in 3 Steps!

### Step 1: Start the Bot
```bash
npm start
```

### Step 2: Scan QR Code
- Open WhatsApp on your phone
- Go to Settings > Linked Devices
- Tap "Link a Device"
- Scan the QR code in your terminal

### Step 3: Create Invoice
Send yourself a WhatsApp message:
```
invoice
```

Then follow the prompts!

---

## Example Usage

```
You: invoice

Bot: Great! Let's create an invoice.
     Please provide the customer name:

You: John Doe

Bot: Customer: John Doe
     Please provide the customer email:

You: john@example.com

Bot: Email: john@example.com
     Please provide the customer phone number:

You: 555-1234

Bot: Phone: 555-1234
     Now let's add items...
     Send item details in format:
     Item name | Quantity | Price

You: Web Design | 1 | 500

Bot: Item added: Web Design x1 @ $500 = $500.00
     Add another item or type "done"

You: done

Bot: Items added successfully!
     Please provide the payment method:

You: Cash

Bot: Payment Method: Cash
     Please provide any additional notes or type "skip":

You: skip

Bot: [Sends PDF Invoice]
```

---

## Tips

- Keep terminal window open while bot is running
- First time setup takes a minute
- Invoices are saved in `invoices/` folder
- Customize your company info in `config.js`

---

## Troubleshooting

**QR code not showing?**
- Wait 10 seconds and try again
- Check internet connection

**Bot disconnected?**
- Just restart with `npm start`
- Scan QR code again

**Need help?**
- Type `help` in WhatsApp
- Check README.md for full documentation

---

**That's it! You're ready to generate invoices! 🎉**

# WhatsApp Invoice Bot

A free, automated WhatsApp bot that generates professional invoices and receipts instantly within WhatsApp conversations.

## Features

- **Instant Invoice Generation**: Create professional PDF invoices directly in WhatsApp
- **Interactive Conversation**: User-friendly step-by-step process
- **Professional PDF Design**: Clean, modern invoice templates
- **100% Free**: No API costs, completely free to run
- **Easy Customization**: Configure company details, colors, and branding
- **Auto-save**: All invoices are automatically saved locally
- **Multiple Items**: Add unlimited items to each invoice
- **Customer Details**: Capture customer name, email, and phone
- **Payment Tracking**: Record payment methods
- **Notes Support**: Add custom notes to invoices

## Prerequisites

Before you begin, make sure you have:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **WhatsApp Account** - Active WhatsApp account on your phone
- **Internet Connection** - Stable connection for WhatsApp Web

## Installation

### Step 1: Clone or Download

Download this project to your computer.

### Step 2: Install Dependencies

Open terminal in the project folder and run:

```bash
npm install
```

This will install:
- `whatsapp-web.js` - WhatsApp Web client
- `qrcode-terminal` - QR code generator
- `pdfkit` - PDF generation library

### Step 3: Configure (Optional)

Edit `config.js` to customize:
- Company name and details
- Invoice colors and styling
- Tax rates
- Currency symbols

## Usage

### Starting the Bot

1. Open terminal in the project folder
2. Run the bot:

```bash
npm start
```

Or:

```bash
node index.js
```

3. **Scan the QR code** with your WhatsApp mobile app:
   - Open WhatsApp on your phone
   - Tap **Menu** (⋮) or **Settings**
   - Select **Linked Devices**
   - Tap **Link a Device**
   - Scan the QR code displayed in terminal

4. Wait for "Bot is ready and connected!" message

### Creating an Invoice

Once the bot is running, open WhatsApp and message yourself (or have customers message you):

1. Type: `invoice`
2. Follow the prompts:
   - Enter customer name
   - Enter customer email
   - Enter customer phone
   - Add items in format: `Item name | Quantity | Price`
     - Example: `Web Design | 1 | 500`
     - Example: `Logo Design | 2 | 150`
   - Type `done` when finished adding items
   - Enter payment method (e.g., "Cash", "Bank Transfer")
   - Add notes or type `skip`

3. Receive your professional PDF invoice instantly!

## Commands

- `invoice` - Start creating a new invoice
- `help` - Show available commands

## Example Conversation

```
You: invoice

Bot: Great! Let's create an invoice.
     Please provide the customer name:

You: John Smith

Bot: Customer: John Smith
     Please provide the customer email:

You: john@example.com

Bot: Email: john@example.com
     Please provide the customer phone number:

You: (555) 123-4567

Bot: Phone: (555) 123-4567
     Now let's add items to the invoice.

     Send item details in this format:
     Item name | Quantity | Price per unit

     Example: "Web Design | 1 | 500"

     Send "done" when you've added all items.

You: Website Development | 1 | 1200

Bot: Item added: Website Development x1 @ $1200 = $1200.00
     Add another item or type "done" to continue.

You: Logo Design | 1 | 300

Bot: Item added: Logo Design x1 @ $300 = $300.00
     Add another item or type "done" to continue.

You: done

Bot: Items added successfully!
     Please provide the payment method:

You: Bank Transfer

Bot: Payment Method: Bank Transfer
     Please provide any additional notes (or type "skip"):

You: Payment due within 30 days

Bot: Generating your invoice... Please wait.

Bot: [PDF Invoice Attached]
     Your invoice has been generated!

     Invoice #: INV-1699123456789
     Customer: John Smith
     Total: $1500.00

     Type "invoice" to create another one!
```

## File Structure

```
WhatsappBot/
├── index.js              # Main bot file
├── invoiceGenerator.js   # PDF generation logic
├── config.js             # Configuration settings
├── package.json          # Dependencies
├── README.md            # This file
├── .gitignore           # Git ignore file
├── invoices/            # Generated invoices (auto-created)
└── .wwebjs_auth/        # WhatsApp session (auto-created)
```

## Customization

### Company Details

Edit `config.js`:

```javascript
company: {
    name: 'Your Company Name',
    address: '123 Business Street, City, State 12345',
    email: 'contact@yourcompany.com',
    phone: '(555) 123-4567',
    website: 'www.yourcompany.com'
}
```

### Colors & Styling

Edit `config.js`:

```javascript
pdf: {
    colors: {
        primary: '#3498db',      // Header color
        secondary: '#27ae60',    // Total box color
        text: '#2c3e50',         // Text color
        textLight: '#7f8c8d',    // Light text
        background: '#ecf0f1'    // Row background
    }
}
```

### Tax Settings

Edit `config.js`:

```javascript
invoice: {
    taxRate: 0.10,  // 10% tax (0 for no tax)
    currency: '$',
    prefix: 'INV-'
}
```

## Troubleshooting

### QR Code Not Appearing
- Make sure you have a stable internet connection
- Try restarting the bot
- Clear terminal and run again

### Bot Disconnects
- Check your internet connection
- WhatsApp Web sessions expire; rescan QR code
- Ensure your phone has an active internet connection

### PDF Not Generating
- Check if `invoices/` folder exists
- Ensure you have write permissions
- Check terminal for error messages

### Authentication Errors
- Delete `.wwebjs_auth/` folder
- Restart the bot and scan QR code again

## Important Notes

- **Against WhatsApp ToS**: This uses unofficial WhatsApp Web API. Use at your own risk.
- **Personal Use**: Best for personal/small business use, not enterprise scale
- **Account Safety**: Using unofficial APIs may risk account suspension
- **Session Persistence**: Once authenticated, the bot remembers your session
- **Keep Running**: Keep the bot running to receive messages

## Costs

- **Installation**: $0
- **Dependencies**: $0 (all free, open-source)
- **Hosting**: $0 (runs on your computer)
- **API Fees**: $0 (no API calls)
- **Total**: **$0** (Completely Free!)

## Hosting Options

### Run on Your Computer
- Free but requires computer to stay on
- Best for testing and personal use

### Free Cloud Hosting
- **Railway.app** - Free tier available
- **Render.com** - Free tier with limitations
- **Heroku** - Limited free tier
- **Google Cloud / AWS** - Free tier (credit card required)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Check WhatsApp Web.js documentation

## License

MIT License - Free to use and modify

## Disclaimer

This project uses unofficial WhatsApp Web API and is not affiliated with, endorsed by, or connected to WhatsApp LLC or Meta Platforms Inc. Use at your own risk.

---

**Made with ❤️ for small businesses and freelancers**

Happy Invoicing! 🧾

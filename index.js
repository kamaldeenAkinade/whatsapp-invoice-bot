const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { generateInvoice } = require('./invoiceGenerator');
const fs = require('fs');
const path = require('path');
const businessProfile = require('./businessProfile');
const setupManager = require('./setupManager');

// Create invoices directory if it doesn't exist
const invoicesDir = path.join(__dirname, 'invoices');
if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir);
}

// Initialize WhatsApp client with enhanced stability settings
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: '/app/.wwebjs_auth'
    }),
    puppeteer: {
        headless: true,
        executablePath: '/usr/bin/chromium-browser',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-software-rasterizer'
        ],
        timeout: 100000
    },
    clientId: 'invoice-bot-client'
});

// QR Code generation
client.on('qr', (qr) => {
    console.log('\n========== WHATSAPP INVOICE BOT ==========');
    console.log('Scan this QR code with WhatsApp:\n');
    // Generate QR with larger size and clear borders
    qrcode.generate(qr, { small: false });
    console.log('\nIf QR code appears broken, use this string to generate it:');
    console.log(qr);
    console.log('\n==========================================');
});

// Client ready
// Handle errors
client.on('auth_failure', (err) => {
    console.error('Authentication failed:', err);
});

client.on('disconnected', (reason) => {
    console.log('Client was disconnected:', reason);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

client.on('ready', () => {
    console.log('\n==========================================');
    console.log('Bot is ready and connected!');
    console.log('==========================================\n');
    console.log('How to use:');
    console.log('1. Type "help" for commands');
    console.log('2. Type "invoice" to generate an invoice');
    console.log('3. Follow the prompts');
    console.log('==========================================\n');
});

// Store conversation states for each user
const userStates = {};

// Smart parser to extract numbers from text
function extractNumber(text) {
    const match = text.match(/\d+\.?\d*/);
    return match ? parseFloat(match[0]) : null;
}

// Detect if message is about creating invoice
function isInvoiceRequest(text) {
    const lower = text.toLowerCase();
    const triggers = ['invoice', 'receipt', 'bill', 'create', 'generate', 'need'];
    return triggers.some(trigger => lower.includes(trigger));
}

// Message handler
client.on('message', async (message) => {
    try {
        const chatId = message.from;
        const userInput = message.body.trim().toLowerCase();

        // Check if user is in setup process
        if (setupManager.isInSetup(chatId)) {
            const response = setupManager.processSetupStep(chatId, message.body.trim());
            await message.reply(response);
            return;
        }

        // Initialize user state if doesn't exist
        if (!userStates[chatId]) {
            userStates[chatId] = {
                step: 'idle',
                data: {}
            };
        }

        const userState = userStates[chatId];

        // Check if business profile exists
        if (!businessProfile.isProfileComplete(chatId) && userInput !== 'setup') {
            await message.reply("Welcome! 👋 I notice you haven't set up your business profile yet. This is needed to create professional invoices.\n\nType 'setup' to begin the quick setup process.");
            return;
        }

        // Handle setup command
        if (userInput === 'setup') {
            const response = setupManager.startSetup(chatId);
            await message.reply(response);
            return;
        }

        // Auto-detect invoice creation request
        if (userState.step === 'idle' && isInvoiceRequest(userInput)) {
            userState.step = 'customer_name';
            userState.data = {};
            await message.reply('Perfect! I\'ll help you create an invoice 😊\n\nWhat\'s the customer\'s name?');
            return;
        }

        // Cancel command
        if (userInput.toLowerCase() === 'cancel' && userState.step !== 'idle') {
            userState.step = 'idle';
            userState.data = {};
            await message.reply('Invoice creation cancelled. Send any message when you need an invoice!');
            return;
        }

        // Invoice creation flow
        if (userState.step !== 'idle') {
            switch (userState.step) {
                case 'customer_name':
                    userState.data.customerName = userInput;
                    userState.step = 'customer_contact';
                    await message.reply(`Got it! Customer: *${userInput}*\n\nWhat\'s their email or phone? (you can skip by typing "skip")`);
                    break;

                case 'customer_contact':
                    if (userInput.toLowerCase() === 'skip') {
                        userState.data.customerEmail = '-';
                        userState.data.customerPhone = '-';
                    } else {
                        // Smart detection: if it has @, it's email, otherwise phone
                        if (userInput.includes('@')) {
                            userState.data.customerEmail = userInput;
                            userState.data.customerPhone = '-';
                        } else {
                            userState.data.customerPhone = userInput;
                            userState.data.customerEmail = '-';
                        }
                    }
                    userState.step = 'item_name';
                    userState.data.items = [];
                    userState.data.currentItem = {};
                    await message.reply('Great! Now let\'s add items.\n\nWhat are you selling? (e.g., "Logo Design", "Consulting", "Product")');
                    break;

                case 'item_name':
                    userState.data.currentItem.description = userInput;
                    userState.step = 'item_price';
                    await message.reply(`*${userInput}* - got it!\n\nWhat\'s the total price? (just type the number, e.g., "500")`);
                    break;

                case 'item_price':
                    const price = extractNumber(userInput);
                    if (!price || price <= 0) {
                        await message.reply('Please enter a valid price (e.g., "500" or "99.99")');
                        return;
                    }

                    // Default to quantity 1
                    userState.data.currentItem.quantity = 1;
                    userState.data.currentItem.price = price;

                    userState.data.items.push({...userState.data.currentItem});

                    const total = price;
                    await message.reply(`✅ Added: ${userState.data.currentItem.description} - $${total.toFixed(2)}\n\n` +
                        `Add another item? Type the item name or "done" to finish.`);

                    userState.data.currentItem = {};
                    userState.step = 'add_more_items';
                    break;

                case 'add_more_items':
                    if (userInput.toLowerCase() === 'done' || userInput.toLowerCase() === 'finish' || userInput.toLowerCase() === 'no') {
                        userState.step = 'payment_method';
                        await message.reply('Perfect! How did they pay? (e.g., "Cash", "Card", "PayPal", or just "skip")');
                    } else {
                        // New item
                        userState.data.currentItem.description = userInput;
                        userState.step = 'item_price';
                        await message.reply(`*${userInput}* - what\'s the total price?`);
                    }
                    break;

                case 'payment_method':
                    userState.data.paymentMethod = userInput.toLowerCase() === 'skip' ? 'Not specified' : userInput;
                    userState.step = 'confirm';

                    // Show summary
                    let summary = `*Invoice Summary:*\n\n`;
                    summary += `Customer: ${userState.data.customerName}\n`;
                    summary += `\nItems:\n`;
                    userState.data.items.forEach((item, i) => {
                        summary += `${i + 1}. ${item.description} - $${item.price.toFixed(2)}\n`;
                    });
                    summary += `\nTotal: $${calculateTotal(userState.data.items).toFixed(2)}\n`;
                    summary += `Payment: ${userState.data.paymentMethod}\n\n`;
                    summary += `Send "yes" to generate the invoice or "cancel" to start over.`;

                    await message.reply(summary);
                    break;

                case 'confirm':
                    if (userInput.toLowerCase() !== 'yes' && userInput.toLowerCase() !== 'ok' &&
                        userInput.toLowerCase() !== 'confirm' && userInput.toLowerCase() !== 'y') {
                        userState.step = 'idle';
                        userState.data = {};
                        await message.reply('Invoice cancelled. Send any message when you need a new invoice!');
                        return;
                    }

                    // Generate invoice
                    await message.reply('✨ Creating your invoice...');

                    try {
                        const invoiceNumber = Date.now();
                        const pdfPath = path.join(invoicesDir, `invoice-${invoiceNumber}.pdf`);

                        const invoiceData = {
                            invoiceNumber: `INV-${invoiceNumber}`,
                            date: new Date().toLocaleDateString(),
                            customerName: userState.data.customerName,
                            customerEmail: userState.data.customerEmail,
                            customerPhone: userState.data.customerPhone,
                            items: userState.data.items,
                            paymentMethod: userState.data.paymentMethod,
                            notes: ''
                        };

                        // Generate PDF
                        await generateInvoice(invoiceData, pdfPath);

                        // Send PDF
                        const media = MessageMedia.fromFilePath(pdfPath);
                        await client.sendMessage(chatId, media, {
                            caption: `✅ Invoice ready!\n\n` +
                                `Invoice #: ${invoiceData.invoiceNumber}\n` +
                                `Total: $${calculateTotal(userState.data.items).toFixed(2)}\n\n` +
                                `Need another invoice? Just send me a message!`
                        });

                        // Reset user state
                        userState.step = 'idle';
                        userState.data = {};

                    } catch (error) {
                        console.error('Error generating invoice:', error);
                        await message.reply('Oops! Something went wrong. Please try again by sending "invoice".');
                        userState.step = 'idle';
                        userState.data = {};
                    }
                    break;
            }
        }

    } catch (error) {
        console.error('Error handling message:', error);
    }
});

// Helper function to calculate total
function calculateTotal(items) {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
}

// Error handling
client.on('auth_failure', (msg) => {
    console.error('Authentication failure:', msg);
    console.log('Please delete .wwebjs_auth folder and try again');
});

client.on('disconnected', (reason) => {
    console.log('Client was disconnected:', reason);
    console.log('Restarting...');
});

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

// Handle process errors
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

// Initialize client
console.log('Starting WhatsApp Invoice Bot...');
console.log('Please wait while initializing (this may take 1-3 minutes on first run)...');

client.initialize().catch(err => {
    console.error('Failed to initialize client:', err);
    process.exit(1);
});

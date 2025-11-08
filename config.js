/**
 * Configuration file for WhatsApp Invoice Bot
 * Customize these settings for your business
 */

module.exports = {
    // Company Information
    company: {
        name: 'Your Company Name',
        address: '123 Business Street, City, State 12345',
        email: 'contact@yourcompany.com',
        phone: '(555) 123-4567',
        website: 'www.yourcompany.com'
    },

    // Invoice Settings
    invoice: {
        // Currency symbol
        currency: '$',

        // Tax rate (e.g., 0.10 for 10%, 0 for no tax)
        taxRate: 0,

        // Invoice number prefix
        prefix: 'INV-',

        // Date format (options: 'en-US', 'en-GB', etc.)
        dateFormat: 'en-US'
    },

    // Bot Settings
    bot: {
        // Response messages
        messages: {
            welcome: 'Welcome to our Invoice Bot! Type "help" to see available commands.',
            help: `*WhatsApp Invoice Bot - Commands*\n\n` +
                  `*invoice* - Generate a new invoice/receipt\n` +
                  `*help* - Show this help message\n\n` +
                  `To create an invoice, simply type "invoice" and I'll guide you through the process!`
        },

        // Auto-save invoices (true/false)
        saveInvoices: true,

        // Invoices directory
        invoicesDirectory: 'invoices'
    },

    // PDF Styling
    pdf: {
        // Colors (hex format)
        colors: {
            primary: '#3498db',      // Blue
            secondary: '#27ae60',    // Green
            text: '#2c3e50',         // Dark gray
            textLight: '#7f8c8d',    // Light gray
            background: '#ecf0f1'    // Very light gray
        },

        // Logo (leave empty if no logo)
        logo: '',

        // Page size (options: 'A4', 'LETTER')
        pageSize: 'A4'
    }
};

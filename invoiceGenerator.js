const PDFDocument = require('pdfkit');
const fs = require('fs');

/**
 * Generate a professional invoice PDF
 * @param {Object} data - Invoice data
 * @param {string} outputPath - Path to save the PDF
 */
async function generateInvoice(data, outputPath) {
    return new Promise((resolve, reject) => {
        try {
            // Create a document
            const doc = new PDFDocument({ margin: 50, size: 'A4' });

            // Pipe to file
            const stream = fs.createWriteStream(outputPath);
            doc.pipe(stream);

            // Company header (customizable)
            doc.fontSize(24)
                .fillColor('#2c3e50')
                .text('INVOICE', { align: 'center' });

            doc.moveDown(0.5);

            // Company info from business profile
            doc.fontSize(10)
                .fillColor('#7f8c8d')
                .text(data.business.businessName, { align: 'center' })
                .text(data.business.address, { align: 'center' })
                .text(`${data.business.email} | ${data.business.phone}`, { align: 'center' });

            doc.moveDown(2);

            // Invoice details box
            const invoiceY = doc.y;
            doc.fontSize(10)
                .fillColor('#2c3e50')
                .text(`Invoice #: ${data.invoiceNumber}`, 50, invoiceY)
                .text(`Date: ${data.date}`, 50, invoiceY + 15);

            // Customer details
            doc.moveDown(2);
            doc.fontSize(12)
                .fillColor('#2c3e50')
                .text('Bill To:', 50, doc.y);

            doc.fontSize(10)
                .fillColor('#34495e')
                .text(data.customerName, 50, doc.y + 5)
                .text(data.customerEmail)
                .text(data.customerPhone);

            doc.moveDown(2);

            // Line separator
            doc.strokeColor('#bdc3c7')
                .lineWidth(1)
                .moveTo(50, doc.y)
                .lineTo(550, doc.y)
                .stroke();

            doc.moveDown(1);

            // Table header
            const tableTop = doc.y;
            const itemX = 50;
            const descriptionX = 50;
            const quantityX = 300;
            const priceX = 400;
            const amountX = 500;

            doc.fontSize(10)
                .fillColor('#ffffff')
                .rect(50, tableTop, 500, 25)
                .fill('#3498db');

            doc.fillColor('#ffffff')
                .text('Description', descriptionX + 5, tableTop + 8)
                .text('Qty', quantityX + 5, tableTop + 8)
                .text('Price', priceX + 5, tableTop + 8)
                .text('Amount', amountX + 5, tableTop + 8);

            // Table rows
            let currentY = tableTop + 30;
            let subtotal = 0;

            data.items.forEach((item, index) => {
                const amount = item.quantity * item.price;
                subtotal += amount;

                // Alternate row colors
                if (index % 2 === 0) {
                    doc.fillColor('#ecf0f1')
                        .rect(50, currentY - 5, 500, 25)
                        .fill();
                }

                doc.fillColor('#2c3e50')
                    .fontSize(9)
                    .text(item.description, descriptionX + 5, currentY, { width: 240 })
                    .text(item.quantity.toString(), quantityX + 5, currentY)
                    .text(`$${item.price.toFixed(2)}`, priceX + 5, currentY)
                    .text(`$${amount.toFixed(2)}`, amountX + 5, currentY);

                currentY += 25;
            });

            // Line separator
            doc.strokeColor('#bdc3c7')
                .lineWidth(1)
                .moveTo(50, currentY + 5)
                .lineTo(550, currentY + 5)
                .stroke();

            currentY += 20;

            // Calculate totals
            const tax = subtotal * 0; // 0% tax, change if needed
            const total = subtotal + tax;

            // Subtotal, tax, and total
            const totalLabelX = 400;
            const totalValueX = 500;

            doc.fontSize(10)
                .fillColor('#2c3e50')
                .text('Subtotal:', totalLabelX, currentY)
                .text(`$${subtotal.toFixed(2)}`, totalValueX, currentY);

            currentY += 20;

            if (tax > 0) {
                doc.text('Tax:', totalLabelX, currentY)
                    .text(`$${tax.toFixed(2)}`, totalValueX, currentY);
                currentY += 20;
            }

            // Total box
            doc.fontSize(12)
                .fillColor('#ffffff')
                .rect(totalLabelX - 10, currentY - 5, 160, 30)
                .fill('#27ae60');

            doc.fillColor('#ffffff')
                .text('Total:', totalLabelX, currentY + 5)
                .text(`$${total.toFixed(2)}`, totalValueX, currentY + 5);

            currentY += 50;

            // Payment method
            doc.fontSize(10)
                .fillColor('#2c3e50')
                .text(`Payment Method: ${data.paymentMethod}`, 50, currentY);

            currentY += 30;

            // Notes section
            if (data.notes && data.notes.trim() !== '') {
                doc.fontSize(10)
                    .fillColor('#2c3e50')
                    .text('Notes:', 50, currentY);

                currentY += 15;

                doc.fontSize(9)
                    .fillColor('#7f8c8d')
                    .text(data.notes, 50, currentY, {
                        width: 500,
                        align: 'left'
                    });

                currentY += 40;
            }

            // Footer
            const pageHeight = doc.page.height;
            const footerY = pageHeight - 100;

            doc.fontSize(9)
                .fillColor('#95a5a6')
                .text('Thank you for your business!', 50, footerY, {
                    align: 'center',
                    width: 500
                });

            doc.fontSize(8)
                .text('This is a computer-generated invoice.', {
                    align: 'center',
                    width: 500
                });

            // Finalize PDF
            doc.end();

            stream.on('finish', () => {
                resolve(outputPath);
            });

            stream.on('error', (error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { generateInvoice };

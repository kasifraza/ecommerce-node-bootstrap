const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');
require('dotenv').config();
const sendMail = (order) => {
    try {

        // Mail attachment pdf
        const doc = new PDFDocument();

        // Set the document properties
        doc.info.Title = 'Invoice';
        doc.info.Author = 'Kasif Ecom';

        // Add a title and a subtitle to the PDF
        doc.font('Helvetica-Bold').fontSize(18).text('Invoice', { align: 'center' });
        doc.font('Helvetica').fontSize(12).text('Order Confirmation', { align: 'center' });
        doc.font('Helvetica').fontSize(10).text('DATE : '+ Date.now() , { align: 'right' });
        const rowsItems = [];
        order.products.forEach(product => {
            rowsItems.push([product.product.title, product.quantity, product.product.price, product.product.price*product.quantity]);
        })
        // Add a table to the PDF with product information
        const table = {
            headers: ['Product', 'Quantity', 'Price', 'Total'],
            // rows: [
            //     // ['Product A', '1', '$10', '$10'],
            //     // ['Product B', '2', '$20', '$40'],
            //     // ['Product C', '3', '$30', '$90']
            // ],
            rows : rowsItems
            
        };

        const tableTop = 130;
        const tableLeft = 50;
        const cellPadding = 10;
        const rowHeight = 20;
        const totalHeight = (rowsItems.length + 1) * rowHeight
        const colWidth = (doc.page.width - (tableLeft * 2)) / table.headers.length;

        doc.font('Helvetica-Bold').fontSize(12).text('Product Information', tableLeft, tableTop);
        doc.lineWidth(0.5).moveTo(tableLeft, tableTop + 20).lineTo(doc.page.width - tableLeft, tableTop + 20).stroke();

        table.headers.forEach((header, i) => {
            doc.font('Helvetica-Bold').fontSize(12).text(header, tableLeft + (i * colWidth) + cellPadding, tableTop + 30, { width: colWidth - (cellPadding * 2), align: 'left' });
        });

        table.rows.forEach((row, i) => {
            const rowTop = tableTop + 30 + ((i + 1) * totalHeight);
            row.forEach((cell, j) => {
                doc.font('Helvetica').fontSize(12).text(cell, tableLeft + (j * colWidth) + cellPadding, rowTop, { width: colWidth - (cellPadding * 2), align: 'left' });
            });
        });

        // Add a summary section to the PDF with the total amount
        const summaryTop = tableTop + (table.rows.length * rowHeight) + 150;

        doc.font('Helvetica-Bold').fontSize(12).text('Summary', tableLeft, summaryTop);
        doc.lineWidth(0.5).moveTo(tableLeft, summaryTop + 20).lineTo(doc.page.width - tableLeft, summaryTop + 20).stroke();

        doc.font('Helvetica').fontSize(12).text('Total amount:', tableLeft, summaryTop + 30);
        doc.font('Helvetica-Bold').fontSize(12).text('$'+order.amount, tableLeft + 150, summaryTop + 30);

        // Finalize the PDF document and save it to a file
        doc.end();
        const filePath = path.join(__dirname + '/pdf/', order._id+'-invoice.pdf');
        doc.pipe(fs.createWriteStream(filePath));
        // Mail Attachment pdf END


        // Read the mailer template from a file
        const mailerTemplate = fs.readFileSync(__dirname + '/mailer/orderconfirm.ejs', 'utf8');

        // Set up Nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_EMAIL,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        // Render the mailer template with EJS and send the email
        ejs.renderFile(__dirname + '/mailer/orderconfirm.ejs', {order}, (err, html) => {
            if (err) {
                console.log('Error rendering mailer template:', err);
            } else {
                const mailOptions = {
                    from: process.env.MAIL_EMAIL,
                    to: order.user.email,
                    subject: 'Order Confirmation',
                    html: html,
                    attachments: [{
                        filename: order._id+'-invoice.pdf',
                        path: filePath
                    }]
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log('Error sending email:', err);
                    }
                    //  else {
                    //     console.log('Email sent:', info.response);
                    // }
                });
            }
        });
    } catch (error) {
        console.error(error)
        // throw new Error(error);

        // next(error);
    }



}

module.exports = sendMail;
require('dotenv').config();
const nodemailer = require('nodemailer');
const User = require('../models/userModel');

const sendOrderConfirmationEmailToClient = async (order) => {
    try {
        const transporter = nodemailer.createTransport({
        
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

     
        const user = await User.findById(order.userId);

        const productDetails = order.productIds.map(product => `
            <div>
                <p>Product ID: ${product._id}</p>
                <p>Name: ${product.name}</p>
                <img src="${product.images[0]}" alt="${product.name}" style="max-width: 100px;"/>
                <p>Reference: ${product.reference}</p>
                <p>Price: ${product.price}</p>
            </div>
        `).join('');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email, 
            subject: 'Order Confirmation',
            html: `
                <p>Thank you for your order!</p>
                <p>Order ID: ${order._id}</p>
                <p>User Details:</p>
                <p>Name: ${user.fullName}</p>
                <p>Email: ${user.email}</p>
                <p>Address: ${user.address}</p>
                <p>Phone Number: ${user.phoneNumber}</p>
                <p>Product Details:</p>
                ${productDetails}
                <p>Total Price: ${order.totalPrice}</p>
                <p>Shipping Method: ${order.shippingMethod}</p>
                <p>Shipping Fee: ${order.shippingFee}</p>
                <p>Payment Method: ${order.paymentMethod}</p>
            `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email to client:', error);
    }
};

const sendOrderNotificationEmailToOwner = async (order) => {
    
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const user = await User.findById(order.userId);

        const productDetails = order.productIds.map(product => `
            <div>
                <p>Product ID: ${product._id}</p>
                <p>Name: ${product.name}</p>
                <img src="${product.images[0]}" alt="${product.name}" style="max-width: 100px;"/>
                <p>Reference: ${product.reference}</p>
                <p>Price: ${product.price}</p>
            </div>
        `).join('');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_ADMIN, 
            subject: 'New Order Notification',
            html: `
                <p>You have received a new order!</p>
                <p>Order ID: ${order._id}</p>
                <p>User Details:</p>
                <p>Name: ${user.fullName}</p>
                <p>Email: ${user.email}</p>
                <p>Address: ${user.address}</p>
                <p>Phone Number: ${user.phoneNumber}</p>
                <p>Product Details:</p>
                ${productDetails}
                <p>Total Price: ${order.totalPrice}</p>
                <p>Shipping Method: ${order.shippingMethod}</p>
                <p>Shipping Fee: ${order.shippingFee}</p>
                <p>Payment Method: ${order.paymentMethod}</p>
            `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email to website owner:', error);
    }
};

module.exports = {sendOrderNotificationEmailToOwner, sendOrderConfirmationEmailToClient };
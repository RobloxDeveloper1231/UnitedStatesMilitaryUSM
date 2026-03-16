// // USM COMMAND BACKEND // //
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors()); // Allows your website to talk to this API
app.use(express.json());

// // CONNECT TO DATABASE // //
// These use the Environment Variables you set in Render
const supabase = createClient(process.env.SUPA_URL, process.env.SUPA_SERVICE_KEY);

// // GMAIL SETUP // //
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Put your actual Gmail here
        pass: process.env.GMAIL_PASS  // Your 16-char App Password
    }
});

// // API ROUTE: SEND EMAIL // //
app.post('/api/verify', (req, res) => {
    const { email, username } = req.body;
    
    const mailOptions = {
        from: '"USM HIGH COMMAND" <your-email@gmail.com>',
        to: email,
        subject: 'OFFICIAL ENLISTMENT VERIFIED',
        html: `<h3>Welcome, ${username}</h3><p>Your record is now active in the USM Database.</p>`
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) return res.status(500).send(error.toString());
        res.status(200).send("Verification Email Sent");
    });
});

// // API ROUTE: PING STATUS // //
app.post('/api/ping', async (req, res) => {
    const { uuid } = req.body;
    await supabase.from('profiles').update({ last_seen: new Date() }).eq('id', uuid);
    res.send("Status Updated");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`USM API active on port ${PORT}`));

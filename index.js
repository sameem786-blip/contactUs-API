const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();


// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // this is to handle URL encoded data
// end parser middleware


// custom middleware to log data access
const log = function(req, res, next) {
    console.log(`${new Date()}: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log(req.body); // make sure JSON middleware is loaded first
    next();
}
app.use(log);
// end custom middleware


// enable static files pointing to the folder "public"
// this can be used to serve the index.html file
app.use(express.static(path.join(__dirname, "public")));


// HTTP POST
app.post("/contactUs", function(req, res) {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "Your gmail", // this should be YOUR GMAIL account
            pass: "Your password" // this should be your password
        }
    });

    var textBody = `FROM: ${req.body.name} EMAIL: ${req.body.email} MESSAGE: ${req.body.message}`;
    var htmlBody = `<h2>Mail From Contact Form</h2><p>from: ${req.body.name} <a href="mailto:${req.body.email}">${req.body.email}</a></p><p>${req.body.message}</p>`;
    var mail = {
        from: "Your email", // sender address
        to: "Your email", // list of receivers (THIS COULD BE A DIFFERENT ADDRESS or ADDRESSES SEPARATED BY COMMAS)
        subject: "Your email", // Subject line
        text: textBody,
        html: htmlBody
    };

    // send mail with defined transport object
    transporter.sendMail(mail, function(err, info) {
        if (err) {
            console.log(err);
            res.json({ message: "message not sent: an error occured; check the server's console log" });
        } else {
            res.json({ message: `message sent: ${info.messageId}` });
        }
    });
});


// set port from environment variable, or 8000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
const nodemailer = require( 'nodemailer' );
require( 'dotenv' ).config();

async function sendMailResetPassWithEmail( recieveremail, messageText, messageHtml, res, subjectMsg = "Reset your password for Offcampuscareer" ) {
    let transporter = nodemailer.createTransport( {
        host: process.env.HOST_IP,
        port: 465, // 587 or 25 or 2525
        secure: true, // true for 465, false for other ports
        transportMethod: 'SMTP',
        auth: {
            user: process.env.EMAIL_NOREPLY_NAME,
            pass: process.env.EMAIL_NOREPLY_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    } );

    let mail = {
        from: `"Offcampuscareer" <${process.env.EMAIL_NOREPLY_NAME}>`, // sender address
        to: `${recieveremail}`, // list of receivers
        subject: `${subjectMsg}`, // Subject line
        text: messageText, // plain text body
        html: messageHtml, // html body
    };
    transporter.sendMail( mail, function ( err, info ) {
        if ( err ) {
            return res.send( 'Failed to send mail, Please login with different method' );
        } else {
            return res.send( 'success' );
        }
    } );

}
async function sendMailRssResponse( recieveremail, messageText, messageHtml, subjectMsg ) {
    let transporter = nodemailer.createTransport( {
        host: process.env.HOST_IP,
        port: 465, // 587 or 25 or 2525
        secure: true, // true for 465, false for other ports
        transportMethod: 'SMTP',
        auth: {
            user: process.env.EMAIL_NOREPLY_NAME,
            pass: process.env.EMAIL_NOREPLY_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    } );

    let mail = {
        from: `"Offcampuscareer" <${process.env.EMAIL_NOREPLY_NAME}>`, // sender address
        to: `${ recieveremail }`, // list of receivers
        replyTo: `help@offcampuscareer.com,offcampuscareer@gmail.com`,
        subject: `${subjectMsg}`, // Subject line
        text: messageText, // plain text body
        html: messageHtml, // html body
    };
    transporter.sendMail( mail, function ( err, info ) {
        if ( err ) {
            console.log( 'Failed to send mail, Please login with different method' );
        } else {
            // console.log( 'success' );
        }
    } );

}


function responseMsgRss( mailObj ) {

    let messgeText = `Hello User,

                            Your Updated RSS Feed contains ${mailObj.countUrls} Urls, Follow this link to check your Offcampuscareer Rss Feed created by your https://offcampuscareer.com/profile/${mailObj.userid} account.
                                        
                            https://offcampuscareer.com/feeds/${mailObj.rssid}.xml
                                        
                            If you didn’t ask to generate your Rss Feed, Then you can inform our team at help@offcampuscareer.com or offcampuscareer@gmail.com.
                                        
                            Thanks,
                                        
                            Your Offcampuscareer team`;
    let messageHtml = `<p><strong>Hello User,</strong></p>
                                        
                            <p>Your Updated RSS Feed contains ${mailObj.countUrls} Urls, Follow this link to check your Offcampuscareer Rss Feed created by your <a href="https://offcampuscareer.com/profile/${mailObj.userid}">https://offcampuscareer.com/profile/${mailObj.userid}</a> account.</p>
                                        
                            <p><a href="https://offcampuscareer.com/feeds/${mailObj.rssid}.xml">https://offcampuscareer.com/feeds/${mailObj.rssid}.xml</a></p>
                                        
                            <p>If you didn&rsquo;t ask to generate your Rss Feed, Then you can inform our team at help@offcampuscareer.com or offcampuscareer@gmail.com.</p>
                                        
                            <p><strong>Thanks,</strong></p>
                                        
                            <p><strong>Your Offcampuscareer team</strong></p>
                            `;
    let subjectMsg = `[Info]: Your Rss Feed is Updated`;
    if ( mailObj.emails ) {
        sendMailRssResponse( mailObj.emails, messgeText, messageHtml, subjectMsg );
    }
}

module.exports = {
    sendMailResetPassWithEmail,
    responseMsgRss
}
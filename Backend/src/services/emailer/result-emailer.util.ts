import * as nodemailer from "nodemailer";

export const SendEmail = async (companyId: string) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", //email server
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "labresultdemo@gmail.com",
      pass: "Tr1podLIS",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Cloud CMS" <labresultdemo@gmail.com', // sender address
    to: "reymart.e.villanueva@gmail.com", // list of receivers
    subject: companyId.toUpperCase() + ": Cloud CMS Emailer Testing", // Subject line
    text: "Hello world?", // plain text body
    //html: "<b>Hello world!</b>", // html body
  });

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  console.log(`Message sent: ${info.messageId}`);
};

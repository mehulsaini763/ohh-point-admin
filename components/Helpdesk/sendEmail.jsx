import { SendMailClient } from "zeptomail";


export const sendEmailNotification = async (email, subject, message) => {
    try {
     
const url = "api.zeptomail.in/";
const token = "Zoho-enczapikey PHtE6r0LR7i9jm8n9kQD7PG8EcD1NIgr+uhgeQYTuY1DWaQFHk1So9wilTa++RwoXPMUR/afyolhtbuY4rmNLW3vNmxMCGqyqK3sx/VYSPOZsbq6x00VuVgZdUPaUoTsetVr1SPevdvdNA==";

let client = new SendMailClient({url, token});
client.sendMail({
  "from": 
  {
      "address": "noreply@basicfunda.letsnailthis.guru",
      "name": "OOH POINT Support"
  },
  "to": 
  [
      {
      "email_address": 
          {
              "address": email,
              "name": "OOH POINT Support"
          }
      }
  ],
  "subject": subject,
  "htmlbody": message,
}).then((resp) => console.log("success")).catch((error) => console.log("error"));
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
const otpVerifyTemplateForResetPass = (otp) => {
    return `<html xmlns="http://www.w3.org/1999/xhtml">
  
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your login</title>
      </head>
      
      <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
        <table role="presentation"
          style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
          <tbody>
            <tr>
              <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                  <tbody>
                    <tr>
                      <td style="padding: 40px 0px 0px;">
                        <div style="text-align: left;">
                          <div style="padding-bottom: 20px;"><img src="https://firebasestorage.googleapis.com/v0/b/explrar-391309.appspot.com/o/Explrar_Logo.png?alt=media&token=72ba5a55-864c-4efd-b428-53d0778bac12" alt="Company" style="width: 100px;"></div>
                        </div>
                        <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                          <div style="color: rgb(0, 0, 0); text-align: left;">
                            <h1 style="margin: 1rem 0">Verification code</h1>
                            <p style="padding-bottom: 16px">Please use the verification code below to reset password.</p>
                            <p style="padding-bottom: 16px"><strong style="font-size: 130%">${otp}</strong></p>
                            <p style="padding-bottom: 16px">If you didn’t request this, you can ignore this email.</p>
                            <p style="padding-bottom: 16px">Thanks,<br>The Explrar team</p>
                          </div>
                        </div>
                        <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                          <p style="padding-bottom: 16px">Copyright (C) 2023 Explrar All rights reserved.
      You are receiving this email because you opted in via our website.</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
      
      </html>`;
  };
  
  module.exports = otpVerifyTemplateForResetPass;
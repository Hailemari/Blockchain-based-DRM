const resetPasswordTemplate = (link) => {
    return `
    <html xmlns="http://www.w3.org/1999/xhtml">

    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset your password</title>
      <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
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
                         <div style="padding-bottom: 20px;"><img src="https://drmuser-profile.s3.eu-north-1.amazonaws.com/Screenshot+from+2024-06-17+09-20-28.png" alt="Digital Right Management" style="width: 100px;"></div>
                      </div>
                      <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                        <div style="color: rgb(0, 0, 0); text-align: left;">
                          <h1 style="margin: 1rem 0">Trouble signing in?</h1>
                          <p style="font-weight:bold;">Greetings,</p>
                          <p style="padding-bottom: 16px">We've received a request to reset your Blockchain Based DRM password.</p>
                          <p style="padding-bottom: 16px">If you made this request, please click the button below to create a new password.</p>
                          <p style="padding-bottom: 16px"><a href=${link} target="_blank"
                              style="padding: 12px 24px; border-radius: 4px; color: #FFF; background: #31449B;display: inline-block;margin: 0.5rem 0;">Reset
                              Your Password</a></p>
                          <p style="font-weight:bold">Please remember, for your security, this link will expire in 24 hours.</p>
                          <p style="padding-bottom: 16px">If you did not make this request, please disregard this email. Your password will remain unchanged.</p>
                          <p style="padding-bottom: 16px">Stay safe and happy travels!</p>
                          <p style="padding-bottom: 16px;font-weight: bold">Best Regards,<br>The Blockchain Based DRM team</p>
                        </div>
                      </div>
                      <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                        <p style="padding-bottom: 16px">Copyright (C) 2024 Blockchain Based DRM All rights reserved. You are receiving this email because you opted in via our website.</p>
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
    
    </html>
    `
}
module.exports = resetPasswordTemplate;
type OtpEmailTemplateProps = {
  logoUrl: string;
  companyName: string;
  heading: string;
  otp: string;
  messages: string[];
  footer: string;
  expiresIn: number;
};

export function generateOtpEmailTemplate({
  logoUrl,
  companyName,
  heading,
  otp,
  messages,
  footer,
  expiresIn,
}: OtpEmailTemplateProps) {
  return `
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100% !important;">
        <tr>
          <td align="center">
            <table 
              style="border:1px solid #eaeaea;border-radius:5px;margin:40px 0;" 
              width="600" 
              border="0" 
              cellspacing="0" 
              cellpadding="40"
            >
              <tr>
                <td align="center">
                  <div style="font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;text-align:left;width:465px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100% !important;">
                      <tr>
                        <td align="center">
                        <div><img src="${logoUrl}" width="40" height="37" alt="${companyName}" /></div>
                          <h1 style="color:#000;font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;font-size:24px;font-weight:normal;margin:30px 0;padding:0;">
                            ${heading}
                          </h1>
                        </td>
                      </tr>
                    </table>
  
                    ${
    messages.map((message) => `
                    <p style="color:#000;font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;font-size:14px;line-height:24px;">
                      ${message}
                    </p>`).join("")
  }
  
                    <div align="center" style="margin:32px 0;">
                      <table border="0" cellspacing="0" cellpadding="0" style="display:inline-block;">
                        <tr>
                          <td 
                            align="center" 
                            bgcolor="#f8f9fa" 
                            valign="middle" 
                            height="60" 
                            style="font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;font-size:32px;font-weight:700;padding:20px 40px;border-radius:12px;border:2px solid #e9ecef;letter-spacing:4px;color:#000;"
                          >
                            ${otp}
                          </td>
                        </tr>
                      </table>
                    </div>
  
                    ${
    expiresIn
      ? `
                    <p style="color:#666;font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;font-size:12px;line-height:20px;text-align:center;margin:16px 0;">
                      Tämä koodi vanhenee ${expiresIn} minuutissa.
                    </p>
                    `
      : ""
  }
  
                    <br/>
                    <hr style="border:none;border-top:1px solid #eaeaea;margin:26px 0;width:100%;"></hr>
                    <p style="color:#666666;font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;font-size:12px;line-height:24px;">
                      ${footer}
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;
}

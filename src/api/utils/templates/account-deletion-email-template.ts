type AccountDeletionEmailTemplateProps = {
  logoUrl: string;
  companyName: string;
  heading: string;
  url: string;
  buttonText: string;
  messages: string[];
  warning: string;
  footer: string;
};

export function accountDeletionEmailTemplate({
  logoUrl,
  companyName,
  heading,
  url,
  buttonText,
  messages,
  warning,
  footer,
}: AccountDeletionEmailTemplateProps) {
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

                    <div style="background:#fff6f6;border:1px solid #f9d5d3;border-radius:8px;padding:16px;margin:24px 0;">
                      <p style="color:#c5221f;font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;font-size:14px;line-height:24px;margin:0;">
                        ${warning}
                      </p>
                    </div>

                    <div align="center">
                      <table border="0" cellspacing="0" cellpadding="0" style="display:inline-block;">
                        <tr>
                          <td align="center" style="border-radius:5px;">
                            <a 
                              href="${url}" 
                              target="_blank" 
                              style="font-size:14px;font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;color:#fff;text-decoration:none;border-radius:5px;padding:12px 24px;border:1px solid #c5221f;background-color:#c5221f;display:inline-block;font-weight:500;"
                            >
                              ${buttonText}
                            </a>
                          </td>
                        </tr>
                      </table>
                    </div>

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

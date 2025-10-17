import { Resend } from 'resend';

// Don't initialize Resend here - we'll do it in a function
let resend: Resend | null = null;

const getResendClient = () => {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resend = new Resend(apiKey);
  }
  return resend;
};

export interface EmailData {
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export class EmailService {
  static async sendNewsletter(to: string[], emailData: EmailData) {
    try {
      const resendClient = getResendClient();
      
      const { data, error } = await resendClient.batch.send(
        to.map(email => ({
          from: 'Doterran Philosophy <noreply@zenatrust.com>',
          to: email,
          subject: emailData.subject,
          html: emailData.htmlContent,
          text: emailData.textContent || this.htmlToText(emailData.htmlContent),
        }))
      );

      if (error) {
        console.error('Resend error:', error);
        throw new Error(`Failed to send emails: ${error.message}`);
      }

      return {
        success: true,
        message: `Newsletter sent to ${to.length} subscribers`,
        data
      };
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  }

  private static htmlToText(html: string): string {
    // Simple HTML to text conversion for email clients that prefer plain text
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<p>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
  }

  static createPhilosophyTemplate(subject: string, content: string, author: string = 'Doterra') {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { 
            font-family: 'Georgia', serif; 
            line-height: 1.6; 
            color: #2c3e50; 
            background-color: #f8f5f0; 
            margin: 0; 
            padding: 20px;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            padding: 40px; 
            border: 1px solid #d4c9b9; 
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header { 
            text-align: center; 
            border-bottom: 2px solid #722F37; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
        }
        .logo { 
            color: #722F37; 
            font-size: 28px; 
            font-weight: bold; 
            font-family: 'Playfair Display', serif;
        }
        .tagline { 
            color: #8B7355; 
            font-style: italic; 
            margin-top: 5px;
        }
        .content { 
            font-size: 16px; 
            line-height: 1.8;
        }
        .quote {
            background: #f5f1e8; 
            border-left: 4px solid #2D5016; 
            padding: 15px; 
            margin: 20px 0; 
            font-style: italic;
        }
        .signature { 
            margin-top: 30px; 
            border-top: 1px solid #d4c9b9; 
            padding-top: 20px; 
            color: #722F37;
        }
        .footer { 
            text-align: center; 
            margin-top: 30px; 
            font-size: 12px; 
            color: #8B7355;
        }
        a { 
            color: #722F37; 
            text-decoration: none;
        }
        a:hover { 
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Doterran</div>
            <div class="tagline">The Examined Life</div>
        </div>
        
        <div class="content">
            ${content}
        </div>
        
        <div class="signature">
            In pursuit of authentic being,<br>
            <strong>${author}</strong>
        </div>
        
        <div class="footer">
            <p>You received this email because you subscribed to philosophical insights from Doterran.</p>
            <p><a href="[UNSUBSCRIBE_LINK]">Unsubscribe</a> | <a href="[BLOG_LINK]">Visit Blog</a></p>
        </div>
    </div>
</body>
</html>
    `.trim();
  }
}
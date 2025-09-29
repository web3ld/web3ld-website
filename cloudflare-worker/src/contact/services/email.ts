import { BrevoEmailContent, BrevoResult } from '../types';
import { ContactRequestData, Env } from '../types';

export async function sendEmailViaBrevo(
  data: ContactRequestData,
  env: Env
): Promise<BrevoResult> {
  console.log('Brevo email config:', {
    from: env.SENDER_EMAIL,
    to: env.RECEIVER_EMAIL,
    replyTo: data.email,
    subject: `New Contact Form Submission from ${data.name}`
  });

  const emailContent: BrevoEmailContent = {
    sender: {
      email: env.SENDER_EMAIL,
      name: 'Contact Form'
    },
    to: [
      {
        email: env.RECEIVER_EMAIL,
        name: 'Admin'
      }
    ],
    subject: `New Contact Form Submission from ${data.name}`,
    htmlContent: formatHtmlEmail(data),
    textContent: formatTextEmail(data),
    replyTo: {
      email: data.email,
      name: data.name
    }
  };

  try {
    console.log('Calling Brevo API...');
    
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': env.BREVO_API_KEY
      },
      body: JSON.stringify(emailContent)
    });

    const responseText = await response.text();
    console.log('Brevo raw response:', {
      status: response.status,
      statusText: response.statusText,
      body: responseText
    });

    let responseData: any;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse Brevo response as JSON');
      return {
        success: false,
        error: 'Invalid response from email service',
        details: responseText
      };
    }

    if (response.ok && responseData.messageId) {
      console.log('✅ Brevo email sent successfully! MessageId:', responseData.messageId);
      return {
        success: true,
        messageId: responseData.messageId
      };
    } else {
      console.error('❌ Brevo API error:', responseData);
      return {
        success: false,
        error: responseData.message || 'Failed to send email',
        details: responseData
      };
    }
  } catch (error) {
    console.error('Brevo API exception:', error);
    return {
      success: false,
      error: 'Email service error',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function formatHtmlEmail(data: ContactRequestData): string {
  return `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    ${data.organization ? `<p><strong>Organization:</strong> ${data.organization}</p>` : ''}
    ${data.title ? `<p><strong>Title:</strong> ${data.title}</p>` : ''}
    <p><strong>Message:</strong></p>
    <p>${data.message.replace(/\n/g, '<br>')}</p>
    <hr>
    <p style="color: #666; font-size: 12px;">Sent via Contact Form</p>
  `;
}

function formatTextEmail(data: ContactRequestData): string {
  return `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
${data.organization ? `Organization: ${data.organization}\n` : ''}
${data.title ? `Title: ${data.title}\n` : ''}

Message:
${data.message}
  `.trim();
}
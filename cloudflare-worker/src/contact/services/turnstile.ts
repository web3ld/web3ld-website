import { TurnstileVerifyResponse } from '../types';

export async function verifyTurnstile(
  token: string,
  secretKey: string,
  remoteIp: string
): Promise<boolean> {
  // Regular Turnstile verification only - backdoor check happens in handler
  try {
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);
    formData.append('remoteip', remoteIp);

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json() as TurnstileVerifyResponse;
    
    if (!result.success) {
      console.error('Turnstile verification failed:', result['error-codes']);
    }
    
    return result.success;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}
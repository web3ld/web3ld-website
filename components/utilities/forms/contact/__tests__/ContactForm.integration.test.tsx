import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ContactForm from '@/components/utilities/forms/contact/ContactForm';

vi.mock('@config/public', () => ({
  env: { NEXT_PUBLIC_CLOUDFLARE_WORKER_URL: 'https://worker.example.com/contact' },
  runtime: { isDev: true, isTest: true },
}));

vi.mock('@marsidev/react-turnstile', () => ({
  Turnstile: (props: any) => (
    <button data-testid="turnstile" onClick={() => props.onSuccess?.('turnstile-123')}>
      turnstile
    </button>
  ),
}));

const getById = (id: string) =>
  document.getElementById(id)! as HTMLInputElement | HTMLTextAreaElement;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ContactForm integration: payload & URL', () => {
  const user = userEvent.setup();

  it('sends schema-conformant payload to configured worker URL', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);
    vi.stubGlobal('fetch', fetchSpy as unknown as typeof fetch);

    render(<ContactForm variant="green" />);

    await user.click(screen.getByTestId('turnstile'));

    await user.type(getById('name'), 'John Doe');
    await user.type(getById('email'), 'john@example.com');
    await user.type(getById('organization'), 'Acme Labs');
    await user.type(getById('title'), 'CTO');
    await user.type(getById('message'), 'Hello, this is more than ten chars.');

    await user.click(screen.getByRole('button', { name: /send/i }));

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0];

    expect(url).toBe('https://worker.example.com/contact');
    expect(init).toMatchObject({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const body = JSON.parse((init as any).body);
    expect(body).toEqual({
      name: 'John Doe',
      email: 'john@example.com',
      organization: 'Acme Labs',
      title: 'CTO',
      message: 'Hello, this is more than ten chars.',
      turnstileToken: 'turnstile-123',
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ContactForm from '@/components/utilities/forms/contact/ContactForm';

// --- Mocks ---

// Frontend env/runtime
vi.mock('@config/public', () => ({
  env: { NEXT_PUBLIC_CLOUDFLARE_WORKER_URL: '' }, // fallback to /api/contact
  runtime: { isDev: true, isTest: true }, // ensures Turnstile test site key
}));

// Turnstile widget -> clickable div that calls onSuccess('test-token')
vi.mock('@marsidev/react-turnstile', () => ({
  Turnstile: (props: any) => (
    <div
      data-testid="turnstile"
      title="turnstile"
      onClick={() => props.onSuccess?.('test-token')}
      onMouseLeave={() => props.onExpire?.()}
    />
  ),
}));

// --- Helpers ---

const getById = (id: string) => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element with id="${id}" not found`);
  return el as HTMLInputElement | HTMLTextAreaElement;
};

const clickTurnstile = () => {
  screen.getByTestId('turnstile').click();
};

describe('ContactForm (unit)', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders required fields and submit button', () => {
    render(<ContactForm />);
    expect(document.getElementById('name')).toBeInTheDocument();
    expect(document.getElementById('email')).toBeInTheDocument();
    expect(document.getElementById('message')).toBeInTheDocument();

    const submit = screen.getByRole('button', { name: /send/i });
    expect(submit).toBeInTheDocument();
    expect(submit).toHaveAttribute('type', 'submit');
  });

  it('shows validation errors when required fields are empty', async () => {
    render(<ContactForm />);
    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      // aria-invalid + aria-describedby for invalid fields
      expect(getById('name')).toHaveAttribute('aria-invalid', 'true');
      expect(getById('name')).toHaveAttribute('aria-describedby', 'name-error');
      expect(document.getElementById('name-error')).toBeInTheDocument();

      expect(getById('email')).toHaveAttribute('aria-invalid', 'true');
      expect(getById('email')).toHaveAttribute('aria-describedby', 'email-error');
      expect(document.getElementById('email-error')).toBeInTheDocument();

      expect(getById('message')).toHaveAttribute('aria-invalid', 'true');
      expect(getById('message')).toHaveAttribute('aria-describedby', 'message-error');
      expect(document.getElementById('message-error')).toBeInTheDocument();
    });
  });

  it('updates character count as message is typed', async () => {
    render(<ContactForm />);
    await user.type(getById('message'), 'hello!');
    expect(screen.getByText(/6\s*\/\s*3000/)).toBeInTheDocument();
  });

  it('blocks submit when Turnstile is missing and shows inline error', async () => {
    render(<ContactForm />);

    // Fill required fields EXCEPT the turnstile
    await user.type(getById('name'), 'Alice');
    await user.type(getById('email'), 'alice@example.com');
    await user.type(getById('message'), 'Hello there! This is valid.');

    await user.click(screen.getByRole('button', { name: /send/i }));

    // Zod prevents onSubmit; we should see an inline error instead of a modal
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(await screen.findByText(/verification required/i)).toBeInTheDocument();
  });

  it('submits successfully with token, shows success modal, resets fields & token', async () => {
    // Create a deferred fetch so we can observe "in-flight" disabled state
    let resolveFetch!: () => void;
    const fetchPromise = new Promise<Response>((res) => {
      resolveFetch = () =>
        res({
          ok: true,
          json: async () => ({ success: true, message: 'ok' }),
        } as unknown as Response);
    });
    const fetchSpy = vi.fn().mockImplementation(() => fetchPromise);
    vi.stubGlobal('fetch', fetchSpy as unknown as typeof fetch);

    render(<ContactForm />);

    // Complete captcha
    clickTurnstile();

    // Fill required fields
    await user.type(getById('name'), 'Alice');
    await user.type(getById('email'), 'alice@example.com');
    await user.type(getById('message'), 'Hello there! This is valid.');

    // Click submit (capture the same element reference to check disabled state)
    const submitBtn = screen.getByRole('button', { name: /send/i });
    await user.click(submitBtn);

    // While fetch is pending, button should become disabled
    await waitFor(() => expect(submitBtn).toBeDisabled());

    // Finish the request
    resolveFetch();

    // Success modal appears
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: /success/i })).toBeInTheDocument();

    // Fields reset after success
    expect(getById('name')).toHaveValue('');
    expect(getById('email')).toHaveValue('');
    expect(getById('message')).toHaveValue('');

    // Close the modal
    await user.click(within(dialog).getByRole('button', { name: /okay/i }));

    // Submit again without re-doing Turnstile => inline "Verification required" error
    await user.click(screen.getByRole('button', { name: /send/i }));
    expect(await screen.findByText(/verification required/i)).toBeInTheDocument();

    // Called with fallback URL because env var is mocked as empty
    expect(fetchSpy).toHaveBeenCalledWith('/api/contact', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.any(String),
    }));
  });

  it('shows failure modal when server responds with error', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Nope' }),
    } as Response);
    vi.stubGlobal('fetch', fetchSpy as unknown as typeof fetch);

    render(<ContactForm />);
    clickTurnstile();

    await user.type(getById('name'), 'Alice');
    await user.type(getById('email'), 'alice@example.com');
    await user.type(getById('message'), 'Hello there! This is valid.');

    await user.click(screen.getByRole('button', { name: /send/i }));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: /failed/i })).toBeInTheDocument();
  });

  it('shows error modal on network failure', async () => {
    const fetchSpy = vi.fn().mockRejectedValue(new Error('network down'));
    vi.stubGlobal('fetch', fetchSpy as unknown as typeof fetch);

    render(<ContactForm />);
    clickTurnstile();

    await user.type(getById('name'), 'Alice');
    await user.type(getById('email'), 'alice@example.com');
    await user.type(getById('message'), 'Hello there! This is valid.');

    await user.click(screen.getByRole('button', { name: /send/i }));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: /error/i })).toBeInTheDocument();
  });
});

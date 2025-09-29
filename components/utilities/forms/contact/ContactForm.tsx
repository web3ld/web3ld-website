// components/utilities/forms/contact/ContactForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactFormBaseSchema as contactFormSchema, type ContactFormData } from '@cloudflare-worker/contact/schemas';
import { Turnstile } from '@marsidev/react-turnstile';
import styles from './ContactForm.module.css';
import { env, runtime } from '@config/public';

interface ContactFormProps {
  variant?: 'green' | 'purple';
}

interface ModalState {
  isOpen: boolean;
  type: 'success' | 'error' | 'failure';
  message: string;
}

export default function ContactForm({ variant = 'purple' }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileKey, setTurnstileKey] = useState(0); // Key for resetting widget
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: 'success',
    message: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      organization: '',
      title: '',
      message: '',
      turnstileToken: '',
    },
  });

  const messageValue = watch('message') || '';

  const showModal = (type: 'success' | 'error' | 'failure', message: string) => {
    setModal({ isOpen: true, type, message });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const onSubmit = async (data: ContactFormData) => {
    if (!data.turnstileToken) {
      showModal('error', 'Please complete the verification');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL || '/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        showModal('success', "Thank you for your message! We'll get back to you soon.");
        reset();
        setValue('turnstileToken', '');
        // Force Turnstile widget to reset by changing its key
        setTurnstileKey(prev => prev + 1);
      } else {
        showModal('failure', result.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showModal('error', 'An error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const variantClass = variant === 'green' ? styles.green : styles.purple;
  
  // Use test key in dev/test, production key in prod
  const siteKey = (runtime.isDev || runtime.isTest)
    ? '1x00000000000000000000AA'
    : env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

  return (
    <div className={`${styles.formContainer} ${variantClass}`}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Name / Alias *
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={styles.input}
            placeholder="Your name or alias"
            aria-label="Name or Alias"
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            maxLength={50}
          />
          {errors.name && (
            <span id="name-error" className={styles.error}>
              {errors.name.message}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email *
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={styles.input}
            placeholder="your@email.com"
            aria-label="Email address"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            maxLength={50}
          />
          {errors.email && (
            <span id="email-error" className={styles.error}>
              {errors.email.message}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="organization" className={styles.label}>
            Org / Project (Optional)
          </label>
          <input
            id="organization"
            type="text"
            {...register('organization')}
            className={styles.input}
            placeholder="Your organization or project"
            aria-label="Organization or Project"
            aria-invalid={!!errors.organization}
            aria-describedby={errors.organization ? 'org-error' : undefined}
            maxLength={100}
          />
          {errors.organization && (
            <span id="org-error" className={styles.error}>
              {errors.organization.message}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            Title / Role (Optional)
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className={styles.input}
            placeholder="Your title or role"
            aria-label="Title or Role"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'title-error' : undefined}
            maxLength={100}
          />
          {errors.title && (
            <span id="title-error" className={styles.error}>
              {errors.title.message}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>
            Message *
          </label>
          <textarea
            id="message"
            {...register('message')}
            className={styles.textarea}
            placeholder="Your message (10-3000 characters)"
            rows={6}
            aria-label="Message"
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
            maxLength={3000}
          />
          {errors.message && (
            <span id="message-error" className={styles.error}>
              {errors.message.message}
            </span>
          )}
          <span className={styles.charCount}>
            {messageValue.length} / 3000
          </span>
        </div>

        <div className={styles.turnstileContainer}>
          <Turnstile
            key={turnstileKey}
            siteKey={siteKey}
            onSuccess={(token) => setValue('turnstileToken', token)}
            onExpire={() => setValue('turnstileToken', '')}
            onError={() => {
              setValue('turnstileToken', '');
              console.error('Turnstile verification error');
            }}
            options={{
              theme: 'dark',
              size: 'normal',
              appearance: 'always',
            }}
          />
          {errors.turnstileToken && (
            <span className={styles.error}>
              {errors.turnstileToken.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitButton}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {/* Modal */}
      {modal.isOpen && (
        <div
          className={`${styles.modalOverlay} ${modal.isOpen ? styles.fadeIn : styles.fadeOut}`}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
        >
          <div
            className={`${styles.modal} ${variantClass}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalContent}>
              <h3 id="contact-modal-title" className={styles.modalTitle}>
                {modal.type === 'success' && '✓ Success'}
                {modal.type === 'error' && '⚠ Error'}
                {modal.type === 'failure' && '✗ Failed'}
              </h3>
              <p className={styles.modalMessage}>{modal.message}</p>
              <button
                className={styles.modalButton}
                onClick={closeModal}
                autoFocus
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
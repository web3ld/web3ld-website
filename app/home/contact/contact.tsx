// app/home/contact/contact.tsx
import ContactForm from '@/components/utilities/forms/contact/ContactForm';
import styles from './contact.module.css';

export default function ContactSection() {
  return (
    <section className={styles.contactSection} id="contact" >
      <div className={styles.container}>
        <h2 className={styles.heading}>Contact</h2>
        <p className={styles.blurb}>
          Get in touch if you have any questions, want to contribute or have a project you&apos;d like to recommend
        </p>
        <ContactForm variant="purple" />
      </div>
    </section>
  );
}
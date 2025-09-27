import React from 'react';
import styles from './faq.module.css';
import { Accordion, AccordionText, AccordionItem } from '@components/utilities/accordions/QA';

export default function FAQSection() {
  const items: AccordionItem[] = [
    {
      value: 'item-1',
      title: 'What is Lorem Ipsum?',
      content: (
        <AccordionText
          variant="purple"
          heading="Overview"
          text={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet.\n\nCras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.`}
        />
      ),
    },
    {
      value: 'item-2',
      title: 'Why do we use it?',
      content: (
        <AccordionText
          variant="purple"
          heading="Reasoning"
          text={`It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.\n\nThe point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.`}
        />
      ),
    },
    {
      value: 'item-3',
      title: 'Where does it come from?',
      content: (
        <AccordionText
          variant="purple"
          heading="Origins"
          text={`Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC.\n\nRichard McClintock, a Latin professor, looked up one of the more obscure Latin words.`}
        />
      ),
    },
    {
      value: 'item-4',
      title: 'Where can I get some?',
      content: (
        <AccordionText
          variant="purple"
          heading="Sources"
          text={`There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.\n\nIf you are going to use a passage of Lorem Ipsum, you need to be sure there isn’t anything embarrassing hidden.`}
        />
      ),
    },
  ];

  return (
    <section id="faq" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>FAQ</h2>
        <div className={styles.stack}>
          <Accordion items={items} variant="purple" />
        </div>
      </div>
    </section>
  );
}

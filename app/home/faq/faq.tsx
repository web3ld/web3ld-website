import React from 'react';
import styles from './faq.module.css';
import { Accordion, AccordionText, AccordionItem } from '@components/utilities/accordions/QA';

export default function FAQSection() {
  const items: AccordionItem[] = [
    {
      value: 'item-1',
      title: 'What is Web 3?',
      content: (
        <AccordionText
          variant="purple"
          heading="Two Definitions"
          renderHTML
          text={`Web&nbsp;3 can mean two related but distinct things:<br /><br />
1. <strong>The Semantic Web</strong> — a vision of a web where information is structured and linked in ways that make it more meaningful, consistent, and accessible across platforms.<br /><br />
2. <strong>The Decentralized Web (Blockchain)</strong> — a vision of building an internet that runs on decentralized technologies such as blockchains, giving users more ownership and control over data and interactions.<br /><br />
<strong>Web3LD</strong> is an open-source initiative focused on the <strong>semantic web</strong>, with a particular interest in blockchain-based Web&nbsp;3. It is technically project-agnostic: the goal is to support clear, consistent, and accessible information regardless of the specific platform or technology.`}
        />
      ),
    },
    {
      value: 'item-2',
      title: 'What is Structured Markup Data?',
      content: (
        <AccordionText
          variant="purple"
          heading="Overview"
          renderHTML
          text={`Structured markup data — also known as <strong>schemas</strong> — are standardized ways of adding extra meaning to information on websites.<br /><br />
They create a <strong>structured data construct</strong> that helps contextualize content which would otherwise be <em>unstructured</em> or <em>semi-structured</em>.<br /><br />
This additional context makes it easier for systems like <strong>search engines</strong> and <strong>AI models</strong> to understand what information represents, improving indexing, relevance, and the way content is displayed or reasoned over.`}
        />
      ),
    },
    {
      value: 'item-3',
      title: 'What is JSON-LD?',
      content: (
        <AccordionText
          variant="purple"
          heading="Overview"
          renderHTML
          text={`<strong>JSON-LD</strong> stands for <strong>JavaScript Object Notation for Linked Data</strong>.<br /><br />
It is a <strong>formatting structure</strong> used to package and expose <strong>structured markup data</strong> (schemas) on websites in a way that is easily accessible to <strong>search engines</strong> and <strong>AI systems</strong>.<br /><br />
There are other schema formats such as <em>Microdata</em> and <em>RDFa</em>, but JSON-LD has become a <strong>popular modern implementation</strong> because it builds on <strong>JSON</strong>, a universal data format widely used in web development.<br /><br />
This makes JSON-LD both human-readable and machine-friendly, ensuring structured data is cleanly separated from page presentation while remaining interoperable across platforms.`}
        />
      ),
    },
    {
      value: 'item-4',
      title: 'What does Web3LD do?',
      content: (
        <AccordionText
          variant="purple"
          heading="Our Focus"
          renderHTML
          text={`We champion beneficial <strong>structured markup data</strong> practices to help projects reap the benefits of the <strong>semantic web</strong>.<br /><br />
In practice, we help teams — especially <strong>open-source</strong> projects — integrate <strong>JSON-LD</strong> infrastructure and schemas. This can include education, reviews, and even submitting <strong>pull requests</strong> directly to GitHub repositories to add or improve schema implementations.`}
        />
      ),
    },
    {
      value: 'item-5',
      title: 'How can I get my project integrated in the semantic web?',
      content: (
        <AccordionText
          variant="purple"
          heading="Getting Started"
          renderHTML
          text={`First, learn the basics of <strong>structured markup data</strong>. You’ll find resources on this site, across the web, and many chatbot LLMs can help answer implementation questions.<br /><br />
Then, add the appropriate <strong>schema</strong> to your website or app to complement the content you already have (e.g., Organization, Article, Product, Event).<br /><br />
You’re always welcome to reach out to <strong>Web3LD</strong> for guidance — including reviews, recommendations, or direct support with implementation.`}
        />
      ),
    },
    {
      value: 'item-6',
      title: 'How much will my results in search engines and AI improve?',
      content: (
        <AccordionText
          variant="purple"
          heading="Setting Expectations"
          renderHTML
          text={`There’s no single metric or guarantee — different systems consume schemas differently, and results depend on your site’s overall content quality, technical health, and information architecture.<br /><br />
That said, adding <strong>structured data</strong> is a <strong>low-cost</strong> way to feed clear context into these systems. Major search engines use structured data to better understand, organize, and sometimes enhance how results are displayed. Many <strong>AI systems</strong> also leverage this context to interpret entities and relationships more reliably.`}
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

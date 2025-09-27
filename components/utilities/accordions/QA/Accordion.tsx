'use client';

import * as RadixAccordion from '@radix-ui/react-accordion';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import styles from './Accordion.module.css';
import type { AccordionItem, AccordionProps } from './types';
import { AccordionVariantContext } from './variant-context';

const contentVariants = {
  open: { height: 'auto', opacity: 1 },
  collapsed: { height: 0, opacity: 0 },
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ');
}

export function Accordion({ items, variant = 'purple', className }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const variantClass =
    variant === 'green' ? styles.variantGreen : styles.variantPurple;

  return (
    <AccordionVariantContext.Provider value={variant}>
      <RadixAccordion.Root
        type="multiple"
        value={openItems}
        onValueChange={setOpenItems}
        className={cx(styles.accordionRoot, variantClass, className)}
        data-variant={variant}
      >
        {items.map((item: AccordionItem) => {
          const isOpen = openItems.includes(item.value);
          return (
            <RadixAccordion.Item key={item.value} value={item.value} className={styles.accordionItem}>
              <RadixAccordion.Header className={styles.accordionHeader}>
                <RadixAccordion.Trigger className={styles.accordionTrigger}>
                  <div className={styles.headerWrapper}>
                    <h3 className={styles.title}>{item.title}</h3>
                    <motion.div
                      className={styles.icon}
                      initial={false}
                      animate={{ rotate: 0 }}
                      transition={{ duration: 0.3 }}
                      aria-hidden
                    >
                      {/* Plus/Minus built from two lines; color via CSS var */}
                      <motion.div
                        className={styles.iconLine}
                        animate={{ opacity: isOpen ? 0 : 1, rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.div
                        className={styles.iconLine}
                        animate={{ rotate: isOpen ? 0 : 90 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  </div>
                </RadixAccordion.Trigger>
              </RadixAccordion.Header>

              <RadixAccordion.Content forceMount asChild>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key={`${item.value}-content`}
                      className={styles.contentWrapper}
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={contentVariants}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <motion.div
                        className={styles.contentInner}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.content}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </RadixAccordion.Content>
            </RadixAccordion.Item>
          );
        })}
      </RadixAccordion.Root>
    </AccordionVariantContext.Provider>
  );
}

export default Accordion;

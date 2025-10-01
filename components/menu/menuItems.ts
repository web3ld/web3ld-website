// components/menu/menuItems.ts
export interface MenuItem {
  label: string;
  href: string;
  isSection?: boolean; // true if it's a section on the current page
}

export const menuItems: MenuItem[] = [
  {
    label: 'About',
    href: '/#about',
    isSection: true
  },
  {
    label: 'FAQ',
    href: '/#faq',
    isSection: true
  },
  {
    label: 'Resources',
    href: '/#resources',
    isSection: true
  },
  {
    label: 'Sponsor',
    href: '/#sponsor',
    isSection: true
  },
  {
    label: 'Contribute',
    href: '/#contribute',
    isSection: true
  },
  {
    label: 'Contact',
    href: '/#contact',
    isSection: true
  }
];

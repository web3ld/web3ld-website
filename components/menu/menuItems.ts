// components/menu/menuItems.ts
export interface MenuItem {
  label: string;
  href: string;
  isSection?: boolean; // true if it's a section on the current page
}

export const menuItems: MenuItem[] = [
  {
    label: 'Sponsor',
    href: '/#sponsor',
    isSection: true
  },
  {
    label: 'FAQ',
    href: '/#faq',
    isSection: true
  },
  {
    label: 'Contact',
    href: '/#contact',
    isSection: true
  },
  {
    label: 'Terms',
    href: '/terms',
    isSection: false
  }
];
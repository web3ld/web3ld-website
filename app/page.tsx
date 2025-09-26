// app/page.tsx (or app/home/page.tsx)
import PageWrapper from '../components/pagewrapper/pagewrapper';
import Hero from './home/hero/hero';
import Sponsor from './home/sponsor/sponsor';
import Resources from './home/resources/resources';
import FAQ from './home/faq/faq';
import Contact from './home/contact/contact';

export default function HomePage() {
  const sectionIds = ['hero', 'sponsor', 'resources', 'faq', 'contact'];
  
  return (
    <PageWrapper sectionIds={sectionIds}>
      <Hero />
      <Sponsor />
      <Resources />
      <FAQ />
      <Contact />
    </PageWrapper>
  );
}
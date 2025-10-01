import PageWrapper from '../components/pagewrapper/pagewrapper';
import Hero from './home/hero/hero';
import Sponsor from './home/sponsor/sponsor';
import Resources from './home/resources/resources';
import FAQ from './home/faq/faq';
import Contact from './home/contact/contact';
import Contribute from './home/contribute/contribute';
import { loadJsonLdScripts } from '@/lib/jsonld/loadJsonFromIndex';
import homepageJsonLdData from './_data/jsonld/homepage';
export { metadata } from './metadata';

export default function HomePage() {
  const sectionIds = ['hero', 'sponsor', 'resources', 'faq', 'contribute', 'contact'];

  return (
    <PageWrapper sectionIds={sectionIds}>
      <Hero />
      <FAQ />
      <Resources />
      <Sponsor />
      <Contribute />
      <Contact />
      {loadJsonLdScripts(homepageJsonLdData, 'homepage-jsonld')}
    </PageWrapper>
  );
}

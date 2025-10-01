// app/page.tsx
import PageWrapper from '../components/pagewrapper/pagewrapper';
import { Hero, About, FAQ, Resources, Sponsor, Contribute, Contact } from './home';
import { loadJsonLdScripts } from '@/lib/jsonld/loadJsonFromIndex';
import homepageJsonLdData from './_data/jsonld/homepage';
export { metadata } from './metadata';

export default function HomePage() {
  const sectionIds = ['hero', 'about', 'faq', 'sponsor', 'resources', 'contribute', 'contact'];

  return (
    <PageWrapper sectionIds={sectionIds}>
      <Hero />
      <About />
      <FAQ />
      <Resources />
      <Sponsor />
      <Contribute />
      <Contact />
      {loadJsonLdScripts(homepageJsonLdData, 'homepage-jsonld')}
    </PageWrapper>
  );
}

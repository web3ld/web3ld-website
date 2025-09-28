import type { Metadata } from "next"; 
import "./globals.css"; 
import Header from "@components/header/header"; 
import Footer from "@components/footer/footer";
import { loadJsonLdScripts } from "@/lib/jsonld/loadJsonFromIndex";
import globalJsonLdData from "./_data/jsonld/global";
 
export const metadata: Metadata = { 
  title: "Web3LD", 
  description: "OS initiative for building authority in the semantic web", 
}; 
 
export default function RootLayout({ 
  children, 
}: Readonly<{ children: React.ReactNode }>) { 
  return ( 
    <html lang="en"> 
      <body> 
        <Header /> 
        {children}
        <Footer />
        {loadJsonLdScripts(globalJsonLdData, 'global-jsonld')}
      </body> 
    </html> 
  ); 
}
import type { Metadata } from "next"; 
import "./globals.css"; 
import Header from "@components/header/header"; 
import Footer from "@components/footer/footer";
 
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
      </body> 
    </html> 
  ); 
}
import { CMSSection } from './components/CMSBlocks'
import { useSiteDataContext } from './context/useSiteDataContext'
import { useScrollReveal } from './hooks/useScrollReveal'
import { useSEOMetadata } from './hooks/useSEOMetadata'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import Trust from './components/Trust'
import Facilities from './components/Facilities'
import Process from './components/Process'
import Coverage from './components/Coverage'
import Pricing from './components/Pricing'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'

function App() {
  const { cms, data } = useSiteDataContext()
  useScrollReveal(cms)
  useSEOMetadata(cms, data)
  return (
    <>
      <Header />
      <CMSSection id="hero"><Hero /></CMSSection>
      <CMSSection id="servicios"><Services /></CMSSection>
      <CMSSection id="confianza"><Trust /></CMSSection>
      <CMSSection id="instalaciones"><Facilities /></CMSSection>
      <CMSSection id="proceso"><Process /></CMSSection>
      <CMSSection id="cobertura"><Coverage /></CMSSection>
      <CMSSection id="precios"><Pricing /></CMSSection>
      <CMSSection id="preguntas"><FAQ /></CMSSection>
      <CMSSection id="contacto"><Contact /></CMSSection>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

export default App

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
  useScrollReveal()
  const { cms, data } = useSiteDataContext()
  useSEOMetadata(cms, data)
  return (
    <>
      <Header />
      <CMSSection cms={cms} id="hero"><Hero /></CMSSection>
      <CMSSection cms={cms} id="servicios"><Services /></CMSSection>
      <CMSSection cms={cms} id="confianza"><Trust /></CMSSection>
      <CMSSection cms={cms} id="instalaciones"><Facilities /></CMSSection>
      <CMSSection cms={cms} id="proceso"><Process /></CMSSection>
      <CMSSection cms={cms} id="cobertura"><Coverage /></CMSSection>
      <CMSSection cms={cms} id="precios"><Pricing /></CMSSection>
      <CMSSection cms={cms} id="preguntas"><FAQ /></CMSSection>
      <CMSSection cms={cms} id="contacto"><Contact /></CMSSection>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

export default App

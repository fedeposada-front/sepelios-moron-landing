import { useScrollReveal } from './hooks/useScrollReveal'
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
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <Trust />
      <Facilities />
      <Process />
      <Coverage />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </>
  )
}

export default App

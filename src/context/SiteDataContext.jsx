import { createContext, useContext } from 'react'
import { useSiteData } from '../hooks/useSiteData'
import { useCMS } from '../hooks/useCMS'

const SiteDataContext = createContext({})

export function SiteDataProvider({ children }) {
  const { data: legacyData, loading } = useSiteData()
  const cms = useCMS()
  const data = { ...legacyData, ...Object.fromEntries(Object.entries(cms?.config || {}).filter(([key, value]) => key !== 'whatsapp_numero' || /^\d{11,15}$/.test(value))) }
  for (const key of ['telefono_principal', 'telefono_2', 'telefono_3']) {
    if (cms?.config?.[key]) data[key + '_tel'] = '+549' + cms.config[key].replace(/\\D/g, '').slice(-10)
  }
  const zones = (cms?.collections?.zona || []).filter(item => item.mostrar).map(item => item.nombre).filter(Boolean)
  if (zones.length) data.zonas_cobertura = zones.join('|')
  return (
    <SiteDataContext.Provider value={{ data, loading, cms }}>
      {children}
    </SiteDataContext.Provider>
  )
}

export function useSiteDataContext() {
  return useContext(SiteDataContext)
}

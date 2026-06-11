import { createContext, useContext } from 'react'
import { useSiteData } from '../hooks/useSiteData'

const SiteDataContext = createContext({})

export function SiteDataProvider({ children }) {
  const { data, loading } = useSiteData()
  return (
    <SiteDataContext.Provider value={{ data, loading }}>
      {children}
    </SiteDataContext.Provider>
  )
}

export function useSiteDataContext() {
  return useContext(SiteDataContext)
}

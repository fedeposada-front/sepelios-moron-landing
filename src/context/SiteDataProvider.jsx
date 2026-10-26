import { SiteDataContext } from './siteDataContext'
import { useCMS } from '../hooks/useCMS'

export function SiteDataProvider({ children }) {
  const cms = useCMS()
  return (
    <SiteDataContext.Provider value={{
      cms,
      data: cms.config,
      loading: cms.status === 'loading',
      status: cms.status,
      error: cms.error,
    }}>
      {children}
    </SiteDataContext.Provider>
  )
}

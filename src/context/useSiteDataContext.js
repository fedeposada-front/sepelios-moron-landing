import { useContext } from 'react'
import { SiteDataContext } from './siteDataContext'

export function useSiteDataContext() {
  return useContext(SiteDataContext)
}

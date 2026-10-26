import { createContext } from 'react'
import { createFallbackCMS } from '../cms/parseCMS'

const fallbackCMS = createFallbackCMS()

export const SiteDataContext = createContext({
  cms: fallbackCMS,
  data: fallbackCMS.config,
  loading: true,
  status: 'loading',
  error: null,
})

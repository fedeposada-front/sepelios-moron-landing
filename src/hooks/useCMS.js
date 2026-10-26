import { useEffect, useState } from 'react'
import { CMS_URL, createFallbackCMS, fetchCMS } from '../cms/parseCMS'

export function useCMS() {
  const [cms, setCMS] = useState(() => ({ ...createFallbackCMS(), status: 'loading' }))

  useEffect(() => {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(new Error('CMS request timed out')), 12000)

    fetchCMS(globalThis.fetch, controller.signal, import.meta.env.VITE_CMS_CSV_URL || CMS_URL).then(nextCMS => {
      if (nextCMS.status === 'fallback' && nextCMS.error) {
        console.error('CMS no disponible; se usa contenido local aprobado.', nextCMS.error)
      } else if (nextCMS.issues.length) {
        console.error('CMS contiene filas inválidas; se aplicaron valores seguros.', nextCMS.issues)
      }
      setCMS(nextCMS)
    }).catch(error => {
      if (error.name !== 'AbortError') {
        console.error('Error inesperado al cargar el CMS.', error)
        setCMS(createFallbackCMS(error))
      }
    })

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  return cms
}

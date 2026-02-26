import { useEffect } from 'react'

/**
 * Hook to update the document title and meta description dynamically
 * @param {string} title - The page title (will be appended to "CryptoDash")
 * @param {string} description - Optional meta description for the page
 */
export function useDocumentTitle(title, description) {
  useEffect(() => {
    const previousTitle = document.title
    
    if (title) {
      document.title = `${title} | CryptoDash`
    } else {
      document.title = 'CryptoDash'
    }

    let previousDescription = null
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        previousDescription = metaDescription.getAttribute('content')
        metaDescription.setAttribute('content', description)
      }
    }

    return () => {
      document.title = previousTitle
      if (previousDescription) {
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
          metaDescription.setAttribute('content', previousDescription)
        }
      }
    }
  }, [title, description])
}

const SAVED_KEY = 'uptools-saved-tools'

export function getSavedSlugs() {
  try {
    return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

export function setSavedSlugsStorage(set) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify([...set]))
    window.dispatchEvent(new CustomEvent('ut:saved-changed'))
  } catch {}
}

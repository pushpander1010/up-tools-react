// One fixed colour per category — shared by tool cards and filter capsules,
// so users can spot Finance vs AI vs Fun at a glance.
export const CATEGORY_COLORS = {
  finance: '#059669', tax: '#0d9488', banking: '#0284c7', crypto: '#d97706',
  images: '#7c3aed', text: '#4f46e5', dev: '#334155', security: '#dc2626',
  networking: '#0891b2', fun: '#db2777', health: '#16a34a', canada: '#ef4444',
  romantic: '#f43f5e', social: '#ec4899', whatsapp: '#00a884', wifi: '#2563eb',
  ai: '#8b5cf6', marketing: '#ea580c', cricket: '#65a30d', sports: '#0ea5e9',
  fifa: '#16a34a', india: '#f97316', education: '#4f46e5', downloader: '#9333ea',
  tools: '#6366f1',
}

export const categoryColor = (slug) => CATEGORY_COLORS[slug] || '#6366f1'

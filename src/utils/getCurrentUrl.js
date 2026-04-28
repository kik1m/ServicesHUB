/**
 * Utility to get current URL safely in both CSR and SSR
 */
export const getCurrentUrl = () => {
  if (typeof window === 'undefined') return '';
  return window.location.href;
};

// Utility to handle base paths for GitHub Pages deployment
export function getBasePath(): string {
  // In production, detect if we're on GitHub Pages by checking the pathname
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    // Extract the repository name from the path
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0 && !pathParts[0].includes('.html')) {
      return `/${pathParts[0]}`;
    }
  }
  return '';
}

export function buildUrl(path: string): string {
  const basePath = getBasePath();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}

export function buildRelativeUrl(path: string): string {
  // For relative paths, just return as is
  if (path.startsWith('./') || path.startsWith('../')) {
    return path;
  }
  // Otherwise build full URL
  return buildUrl(path);
}
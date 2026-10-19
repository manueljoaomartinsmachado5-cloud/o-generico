/**
 * Junta o caminho base do site (BASE_PATH) a um caminho interno.
 * Usar em todos os links internos, para o site funcionar tanto na raiz
 * como num subcaminho (por exemplo, GitHub Pages).
 */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  return `${base}/${clean}`;
}

export interface NavItem {
  label: string;
  path: string;
}

// Secções principais, pela ordem em que aparecem no cabeçalho.
export const nav: NavItem[] = [
  { label: 'Arquivo', path: '/arquivo/' },
  { label: 'Explorar', path: '/explorar/' },
  { label: 'Linha temporal', path: '/linha-temporal/' },
  { label: 'Autores', path: '/autores/' },
  { label: 'Sobre', path: '/sobre/' },
];

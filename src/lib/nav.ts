export interface NavItem {
  label: string;
  path: string;
}

// Cabeçalho: três de cada lado do logótipo.
export const nav: NavItem[] = [
  { label: 'Início', path: '/' },
  { label: 'Sobre', path: '/sobre/' },
  { label: 'Arquivo', path: '/arquivo/' },
  { label: 'Vozes', path: '/vozes/' },
  { label: 'Explorar', path: '/explorar/' },
  { label: 'Contacto', path: '/contacto/' },
];

// Rodapé: todas as secções.
export const sections: NavItem[] = [
  { label: 'Arquivo', path: '/arquivo/' },
  { label: 'Explorar', path: '/explorar/' },
  { label: 'Linha temporal', path: '/linha-temporal/' },
  { label: 'Autores', path: '/autores/' },
  { label: 'Vozes', path: '/vozes/' },
  { label: 'Sobre', path: '/sobre/' },
  { label: 'Contacto', path: '/contacto/' },
];

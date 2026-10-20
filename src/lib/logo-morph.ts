// "Arrasto": o logótipo completo recolhe para "Og" (p = 0 completo, p = 1 Og).
// As letras ENÉRICO deslizam para trás do G (cortadas pelo clipPath de Logo.astro)
// e depois o O cresce até à altura do G e encosta-se a ele.
// Geometria em unidades da fonte, linha de base em y = 0.
const SHIFT = 4940; // fim de ENÉRICO (6694) até ao fim do G (1754)
const O_SCALE = 720 / 700; // O do Inner até à altura do G do Decohaus
const O_CX = [350, 597]; // centro do O: posição no logótipo → junto ao G

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (t: number) => Math.min(Math.max(t, 0), 1);
export const ease = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

export function morphLogo(svg: SVGSVGElement, p: number) {
  const rest = ease(clamp(p / 0.75));
  const o = ease(clamp((p - 0.35) / 0.65));
  const cx = lerp(O_CX[0], O_CX[1], o);
  const s = lerp(1, O_SCALE, o);

  // A caixa acompanha a tinta: esquerda = O, direita = fim das letras, topo = acento do É.
  const x = cx - 350 * s;
  // O topo só desce depois de o acento do É passar para trás do G (rest ≈ 0,39).
  const top = lerp(-1011, -710, clamp((rest - 0.42) / 0.58));
  const w = 6694 - SHIFT * rest - x;
  const h = 10 - top;
  svg.setAttribute('viewBox', `${x} ${top} ${w} ${h}`);
  svg.style.setProperty('--vbw', String(w));
  svg.style.setProperty('--vbh', String(h));

  svg.querySelector('.logo-rest')?.setAttribute('transform', `translate(${-SHIFT * rest} 0)`);
  svg
    .querySelector('.logo-o')
    ?.setAttribute('transform', `translate(${cx} -350) scale(${s}) translate(-350 350)`);
}

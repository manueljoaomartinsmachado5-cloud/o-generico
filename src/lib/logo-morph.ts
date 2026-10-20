// "Arrasto", como no protótipo do Manuel: a caixa de ENÉRICO encolhe da direita até ao G,
// as letras esbatem-se e o logótipo recentra-se; no fim o O encosta-se ao G e cresce até à altura dele.
// p = 0 logótipo completo, p = 1 "Og". Geometria em unidades da fonte, linha de base em y = 0.
const G_END = 1754; // fim do G
const REST = 6694 - G_END; // ENÉRICO, do fim do G ao fim do logótipo
const ACCENT = 3658; // ponta do acento do É (topo do logótipo)
const O_SCALE = 720 / 700; // O do Inner até à altura do G do Decohaus
const O_CX = [350, 597]; // centro do O: posição no logótipo → junto ao G

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (t: number) => Math.min(Math.max(t, 0), 1);
export const ease = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

export function morphLogo(svg: SVGSVGElement, p: number) {
  const wipe = ease(clamp(p / 0.7));
  const o = ease(clamp((p - 0.4) / 0.6));
  const right = G_END + REST * (1 - wipe);
  const cx = lerp(O_CX[0], O_CX[1], o);
  const s = lerp(1, O_SCALE, o);

  // A caixa acompanha a tinta; o topo só desce depois de o acento do É sair de cena.
  const x = cx - 350 * s;
  const top = lerp(-1011, -710, clamp((wipe - (6694 - ACCENT) / REST) / (1 - (6694 - ACCENT) / REST)));
  const w = right - x;
  const h = 10 - top;
  svg.setAttribute('viewBox', `${x} ${top} ${w} ${h}`);
  svg.style.setProperty('--vbw', String(w));
  svg.style.setProperty('--vbh', String(h));

  svg.querySelector('.logo-clip')?.setAttribute('width', String(right - G_END));
  const rest = svg.querySelector('.logo-rest');
  rest?.setAttribute('transform', `translate(${-60 * wipe} 0)`);
  rest?.setAttribute('opacity', String(1 - clamp(wipe / 0.8)));
  svg
    .querySelector('.logo-o')
    ?.setAttribute('transform', `translate(${cx} -350) scale(${s}) translate(-350 350)`);
}

// Anima o logótipo até `target` (0 ou 1) em `duration` ms; recomeça de onde estiver.
export function logoTween(svg: SVGSVGElement, onFrame?: (p: number) => void) {
  let p = 0;
  let raf = 0;
  return (target: number, duration = 700) => {
    cancelAnimationFrame(raf);
    const from = p;
    const d = duration * Math.abs(target - from);
    let t0 = -1;
    const step = (t: number) => {
      if (t0 < 0) t0 = t;
      const k = d ? Math.min((t - t0) / d, 1) : 1;
      p = lerp(from, target, k);
      morphLogo(svg, p);
      onFrame?.(p);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };
}

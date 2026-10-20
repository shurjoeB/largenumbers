// Comparison engine — pure functions, no DOM

export function formatCrore(value) {
  if (value >= 100000) {
    const lakh = value / 100000;
    return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2)} lakh crore`;
  }
  if (value >= 1000) {
    const k = value / 1000;
    return `₹${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k crore`;
  }
  if (value >= 1) {
    return `₹${value.toLocaleString('en-IN')} crore`;
  }
  // sub-crore: convert to lakhs
  const lakhs = value * 100;
  if (lakhs >= 1) return `₹${lakhs.toFixed(1)} lakh`;
  return `₹${(value * 10000000).toLocaleString('en-IN')}`;
}

export function formatRatio(ratio) {
  if (ratio >= 10000) return `${(ratio / 1000).toFixed(0)}k`;
  if (ratio >= 1000) return `${(ratio / 1000).toFixed(1)}k`;
  if (ratio >= 100) return `${Math.round(ratio).toLocaleString('en-IN')}`;
  if (ratio >= 10) return `${ratio.toFixed(1)}`;
  if (ratio >= 1) return `${ratio.toFixed(2)}`;
  // fraction
  const pct = ratio * 100;
  if (pct >= 10) return `${pct.toFixed(0)}%`;
  if (pct >= 1) return `${pct.toFixed(1)}%`;
  return `${pct.toFixed(2)}%`;
}

// Returns a compact display string for the ratio, e.g. "286×" or "1.56×" or "0.3×"
export function ratioDisplay(ratio) {
  if (ratio >= 1) return `${formatRatio(ratio)}×`;
  return formatRatio(ratio); // already shows % for < 1
}

// Picks the best reference for an item value
export function selectBestReference(itemValue, references) {
  let best = null;
  let bestScore = -Infinity;

  for (const ref of references) {
    const ratio = itemValue / ref.value;
    if (ratio < 0.005 || ratio > 500000) continue;

    const logR = Math.log10(ratio);
    // Sweet spot: ratio 1–200 (log 0–2.3)
    // Acceptable: 0.05–10000 (log -1.3 to 4)
    let score;
    if (logR >= 0 && logR <= 2.3) {
      score = 100 - Math.abs(logR - 1.15) * 15;
    } else if (logR >= -1.3 && logR <= 4) {
      score = 60 - Math.abs(logR - 1.15) * 8;
    } else {
      score = 10 - Math.abs(logR) * 2;
    }

    if (score > bestScore) {
      bestScore = score;
      best = ref;
    }
  }

  return best || references[0];
}

// Generates the comparison sentence and visual data
export function generateComparison(item, reference) {
  const ratio = item.value / reference.value;
  const isMore = ratio >= 1;

  let headline, subline;

  if (ratio >= 1) {
    const r = formatRatio(ratio);
    const times = Math.abs(ratio - 1) < 0.05 ? 'equal to' : `${r} times`;
    headline = `${r}×`;
    subline = `The ${item.label} is ${times} the ${reference.shortLabel || reference.label}.`;
  } else {
    const pct = (ratio * 100);
    const pctStr = pct >= 10 ? `${pct.toFixed(0)}%` : `${pct.toFixed(1)}%`;
    headline = pctStr;
    subline = `The ${item.label} is ${pctStr} of the ${reference.shortLabel || reference.label}.`;
  }

  return { ratio, headline, subline, isMore };
}

// Builds the dot-grid data for rendering
export function buildVisualData(ratio) {
  if (ratio <= 0) return { cells: [], overflowCount: 0, groupLabel: '' };

  let groupSize = 1;
  let label = '';

  if (ratio > 2500) {
    groupSize = 1000;
    label = 'each square = 1,000×';
  } else if (ratio > 250) {
    groupSize = 100;
    label = 'each square = 100×';
  } else if (ratio > 25) {
    groupSize = 10;
    label = 'each square = 10×';
  } else {
    groupSize = 1;
    label = 'each square = 1×';
  }

  const displayRatio = ratio / groupSize;
  const fullCells = Math.floor(displayRatio);
  const fraction = displayRatio - fullCells;
  const maxCells = 25;

  const cells = [];

  const shownFull = Math.min(fullCells, maxCells);
  for (let i = 0; i < shownFull; i++) {
    cells.push({ type: 'full', fill: 1 });
  }

  const overflowCount = fullCells > maxCells ? fullCells - maxCells : 0;

  if (overflowCount === 0 && fraction > 0.04) {
    cells.push({ type: 'partial', fill: fraction });
  }

  return { cells, overflowCount, groupSize, groupLabel: label };
}

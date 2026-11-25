// Regions use their original language on some profiles. Categorize both spellings
// once so filter counts and cards cannot disagree.
export function entityCategory(entity) {
  const text = Object.values(entity.kind === 'character' ? entity.origin || {} : entity.classification || {}).join(' ');
  const categories = entity.kind === 'character'
    ? [['fliss', /弗利斯|フリス/], ['roselansa', /洛斯兰瑟|ローズランサ/], ['charles', /夏露露|シャルル/], ['jiuzhou', /九洲/]]
    : [['heteromorphic', /异生类|異生類/], ['phantom', /幻生类|幻生類/]];
  return categories.find(([, pattern]) => pattern.test(text))?.[0] || 'other';
}

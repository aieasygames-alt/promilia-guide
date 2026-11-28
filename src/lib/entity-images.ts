import variants from '../data/entity-images.json';

// Keep the original URL for metadata and browsers without responsive-image support.
export function entityImageSrcSet(src: string): string | undefined {
  const images = variants[src as keyof typeof variants];
  return images?.map(image => `${image.src} ${image.width}w`).join(', ');
}

export const entityCardSizes = '(max-width: 520px) calc(100vw - 40px), (max-width: 580px) calc(100vw - 48px), (max-width: 820px) calc((100vw - 62px) / 2), (max-width: 1200px) calc((100vw - 94px) / 2), (min-width: 1600px) 604px, 554px';
export const entityDetailSizes = '(max-width: 520px) calc(100vw - 40px), (max-width: 820px) calc(100vw - 48px), (max-width: 1100px) calc(100vw - 297px), 780px';

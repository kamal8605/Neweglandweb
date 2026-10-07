import { getImageProps } from "next/image";
import { preload } from "react-dom";

/**
 * Server-side preload for a page's LCP image when the image itself is rendered by a client component after
 * its data loads. `sizes` must match the <Image fill sizes=…> that renders it, so the browser reuses the
 * preloaded response instead of fetching a second candidate.
 */
export function preloadFillImage(src: string, sizes: string) {
  const { props } = getImageProps({ src, alt: "", fill: true, sizes });
  preload(props.src, { as: "image", imageSrcSet: props.srcSet, imageSizes: props.sizes, fetchPriority: "high" });
}

import gsap from 'gsap';

/* ------------------------------------------------------------------ */
/*  GSAP Preset Configurations                                        */
/* ------------------------------------------------------------------ */

export const presets = {
  fadeUp: {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  },

  fadeIn: {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
  },

  stagger: {
    each: 0.1,
    ease: 'power2.out',
  },

  scrollTrigger: {
    start: 'top 85%',
    end: 'bottom 20%',
    toggleActions: 'play none none none',
  },
} as const;

/* ------------------------------------------------------------------ */
/*  splitTextIntoSpans                                                 */
/*  Manual SplitText replacement — wraps text content in <span>        */
/*  elements for character or word-level animation.                    */
/* ------------------------------------------------------------------ */

export function splitTextIntoSpans(
  element: HTMLElement,
  type: 'chars' | 'words' = 'chars'
): HTMLSpanElement[] {
  const originalText = element.textContent || '';

  // Set aria-label on the parent so screen readers announce the full text
  element.setAttribute('aria-label', originalText);

  // Clear existing content
  element.textContent = '';

  const spans: HTMLSpanElement[] = [];

  if (type === 'words') {
    // Split by whitespace runs, preserving spaces between words
    const words = originalText.split(/(\s+)/);

    words.forEach((segment) => {
      if (/^\s+$/.test(segment)) {
        // Whitespace segment — preserve it as a text node
        element.appendChild(document.createTextNode(segment));
      } else if (segment.length > 0) {
        const span = document.createElement('span');
        span.style.display = 'inline-block';
        span.setAttribute('aria-hidden', 'true');
        span.textContent = segment;
        element.appendChild(span);
        spans.push(span);
      }
    });
  } else {
    // Character-level split
    const words = originalText.split(/(\s+)/);

    words.forEach((segment) => {
      if (/^\s+$/.test(segment)) {
        // Preserve whitespace between words as a plain text node
        element.appendChild(document.createTextNode(segment));
      } else {
        // Wrap each character in its own span
        for (const char of segment) {
          const span = document.createElement('span');
          span.style.display = 'inline-block';
          span.setAttribute('aria-hidden', 'true');
          span.textContent = char;
          element.appendChild(span);
          spans.push(span);
        }
      }
    });
  }

  return spans;
}

/* ------------------------------------------------------------------ */
/*  animateStrokeDraw                                                  */
/*  SVG stroke-draw animation using dasharray / dashoffset technique.  */
/* ------------------------------------------------------------------ */

export function animateStrokeDraw(
  path: SVGPathElement,
  duration: number = 1.5,
  delay: number = 0
): gsap.core.Tween {
  const length = path.getTotalLength();

  // Set initial state — fully hidden stroke
  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length,
  });

  // Animate the offset to 0, revealing the stroke
  return gsap.to(path, {
    strokeDashoffset: 0,
    duration,
    delay,
    ease: 'power2.inOut',
  });
}

/* ------------------------------------------------------------------ */
/*  animateCountUp                                                     */
/*  Counts from 0 to a target number, updating element textContent     */
/*  with toLocaleString() formatting.                                  */
/* ------------------------------------------------------------------ */

export function animateCountUp(
  element: HTMLElement,
  target: number,
  duration: number = 2
): gsap.core.Tween {
  const proxy = { value: 0 };

  return gsap.to(proxy, {
    value: target,
    duration,
    ease: 'power2.out',
    onUpdate() {
      element.textContent = Math.round(proxy.value).toLocaleString();
    },
  });
}

import { cloneElement, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

export function FadeEffect({
  children,
  effects,
  time = 0,
  duration = 1,
}: {
  children: React.ReactElement<HTMLElement>;
  effects: ('in' | 'up')[];
  time?: number;
  duration?: number;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), time * 1000);
    return () => clearTimeout(timer);
  }, [time]);

  if (!show) return null;

  const styledChild = cloneElement(children, {
    style: {
      ...(children.props.style || {}),
      animationDuration: `${duration}s`,
      animationTimingFunction: 'ease-out',
      animationFillMode: 'forwards',
      animationName: effects.map(v => `fade-${v}`).toString(),
    },
    className: cn(children.props.className),
  });

  return styledChild;
}

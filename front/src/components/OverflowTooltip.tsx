import React, { useRef, useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function OverflowTooltip({ children, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    }
  }, [children]);

  const content = (
    <div ref={ref} className={`truncate ${className}`}>
      {children}
    </div>
  );

  if (!isOverflowing) return content;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="bottom" align="start">
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

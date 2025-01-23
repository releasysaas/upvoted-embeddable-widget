import { useState, useEffect } from 'react';
import { WidgetContext } from '../lib/context';
import { Widget } from './widget';

interface WidgetContainerProps {
  clientKey: string;
  className: string;
}

export function WidgetContainer({
  clientKey,
  className,
}: WidgetContainerProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <WidgetContext.Provider value={{ isOpen, setIsOpen, clientKey, className }}>
      <Widget />
    </WidgetContext.Provider>
  );
}

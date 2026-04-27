import { useState, useEffect } from 'react';
import { WidgetContext } from '../lib/context';
import { Widget } from './widget';

interface WidgetContainerProps {
  clientKey: string;
  className: string;
  triggerId?: string | null;
}

export function WidgetContainer({
  clientKey,
  className,
  triggerId,
}: WidgetContainerProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!triggerId) return;
    const el = document.getElementById(triggerId);
    if (!el) {
      console.warn(`Upvoted widget: trigger element with id "${triggerId}" not found`);
      return;
    }
    const handler = () => setIsOpen(true);
    el.addEventListener('click', handler);
    return () => el.removeEventListener('click', handler);
  }, [triggerId]);

  if (!mounted) {
    return null;
  }

  const hideTrigger = !!triggerId;

  return (
    <WidgetContext.Provider value={{ isOpen, setIsOpen, clientKey, className, hideTrigger }}>
      <Widget />
    </WidgetContext.Provider>
  );
}

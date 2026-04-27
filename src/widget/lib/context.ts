import { createContext } from 'react';

interface WidgetContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  clientKey: string;
  className: string;
  hideTrigger: boolean;
}

export const WidgetContext = createContext<WidgetContextType>({
  isOpen: false,
  setIsOpen: () => undefined,
  clientKey: '',
  className: '',
  hideTrigger: false,
});

import { createContext } from 'react';

interface WidgetContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  clientKey: string;
  className: string;
}

export const WidgetContext = createContext<WidgetContextType>({
  isOpen: false,
  setIsOpen: () => undefined,
  clientKey: '',
  className: '',
});

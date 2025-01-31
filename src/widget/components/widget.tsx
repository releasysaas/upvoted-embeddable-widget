import { useContext } from 'react';
import { WidgetContext } from '../lib/context';
import { X } from 'lucide-react';
import FeatureRequestForm from './feature-request-form';
export function Widget() {
  const { isOpen, setIsOpen, clientKey, className } = useContext(WidgetContext);

  return (
    <>
      <div className={className}>
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className='fixed bottom-0 right-0 flex items-center gap-2 m-6 px-1 py-1
                       bg-widget-bg-light hover:bg-widget-input-light dark:bg-widget-input-dark text-white rounded-full shadow-lg
                       transition-colors duration-200 z-50'
            aria-label='Open feature request form'
          >
            <img
              src='https://upvoted.s3.us-east-1.amazonaws.com/public/logo_icon_light.svg'
              alt='Upvoted'
              className='w-12 h-12'
            />
          </button>
        ) : (
          <div
            className='fixed inset-0 bg-widget-bg-light dark:bg-widget-bg-dark lg:right-0 lg:left-auto lg:w-[500px]
                        flex flex-col shadow-xl z-50 animate-in slide-in-from-right duration-200'
          >
            <div className='flex items-center justify-between p-4 border-b border-1 dark:border-gray-800'>
              <a href='https://upvoted.io' target='_blank'>
                <img
                  src='https://upvoted.s3.us-east-1.amazonaws.com/public/logo_light.svg'
                  alt='Upvoted'
                  className='h-9'
                />
              </a>
              <h3 className='text-md font-semibold text-slate-700 dark:text-white'>
                Submit Feature Request
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className='p-2 text-slate-700 dark:text-white hover:bg-widget-input-light dark:bg-widget-input-dark rounded-full transition-colors'
                aria-label='Close feature request form'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='flex-1 overflow-y-auto'>
              <FeatureRequestForm authToken={clientKey} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

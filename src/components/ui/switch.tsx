import * as React from 'react';

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  variant?: 'default' | 'primary' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({
    checked,
    onCheckedChange,
    label,
    className = '',
    variant = 'default',
    size = 'default',
    ...props
  }, ref) => {
    const variants = {
      default: 'bg-gray-200 hover:bg-gray-300',
      primary: 'bg-blue-600 hover:bg-blue-700',
      destructive: 'bg-red-600 hover:bg-red-700',
    };

    const sizes = {
      sm: 'h-5 w-9',
      default: 'h-6 w-11',
      lg: 'h-8 w-14',
    };

    const thumbSizes = {
      sm: 'h-4 w-4',
      default: 'h-5 w-5',
      lg: 'h-7 w-7',
    };

    const baseClasses = 'inline-flex items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    const thumbBaseClasses = 'pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform';

    return (
      <div className="flex items-center space-x-2">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
          onClick={() => onCheckedChange(!checked)}
          ref={ref}
          {...props}
        >
          <span 
            className={`${thumbBaseClasses} ${thumbSizes[size]} ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} 
          />
        </button>
        {label && <span className="text-sm font-medium">{label}</span>}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

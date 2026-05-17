import * as React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2';
    const variantStyles: Record<string, string> = {
      default: 'bg-white text-black hover:bg-white/90',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
      outline: 'border border-zinc-700 bg-transparent hover:bg-zinc-800',
      secondary: 'bg-zinc-800 text-white hover:bg-zinc-700',
      ghost: 'hover:bg-zinc-800',
      link: 'text-white underline-offset-4 hover:underline',
    };
    return (
      <button
        className={`${baseStyles} ${variantStyles[variant] || variantStyles.default} ${className || ''}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };

import React, { type ButtonHTMLAttributes, forwardRef, type Ref } from 'react';
import styles from './button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}

const Button = forwardRef(({ 
  className = '', 
  variant = 'default', 
  size = 'default', 
  children, 
  ...props 
}: ButtonProps, ref: Ref<HTMLButtonElement>) => {
  const baseClasses = styles.button;
  const variantClasses = styles[variant] || styles.default;
  const sizeClasses = styles[size] || styles.default;
  
  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim();
  
  return (
    <button
      className={combinedClasses}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
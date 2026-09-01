import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick
}) => {
  const baseStyle = 'bg-white border border-gov-border rounded-lg p-5 overflow-hidden';
  const hoverStyle = hoverable ? 'transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : '';
  const clickStyle = onClick ? 'cursor-pointer select-none' : '';

  return (
    <div
      className={`${baseStyle} ${hoverStyle} ${clickStyle} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`border-b border-gov-border pb-3 mb-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`border-t border-gov-border pt-3 mt-4 ${className}`}>
    {children}
  </div>
);

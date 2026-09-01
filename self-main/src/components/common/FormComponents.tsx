import React, { forwardRef } from 'react';

// Common interfaces
interface BaseFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  wrapperClassName?: string;
}

// Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, BaseFieldProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, helperText, className = '', id, wrapperClassName = '', ...props }, ref) => {
    const fieldId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
    const errorId = `${fieldId}-error`;
    const helperId = `${fieldId}-helper`;

    return (
      <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
        <label htmlFor={fieldId} className="text-sm font-medium text-gov-charcoal flex items-center gap-0.5">
          {label}
          {required && <span className="text-gov-error" aria-hidden="true">*</span>}
        </label>
        
        <input
          id={fieldId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`px-3 py-2 border rounded-md text-sm transition-all focus:outline-none focus:ring-1 focus:ring-gov-navy focus:border-gov-navy bg-white text-gov-charcoal ${
            error ? 'border-gov-error focus:ring-gov-error focus:border-gov-error' : 'border-gov-border'
          } ${className}`}
          {...props}
        />

        {error && (
          <span id={errorId} className="text-xs text-gov-error font-medium" role="alert">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={helperId} className="text-xs text-gov-muted">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

// Select component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, BaseFieldProps {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, required, helperText, options, placeholder, className = '', id, wrapperClassName = '', ...props }, ref) => {
    const fieldId = id || `select-${label.replace(/\s+/g, '-').toLowerCase()}`;
    const errorId = `${fieldId}-error`;
    const helperId = `${fieldId}-helper`;

    return (
      <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
        <label htmlFor={fieldId} className="text-sm font-medium text-gov-charcoal flex items-center gap-0.5">
          {label}
          {required && <span className="text-gov-error" aria-hidden="true">*</span>}
        </label>

        <select
          id={fieldId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`px-3 py-2 border rounded-md text-sm bg-white transition-all focus:outline-none focus:ring-1 focus:ring-gov-navy focus:border-gov-navy text-gov-charcoal ${
            error ? 'border-gov-error focus:ring-gov-error focus:border-gov-error' : 'border-gov-border'
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {error && (
          <span id={errorId} className="text-xs text-gov-error font-medium" role="alert">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={helperId} className="text-xs text-gov-muted">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

// Textarea component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, BaseFieldProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, helperText, className = '', id, wrapperClassName = '', rows = 3, ...props }, ref) => {
    const fieldId = id || `textarea-${label.replace(/\s+/g, '-').toLowerCase()}`;
    const errorId = `${fieldId}-error`;
    const helperId = `${fieldId}-helper`;

    return (
      <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
        <label htmlFor={fieldId} className="text-sm font-medium text-gov-charcoal flex items-center gap-0.5">
          {label}
          {required && <span className="text-gov-error" aria-hidden="true">*</span>}
        </label>

        <textarea
          id={fieldId}
          ref={ref}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`px-3 py-2 border rounded-md text-sm transition-all focus:outline-none focus:ring-1 focus:ring-gov-navy focus:border-gov-navy bg-white text-gov-charcoal ${
            error ? 'border-gov-error focus:ring-gov-error focus:border-gov-error' : 'border-gov-border'
          } ${className}`}
          {...props}
        />

        {error && (
          <span id={errorId} className="text-xs text-gov-error font-medium" role="alert">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={helperId} className="text-xs text-gov-muted">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

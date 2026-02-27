import { useState } from 'react';
import '../styles/Input.css';

/**
 * Reusable Input / TextField component
 * @param {Object} props
 * @param {'text'|'password'|'email'|'number'|'search'} type
 */
function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  disabled = false,
  icon = null,
  className = '',
  ...rest
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`input-group ${error ? 'input-group-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className={`input-wrapper ${focused ? 'input-focused' : ''}`}>
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="input-field"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}

export default Input;

import React from 'react';

const InputField = ({ label, type, name, value, onChange, placeholder, error, variant, icon, children, inputRef, ...props }) => (
  <div className={`input-group ${variant === 'underlined' ? 'underlined-group' : ''}`}>
    {label && variant !== 'underlined' && <label>{label}</label>}
    
    <div className="input-wrapper-inner">
      {icon && <span className="field-icon">{icon}</span>}
      <input
        ref={inputRef}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'error' : ''}
        {...props}
      />
      {/* چیلدرن باید اینجا باشد تا ارور صفحه سفید برطرف شود */}
      {children} 
    </div>
    {error && <span className="error-text" style={{color: '#ef4444', fontSize: '12px'}}>{error}</span>}
  </div>
);

export default InputField;
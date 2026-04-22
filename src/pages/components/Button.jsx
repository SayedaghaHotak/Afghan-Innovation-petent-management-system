import React from 'react';

const Button = ({ type = 'button', className, onClick, disabled, children }) => (
  <button type={type} className={className} onClick={onClick} disabled={disabled}>
    {children}
  </button>
);

export default Button;
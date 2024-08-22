import React, { useEffect, useRef } from 'react';
import { Button as BsButton } from 'react-bootstrap';

/**
 * A custom button component that supports ripple effect.
 * 
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child elements of the button.
 * @param {string} [props.className=''] - The additional CSS class name for the button.
 * @returns {JSX.Element} The button component with ripple effect.
 */
function Button({ children, className = '', ...rest }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (button) {
      button.addEventListener('click', createRipple);
    }

    return () => {
      if (button) {
        button.removeEventListener('click', createRipple);
      }
    };
  }, []);

  /**
   * Creates a ripple effect when the button is clicked.
   * @param {MouseEvent} e - The mouse event that triggered the ripple effect.
   */
  const createRipple = (e) => {
    const button = e.currentTarget;

    // Clear existing ripples
    const existingRipple = button.querySelector('.ripple-overlay');
    if (existingRipple) {
      existingRipple.remove();
    }

    const rippleDiv = document.createElement('span');
    rippleDiv.className = 'ripple-overlay';
    const buttonRect = button.getBoundingClientRect();
    const rippleY = e.clientY - buttonRect.top;
    const rippleX = e.clientX - buttonRect.left;

    rippleDiv.style.top = `${rippleY - rippleDiv.offsetHeight / 2}px`;
    rippleDiv.style.left = `${rippleX - rippleDiv.offsetWidth / 2}px`;

    button.appendChild(rippleDiv);

    setTimeout(() => {
      rippleDiv.remove();
    }, 800);
  };

  return (
    <BsButton ref={buttonRef} className={`${className}`} {...rest}>
      {children}
    </BsButton>
  );
}

export default Button;

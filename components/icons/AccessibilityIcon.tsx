import React from 'react';

export const AccessibilityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
    <path d="M19 7h-2l-2.6-2.95a.5.5 0 0 0-.8 0L12 7h-2l-2.6-2.95a.5.5 0 0 0-.8 0L6 7H4"/>
    <path d="M19 7v10h-2v-4h-2v4H9v-4H7v4H5V7h14z"/>
  </svg>
);

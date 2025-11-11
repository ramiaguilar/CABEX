import React from 'react';

export const SpirometerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20v-4" />
    <path d="M12 8V4" />
    <path d="m15 11 3-3" />
    <path d="M9 11 6 8" />
    <circle cx="12" cy="12" r="8" />
    <path d="M12 12a4 4 0 1 0-4.9 4" />
  </svg>
);

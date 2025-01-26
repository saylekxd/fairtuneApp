import React from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-4 px-4 text-center text-sm text-gray-400/60 bg-black">
      <p>© {currentYear} Fairtune. Made with ♥️ by swtlabs</p>
    </footer>
  );
}; 
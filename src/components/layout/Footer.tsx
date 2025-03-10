import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-green-700 text-white py-4 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p>© {new Date().getFullYear()} המגינים על העצים. כל הזכויות שמורות.</p>
      </div>
    </footer>
  );
};

export default Footer;
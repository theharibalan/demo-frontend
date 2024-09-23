import React, { useEffect } from 'react';

const GoogleTag = () => {
  useEffect(() => {
    // Add Google Tag Manager script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-WKT65GJCLP';
    document.head.appendChild(script1);

    // Add inline Google Tag Manager script
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-WKT65GJCLP');
    `;
    document.head.appendChild(script2);

    return () => {
      // Clean up by removing the scripts when the component is unmounted
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  return null;
};

export default GoogleTag;

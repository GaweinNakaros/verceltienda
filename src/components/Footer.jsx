import React from 'react';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer mt-auto py-4 bg-dark text-light" aria-label="Pie de página">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div className="small">
          <strong>Proyecto React</strong> &copy; {year}
        </div>
        <div className="footer-disclaimer small" aria-live="polite">
          Sitio con fines educativos. No representa una tienda real ni ofrece productos para la venta.
        </div>
        <div className="small">
          <a href="/" className="text-decoration-none link-light">Inicio</a>
          <span className="mx-2 text-secondary">•</span>
          <a href="/productos" className="text-decoration-none link-light">Productos</a>
          <span className="mx-2 text-secondary">•</span>
          <a href="/servicios" className="text-decoration-none link-light">Servicios</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
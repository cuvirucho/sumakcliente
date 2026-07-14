import React, { useEffect } from "react";
import { legalDocs, legalIntro, LEGAL_UPDATED } from "../../data/legalContent";

// Renderiza un bloque de contenido legal según su tipo, reutilizando las clases
// legal-* definidas en index.css. Espeja el Block de TerminosScreen.js (SumakApp).
const Block = ({ block }) => {
  switch (block.type) {
    case "h2":
      return <h2 className="legal-h">{block.text}</h2>;
    case "strong":
      return <p className="legal-subh">{block.text}</p>;
    case "p":
      return <p className="legal-p">{block.text}</p>;
    case "bullets":
      return (
        <ul className="legal-list">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "divider":
      return <hr className="legal-divider" />;
    default:
      return null;
  }
};

const Terminos = () => {
  // Al abrir la página aseguramos que empiece desde arriba.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page fade-in">
      <header className="legal-header">
        <p className="legal-section-kicker">SumakApp</p>
        <h1 className="legal-title">Términos y Condiciones</h1>
        <p className="legal-subtitle">{LEGAL_UPDATED}</p>
        <p className="legal-subtitle">{legalIntro}</p>
      </header>

      {legalDocs.map((doc, index) => (
        <section className="legal-section" key={doc.id}>
          {index > 0 && <hr className="legal-divider" />}
          <h2 className="legal-title legal-title--sub">{doc.title}</h2>
          {doc.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </section>
      ))}
    </div>
  );
};

export default Terminos;

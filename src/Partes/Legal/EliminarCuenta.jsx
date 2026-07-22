import React, { useEffect } from "react";

// Correo de contacto usado en toda la app (mismo que en Footer y Política).
const CORREO = "sumakclean@gmail.com";

// mailto: con asunto y cuerpo prellenados para facilitar la solicitud.
const MAILTO =
  `mailto:${CORREO}` +
  "?subject=" +
  encodeURIComponent("Solicitud de eliminación de cuenta") +
  "&body=" +
  encodeURIComponent(
    "Hola, solicito la eliminación de mi cuenta y de todos los datos " +
      "asociados en SumakApp.\n\nCorreo registrado en la cuenta: \n\n" +
      "Gracias.",
  );

// Botón CTA construido con los tokens del tema (sin CSS nuevo).
const botonEstilo = {
  display: "inline-block",
  marginTop: "var(--space-2)",
  padding: "var(--space-3) var(--space-5)",
  border: "1px solid var(--clr-sage-mid)",
  borderRadius: "var(--radius-md)",
  color: "var(--clr-sage-light)",
  fontFamily: "var(--ff-ui)",
  fontSize: "var(--fs-sm)",
  letterSpacing: "var(--ls-wide)",
};

const EliminarCuenta = () => {
  // Al abrir la página aseguramos que empiece desde arriba.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page fade-in">
      <header className="legal-header">
        <p className="legal-section-kicker">SumakApp</p>
        <h1 className="legal-title">Solicitar eliminación de cuenta</h1>
        <p className="legal-subtitle">
          Última actualización: Julio de 2026
        </p>
      </header>

      <section className="legal-section">
        <h2 className="legal-h">1. Cómo solicitar la eliminación</h2>
        <p className="legal-p">
          Si tienes una cuenta en SumakApp, puedes solicitar en cualquier
          momento que eliminemos tu cuenta y los datos personales asociados a
          ella. Para hacerlo, envíanos un correo desde la dirección con la que
          te registraste indicando que deseas eliminar tu cuenta.
        </p>
        <a href={MAILTO} style={botonEstilo}>
          Solicitar eliminación por correo
        </a>
        <p className="legal-p" style={{ marginTop: "var(--space-3)" }}>
          También puedes escribirnos directamente a{" "}
          <a href={`mailto:${CORREO}`} style={{ color: "var(--clr-sage-light)" }}>
            {CORREO}
          </a>
          . Para verificar tu identidad, la solicitud debe enviarse desde el
          correo registrado en la cuenta.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">2. Qué datos se eliminan</h2>
        <p className="legal-p">
          Al procesar tu solicitud eliminaremos de forma permanente la
          información asociada a tu cuenta, incluyendo:
        </p>
        <ul className="legal-list">
          <li>Tu cuenta de acceso y credenciales de autenticación.</li>
          <li>Tu perfil de usuario (nombre, correo y teléfono).</li>
          <li>Las direcciones de los inmuebles registradas.</li>
          <li>
            Tu historial de reservas, cotizaciones, cancelaciones y servicios.
          </li>
          <li>Tus calificaciones y comentarios.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">3. Qué datos se conservan y por cuánto tiempo</h2>
        <p className="legal-p">
          Por obligaciones legales, contables y tributarias de la República del
          Ecuador, podemos conservar durante el plazo que exige la ley cierta
          información mínima de facturación y comprobantes de los servicios ya
          prestados. Estos datos se mantienen únicamente para cumplir dichas
          obligaciones y no se utilizan para ningún otro fin.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">4. Plazo de procesamiento</h2>
        <p className="legal-p">
          Procesaremos tu solicitud en un plazo máximo de 30 días desde su
          recepción. Te confirmaremos por correo cuando la eliminación se haya
          completado.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">5. Contacto</h2>
        <p className="legal-p">
          Si tienes dudas sobre este proceso o sobre el tratamiento de tus
          datos, escríbenos a{" "}
          <a href={`mailto:${CORREO}`} style={{ color: "var(--clr-sage-light)" }}>
            {CORREO}
          </a>
          . Puedes consultar también nuestra Política de Privacidad para más
          información sobre tus derechos.
        </p>
      </section>
    </div>
  );
};

export default EliminarCuenta;

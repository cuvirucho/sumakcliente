import React, { useEffect } from "react";

const PoliticaPrivacidad = () => {
  // Al abrir la página aseguramos que empiece desde arriba.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page fade-in">
      <header className="legal-header">
        <p className="legal-section-kicker">SumakApp</p>
        <h1 className="legal-title">Política de Privacidad</h1>
        <p className="legal-subtitle">
          Última actualización: Julio de 2026
        </p>
        <p className="legal-subtitle">
          Fecha de entrada en vigor: desde la fecha de publicación oficial de la
          aplicación.
        </p>
      </header>

      {/* ============================================================ */}
      {/* BLOQUE A — POLÍTICA DE PRIVACIDAD */}
      {/* ============================================================ */}

      <section className="legal-section">
        <h2 className="legal-h">1. Introducción</h2>
        <p className="legal-p">
          En SUMAKA ("SumakApp", "nosotros" o "la Empresa") respetamos la
          privacidad de nuestros usuarios y nos comprometemos a proteger la
          información personal que recopilamos durante el uso de nuestra
          aplicación.
        </p>
        <p className="legal-p">
          Esta Política de Privacidad explica qué información recopilamos, cómo
          la utilizamos, con quién la compartimos, cómo la protegemos y cuáles
          son los derechos de los usuarios.
        </p>
        <p className="legal-p">
          Al utilizar SumakApp, el usuario acepta el tratamiento de sus datos
          personales conforme a esta Política de Privacidad y a la legislación
          aplicable de la República del Ecuador.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">2. Responsable del tratamiento de los datos</h2>
        {/* TODO: confirmar RUC y dirección antes de publicar en Google Play */}
        <ul className="legal-list">
          <li>Empresa: SUMAKA</li>
          <li>Nombre comercial: SumakApp</li>
          <li>RUC: 01015125124001</li>
          <li>Dirección: Firecín Hermano Miguel, Callalarga, Cuenca, Ecuador.</li>
          <li>Correo electrónico: sumakclean@gmail.com</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">3. Información que recopilamos</h2>
        <p className="legal-p">
          Dependiendo del uso de la aplicación, SumakApp podrá recopilar la
          siguiente información:
        </p>

        <h3 className="legal-subh">3.1 Datos de identificación</h3>
        <ul className="legal-list">
          <li>Nombre.</li>
          <li>Apellidos (si son solicitados).</li>
          <li>Correo electrónico.</li>
          <li>Número de teléfono.</li>
        </ul>

        <h3 className="legal-subh">3.2 Datos del servicio</h3>
        <ul className="legal-list">
          <li>Dirección del inmueble.</li>
          <li>Historial de reservas.</li>
          <li>Historial de cancelaciones.</li>
          <li>Historial de servicios completados.</li>
          <li>Calificaciones y comentarios.</li>
        </ul>

        <h3 className="legal-subh">3.3 Datos de ubicación</h3>
        <p className="legal-p">
          Con autorización del usuario, SumakApp podrá acceder a la ubicación
          del dispositivo para:
        </p>
        <ul className="legal-list">
          <li>Confirmar la dirección del servicio.</li>
          <li>Guiar al personal de limpieza.</li>
          <li>Verificar el lugar donde debe prestarse el servicio.</li>
        </ul>
        <p className="legal-p">
          La ubicación solo se utilizará para fines relacionados con la
          prestación del servicio.
        </p>

        <h3 className="legal-subh">3.4 Datos técnicos</h3>
        <p className="legal-p">Podremos recopilar información técnica como:</p>
        <ul className="legal-list">
          <li>Identificador del dispositivo.</li>
          <li>Sistema operativo.</li>
          <li>Versión de la aplicación.</li>
          <li>Dirección IP.</li>
          <li>Registros de errores.</li>
          <li>Token de notificaciones (Firebase Cloud Messaging).</li>
        </ul>
        <p className="legal-p">
          Estos datos ayudan a mejorar la estabilidad, seguridad y
          funcionamiento de la aplicación.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">4. Información que no recopilamos</h2>
        <p className="legal-p">Actualmente SumakApp no recopila:</p>
        <ul className="legal-list">
          <li>Número de cédula del usuario.</li>
          <li>Datos de tarjetas bancarias.</li>
          <li>Información financiera sensible.</li>
          <li>Fotografías personales obligatorias.</li>
          <li>Grabaciones de cámara del dispositivo del usuario.</li>
          <li>Grabaciones del micrófono del dispositivo.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">5. Finalidades del tratamiento</h2>
        <p className="legal-p">Los datos personales podrán utilizarse para:</p>
        <ul className="legal-list">
          <li>Crear y administrar la cuenta del usuario.</li>
          <li>Gestionar reservas.</li>
          <li>Coordinar la prestación del servicio.</li>
          <li>Enviar notificaciones relacionadas con reservas.</li>
          <li>Informar cambios importantes del servicio.</li>
          <li>Atender solicitudes de soporte.</li>
          <li>Mejorar la experiencia del usuario.</li>
          <li>Detectar fraudes o usos indebidos.</li>
          <li>Cumplir obligaciones legales.</li>
        </ul>
        <p className="legal-p">
          No utilizaremos los datos personales para fines incompatibles con los
          descritos en esta Política sin informar previamente al usuario cuando
          sea necesario.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">6. Streaming en vivo</h2>
        <p className="legal-p">
          SumakApp ofrece una función opcional que permite al cliente visualizar
          en tiempo real la prestación del servicio de limpieza.
        </p>
        <p className="legal-p">Respecto a esta funcionalidad:</p>
        <ul className="legal-list">
          <li>
            La transmisión únicamente podrá ser visualizada por el cliente que
            contrató el servicio.
          </li>
          <li>SumakApp no almacena ni graba las transmisiones.</li>
          <li>
            Los trabajadores conocen y aceptan esta funcionalidad como parte de
            la prestación del servicio.
          </li>
          <li>
            Está prohibido grabar, distribuir, retransmitir o utilizar la
            transmisión con fines distintos al seguimiento del servicio, salvo
            autorización legal o judicial.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">7. Conservación de los datos</h2>
        <p className="legal-p">
          Los datos personales se conservarán únicamente durante el tiempo
          necesario para:
        </p>
        <ul className="legal-list">
          <li>Mantener la cuenta activa.</li>
          <li>Prestar los servicios solicitados.</li>
          <li>Cumplir obligaciones legales.</li>
          <li>Resolver reclamaciones.</li>
          <li>Proteger los intereses legítimos de SumakApp.</li>
        </ul>
        <p className="legal-p">
          Cuando los datos ya no sean necesarios, podrán ser eliminados o
          anonimizados conforme a las políticas internas de la empresa y la
          legislación aplicable.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">8. Seguridad de la información</h2>
        <p className="legal-p">
          SumakApp implementa medidas técnicas y organizativas razonables para
          proteger la información contra:
        </p>
        <ul className="legal-list">
          <li>Acceso no autorizado.</li>
          <li>Alteración.</li>
          <li>Pérdida.</li>
          <li>Destrucción.</li>
          <li>Divulgación indebida.</li>
        </ul>
        <p className="legal-p">
          Aunque aplicamos medidas de seguridad adecuadas, ningún sistema
          informático puede garantizar una seguridad absoluta.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">9. Compartición de información</h2>
        <p className="legal-p">
          SumakApp no vende ni comercializa los datos personales de sus
          usuarios.
        </p>
        <p className="legal-p">
          La información podrá compartirse únicamente cuando sea necesario para:
        </p>
        <ul className="legal-list">
          <li>Prestar el servicio contratado.</li>
          <li>Cumplir obligaciones legales.</li>
          <li>Atender requerimientos de autoridades competentes.</li>
          <li>Resolver disputas o prevenir fraudes.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">10. Derechos del usuario</h2>
        <p className="legal-p">
          El usuario podrá solicitar, conforme a la legislación aplicable:
        </p>
        <ul className="legal-list">
          <li>Acceder a sus datos personales.</li>
          <li>Corregir información inexacta.</li>
          <li>Actualizar sus datos.</li>
          <li>
            Solicitar la eliminación de su cuenta cuando sea legalmente posible.
          </li>
          <li>
            Presentar consultas o reclamaciones relacionadas con el tratamiento
            de sus datos.
          </li>
        </ul>
        <p className="legal-p">
          Las solicitudes podrán realizarse mediante el correo electrónico de
          soporte indicado en esta Política.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">11. Cookies y tecnologías similares</h2>
        <p className="legal-p">
          Si SumakApp incorpora una versión web o utiliza tecnologías
          equivalentes, podrá emplear cookies u otros mecanismos similares para
          mejorar la experiencia del usuario, analizar el funcionamiento del
          servicio y mantener la seguridad de la plataforma.
        </p>
        <p className="legal-p">
          Cuando la normativa lo requiera, se solicitará el consentimiento
          correspondiente.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">12. Menores de edad</h2>
        <p className="legal-p">
          La aplicación está dirigida principalmente a personas mayores de
          dieciocho (18) años.
        </p>
        <p className="legal-p">
          Los menores únicamente podrán utilizar SumakApp con la autorización y
          supervisión de su padre, madre o representante legal.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">13. Cambios a esta política</h2>
        <p className="legal-p">
          SumakApp podrá modificar esta Política de Privacidad cuando sea
          necesario para adaptarse a cambios legales, tecnológicos o en el
          funcionamiento del servicio.
        </p>
        <p className="legal-p">
          Las modificaciones serán comunicadas mediante la aplicación, correo
          electrónico u otros medios razonables antes de su entrada en vigor,
          cuando corresponda.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">14. Contacto</h2>
        <p className="legal-p">
          Si el usuario tiene preguntas sobre esta Política de Privacidad o
          desea ejercer sus derechos relacionados con sus datos personales,
          podrá comunicarse con:
        </p>
        {/* TODO: confirmar dirección antes de publicar en Google Play */}
        <ul className="legal-list">
          <li>SUMAKA</li>
          <li>Correo electrónico: sumakclean@gmail.com</li>
          <li>Dirección: Firecín Hermano Miguel, Callalarga, Cuenca, Ecuador.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">15. Aceptación</h2>
        <p className="legal-p">
          Al registrarse, acceder o utilizar SumakApp, el usuario declara haber
          leído, comprendido y aceptado esta Política de Privacidad, autorizando
          el tratamiento de sus datos personales conforme a las finalidades
          descritas en el presente documento y a la legislación aplicable.
        </p>
      </section>

      {/* ============================================================ */}
      <hr className="legal-divider" />
      {/* BLOQUE B — INFORMACIÓN DE LA APP Y SEGURIDAD DE LOS DATOS (GOOGLE PLAY) */}
      {/* ============================================================ */}

      <header className="legal-header">
        <p className="legal-section-kicker">Google Play</p>
        <h2 className="legal-title legal-title--sub">
          Información de la app y seguridad de los datos
        </h2>
      </header>

      <section className="legal-section">
        <h2 className="legal-h">1. Descripción corta de la aplicación</h2>
        <p className="legal-p">
          SumakApp conecta a clientes con personal de limpieza capacitado para
          hogares, departamentos, oficinas y alojamientos Airbnb en la ciudad de
          Cuenca, Ecuador.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">2. Descripción completa</h2>
        <p className="legal-p">
          SumakApp es una aplicación desarrollada por SUMAKA que permite
          contratar servicios profesionales de limpieza para casas,
          departamentos, oficinas y alojamientos Airbnb en la ciudad de Cuenca.
        </p>
        <p className="legal-p">Con SumakApp podrás:</p>
        <ul className="legal-list">
          <li>Reservar servicios de limpieza de forma rápida y sencilla.</li>
          <li>Elegir la fecha y el horario disponibles.</li>
          <li>Administrar tus reservas desde la aplicación.</li>
          <li>Recibir notificaciones sobre el estado del servicio.</li>
          <li>Ver el servicio en vivo mediante Streaming cuando esté disponible.</li>
          <li>Acumular puntos y acceder a promociones exclusivas.</li>
          <li>
            Calificar el servicio recibido para ayudarnos a mejorar
            continuamente.
          </li>
        </ul>
        <p className="legal-p">
          Todo el personal de limpieza asignado por SUMAKA pasa por procesos
          internos de verificación de identidad, revisión de antecedentes,
          entrevista y capacitación antes de prestar servicios.
        </p>
        <p className="legal-p">
          Nuestro objetivo es ofrecer una experiencia segura, transparente y de
          calidad para nuestros clientes.
        </p>
        <p className="legal-p">
          Actualmente, SumakApp presta servicios únicamente en la ciudad de
          Cuenca, Ecuador.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">3. Uso de la ubicación</h2>
        <p className="legal-p">¿Por qué solicitamos acceso a la ubicación?</p>
        <p className="legal-p">
          SumakApp utiliza la ubicación del dispositivo para:
        </p>
        <ul className="legal-list">
          <li>Confirmar el lugar donde se prestará el servicio.</li>
          <li>Facilitar la llegada del personal de limpieza.</li>
          <li>Mejorar la coordinación de las reservas.</li>
        </ul>
        <p className="legal-p">
          La ubicación no se utiliza para publicidad ni se comparte con terceros
          para fines comerciales.
        </p>
        <p className="legal-p">
          El usuario puede administrar este permiso desde la configuración de su
          dispositivo, aunque desactivarlo puede afectar el funcionamiento de
          algunas funciones de la aplicación.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">4. Uso de notificaciones</h2>
        <p className="legal-p">
          SumakApp utiliza notificaciones para informar al usuario sobre:
        </p>
        <ul className="legal-list">
          <li>Confirmación de reservas.</li>
          <li>Cambios de horario.</li>
          <li>Recordatorios del servicio.</li>
          <li>Inicio o finalización de la limpieza.</li>
          <li>Información importante relacionada con la cuenta.</li>
          <li>
            Promociones y novedades, cuando el usuario haya autorizado este tipo
            de comunicaciones.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">5. Uso del streaming en vivo</h2>
        <p className="legal-p">
          Cuando el servicio contratado lo permita, el cliente podrá visualizar
          la limpieza mediante una transmisión en vivo.
        </p>
        <p className="legal-p">Características:</p>
        <ul className="legal-list">
          <li>
            Solo el cliente que contrató el servicio puede acceder a la
            transmisión.
          </li>
          <li>SumakApp no graba ni almacena las transmisiones.</li>
          <li>
            La transmisión tiene como finalidad brindar mayor transparencia
            durante la prestación del servicio.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">6. Creación de cuenta</h2>
        <p className="legal-p">
          Para utilizar SumakApp es necesario crear una cuenta.
        </p>
        <p className="legal-p">Durante el registro se solicitarán datos como:</p>
        <ul className="legal-list">
          <li>Nombre.</li>
          <li>Correo electrónico.</li>
          <li>Número de teléfono.</li>
          <li>Dirección del servicio.</li>
        </ul>
        <p className="legal-p">
          Estos datos se utilizan exclusivamente para prestar los servicios
          contratados, administrar la cuenta y cumplir obligaciones legales,
          conforme a la Política de Privacidad.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">7. Información sobre los datos personales</h2>
        <p className="legal-p">
          SumakApp recopila únicamente los datos necesarios para:
        </p>
        <ul className="legal-list">
          <li>Crear la cuenta del usuario.</li>
          <li>Gestionar reservas.</li>
          <li>Coordinar servicios.</li>
          <li>Enviar notificaciones.</li>
          <li>Brindar soporte.</li>
          <li>Mejorar la calidad de la aplicación.</li>
          <li>Cumplir obligaciones legales.</li>
        </ul>
        <p className="legal-p">
          SUMAKA no vende los datos personales de sus usuarios.
        </p>
        <p className="legal-p">
          El tratamiento de la información se realiza conforme a la legislación
          ecuatoriana y a la Política de Privacidad publicada por la empresa.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">8. Seguridad</h2>
        <p className="legal-p">
          SUMAKA aplica medidas técnicas y organizativas razonables para
          proteger la información de los usuarios frente a accesos no
          autorizados, alteraciones, pérdidas o divulgaciones indebidas.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">9. Público objetivo</h2>
        <p className="legal-p">
          SumakApp está dirigida principalmente a personas mayores de 18 años.
        </p>
        <p className="legal-p">
          Los menores de edad únicamente podrán utilizar la aplicación con la
          autorización y supervisión de su padre, madre o representante legal.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">10. Contacto del desarrollador</h2>
        <ul className="legal-list">
          <li>Empresa: SUMAKA</li>
          <li>Nombre comercial: SumakApp</li>
          <li>Correo electrónico: sumakclean@gmail.com</li>
          <li>Ciudad: Cuenca, Ecuador.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">11. Declaración de cumplimiento</h2>
        <p className="legal-p">
          SUMAKA declara que SumakApp cumple con las políticas aplicables de
          Google Play, incluyendo aquellas relacionadas con:
        </p>
        <ul className="legal-list">
          <li>Privacidad y protección de datos personales.</li>
          <li>Transparencia en la recopilación y uso de información.</li>
          <li>Seguridad de la cuenta del usuario.</li>
          <li>Uso responsable de permisos del dispositivo.</li>
          <li>Protección de menores.</li>
          <li>Prevención del fraude y del uso indebido de la plataforma.</li>
        </ul>
        <p className="legal-p">
          La aplicación solicitará únicamente los permisos necesarios para el
          funcionamiento de las funcionalidades ofrecidas al usuario.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">12. Declaración sobre los permisos</h2>
        <p className="legal-p">
          Los permisos solicitados por SumakApp se utilizan exclusivamente para
          habilitar las funciones correspondientes dentro de la aplicación.
        </p>
        <p className="legal-p">
          Cada permiso está relacionado con una funcionalidad específica y no se
          utiliza para fines distintos de los informados al usuario.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">13. Eliminación de la cuenta</h2>
        <p className="legal-p">
          El usuario podrá solicitar la eliminación de su cuenta y de los datos
          personales cuya conservación no sea obligatoria por ley, conforme a la
          Política de Privacidad y a la legislación aplicable.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">14. Actualizaciones</h2>
        <p className="legal-p">
          Estos textos podrán actualizarse cuando se incorporen nuevas
          funcionalidades, cambien los permisos utilizados por la aplicación o
          se modifiquen los requisitos de Google Play.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-h">15. Nota importante</h2>
        <p className="legal-p">
          Estos textos están diseñados para ser coherentes con las políticas de
          SumakApp y facilitar el cumplimiento de los requisitos de publicación
          en Google Play. No sustituyen la información que deba completarse
          directamente en la consola de Google Play, como el formulario de
          Seguridad de los datos (Data safety), la Política de Privacidad
          publicada en un sitio web accesible y las declaraciones sobre permisos
          y funcionalidades de la aplicación.
        </p>
      </section>
    </div>
  );
};

export default PoliticaPrivacidad;

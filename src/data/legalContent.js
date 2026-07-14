// Contenido legal de SumakApp transcrito del documento oficial de SUMAKA.
// Se separa el contenido de la presentación: cada documento tiene un `title`
// y una lista de `blocks`. La pantalla TerminosScreen renderiza estos bloques
// con los tokens de estilo de la app (theme.js).
//
// Tipos de bloque:
//   { type: 'h2', text }        -> encabezado de sección
//   { type: 'p', text }         -> párrafo
//   { type: 'strong', text }    -> párrafo destacado (dato/subtítulo)
//   { type: 'bullets', items }  -> lista con viñetas
//   { type: 'divider' }         -> separador fino

export const LEGAL_UPDATED = "Última actualización: Julio de 2026";

export const legalIntro =
  "Al crear una cuenta, reservar un servicio o utilizar SumakApp, declaras haber " +
  "leído, comprendido y aceptado los siguientes documentos legales de SUMAKA.";

export const legalDocs = [
  {
    id: "generales",
    title: "Disposiciones Generales Comunes",
    blocks: [
      {
        type: "p",
        text: "Las presentes disposiciones son aplicables de manera integral a todos los instrumentos legales de SumakApp.",
      },
      { type: "h2", text: "1. Información del titular y contacto" },
      {
        type: "p",
        text: "La aplicación SumakApp es propiedad de SUMAKA, compañía legalmente constituida en la República del Ecuador.",
      },
      {
        type: "bullets",
        items: [
          "RUC: 0195182914001",
          "Domicilio:AUTACHI DUCHICELAl, CAJAMARCA, Cuenca, Ecuador.",
          "Correo electrónico: sumakclean@gmail.com",
          "Sitio web: sumakclean.com",
        ],
      },
      { type: "h2", text: "2. Definiciones operativas" },
      {
        type: "p",
        text: "Cliente: Persona natural o jurídica que contrata servicios mediante la Aplicación.",
      },
      {
        type: "p",
        text: "Personal/Trabajador: Profesionales contratados directamente por SUMAKA para la ejecución de servicios.",
      },
      {
        type: "p",
        text: "Servicio: Actividades profesionales de limpieza detalladas en la Aplicación.",
      },
      { type: "h2", text: "3. Cláusula de fuerza mayor" },
      {
        type: "p",
        text: "Ninguna de las partes será responsable por el incumplimiento de sus obligaciones cuando este sea consecuencia de eventos de fuerza mayor o caso fortuito, incluyendo desastres naturales, interrupciones generales de servicios básicos o conectividad, conmoción social o disposiciones de autoridad pública.",
      },
      { type: "h2", text: "4. Modificaciones y notificaciones" },
      {
        type: "p",
        text: "SUMAKA se reserva el derecho de actualizar sus políticas en cualquier momento. Los cambios entrarán en vigor a partir de su publicación oficial en la Aplicación o tras la notificación al correo electrónico registrado del usuario.",
      },
    ],
  },

  {
    id: "terminos",
    title: "Términos y Condiciones de Uso",
    blocks: [
      {
        type: "strong",
        text: "Fecha de entrada en vigor: desde la fecha de publicación oficial de la aplicación. Última actualización: julio de 2026.",
      },
      { type: "h2", text: "1. Introducción" },
      { type: "p", text: 'Bienvenido a SumakApp ("la Aplicación").' },
      {
        type: "p",
        text: "Los presentes Términos y Condiciones regulan el acceso, registro y uso de la aplicación móvil SumakApp, así como los servicios de limpieza ofrecidos por SUMAKA, compañía legalmente constituida en la República del Ecuador.",
      },
      {
        type: "p",
        text: "Al crear una cuenta, acceder o utilizar la aplicación, el usuario declara haber leído, comprendido y aceptado íntegramente estos Términos y Condiciones. Si el usuario no está de acuerdo con cualquiera de sus disposiciones, deberá abstenerse de utilizar la aplicación y sus servicios.",
      },
      { type: "h2", text: "4. Objeto" },
      {
        type: "p",
        text: "Estos Términos regulan el uso de SumakApp y establecen los derechos y obligaciones entre SUMAKA y sus usuarios.",
      },
      {
        type: "p",
        text: "El objetivo de SumakApp es facilitar la contratación de servicios profesionales de limpieza de manera segura, transparente y eficiente.",
      },
      { type: "h2", text: "5. Aceptación" },
      { type: "p", text: "Al utilizar SumakApp el usuario acepta:" },
      {
        type: "bullets",
        items: [
          "Todos los presentes Términos y Condiciones.",
          "Las políticas complementarias publicadas por SumakApp.",
          "Las futuras modificaciones notificadas por la empresa.",
        ],
      },
      {
        type: "p",
        text: "La aceptación constituye un acuerdo legalmente vinculante entre el usuario y SUMAKA.",
      },
      { type: "h2", text: "6. Requisitos para utilizar la aplicación" },
      { type: "p", text: "Para utilizar SumakApp el usuario deberá:" },
      {
        type: "bullets",
        items: [
          "Registrarse con información veraz y actualizada.",
          "Mantener protegidas sus credenciales de acceso.",
          "No compartir su cuenta con terceros.",
          "Utilizar la aplicación únicamente para fines legales.",
        ],
      },
      {
        type: "p",
        text: "Los menores de dieciocho (18) años únicamente podrán utilizar la aplicación bajo la autorización y supervisión de su padre, madre o representante legal.",
      },
      { type: "h2", text: "7. Registro de usuarios" },
      {
        type: "p",
        text: "Para acceder a los servicios será obligatorio crear una cuenta.",
      },
      {
        type: "p",
        text: "El usuario será responsable de toda la actividad realizada desde su cuenta.",
      },
      {
        type: "p",
        text: "SUMAKA podrá solicitar información adicional para verificar la identidad del usuario cuando lo considere necesario.",
      },
      {
        type: "p",
        text: "El suministro de información falsa podrá ocasionar la suspensión o eliminación definitiva de la cuenta.",
      },
      { type: "h2", text: "8. Servicios ofrecidos" },
      {
        type: "p",
        text: "Actualmente SumakApp ofrece los siguientes servicios dentro de la ciudad de Cuenca:",
      },
      {
        type: "bullets",
        items: [
          "Limpieza de casas.",
          "Limpieza de departamentos.",
          "Limpieza de oficinas.",
          "Limpieza de alojamientos tipo Airbnb.",
        ],
      },
      {
        type: "p",
        text: "La empresa podrá incorporar nuevos servicios, modificar los existentes o suspender alguno de ellos cuando lo considere necesario.",
      },
      { type: "h2", text: "9. Cobertura" },
      {
        type: "p",
        text: "Los servicios se prestan exclusivamente dentro de la ciudad de Cuenca, Ecuador.",
      },
      {
        type: "p",
        text: "SUMAKA podrá ampliar su cobertura geográfica en cualquier momento.",
      },
      { type: "h2", text: "10. Horarios" },
      { type: "p", text: "El horario de atención es de 07:00 a 19:00." },
      {
        type: "p",
        text: "Las reservas podrán realizarse desde la aplicación conforme a la disponibilidad existente.",
      },
      { type: "h2", text: "11. Personal" },
      {
        type: "p",
        text: "Todos los servicios son realizados por personal contratado directamente por SUMAKA.",
      },
      {
        type: "p",
        text: "Antes de incorporarse al equipo, cada trabajador pasa por un proceso de:",
      },
      {
        type: "bullets",
        items: [
          "Verificación de identidad.",
          "Validación documental.",
          "Revisión de antecedentes.",
          "Entrevista.",
          "Capacitación.",
        ],
      },
      { type: "h2", text: "12. Reservas" },
      {
        type: "p",
        text: "Las reservas se realizan exclusivamente mediante SumakApp.",
      },
      {
        type: "p",
        text: "Una reserva se considera confirmada cuando la empresa la acepta dentro de la plataforma.",
      },
      {
        type: "p",
        text: "SUMAKA podrá rechazar solicitudes cuando no exista disponibilidad, existan riesgos para el personal o por causas de fuerza mayor.",
      },
      { type: "h2", text: "13. Obligaciones del cliente" },
      { type: "p", text: "El cliente se compromete a:" },
      {
        type: "bullets",
        items: [
          "Facilitar el acceso al inmueble.",
          "Contar con suministro de agua y energía eléctrica durante el servicio.",
          "Mantener bajo control a las mascotas.",
          "Informar cualquier riesgo que pueda afectar la seguridad del personal.",
          "Tratar al personal con respeto.",
        ],
      },
      { type: "h2", text: "14. Conductas prohibidas" },
      { type: "p", text: "Está prohibido:" },
      {
        type: "bullets",
        items: [
          "Agredir física o verbalmente al personal.",
          "Discriminar por cualquier motivo.",
          "Acosar a los trabajadores.",
          "Utilizar la aplicación con fines ilícitos.",
          "Proporcionar información falsa.",
          "Realizar fraudes.",
          "Intentar afectar el funcionamiento de la plataforma.",
        ],
      },
      {
        type: "p",
        text: "El incumplimiento podrá ocasionar la suspensión o eliminación permanente de la cuenta.",
      },
      { type: "h2", text: "15. Disponibilidad" },
      {
        type: "p",
        text: "SUMAKA realiza esfuerzos razonables para mantener la aplicación disponible.",
      },
      {
        type: "p",
        text: "Sin embargo, no garantiza disponibilidad continua e ininterrumpida debido a:",
      },
      {
        type: "bullets",
        items: [
          "Mantenimiento.",
          "Actualizaciones.",
          "Fallas técnicas.",
          "Problemas de Internet.",
          "Eventos de fuerza mayor.",
        ],
      },
      { type: "h2", text: "19. Aceptación final" },
      {
        type: "p",
        text: "Al crear una cuenta, reservar un servicio o utilizar cualquier funcionalidad de SumakApp, el usuario declara haber leído, comprendido y aceptado íntegramente estos Términos y Condiciones de Uso.",
      },
    ],
  },

  {
    id: "privacidad",
    title: "Política de Privacidad",
    blocks: [
      { type: "h2", text: "1. Introducción" },
      {
        type: "p",
        text: 'En SUMAKA ("SumakApp", "nosotros" o "la Empresa") respetamos la privacidad de nuestros usuarios y nos comprometemos a proteger la información personal que recopilamos durante el uso de nuestra aplicación.',
      },
      {
        type: "p",
        text: "Esta Política de Privacidad explica qué información recopilamos, cómo la utilizamos, con quién la compartimos, cómo la protegemos y cuáles son los derechos de los usuarios.",
      },
      {
        type: "p",
        text: "Al utilizar SumakApp, el usuario acepta el tratamiento de sus datos personales conforme a esta Política de Privacidad y a la legislación aplicable de la República del Ecuador.",
      },
      { type: "h2", text: "3. Información que recopilamos" },
      {
        type: "p",
        text: "Dependiendo del uso de la aplicación, SumakApp podrá recopilar la siguiente información:",
      },
      { type: "strong", text: "3.1 Datos de identificación" },
      {
        type: "bullets",
        items: [
          "Nombre.",
          "Apellidos (si son solicitados).",
          "Correo electrónico.",
          "Número de teléfono.",
        ],
      },
      { type: "strong", text: "3.2 Datos del servicio" },
      {
        type: "bullets",
        items: [
          "Dirección del inmueble.",
          "Historial de reservas.",
          "Historial de cancelaciones.",
          "Historial de servicios completados.",
          "Calificaciones y comentarios.",
        ],
      },
      { type: "strong", text: "3.3 Datos de ubicación" },
      {
        type: "p",
        text: "Con autorización del usuario, SumakApp podrá acceder a la ubicación del dispositivo para:",
      },
      {
        type: "bullets",
        items: [
          "Confirmar la dirección del servicio.",
          "Guiar al personal de limpieza.",
          "Verificar el lugar donde debe prestarse el servicio.",
        ],
      },
      {
        type: "p",
        text: "La ubicación solo se utilizará para fines relacionados con la prestación del servicio.",
      },
      { type: "strong", text: "3.4 Datos técnicos" },
      { type: "p", text: "Podremos recopilar información técnica como:" },
      {
        type: "bullets",
        items: [
          "Identificador del dispositivo.",
          "Sistema operativo.",
          "Versión de la aplicación.",
          "Dirección IP.",
          "Registros de errores.",
          "Token de notificaciones (Firebase Cloud Messaging).",
        ],
      },
      {
        type: "p",
        text: "Estos datos ayudan a mejorar la estabilidad, seguridad y funcionamiento de la aplicación.",
      },
      { type: "h2", text: "4. Información que no recopilamos" },
      { type: "p", text: "Actualmente SumakApp no recopila:" },
      {
        type: "bullets",
        items: [
          "Número de cédula del usuario.",
          "Datos de tarjetas bancarias.",
          "Información financiera sensible.",
          "Fotografías personales obligatorias.",
          "Grabaciones de cámara del dispositivo del usuario.",
          "Grabaciones del micrófono del dispositivo.",
        ],
      },
      { type: "h2", text: "5. Finalidades del tratamiento" },
      { type: "p", text: "Los datos personales podrán utilizarse para:" },
      {
        type: "bullets",
        items: [
          "Crear y administrar la cuenta del usuario.",
          "Gestionar reservas.",
          "Coordinar la prestación del servicio.",
          "Enviar notificaciones relacionadas con reservas.",
          "Informar cambios importantes del servicio.",
          "Atender solicitudes de soporte.",
          "Mejorar la experiencia del usuario.",
          "Detectar fraudes o usos indebidos.",
          "Cumplir obligaciones legales.",
        ],
      },
      {
        type: "p",
        text: "No utilizaremos los datos personales para fines incompatibles con los descritos en esta Política sin informar previamente al usuario cuando sea necesario.",
      },
      { type: "h2", text: "6. Streaming en vivo" },
      {
        type: "p",
        text: "SumakApp ofrece una función opcional que permite al cliente visualizar en tiempo real la prestación del servicio de limpieza.",
      },
      { type: "p", text: "Respecto a esta funcionalidad:" },
      {
        type: "bullets",
        items: [
          "La transmisión únicamente podrá ser visualizada por el cliente que contrató el servicio.",
          "SumakApp no almacena ni graba las transmisiones.",
          "Los trabajadores conocen y aceptan esta funcionalidad como parte de la prestación del servicio.",
          "Está prohibido grabar, distribuir, retransmitir o utilizar la transmisión con fines distintos al seguimiento del servicio, salvo autorización legal o judicial.",
        ],
      },
      { type: "h2", text: "7. Conservación de los datos" },
      {
        type: "p",
        text: "Los datos personales se conservarán únicamente durante el tiempo necesario para:",
      },
      {
        type: "bullets",
        items: [
          "Mantener la cuenta activa.",
          "Prestar los servicios solicitados.",
          "Cumplir obligaciones legales.",
          "Resolver reclamaciones.",
          "Proteger los intereses legítimos de SumakApp.",
        ],
      },
      {
        type: "p",
        text: "Cuando los datos ya no sean necesarios, podrán ser eliminados o anonimizados conforme a las políticas internas de la empresa y la legislación aplicable.",
      },
      { type: "h2", text: "8. Seguridad de la información" },
      {
        type: "p",
        text: "SumakApp implementa medidas técnicas y organizativas razonables para proteger la información contra:",
      },
      {
        type: "bullets",
        items: [
          "Acceso no autorizado.",
          "Alteración.",
          "Pérdida.",
          "Destrucción.",
          "Divulgación indebida.",
        ],
      },
      {
        type: "p",
        text: "Aunque aplicamos medidas de seguridad adecuadas, ningún sistema informático puede garantizar una seguridad absoluta.",
      },
      { type: "h2", text: "9. Compartición de información" },
      {
        type: "p",
        text: "SumakApp no vende ni comercializa los datos personales de sus usuarios.",
      },
      {
        type: "p",
        text: "La información podrá compartirse únicamente cuando sea necesario para:",
      },
      {
        type: "bullets",
        items: [
          "Prestar el servicio contratado.",
          "Cumplir obligaciones legales.",
          "Atender requerimientos de autoridades competentes.",
          "Resolver disputas o prevenir fraudes.",
        ],
      },
      { type: "h2", text: "10. Derechos del usuario" },
      {
        type: "p",
        text: "El usuario podrá solicitar, conforme a la legislación aplicable:",
      },
      {
        type: "bullets",
        items: [
          "Acceder a sus datos personales.",
          "Corregir información inexacta.",
          "Actualizar sus datos.",
          "Solicitar la eliminación de su cuenta cuando sea legalmente posible.",
          "Presentar consultas o reclamaciones relacionadas con el tratamiento de sus datos.",
        ],
      },
      {
        type: "p",
        text: "Las solicitudes podrán realizarse mediante el correo electrónico de soporte indicado en esta Política.",
      },
      { type: "h2", text: "11. Cookies y tecnologías similares" },
      {
        type: "p",
        text: "Si SumakApp incorpora una versión web o utiliza tecnologías equivalentes, podrá emplear cookies u otros mecanismos similares para mejorar la experiencia del usuario, analizar el funcionamiento del servicio y mantener la seguridad de la plataforma.",
      },
      {
        type: "p",
        text: "Cuando la normativa lo requiera, se solicitará el consentimiento correspondiente.",
      },
      { type: "h2", text: "12. Menores de edad" },
      {
        type: "p",
        text: "La aplicación está dirigida principalmente a personas mayores de dieciocho (18) años.",
      },
      {
        type: "p",
        text: "Los menores únicamente podrán utilizar SumakApp con la autorización y supervisión de su padre, madre o representante legal.",
      },
      { type: "h2", text: "15. Aceptación" },
      {
        type: "p",
        text: "Al registrarse, acceder o utilizar SumakApp, el usuario declara haber leído, comprendido y aceptado esta Política de Privacidad, autorizando el tratamiento de sus datos personales conforme a las finalidades descritas en el presente documento y a la legislación aplicable.",
      },
    ],
  },

  {
    id: "cancelaciones",
    title: "Política de Cancelaciones",
    blocks: [
      { type: "h2", text: "1. Objetivo" },
      {
        type: "p",
        text: "La presente Política de Cancelaciones establece las condiciones aplicables a la modificación o cancelación de las reservas realizadas a través de SumakApp.",
      },
      {
        type: "p",
        text: "Su finalidad es proteger tanto a los clientes como al personal de limpieza, garantizando una planificación adecuada de los servicios.",
      },
      { type: "h2", text: "2. Alcance" },
      {
        type: "p",
        text: "Esta política aplica a todos los servicios contratados mediante SumakApp dentro de la ciudad de Cuenca, Ecuador.",
      },
      {
        type: "p",
        text: "Toda persona que utilice la plataforma acepta esta política al momento de confirmar una reserva.",
      },
      { type: "h2", text: "3. Cancelación por parte del cliente" },
      {
        type: "p",
        text: "El cliente podrá cancelar una reserva sin costo siempre que la cancelación se realice con al menos 24 horas de anticipación respecto de la hora programada para el servicio.",
      },
      {
        type: "p",
        text: "La cancelación deberá efectuarse utilizando la aplicación o los canales oficiales habilitados por SumakApp.",
      },
      { type: "h2", text: "4. Cancelaciones fuera del plazo" },
      {
        type: "p",
        text: "Cuando el cliente cancele una reserva con menos de veinticuatro (24) horas de anticipación, SumakApp podrá cobrar el valor correspondiente al servicio o los cargos establecidos, debido a los costos operativos y a la asignación del personal.",
      },
      { type: "h2", text: "5. Trabajador en camino" },
      {
        type: "p",
        text: "Si el personal de limpieza ya ha sido despachado y se encuentra en camino al domicilio del cliente, la cancelación generará el cobro correspondiente conforme a las condiciones del servicio contratado.",
      },
      {
        type: "p",
        text: "Esta medida busca compensar el tiempo de desplazamiento y los recursos destinados a la atención de la reserva.",
      },
      { type: "h2", text: "6. Ausencia del cliente" },
      {
        type: "p",
        text: "Si el trabajador llega a la dirección indicada y no puede ingresar al inmueble porque el cliente no se encuentra presente, no responde a las llamadas o no facilita el acceso, el servicio se considerará cancelado por causa imputable al cliente y podrá cobrarse el valor correspondiente.",
      },
      { type: "h2", text: "7. Falta de condiciones para prestar el servicio" },
      {
        type: "p",
        text: "SumakApp podrá cancelar o suspender un servicio cuando el cliente no proporcione las condiciones mínimas necesarias para realizar la limpieza, incluyendo, entre otras:",
      },
      {
        type: "bullets",
        items: [
          "Falta de acceso al inmueble.",
          "Ausencia de suministro de agua.",
          "Ausencia de energía eléctrica.",
          "Presencia de riesgos para la seguridad del personal.",
          "Mascotas agresivas sin control.",
          "Situaciones que comprometan la integridad física o psicológica del trabajador.",
        ],
      },
      {
        type: "p",
        text: "En estos casos, SumakApp evaluará si corresponde aplicar cargos por la reserva.",
      },
      { type: "h2", text: "8. Cancelación por parte de SumakApp" },
      {
        type: "p",
        text: "SumakApp podrá cancelar una reserva por motivos justificados, incluyendo:",
      },
      {
        type: "bullets",
        items: [
          "Emergencias.",
          "Condiciones climáticas extremas.",
          "Problemas de seguridad.",
          "Accidentes del personal.",
          "Enfermedad del trabajador asignado.",
          "Casos de fuerza mayor.",
          "Situaciones operativas excepcionales.",
        ],
      },
      {
        type: "p",
        text: "Cuando sea posible, SumakApp ofrecerá una nueva fecha para la prestación del servicio o procederá conforme a la Política de Reembolsos.",
      },
      { type: "h2", text: "9. Retrasos del personal" },
      {
        type: "p",
        text: "Si el trabajador asignado presenta un retraso debido a tráfico, accidentes, cierres de vías u otras circunstancias ajenas al control de SumakApp, la empresa informará al cliente tan pronto como sea posible.",
      },
      { type: "p", text: "En estos casos, el cliente podrá optar por:" },
      {
        type: "bullets",
        items: [
          "Esperar al trabajador y recibir el servicio.",
          "Reprogramar la reserva sin costo.",
          "Cancelar la reserva sin penalización.",
        ],
      },
      { type: "h2", text: "10. Modificación de reservas" },
      {
        type: "p",
        text: "El cliente podrá solicitar la modificación de la fecha u hora del servicio, sujeto a disponibilidad operativa.",
      },
      {
        type: "p",
        text: "Las modificaciones realizadas con menos de 24 horas de anticipación podrán ser rechazadas o generar cargos adicionales.",
      },
      { type: "h2", text: "11. Cancelaciones por conductas inadecuadas" },
      {
        type: "p",
        text: "SumakApp podrá cancelar inmediatamente cualquier servicio cuando el cliente incurra en conductas como:",
      },
      {
        type: "bullets",
        items: [
          "Agresiones físicas o verbales.",
          "Amenazas.",
          "Acoso.",
          "Discriminación.",
          "Consumo de sustancias que comprometan la seguridad del personal.",
          "Actividades ilegales dentro del inmueble.",
          "Cualquier otra conducta que represente un riesgo para el trabajador.",
        ],
      },
      {
        type: "p",
        text: "En estos casos, el cliente podrá perder el derecho a reembolsos y su cuenta podrá ser suspendida o eliminada.",
      },
      { type: "h2", text: "12. Reprogramaciones" },
      {
        type: "p",
        text: "Cuando una cancelación sea atribuible a SumakApp, la empresa podrá ofrecer al cliente la posibilidad de reprogramar el servicio sin costo adicional.",
      },
      { type: "p", text: "La nueva fecha estará sujeta a disponibilidad." },
      { type: "h2", text: "14. Relación con la Política de Reembolsos" },
      {
        type: "p",
        text: "Las cancelaciones no implican automáticamente el derecho a recibir un reembolso.",
      },
      {
        type: "p",
        text: "Las devoluciones de dinero se regirán exclusivamente por la Política de Reembolsos vigente de SumakApp.",
      },
      { type: "h2", text: "17. Aceptación" },
      {
        type: "p",
        text: "Al reservar un servicio mediante SumakApp, el usuario declara haber leído, comprendido y aceptado íntegramente esta Política de Cancelaciones.",
      },
    ],
  },

  {
    id: "reembolsos",
    title: "Política de Reembolsos",
    blocks: [
      { type: "h2", text: "1. Objetivo" },
      {
        type: "p",
        text: "La presente Política de Reembolsos regula las condiciones bajo las cuales SumakApp podrá devolver total o parcialmente los valores pagados por los servicios contratados mediante la aplicación.",
      },
      {
        type: "p",
        text: "Su finalidad es garantizar un proceso transparente, justo y equilibrado para los clientes y para SUMAKA.",
      },
      { type: "h2", text: "2. Alcance" },
      {
        type: "p",
        text: "Esta política aplica a todos los servicios contratados mediante SumakApp dentro de la ciudad de Cuenca, Ecuador.",
      },
      {
        type: "p",
        text: "Todo usuario acepta esta política al reservar un servicio.",
      },
      { type: "h2", text: "3. Casos en los que procede un reembolso" },
      {
        type: "p",
        text: "El cliente podrá solicitar un reembolso cuando ocurra alguna de las siguientes situaciones atribuibles a SumakApp:",
      },
      {
        type: "bullets",
        items: [
          "El servicio contratado no fue prestado.",
          "SumakApp no envió personal al lugar acordado.",
          "El servicio fue cancelado por decisión de SumakApp sin ofrecer una alternativa aceptable para el cliente.",
          "El servicio prestado incumplió de manera significativa las condiciones ofrecidas y, tras la revisión correspondiente, se determine que la reclamación es procedente.",
        ],
      },
      { type: "p", text: "Cada solicitud será evaluada individualmente." },
      { type: "h2", text: "4. Garantía de satisfacción" },
      {
        type: "p",
        text: "Si el cliente considera que el servicio no cumplió con los estándares ofrecidos, deberá comunicarlo a SumakApp dentro del plazo indicado por la empresa, aportando la información y evidencias disponibles.",
      },
      {
        type: "p",
        text: "Como primera medida, SumakApp podrá ofrecer una nueva limpieza sin costo adicional.",
      },
      {
        type: "p",
        text: "Si, luego del análisis del caso, no fuera posible resolver la situación mediante una nueva prestación del servicio, la empresa podrá aprobar un reembolso total o parcial, según corresponda.",
      },
      { type: "h2", text: "5. Casos en los que no procede un reembolso" },
      { type: "p", text: "No habrá derecho a reembolso cuando:" },
      {
        type: "bullets",
        items: [
          "El cliente cancele fuera del plazo permitido.",
          "El trabajador ya haya sido despachado al lugar del servicio.",
          "El cliente no permita el acceso al inmueble.",
          "El cliente no se encuentre presente en la dirección indicada.",
          "No existan las condiciones mínimas para realizar la limpieza (por ejemplo, falta de agua o energía eléctrica).",
          "El servicio no pueda ejecutarse debido a riesgos generados por el cliente.",
          "La cancelación sea imputable al cliente.",
        ],
      },
      { type: "h2", text: "6. Evaluación de las solicitudes" },
      {
        type: "p",
        text: "Todas las solicitudes de reembolso serán analizadas caso por caso.",
      },
      { type: "p", text: "Durante la evaluación, SumakApp podrá considerar:" },
      {
        type: "bullets",
        items: [
          "La información proporcionada por el cliente.",
          "El informe del trabajador asignado.",
          "Registros internos de la reserva.",
          "Evidencias disponibles.",
          "Cualquier otro elemento relevante.",
        ],
      },
      {
        type: "p",
        text: "La decisión será adoptada conforme a los hechos verificados y a la legislación aplicable.",
      },
      { type: "h2", text: "7. Reembolsos parciales" },
      {
        type: "p",
        text: "Cuando corresponda, SumakApp podrá otorgar un reembolso parcial si únicamente una parte del servicio resultó afectada o cuando las circunstancias del caso así lo justifiquen.",
      },
      { type: "h2", text: "8. Plazo para solicitar el reembolso" },
      {
        type: "p",
        text: "El cliente deberá presentar su solicitud dentro del plazo que establezca SumakApp a través de sus canales oficiales.",
      },
      {
        type: "p",
        text: "Las solicitudes presentadas fuera de dicho plazo podrán ser rechazadas, salvo que existan circunstancias excepcionales debidamente justificadas.",
      },
      { type: "h2", text: "9. Procedimiento" },
      { type: "p", text: "Para solicitar un reembolso, el cliente deberá:" },
      {
        type: "bullets",
        items: [
          "Contactar a SumakApp mediante los canales oficiales.",
          "Indicar el número o identificación de la reserva.",
          "Explicar detalladamente el motivo de la solicitud.",
          "Proporcionar, cuando sea posible, fotografías, documentos u otras evidencias que respalden la reclamación.",
        ],
      },
      {
        type: "p",
        text: "SumakApp podrá solicitar información adicional si resulta necesaria para completar la evaluación.",
      },
      { type: "h2", text: "10. Forma del reembolso" },
      {
        type: "p",
        text: "Cuando un reembolso sea aprobado, SumakApp realizará la devolución utilizando el mismo medio de pago empleado por el cliente, siempre que sea posible.",
      },
      {
        type: "p",
        text: "Si ello no fuera técnicamente viable, la empresa podrá acordar un mecanismo alternativo de devolución.",
      },
      { type: "h2", text: "11. Tiempos de procesamiento" },
      {
        type: "p",
        text: "El tiempo necesario para que el reembolso se refleje en favor del cliente podrá variar dependiendo de:",
      },
      {
        type: "bullets",
        items: [
          "El método de pago utilizado.",
          "La entidad financiera correspondiente.",
          "Los tiempos de procesamiento de terceros.",
        ],
      },
      {
        type: "p",
        text: "SumakApp no será responsable por demoras atribuibles a instituciones financieras o proveedores externos.",
      },
      { type: "h2", text: "12. Fraude o uso indebido" },
      {
        type: "p",
        text: "SumakApp podrá rechazar cualquier solicitud de reembolso cuando existan indicios razonables de:",
      },
      {
        type: "bullets",
        items: [
          "Fraude.",
          "Información falsa.",
          "Manipulación de evidencias.",
          "Abuso reiterado de las políticas de reembolso.",
          "Conductas destinadas a obtener beneficios indebidos.",
        ],
      },
      {
        type: "p",
        text: "En estos casos, la empresa podrá suspender o cancelar la cuenta del usuario.",
      },
      { type: "h2", text: "14. Relación con otras políticas" },
      {
        type: "p",
        text: "Esta Política de Reembolsos deberá interpretarse conjuntamente con:",
      },
      {
        type: "bullets",
        items: [
          "Los Términos y Condiciones de Uso.",
          "La Política de Cancelaciones.",
          "La Política de Privacidad.",
          "Las demás políticas publicadas por SumakApp.",
        ],
      },
      { type: "h2", text: "17. Aceptación" },
      {
        type: "p",
        text: "Al utilizar SumakApp y contratar cualquiera de sus servicios, el usuario declara haber leído, comprendido y aceptado íntegramente esta Política de Reembolsos.",
      },
    ],
  },

  {
    id: "fidelizacion",
    title: "Política de Fidelización, Puntos, Cupones y Membresías",
    blocks: [
      { type: "h2", text: "1. Objetivo" },
      {
        type: "p",
        text: "La presente Política regula el funcionamiento del Programa de Fidelización de SumakApp, incluyendo la obtención y utilización de puntos, cupones promocionales y membresías.",
      },
      {
        type: "p",
        text: "El objetivo del programa es premiar la confianza y preferencia de los clientes mediante beneficios exclusivos.",
      },
      { type: "h2", text: "2. Alcance" },
      {
        type: "p",
        text: "Esta política aplica a todos los usuarios registrados de SumakApp que utilicen la aplicación para contratar servicios de limpieza.",
      },
      {
        type: "p",
        text: "La participación en el programa es gratuita, salvo los beneficios asociados a las membresías de pago.",
      },
      { type: "h2", text: "3. Programa de puntos" },
      {
        type: "p",
        text: "Cada servicio de limpieza completado correctamente permitirá al cliente acumular puntos dentro de su cuenta.",
      },
      {
        type: "p",
        text: "La cantidad de puntos otorgados por cada servicio será determinada por SumakApp y podrá variar según:",
      },
      {
        type: "bullets",
        items: [
          "El tipo de servicio contratado.",
          "El valor de la reserva.",
          "Promociones especiales.",
          "Campañas temporales.",
        ],
      },
      {
        type: "p",
        text: "Los puntos acumulados se reflejarán en la cuenta del usuario una vez finalizado el servicio y verificado el pago correspondiente.",
      },
      { type: "h2", text: "4. Uso de los puntos" },
      {
        type: "p",
        text: "Los puntos podrán utilizarse únicamente para obtener descuentos o beneficios autorizados dentro de SumakApp.",
      },
      { type: "p", text: "Los puntos no podrán:" },
      {
        type: "bullets",
        items: [
          "Convertirse en dinero.",
          "Ser retirados en efectivo.",
          "Transferirse a otra persona o cuenta.",
          "Comercializarse o venderse.",
          "Utilizarse fuera de la plataforma.",
        ],
      },
      { type: "h2", text: "5. Vigencia de los puntos" },
      {
        type: "p",
        text: "Salvo que SumakApp comunique lo contrario, los puntos acumulados no tendrán fecha de vencimiento mientras la cuenta permanezca activa y en buen estado.",
      },
      {
        type: "p",
        text: "La empresa podrá establecer campañas con puntos promocionales que sí tengan una fecha de expiración, lo cual será informado oportunamente.",
      },
      { type: "h2", text: "6. Pérdida de puntos" },
      {
        type: "p",
        text: "SumakApp podrá descontar o eliminar puntos cuando ocurra alguna de las siguientes situaciones:",
      },
      {
        type: "bullets",
        items: [
          "Cancelación de un servicio que ya generó puntos.",
          "Reembolso aprobado de una reserva.",
          "Fraude o intento de fraude.",
          "Uso indebido del programa de fidelización.",
          "Manipulación del sistema.",
          "Incumplimiento de los Términos y Condiciones.",
        ],
      },
      { type: "h2", text: "7. Cupones promocionales" },
      {
        type: "p",
        text: "SumakApp podrá emitir cupones promocionales para incentivar el uso de la aplicación.",
      },
      { type: "p", text: "Los cupones podrán:" },
      {
        type: "bullets",
        items: [
          "Tener una fecha de expiración.",
          "Aplicarse únicamente a determinados servicios.",
          "Estar sujetos a un monto mínimo de compra.",
          "Limitarse a un número determinado de usos.",
        ],
      },
      {
        type: "p",
        text: "Cada promoción indicará sus condiciones específicas.",
      },
      { type: "h2", text: "8. Acumulación de cupones" },
      {
        type: "p",
        text: "Salvo que una promoción indique expresamente lo contrario, los cupones no son acumulables entre sí.",
      },
      {
        type: "p",
        text: "El sistema aplicará únicamente el cupón válido que represente el mayor beneficio para el usuario o aquel que este seleccione, cuando corresponda.",
      },
      { type: "h2", text: "9. Membresías" },
      {
        type: "p",
        text: "SumakApp podrá ofrecer membresías de suscripción mensual que otorguen beneficios exclusivos a los usuarios afiliados.",
      },
      { type: "p", text: "Los beneficios podrán incluir, entre otros:" },
      {
        type: "bullets",
        items: [
          "Descuentos especiales.",
          "Acceso a promociones exclusivas.",
          "Beneficios adicionales determinados por SumakApp.",
        ],
      },
      {
        type: "p",
        text: "Las condiciones específicas de cada membresía serán informadas antes de la contratación.",
      },
      { type: "h2", text: "10. Modificación de beneficios" },
      {
        type: "p",
        text: "SumakApp podrá modificar, ampliar o eliminar los beneficios del programa de fidelización, de los cupones o de las membresías cuando existan razones comerciales, operativas o legales.",
      },
      {
        type: "p",
        text: "Cuando los cambios afecten de forma significativa a los usuarios, se realizará una notificación por medios razonables.",
      },
      { type: "h2", text: "11. Fraude y uso indebido" },
      {
        type: "p",
        text: "Está prohibido cualquier intento de obtener puntos, cupones o beneficios mediante:",
      },
      {
        type: "bullets",
        items: [
          "Información falsa.",
          "Creación de cuentas duplicadas.",
          "Manipulación del sistema.",
          "Uso de herramientas automatizadas.",
          "Actividades fraudulentas.",
        ],
      },
      { type: "p", text: "En estos casos, SumakApp podrá:" },
      {
        type: "bullets",
        items: [
          "Anular los puntos obtenidos.",
          "Invalidar cupones.",
          "Cancelar membresías.",
          "Suspender temporalmente la cuenta.",
          "Eliminar definitivamente la cuenta.",
          "Iniciar las acciones legales que correspondan.",
        ],
      },
      { type: "h2", text: "12. Cancelación de la cuenta" },
      {
        type: "p",
        text: "Si una cuenta es eliminada por decisión del usuario o por incumplimiento de los Términos y Condiciones, los puntos, cupones y beneficios asociados podrán perderse definitivamente, salvo disposición legal en contrario.",
      },
      { type: "h2", text: "13. Limitación de responsabilidad" },
      {
        type: "p",
        text: "SumakApp no garantiza la disponibilidad permanente del programa de fidelización.",
      },
      {
        type: "p",
        text: "La empresa podrá suspender temporalmente el programa debido a:",
      },
      {
        type: "bullets",
        items: [
          "Mantenimiento.",
          "Actualizaciones.",
          "Fallas técnicas.",
          "Eventos de fuerza mayor.",
          "Razones de seguridad.",
        ],
      },
      { type: "h2", text: "17. Aceptación" },
      {
        type: "p",
        text: "Al utilizar SumakApp y participar en el Programa de Fidelización, el usuario declara haber leído, comprendido y aceptado íntegramente esta Política.",
      },
      { type: "strong", text: "Disposición final" },
      {
        type: "p",
        text: "El Programa de Fidelización de SumakApp constituye un beneficio comercial ofrecido por la empresa a sus usuarios. La existencia de puntos, cupones o membresías no genera derechos de propiedad sobre dichos beneficios, los cuales podrán ser modificados o retirados por SumakApp conforme a esta Política y a la legislación aplicable.",
      },
    ],
  },

  {
    id: "membresias",
    title: "Política de Membresías",
    blocks: [
      { type: "h2", text: "1. Objeto" },
      {
        type: "p",
        text: "La presente Política regula el funcionamiento de las membresías ofrecidas por SUMAKA, a través de la aplicación SumakApp.",
      },
      {
        type: "p",
        text: "Su finalidad es establecer las condiciones aplicables a la contratación, uso, renovación, cancelación y beneficios de los planes de suscripción disponibles para los usuarios.",
      },
      { type: "h2", text: "2. Alcance" },
      {
        type: "p",
        text: "Esta Política aplica a todos los usuarios que contraten una membresía dentro de SumakApp.",
      },
      {
        type: "p",
        text: "La contratación de una membresía implica la aceptación de los presentes términos, así como de los Términos y Condiciones de Uso y demás políticas publicadas por SumakApp.",
      },
      { type: "h2", text: "3. ¿Qué es una membresía?" },
      {
        type: "p",
        text: "Una membresía es un plan de suscripción que permite al usuario acceder a beneficios exclusivos mientras permanezca activa.",
      },
      {
        type: "p",
        text: "Las membresías son opcionales y no son necesarias para utilizar los servicios básicos de SumakApp.",
      },
      { type: "h2", text: "4. Planes disponibles" },
      {
        type: "p",
        text: "SumakApp podrá ofrecer uno o varios planes de membresía.",
      },
      { type: "p", text: "Actualmente podrá incluir, entre otros:" },
      {
        type: "bullets",
        items: [
          "Membresía Mensual.",
          "Membresía Premium.",
          "Membresías promocionales.",
          "Membresías corporativas.",
          "Nuevos planes que la empresa incorpore en el futuro.",
        ],
      },
      { type: "p", text: "Cada plan indicará claramente:" },
      {
        type: "bullets",
        items: [
          "Precio.",
          "Duración.",
          "Beneficios.",
          "Restricciones.",
          "Condiciones de renovación.",
        ],
      },
      { type: "h2", text: "5. Beneficios" },
      {
        type: "p",
        text: "Dependiendo del plan contratado, el usuario podrá acceder a beneficios como:",
      },
      {
        type: "bullets",
        items: [
          "Descuentos en servicios.",
          "Promociones exclusivas.",
          "Acumulación adicional de puntos.",
          "Acceso anticipado a campañas.",
          "Atención prioritaria.",
          "Beneficios especiales determinados por SumakApp.",
        ],
      },
      { type: "p", text: "Los beneficios podrán variar entre planes." },
      { type: "h2", text: "6. Activación" },
      {
        type: "p",
        text: "La membresía se activará una vez confirmado correctamente el pago correspondiente.",
      },
      {
        type: "p",
        text: "Mientras el pago no sea confirmado, el usuario no tendrá acceso a los beneficios del plan.",
      },
      { type: "h2", text: "7. Duración" },
      {
        type: "p",
        text: "Cada membresía tendrá la duración indicada al momento de su contratación.",
      },
      {
        type: "p",
        text: "En el caso de la Membresía Mensual, la vigencia será de treinta (30) días calendario, salvo que se indique expresamente otro período.",
      },
      { type: "h2", text: "8. Renovación" },
      {
        type: "p",
        text: "Cuando la plataforma incorpore la funcionalidad correspondiente, la membresía podrá renovarse automáticamente si el usuario así lo autoriza.",
      },
      {
        type: "p",
        text: "Si no existe renovación automática, el usuario deberá contratar nuevamente el plan una vez finalizado su período de vigencia.",
      },
      { type: "h2", text: "9. Cancelación" },
      {
        type: "p",
        text: "El usuario podrá cancelar su membresía en cualquier momento.",
      },
      {
        type: "p",
        text: "La cancelación impedirá futuras renovaciones, pero los beneficios permanecerán vigentes hasta la fecha de vencimiento del período ya pagado, salvo disposición legal en contrario.",
      },
      { type: "h2", text: "10. Reembolsos de membresías" },
      {
        type: "p",
        text: "Como regla general, los pagos realizados por membresías no serán reembolsables.",
      },
      {
        type: "p",
        text: "No obstante, SumakApp podrá aprobar un reembolso cuando:",
      },
      {
        type: "bullets",
        items: [
          "Se haya realizado un cobro por error atribuible a la empresa.",
          "La membresía no pueda ser activada por causas imputables a SumakApp.",
          "La legislación aplicable así lo exija.",
        ],
      },
      { type: "p", text: "Toda solicitud será analizada individualmente." },
      { type: "h2", text: "11. Modificación de beneficios" },
      {
        type: "p",
        text: "SumakApp podrá actualizar los beneficios, características o condiciones de las membresías por razones comerciales, operativas o legales.",
      },
      {
        type: "p",
        text: "Los cambios no afectarán retroactivamente los beneficios ya disfrutados por el usuario.",
      },
      {
        type: "p",
        text: "Cuando las modificaciones sean relevantes, la empresa informará a los usuarios mediante la aplicación, correo electrónico u otros canales oficiales.",
      },
      { type: "h2", text: "12. Uso correcto" },
      { type: "p", text: "La membresía es personal e intransferible." },
      { type: "p", text: "Está prohibido:" },
      {
        type: "bullets",
        items: [
          "Compartir beneficios con terceros cuando no esté permitido.",
          "Revender membresías.",
          "Manipular el sistema para obtener beneficios indebidos.",
          "Utilizar información falsa para acceder a promociones.",
        ],
      },
      { type: "h2", text: "13. Suspensión o cancelación" },
      {
        type: "p",
        text: "SumakApp podrá suspender o cancelar una membresía cuando el usuario:",
      },
      {
        type: "bullets",
        items: [
          "Incumpla los Términos y Condiciones.",
          "Cometa fraude.",
          "Proporcione información falsa.",
          "Realice actividades ilegales.",
          "Haga un uso abusivo de los beneficios.",
        ],
      },
      {
        type: "p",
        text: "La suspensión de la membresía podrá ir acompañada de la suspensión o eliminación de la cuenta del usuario.",
      },
      { type: "h2", text: "15. Fuerza mayor" },
      {
        type: "p",
        text: "SumakApp no será responsable por la imposibilidad temporal de utilizar una membresía cuando ello se deba a circunstancias fuera de su control, incluyendo:",
      },
      {
        type: "bullets",
        items: [
          "Desastres naturales.",
          "Cortes de energía.",
          "Interrupciones de Internet.",
          "Fallas de proveedores tecnológicos.",
          "Decisiones de autoridades competentes.",
          "Otros eventos de fuerza mayor.",
        ],
      },
      { type: "h2", text: "19. Aceptación" },
      {
        type: "p",
        text: "Al contratar una membresía en SumakApp, el usuario declara haber leído, comprendido y aceptado íntegramente esta Política de Membresías.",
      },
    ],
  },

  {
    id: "streaming",
    title: "Política de Streaming en Vivo",
    blocks: [
      { type: "h2", text: "1. Objeto" },
      {
        type: "p",
        text: "La presente Política regula el funcionamiento de la función de Streaming en Vivo disponible en SumakApp.",
      },
      {
        type: "p",
        text: "Esta funcionalidad permite al cliente visualizar, en tiempo real, la prestación del servicio de limpieza contratado, con el propósito de ofrecer mayor transparencia, confianza y seguridad durante la ejecución del servicio.",
      },
      { type: "h2", text: "2. Alcance" },
      {
        type: "p",
        text: "Esta Política aplica a todos los clientes y trabajadores que utilicen la función de Streaming en Vivo de SumakApp.",
      },
      {
        type: "p",
        text: "El uso de esta funcionalidad implica la aceptación de las disposiciones contenidas en este documento, así como de los Términos y Condiciones y la Política de Privacidad.",
      },
      { type: "h2", text: "3. Finalidad del streaming" },
      {
        type: "p",
        text: "El Streaming en Vivo tiene como único propósito permitir al cliente supervisar el desarrollo del servicio contratado.",
      },
      {
        type: "p",
        text: "La transmisión no constituye un sistema de vigilancia permanente ni un mecanismo de control laboral fuera del tiempo necesario para la prestación del servicio.",
      },
      { type: "h2", text: "4. Acceso a la transmisión" },
      {
        type: "p",
        text: "La transmisión podrá ser visualizada únicamente por:",
      },
      {
        type: "bullets",
        items: [
          "El cliente que contrató el servicio.",
          "La cuenta desde la cual se realizó la reserva.",
        ],
      },
      {
        type: "p",
        text: "Ningún otro usuario tendrá acceso a la transmisión, salvo obligación legal o requerimiento de una autoridad competente.",
      },
      { type: "h2", text: "5. Confidencialidad" },
      {
        type: "p",
        text: "Toda transmisión realizada mediante SumakApp tiene carácter privado y confidencial.",
      },
      {
        type: "p",
        text: "El acceso está restringido exclusivamente al cliente autorizado.",
      },
      {
        type: "p",
        text: "El usuario se compromete a mantener la confidencialidad de la transmisión y a utilizarla únicamente para verificar el desarrollo del servicio contratado.",
      },
      { type: "h2", text: "6. Prohibición de grabar o difundir" },
      { type: "p", text: "El cliente acepta que está prohibido:" },
      {
        type: "bullets",
        items: [
          "Grabar la transmisión utilizando aplicaciones, programas o dispositivos externos.",
          "Tomar capturas de pantalla con fines ilícitos.",
          "Compartir la transmisión con terceros no autorizados.",
          "Publicar imágenes o videos obtenidos durante la transmisión en redes sociales, plataformas digitales o cualquier otro medio.",
          "Editar el contenido para afectar la imagen, reputación o derechos del trabajador o de SumakApp.",
        ],
      },
      {
        type: "p",
        text: "Estas restricciones no limitan los derechos que puedan corresponder al usuario cuando una autoridad competente solicite información o cuando la legislación aplicable lo permita.",
      },
      { type: "h2", text: "7. Ausencia de grabaciones" },
      {
        type: "p",
        text: "SumakApp no graba, almacena ni conserva las transmisiones realizadas mediante esta funcionalidad.",
      },
      {
        type: "p",
        text: "Finalizado el servicio o cerrada la transmisión, el contenido deja de estar disponible.",
      },
      { type: "h2", text: "8. Consentimiento del personal" },
      {
        type: "p",
        text: "Todo trabajador que participe en servicios con Streaming en Vivo conoce previamente la existencia de esta funcionalidad y presta su consentimiento para aparecer en la transmisión durante la ejecución de sus labores.",
      },
      {
        type: "p",
        text: "Este consentimiento forma parte de las condiciones de prestación del servicio y se limita exclusivamente al tiempo y alcance necesarios para su ejecución.",
      },
      { type: "h2", text: "9. Consentimiento del cliente" },
      {
        type: "p",
        text: "Al activar o utilizar el Streaming en Vivo, el cliente acepta:",
      },
      {
        type: "bullets",
        items: [
          "Que la transmisión tiene una finalidad exclusivamente relacionada con el servicio contratado.",
          "Que no existe expectativa de grabación o almacenamiento por parte de SumakApp.",
          "Que utilizará la transmisión de manera responsable y conforme a esta Política.",
        ],
      },
      { type: "h2", text: "10. Disponibilidad del servicio" },
      {
        type: "p",
        text: "La función de Streaming en Vivo depende del funcionamiento de diversos servicios tecnológicos, incluyendo redes de datos, acceso a Internet y dispositivos compatibles.",
      },
      {
        type: "p",
        text: "Por ello, SumakApp no garantiza que la transmisión esté disponible de forma continua o libre de interrupciones.",
      },
      { type: "p", text: "Podrán presentarse:" },
      {
        type: "bullets",
        items: [
          "Retrasos en la transmisión.",
          "Reducción de calidad de imagen.",
          "Cortes temporales.",
          "Interrupciones del servicio.",
          "Fallas ocasionadas por terceros.",
        ],
      },
      {
        type: "p",
        text: "Debido a la naturaleza de Internet, SUMAKA no garantiza la calidad, continuidad, estabilidad ni disponibilidad permanente de la transmisión en vivo.",
      },
      {
        type: "p",
        text: "SUMAKA no será responsable por interrupciones, retrasos, pérdida de calidad, pixelación, falta de audio o video ocasionadas por redes móviles, proveedores de Internet o fallos tecnológicos.",
      },
      { type: "h2", text: "13. Usos prohibidos" },
      { type: "p", text: "Queda prohibido utilizar el Streaming para:" },
      {
        type: "bullets",
        items: [
          "Hostigar al trabajador.",
          "Amenazar al personal.",
          "Realizar comentarios discriminatorios.",
          "Difundir imágenes sin autorización.",
          "Obtener beneficios comerciales.",
          "Cometer actos ilícitos.",
          "Vulnerar derechos de terceros.",
        ],
      },
      {
        type: "p",
        text: "El incumplimiento podrá ocasionar la suspensión inmediata de la cuenta y las acciones legales correspondientes.",
      },
      { type: "h2", text: "18. Aceptación" },
      {
        type: "p",
        text: "Al utilizar la función de Streaming en Vivo de SumakApp, el usuario declara haber leído, comprendido y aceptado íntegramente esta Política.",
      },
    ],
  },

  {
    id: "usoaceptable",
    title: "Política de Uso Aceptable",
    blocks: [
      { type: "h2", text: "1. Objetivo" },
      {
        type: "p",
        text: "La presente Política de Uso Aceptable establece las normas que regulan el uso correcto de la aplicación SumakApp, con el propósito de garantizar una plataforma segura, confiable y respetuosa para clientes, trabajadores y la empresa.",
      },
      {
        type: "p",
        text: "Todo usuario que acceda o utilice SumakApp acepta cumplir las disposiciones establecidas en este documento.",
      },
      { type: "h2", text: "2. Alcance" },
      { type: "p", text: "Esta Política aplica a:" },
      {
        type: "bullets",
        items: [
          "Clientes.",
          "Usuarios registrados.",
          "Personas que soliciten servicios mediante SumakApp.",
          "Cualquier persona que utilice las funcionalidades de la aplicación.",
        ],
      },
      {
        type: "p",
        text: "Su cumplimiento es obligatorio durante todo el tiempo en que el usuario mantenga una cuenta activa o utilice los servicios de la aplicación.",
      },
    ],
  },

  {
    id: "avisolegal",
    title: "Aviso Legal y Limitación de Responsabilidad",
    blocks: [
      { type: "h2", text: "1. Objeto" },
      {
        type: "p",
        text: "El presente Aviso Legal y Limitación de Responsabilidad regula las condiciones jurídicas relacionadas con el uso de la aplicación SumakApp, propiedad de SUMAKA, y establece el alcance de las responsabilidades de la empresa frente a los usuarios.",
      },
      {
        type: "p",
        text: "Este documento forma parte integral de los Términos y Condiciones de Uso y de las demás políticas publicadas por SumakApp.",
      },
      { type: "h2", text: "2. Información legal" },
      {
        type: "bullets",
        items: [
          "Razón Social: SUMAKA",
          "Nombre Comercial: SumakApp",
          "RUC: 0195182914001",
          "Domicilio: AUTACHI DUCHICELAl, CAJAMARCA, Cuenca, Ecuador.",
          "Correo electrónico:  sumakclean@gmail.com",
          "País de operación: República del Ecuador.",
        ],
      },
      { type: "h2", text: "3. Naturaleza del servicio" },
      {
        type: "p",
        text: "SumakApp es una plataforma tecnológica mediante la cual los usuarios pueden solicitar servicios profesionales de limpieza prestados por personal contratado por SUMAKA.",
      },
      {
        type: "p",
        text: "La empresa administra la plataforma, coordina las reservas y organiza la prestación de los servicios ofrecidos.",
      },
      { type: "h2", text: "4. Disponibilidad del servicio" },
      {
        type: "p",
        text: "SUMAKA realiza esfuerzos razonables para mantener la aplicación disponible y en correcto funcionamiento.",
      },
      {
        type: "p",
        text: "Sin embargo, no garantiza que la plataforma permanezca disponible de forma ininterrumpida, ya que pueden presentarse:",
      },
      {
        type: "bullets",
        items: [
          "Mantenimientos programados.",
          "Actualizaciones del sistema.",
          "Fallas de Internet.",
          "Problemas en servicios de terceros.",
          "Cortes de energía.",
          "Errores de software.",
          "Eventos de fuerza mayor.",
        ],
      },
      {
        type: "p",
        text: "La empresa procurará restablecer el servicio en el menor tiempo posible.",
      },
      { type: "h2", text: "5. Exactitud de la información" },
      {
        type: "p",
        text: "El usuario es responsable de proporcionar información veraz, completa y actualizada.",
      },
      {
        type: "p",
        text: "SUMAKA no será responsable por errores, retrasos o inconvenientes derivados de información incorrecta suministrada por el usuario, incluyendo direcciones, números telefónicos, horarios o datos de contacto.",
      },
      { type: "h2", text: "6. Responsabilidad del usuario" },
      { type: "p", text: "El usuario será responsable de:" },
      {
        type: "bullets",
        items: [
          "Utilizar la aplicación conforme a la ley.",
          "Mantener la confidencialidad de su cuenta y contraseña.",
          "Proteger el acceso a su dispositivo.",
          "Facilitar el ingreso del personal al inmueble.",
          "Garantizar condiciones mínimas para la prestación del servicio, incluyendo agua, energía eléctrica y acceso seguro.",
          "Mantener bajo control a las mascotas.",
          "Tratar con respeto al personal de SumakApp.",
        ],
      },
      {
        type: "p",
        text: "El usuario responderá por los daños ocasionados por el incumplimiento de estas obligaciones.",
      },
      { type: "h2", text: "7. Responsabilidad de SUMAKA" },
      { type: "p", text: "SUMAKA se compromete a:" },
      {
        type: "bullets",
        items: [
          "Prestar los servicios contratados de buena fe y con diligencia razonable.",
          "Asignar personal previamente verificado y capacitado.",
          "Proteger los datos personales conforme a su Política de Privacidad.",
          "Atender las reclamaciones presentadas por los usuarios.",
          "Procurar el correcto funcionamiento de la plataforma.",
        ],
      },
      { type: "h2", text: "8. Daños durante el servicio" },
      {
        type: "p",
        text: "En caso de que el usuario considere que se produjo un daño durante la prestación del servicio, deberá comunicarlo a SumakApp a la mayor brevedad posible y aportar la información o evidencias disponibles.",
      },
      { type: "p", text: "Cada caso será investigado individualmente." },
      {
        type: "p",
        text: "La eventual responsabilidad de SUMAKA se determinará conforme a la legislación de la República del Ecuador, los hechos verificados y las pruebas disponibles.",
      },
      {
        type: "p",
        text: "SUMAKA únicamente responderá cuando se demuestre, mediante pruebas suficientes, que el daño fue causado directamente por culpa o negligencia comprobada del personal asignado durante la prestación del servicio.",
      },
      {
        type: "p",
        text: "SUMAKA no responderá por daños preexistentes, desgaste natural, defectos de fabricación, deterioro por antigüedad o materiales defectuosos.",
      },
      {
        type: "p",
        text: "Ninguna disposición de este documento limita los derechos irrenunciables que la legislación aplicable reconozca a los consumidores.",
      },
      { type: "h2", text: "9. Objetos de valor" },
      {
        type: "p",
        text: "Se recomienda al cliente guardar en un lugar seguro dinero en efectivo, joyas, documentos importantes, dispositivos electrónicos, objetos de colección y demás bienes de alto valor antes del inicio del servicio.",
      },
      {
        type: "p",
        text: "El cliente reconoce que es su responsabilidad resguardar el dinero en efectivo, las joyas, los documentos, las obras de arte, los equipos electrónicos, las colecciones y demás bienes de alto valor antes del inicio del servicio.",
      },
      {
        type: "p",
        text: "Si un usuario reporta la pérdida de un objeto, SumakApp colaborará razonablemente en la investigación interna del caso.",
      },
      {
        type: "p",
        text: "La empresa evaluará cada situación de acuerdo con las circunstancias y las evidencias disponibles.",
      },
      {
        type: "p",
        text: "SUMAKA no será responsable por pérdidas cuya existencia, estado o valor no puedan demostrarse mediante pruebas suficientes.",
      },
      { type: "h2", text: "10. Objetos frágiles y delicados" },
      {
        type: "p",
        text: "El cliente deberá informar previamente la existencia de objetos frágiles, piezas de colección, antigüedades, obras de arte, cristalería fina, equipos especializados u otros bienes que requieran una manipulación especial.",
      },
      {
        type: "p",
        text: "En caso de no informar dicha circunstancia, SUMAKA no será responsable por los daños derivados de una manipulación ordinaria realizada durante la prestación del servicio.",
      },
      { type: "h2", text: "11. Daños causados por el cliente" },
      {
        type: "p",
        text: "El cliente responderá por cualquier daño ocasionado al personal, equipos, herramientas o bienes de SUMAKA cuando dicho daño sea consecuencia de su conducta o de condiciones inseguras del inmueble.",
      },
      { type: "h2", text: "12. Límite de indemnización" },
      {
        type: "p",
        text: "En ningún caso la responsabilidad total de SUMAKA excederá el monto efectivamente pagado por el servicio objeto de la reclamación, salvo que la legislación aplicable disponga lo contrario.",
      },
      { type: "h2", text: "13. Daños indirectos" },
      {
        type: "p",
        text: "SUMAKA no será responsable por daños indirectos, lucro cesante, pérdida de ingresos, pérdida de oportunidades comerciales, pérdida de datos, daños morales o cualquier otro perjuicio consecuencial derivado del uso de la aplicación o de la prestación del servicio, salvo cuando la ley disponga expresamente lo contrario.",
      },
      { type: "h2", text: "14. Propiedad intelectual" },
      {
        type: "p",
        text: "Todos los derechos sobre la aplicación (código fuente, diseño, logotipos, marca, nombre comercial, iconografía, bases de datos, contenido propio y documentación) pertenecen a SUMAKA o a sus respectivos titulares y están protegidos por la legislación aplicable.",
      },
      {
        type: "p",
        text: "Queda prohibida su reproducción, distribución, modificación, descompilación, ingeniería inversa o cualquier uso no autorizado.",
      },
      { type: "h2", text: "15. Prohibiciones" },
      { type: "p", text: "El usuario no podrá:" },
      {
        type: "bullets",
        items: [
          "Utilizar SumakApp para actividades ilegales.",
          "Intentar acceder sin autorización a sistemas internos.",
          "Manipular el funcionamiento de la aplicación.",
          "Crear cuentas falsas.",
          "Suplantar la identidad de otras personas.",
          "Distribuir software malicioso.",
          "Realizar ataques informáticos.",
          "Obtener información mediante medios fraudulentos.",
        ],
      },
      { type: "h2", text: "16. Fallas de proveedores y terceros tecnológicos" },
      {
        type: "p",
        text: "SumakApp funciona sobre diversos servicios e infraestructuras de terceros, incluyendo, entre otros, servicios en la nube, servicios de Google y Firebase, plataformas de desarrollo como Expo, tecnologías de transmisión como WebRTC, redes móviles y servicios de acceso a Internet.",
      },
      {
        type: "p",
        text: "SUMAKA no será responsable por fallas ocasionadas por proveedores tecnológicos, redes móviles, servicios de Internet, servicios en la nube, pasarelas de pago, plataformas de terceros o interrupciones ajenas a su control.",
      },
      { type: "h2", text: "17. Fuerza mayor" },
      {
        type: "p",
        text: "SUMAKA no será responsable por retrasos, interrupciones o incumplimientos derivados de circunstancias fuera de su control razonable, incluyendo terremotos, inundaciones, incendios, epidemias o pandemias, cortes de energía eléctrica, interrupciones de Internet, accidentes, manifestaciones, decisiones de autoridades públicas, conflictos laborales y otros eventos de fuerza mayor.",
      },
      {
        type: "p",
        text: "En estos casos, la empresa procurará minimizar los efectos y reprogramar el servicio cuando resulte posible.",
      },
      { type: "h2", text: "18. Errores del usuario" },
      {
        type: "p",
        text: "SUMAKA no será responsable por pérdidas o inconvenientes ocasionados por errores del usuario, incluyendo direcciones incorrectas, datos erróneos, reservas realizadas por equivocación o uso indebido de la aplicación.",
      },
      { type: "h2", text: "20. Legislación aplicable y jurisdicción" },
      {
        type: "p",
        text: "El presente Aviso Legal se regirá por las leyes de la República del Ecuador.",
      },
      {
        type: "p",
        text: "Las controversias que no puedan resolverse de manera amistosa serán sometidas a las autoridades competentes de la ciudad de Cuenca, sin perjuicio de otros mecanismos de solución de conflictos previstos por la legislación aplicable.",
      },
      { type: "h2", text: "24. Aceptación" },
      {
        type: "p",
        text: "Al acceder, registrarse o utilizar SumakApp, el usuario declara haber leído, comprendido y aceptado íntegramente el presente Aviso Legal y Limitación de Responsabilidad.",
      },
    ],
  },

  {
    id: "consentimiento",
    title: "Consentimiento para el Tratamiento de Datos Personales",
    blocks: [
      { type: "h2", text: "1. Objeto" },
      {
        type: "p",
        text: "El presente documento tiene por objeto obtener el consentimiento libre, específico, informado e inequívoco del usuario para el tratamiento de sus datos personales por parte de SUMAKA, propietaria de la aplicación SumakApp, conforme a la legislación vigente de la República del Ecuador y, en particular, a la Ley Orgánica de Protección de Datos Personales (LOPDP).",
      },
      { type: "h2", text: "2. Responsable del tratamiento" },
      {
        type: "bullets",
        items: [
          "Razón Social: SUMAKA",
          "Nombre Comercial: SumakApp",
          "RUC: 0195182914001",
          "Dirección: AUTACHI DUCHICELAl, CAJAMARCA, Cuenca, Ecuador.",
          "Correo electrónico:  sumakclean@gmail.com",
        ],
      },
      { type: "h2", text: "3. Datos personales que podrán ser recopilados" },
      {
        type: "p",
        text: "Dependiendo de las funcionalidades utilizadas por el usuario, SumakApp podrá recopilar y tratar datos de identificación (nombre, correo, teléfono), datos de contacto (dirección del servicio, ciudad), datos de ubicación, datos relacionados con el servicio (historial de reservas, cancelaciones, calificaciones, soporte) y datos técnicos (IP, identificador del dispositivo, sistema operativo, versión de la app, registros de errores, token de notificaciones).",
      },
      { type: "h2", text: "4. Datos que no recopilamos" },
      {
        type: "p",
        text: "Actualmente SumakApp no recopila de manera obligatoria:",
      },
      {
        type: "bullets",
        items: [
          "Número de cédula.",
          "Datos de tarjetas bancarias.",
          "Contraseñas de servicios externos.",
          "Fotografías personales del usuario.",
          "Grabaciones de la cámara del dispositivo.",
          "Grabaciones del micrófono del dispositivo.",
          "Información biométrica.",
        ],
      },
      { type: "h2", text: "5. Finalidades del tratamiento" },
      {
        type: "p",
        text: "Los datos personales podrán ser tratados para las siguientes finalidades:",
      },
      {
        type: "bullets",
        items: [
          "Crear y administrar la cuenta del usuario.",
          "Gestionar reservas.",
          "Coordinar los servicios de limpieza.",
          "Verificar la ubicación del servicio.",
          "Enviar notificaciones relacionadas con reservas.",
          "Brindar soporte técnico.",
          "Mejorar la calidad del servicio.",
          "Detectar fraudes o usos indebidos.",
          "Cumplir obligaciones legales.",
          "Atender consultas y reclamaciones.",
          "Elaborar estadísticas internas utilizando información agregada o anonimizada cuando sea posible.",
        ],
      },
      { type: "h2", text: "6. Base legal del tratamiento" },
      {
        type: "p",
        text: "El tratamiento de los datos personales podrá fundamentarse, según corresponda, en el consentimiento otorgado por el usuario, la ejecución de la relación contractual derivada del uso de SumakApp, el cumplimiento de obligaciones legales y el interés legítimo de SUMAKA, siempre que no prevalezcan los derechos y libertades del usuario.",
      },
      { type: "h2", text: "10. Derechos del titular de los datos" },
      {
        type: "p",
        text: "De conformidad con la legislación ecuatoriana, el usuario podrá ejercer los siguientes derechos:",
      },
      {
        type: "bullets",
        items: [
          "Acceder a sus datos personales.",
          "Rectificar información inexacta o incompleta.",
          "Actualizar sus datos.",
          "Solicitar la eliminación de sus datos cuando sea legalmente procedente.",
          "Solicitar la limitación del tratamiento cuando corresponda.",
          "Oponerse al tratamiento en los casos previstos por la ley.",
          "Solicitar la portabilidad de sus datos cuando sea aplicable.",
          "Revocar el consentimiento otorgado, sin afectar la licitud del tratamiento realizado con anterioridad.",
        ],
      },
      { type: "h2", text: "11. Revocación del consentimiento" },
      {
        type: "p",
        text: "El usuario podrá retirar su consentimiento en cualquier momento mediante solicitud dirigida a los canales oficiales de SUMAKA.",
      },
      {
        type: "p",
        text: "La revocación no afectará la licitud del tratamiento efectuado antes de su recepción y podrá implicar la imposibilidad de continuar utilizando determinadas funcionalidades de SumakApp.",
      },
      { type: "h2", text: "13. Menores de edad" },
      {
        type: "p",
        text: "SumakApp está dirigida principalmente a personas mayores de dieciocho (18) años. Los menores de edad únicamente podrán utilizar la aplicación con la autorización y supervisión de su padre, madre o representante legal.",
      },
      { type: "h2", text: "16. Declaración de consentimiento" },
      {
        type: "p",
        text: 'Al seleccionar la opción "Acepto", registrarse o continuar utilizando SumakApp, el usuario declara que ha leído íntegramente el presente documento, comprende el alcance del tratamiento de sus datos personales, otorga su consentimiento libre, específico, informado e inequívoco para el tratamiento de sus datos conforme a las finalidades descritas, y reconoce que puede ejercer sus derechos conforme a la legislación aplicable.',
      },
      { type: "strong", text: "Texto de consentimiento para el registro" },
      {
        type: "p",
        text: '"Declaro que he leído y acepto los Términos y Condiciones, la Política de Privacidad y el presente Consentimiento para el Tratamiento de Datos Personales. Autorizo a SUMAKA a tratar mis datos personales para la creación y administración de mi cuenta, la gestión de reservas, la prestación de los servicios contratados, el envío de notificaciones relacionadas con dichos servicios y el cumplimiento de las obligaciones legales aplicables, de conformidad con la legislación vigente de la República del Ecuador."',
      },
    ],
  },

  {
    id: "clausulas",
    title: "Cláusulas Específicas para Trabajadores y Clientes",
    blocks: [
      { type: "h2", text: "1. Objeto" },
      {
        type: "p",
        text: "Las presentes cláusulas establecen los derechos, obligaciones, responsabilidades y normas de conducta aplicables a los clientes y al personal de SUMAKA durante la prestación de los servicios ofrecidos mediante SumakApp.",
      },
      {
        type: "p",
        text: "Estas disposiciones complementan los Términos y Condiciones de Uso, la Política de Privacidad y las demás políticas de la empresa.",
      },
      { type: "strong", text: "Capítulo I — Obligaciones del cliente" },
      { type: "h2", text: "3. Información veraz" },
      {
        type: "p",
        text: "El cliente deberá proporcionar información completa, exacta y actualizada al momento de crear su cuenta y reservar un servicio. La entrega de información falsa podrá ocasionar la suspensión o cancelación de la cuenta.",
      },
      { type: "h2", text: "4. Acceso al inmueble" },
      {
        type: "p",
        text: "El cliente deberá garantizar que el personal pueda ingresar al lugar donde se prestará el servicio. En caso de que no sea posible acceder al inmueble por causas imputables al cliente, podrán aplicarse las políticas de cancelación correspondientes.",
      },
      { type: "h2", text: "5. Condiciones mínimas" },
      {
        type: "p",
        text: "El cliente deberá asegurar que durante la prestación del servicio existan condiciones adecuadas para trabajar, incluyendo:",
      },
      {
        type: "bullets",
        items: [
          "Acceso seguro al inmueble.",
          "Suministro de agua.",
          "Energía eléctrica.",
          "Espacios libres de riesgos innecesarios.",
        ],
      },
      { type: "h2", text: "6. Mascotas" },
      {
        type: "p",
        text: "El cliente deberá mantener bajo control a sus mascotas durante toda la prestación del servicio. Cuando exista riesgo para la seguridad del trabajador, este podrá suspender temporalmente la limpieza hasta que desaparezca el riesgo.",
      },
      { type: "h2", text: "8. Objetos de valor y objetos delicados" },
      {
        type: "p",
        text: "Se recomienda al cliente guardar adecuadamente dinero en efectivo, joyas, documentos importantes, equipos electrónicos, objetos de colección y bienes de alto valor económico o sentimental.",
      },
      {
        type: "p",
        text: "El cliente reconoce que es su responsabilidad resguardar el dinero en efectivo, las joyas, los documentos, las obras de arte, los equipos electrónicos, las colecciones y demás bienes de alto valor antes del inicio del servicio.",
      },
      {
        type: "p",
        text: "El cliente deberá informar previamente la existencia de objetos frágiles, piezas de colección, antigüedades, obras de arte, cristalería fina, equipos especializados u otros bienes que requieran una manipulación especial. En caso de no informar dicha circunstancia, SUMAKA no será responsable por los daños derivados de una manipulación ordinaria realizada durante la prestación del servicio.",
      },
      {
        type: "p",
        text: "Si el cliente reporta la pérdida o daño de un objeto, SumakApp colaborará en la investigación correspondiente y evaluará el caso conforme a las pruebas disponibles y la legislación aplicable.",
      },
      {
        type: "p",
        text: "SUMAKA no será responsable por pérdidas cuya existencia, estado o valor no puedan demostrarse mediante pruebas suficientes.",
      },
      { type: "h2", text: "9. Trato respetuoso" },
      {
        type: "p",
        text: "El cliente deberá mantener un trato respetuoso hacia todo el personal. No se permitirá insultos, amenazas, acoso, discriminación, violencia física o verbal, ni conductas intimidatorias.",
      },
      { type: "strong", text: "Capítulo III — Obligaciones del personal" },
      { type: "h2", text: "15. Profesionalismo" },
      {
        type: "p",
        text: "Todo trabajador deberá desempeñar sus funciones con honestidad, respeto, responsabilidad, puntualidad, profesionalismo y diligencia.",
      },
      { type: "h2", text: "18. Confidencialidad" },
      {
        type: "p",
        text: "El personal deberá mantener absoluta confidencialidad respecto de la información del cliente, direcciones, códigos de acceso, rutinas del hogar, objetos observados durante el servicio e información obtenida mediante el Streaming en Vivo.",
      },
      {
        type: "p",
        text: "La obligación de confidencialidad continuará vigente incluso después de finalizar la relación laboral.",
      },
      { type: "h2", text: "20. Conducta profesional" },
      {
        type: "p",
        text: "Durante la prestación del servicio el trabajador deberá abstenerse de solicitar dinero adicional no autorizado, aceptar pagos fuera de los canales establecidos, pedir préstamos al cliente, consumir alcohol o sustancias ilícitas, fumar dentro del inmueble sin autorización y realizar actividades ajenas al servicio contratado.",
      },
      { type: "strong", text: "Capítulo IV — Responsabilidades compartidas" },
      { type: "h2", text: "23. Cooperación" },
      {
        type: "p",
        text: "Cliente y trabajador deberán colaborar de buena fe para garantizar el correcto desarrollo del servicio.",
      },
      { type: "h2", text: "25. Daños" },
      {
        type: "p",
        text: "Si durante la prestación del servicio se reporta un daño, SUMAKA realizará una investigación objetiva. La eventual responsabilidad será determinada conforme a la legislación ecuatoriana, las pruebas disponibles y los hechos verificados.",
      },
      { type: "h2", text: "32. Aceptación" },
      {
        type: "p",
        text: "Al utilizar SumakApp o prestar servicios para SUMAKA, las partes declaran haber leído, comprendido y aceptado íntegramente las presentes Cláusulas Específicas para Trabajadores y Clientes.",
      },
    ],
  },

  {
    id: "eliminacion",
    title: "Política de Eliminación de Cuenta y Datos Personales",
    blocks: [
      { type: "h2", text: "1. Objeto" },
      {
        type: "p",
        text: "La presente Política establece el procedimiento mediante el cual los usuarios de SumakApp, propiedad de SUMAKA, pueden solicitar la eliminación de su cuenta y el tratamiento que se dará a sus datos personales, de conformidad con la legislación de la República del Ecuador, en especial la Ley Orgánica de Protección de Datos Personales (LOPDP).",
      },
      { type: "h2", text: "3. Derecho a eliminar la cuenta" },
      {
        type: "p",
        text: "Todo usuario podrá solicitar la eliminación de su cuenta en cualquier momento. La eliminación de la cuenta implicará la desactivación del acceso a SumakApp y el inicio del proceso de tratamiento de los datos personales conforme a esta Política.",
      },
      { type: "h2", text: "4. Cómo solicitar la eliminación" },
      {
        type: "p",
        text: "Opción 1 — Desde la aplicación: cuando la funcionalidad esté disponible, el usuario podrá acceder a Perfil → Configuración → Eliminar cuenta. La aplicación solicitará una confirmación antes de ejecutar la eliminación.",
      },
      {
        type: "p",
        text: "Opción 2 — Correo electrónico: el usuario podrá enviar una solicitud a sumal@gmail.com indicando:",
      },
      {
        type: "bullets",
        items: [
          "Nombre completo.",
          "Correo electrónico asociado a la cuenta.",
          "Número de teléfono registrado (si corresponde).",
          "Solicitud expresa de eliminación de la cuenta.",
        ],
      },
      {
        type: "p",
        text: "SUMAKA podrá solicitar información adicional para verificar la identidad del solicitante antes de proceder.",
      },
      { type: "h2", text: "6. Datos que serán eliminados" },
      {
        type: "p",
        text: "Una vez aprobada la solicitud y finalizados los plazos legales aplicables, SUMAKA eliminará o anonimizará, según corresponda: nombre, correo electrónico, número de teléfono, dirección registrada, ubicaciones almacenadas, historial de uso cuando legalmente pueda eliminarse, token de notificaciones, información del perfil y preferencias de la cuenta.",
      },
      { type: "h2", text: "7. Datos que podrán conservarse" },
      {
        type: "p",
        text: "Determinada información podrá mantenerse durante el tiempo exigido por la legislación aplicable o cuando exista una base legal para ello, incluyendo:",
      },
      {
        type: "bullets",
        items: [
          "Registros relacionados con obligaciones tributarias o contables.",
          "Información necesaria para atender procesos judiciales o administrativos.",
          "Datos requeridos para prevenir fraudes o proteger derechos de SUMAKA o de terceros.",
          "Registros cuya conservación sea obligatoria por disposición legal.",
        ],
      },
      { type: "h2", text: "9. Efectos de la eliminación" },
      { type: "p", text: "Al eliminar la cuenta:" },
      {
        type: "bullets",
        items: [
          "El usuario perderá el acceso a SumakApp.",
          "Se eliminarán o anonimizarán los datos conforme a esta Política.",
          "Se perderán los puntos de fidelización, cupones y beneficios asociados a la cuenta, salvo disposición legal en contrario.",
          "Las membresías activas podrán darse por terminadas conforme a sus condiciones de contratación.",
          "No será posible recuperar la cuenta eliminada.",
        ],
      },
      {
        type: "p",
        text: "Si el usuario desea volver a utilizar SumakApp, deberá crear una nueva cuenta.",
      },
      { type: "h2", text: "14. Contacto" },
      {
        type: "p",
        text: "Para solicitar la eliminación de la cuenta o ejercer derechos relacionados con los datos personales, el usuario podrá comunicarse con SUMAKA (SumakApp) al correo sumal@gmail.com, Firecín Hermano Miguel, Callalarga, Cuenca, Ecuador.",
      },
      { type: "h2", text: "16. Aceptación" },
      {
        type: "p",
        text: "Al crear una cuenta y utilizar SumakApp, el usuario declara haber leído, comprendido y aceptado la presente Política de Eliminación de Cuenta y Datos Personales.",
      },
    ],
  },
];

export default legalDocs;

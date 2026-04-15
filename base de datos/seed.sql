-- ==========================================================
-- CIBERMARKETING LAB: SEED EXPANDIDO (VERSIÓN PRO)
-- Inclusión de 3-4 opciones por pregunta para mayor profundidad
-- ==========================================================

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE respuestas_usuario;
TRUNCATE TABLE simulaciones;
TRUNCATE TABLE opciones;
TRUNCATE TABLE preguntas;
TRUNCATE TABLE escenarios;
TRUNCATE TABLE usuarios;
TRUNCATE TABLE roles;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. ROLES Y USUARIOS BASE
INSERT INTO roles (id, nombre) VALUES (1, 'ADMIN'), (2, 'ESTUDIANTE'), (3, 'DOCENTE');
INSERT INTO usuarios (id, nombre_completo, correo, password, rol_id) 
VALUES (1, 'Admin Cibertec', 'admin@cibertec.edu.pe', '$2a$10$8.UnVuG9HHgffUDAlk8Kn.2NvEfW.rS3v5u70.S.N8fLw1S6v.O.', 1);

-- 2. ESCENARIOS
INSERT INTO escenarios (id, titulo, descripcion_empresa, descripcion_producto, situacion_mercado, imagen_url) VALUES 
(
    1,
    'MarketMind: El Reto de la Conversión Digital', 
    'MarketMind es una startup peruana de analítica predictiva B2B para PYMES en crecimiento.', 
    'Plataforma SaaS con dashboards de IA que optimizan el retorno de inversión publicitaria.', 
    'Con 10,000 usuarios en Free Trial, el objetivo es duplicar la tasa de conversión en 3 meses.',
    'assets/scenarios/marketmind.png'
),
(
    2,
    'Yachay-Tech: Innovación con Sello Peruano',
    'Yachay-Tech busca cerrar la brecha digital con tecnología diseñada específicamente para la realidad geográfica del Perú.',
    'Tablet "Kallpa": Carcasa reforzada, batería de 20 horas e incluye el "Yachay-Hub" con contenido educativo precargado.',
    'Tras un año, la marca Kallpa es vista como "económica". El reto es elevar su posicionamiento hacia "Alta Tecnología Educativa".',
    'assets/scenarios/kallpa_tablet.png'
);

-- 3. PREGUNTAS (8 por escenario)
INSERT INTO preguntas (id, escenario_id, fase, sub_fase, enunciado, orden) VALUES 
-- ESCENARIO 1: MARKETMIND
(1, 1, 1, 'Análisis A', 'Investigación UX: ¿Qué método usarás para identificar por qué los usuarios abandonan el registro?', 1),
(2, 1, 1, 'Análisis B', 'Investigación de Mercado B2B: ¿Cómo identificarás las necesidades reales de los gerentes de PYMES?', 2),
(3, 1, 1, 'Análisis C', 'Métricas de Valor: ¿Cómo validarás si el precio actual de la suscripción es aceptado por el mercado?', 3),
(4, 1, 2, 'Persona Hijo', 'Perfil "Analista Junior" (Influenciador): ¿Cuál es su principal motivación para usar MarketMind?', 4),
(5, 1, 2, 'Persona Padre', 'Perfil "Gerente General" (Decisor): ¿Qué factor le da seguridad para invertir en tecnología SaaS?', 5),
(6, 1, 3, 'Eje Precio/Calidad', 'Matriz de Posicionamiento: Define el equilibrio estratégico entre Precio y Valor percibido:', 6),
(7, 1, 3, 'Eje Innovación', 'Matriz de Posicionamiento: ¿En qué característica de IA te enfocarás para diferenciarte?', 7),
(8, 1, 3, 'Eje Prestigio', 'Matriz de Posicionamiento: ¿Cómo quieres que el mercado perciba la marca MarketMind?', 8),

-- ESCENARIO 2: YACHAY-TECH
(9, 2, 1, 'Análisis A', 'Investigación de Estímulos: ¿Qué herramienta usarás para ver cómo los estudiantes usan la tablet en zonas sin internet?', 9),
(10, 2, 1, 'Análisis B', 'Influencia Social: ¿Qué instrumento aplicaremos para entender la recomendación "boca a boca" en comunidades altoandinas?', 10),
(11, 2, 1, 'Análisis C', 'Actitudes frente a lo nacional: ¿Cómo mediremos la barrera psicológica de "Si es peruano es barato"?', 11),
(12, 2, 2, 'Persona Hijo', 'Buyer Persona "Estudiante Digital": ¿Cuál es su miedo principal respecto a la tecnología?', 12),
(13, 2, 2, 'Persona Padre', 'Buyer Persona "Padre de Familia": ¿Por qué decidiría comprar Kallpa en vez de una marca global?', 13),
(14, 2, 3, 'Eje Precio/Calidad', 'Posicionamiento Estratégico: ¿Cómo manejaremos el precio frente a la competencia importada?', 14),
(15, 2, 3, 'Eje Innovación', 'Posicionamiento Estratégico: ¿Cuál será nuestro diferencial tecnológico inclusivo?', 15),
(16, 2, 3, 'Eje Prestigio', 'Posicionamiento Estratégico: ¿Cómo elevaremos el valor emocional de la marca?', 16);

-- 4. OPCIONES EXPANDIDAS
INSERT INTO opciones (pregunta_id, texto_opcion, feedback, puntos, es_mejor_opcion, resultado) VALUES 
-- MarketMind Q1
(1, 'Auditoría de Mapas de Calor (Hotjar)', 'Detectas que el 70% de los usuarios intenta hacer clic en una imagen que no es un botón.', 3.0, TRUE, 'Hallazgo: Hay una confusión visual severa en el flujo de registro que causa deserción.'),
(1, 'Encuesta de Satisfacción Post-Registro', 'No obtendrás datos de quienes se fueron, solo de quienes ya compraron.', 1.0, FALSE, 'Hallazgo: Tu muestra está sesgada; ignoras a los 10,000 usuarios que abandonan.'),
(1, 'A/B Testing de la Landing Page', 'Bueno para optimizar colores, pero no explica por qué se van.', 2.0, FALSE, 'Hallazgo: La tasa de conversión sube 2%, pero el abandono estructural persiste.'),
(1, 'Análisis de Embudo de Conversión (Drop-off)', 'Identificas que el paso 3 del formulario es el cuello de botella.', 2.5, FALSE, 'Hallazgo: El campo "Tarjeta de Crédito" es la principal razón de abandono.'),

-- MarketMind Q2
(2, 'Entrevistas en Profundidad con CEOs', 'Descubres que les preocupa más el ahorro de tiempo que el ahorro de dinero.', 3.0, TRUE, 'Hallazgo: El mensaje comercial debe enfocarse en "Productividad" y no solo en "Tecnología".'),
(2, 'Encuestas Masivas por Email', 'Baja tasa de respuesta y respuestas superficiales.', 1.5, FALSE, 'Hallazgo: Los gerentes no llenan encuestas largas; prefieren conversaciones directas.'),
(2, 'Grupos Focales con Analistas', 'Obtienes datos técnicos pero no de poder de decisión de compra.', 2.0, FALSE, 'Hallazgo: El analista ama la herramienta, pero el jefe no entiende el presupuesto.'),

-- MarketMind Q3
(3, 'Test de Precio Van Westendorp', 'Identificas que el punto óptimo es $49/mes, superior a tu costo base.', 3.0, TRUE, 'Hallazgo: Tienes margen para subir el precio percibido si añades soporte personalizado.'),
(3, 'Benchmark de Precios Globales', 'Copiamos a la competencia sin considerar el mercado local.', 1.5, FALSE, 'Hallazgo: El cliente peruano siente que el precio es "muy premium" para su realidad.'),
(3, 'Entrevistas de Disposición de Pago', 'Datos cualitativos de alto valor pero costosos de obtener.', 2.5, FALSE, 'Hallazgo: El 80% pagaría si la plataforma se integrara con Sunat.'),

-- MarketMind Q4 (FASE 2)
(4, 'Reconocimiento y Estatus Profesional', 'Quiere presentar reportes "premium" a sus jefes sin esfuerzo técnico.', 2.5, TRUE, 'Perfil: El impulsor busca brillar ante gerencia mediante la automatización.'),
(4, 'Ahorro de Esfuerzo Operativo', 'Busca no tener que limpiar archivos Excel manualmente.', 1.5, FALSE, 'Perfil: Valora la utilidad pura, pero no empujará la compra corporativa.'),
(4, 'Miedo a ser Reemplazado por IA', 'Ve a la herramienta como un aliado para actualizarse.', 2.0, FALSE, 'Perfil: El adopción es alta por necesidad de supervivencia laboral.'),

-- MarketMind Q5
(5, 'Retorno de Inversión (ROI) Garantizado', 'Desea ver cómo cada dólar invertido se traduce en leads calificados.', 3.0, TRUE, 'Perfil: El decisor firma si la demo muestra ahorro real en su inversión actual.'),
(5, 'Seguridad de Datos y Cumplimiento', 'Le preocupa que los datos de sus clientes salgan del país.', 2.0, FALSE, 'Perfil: Un factor de bloqueo técnico, mas no un disparador de compra.'),
(5, 'Escalabilidad del Negocio', 'Quiere saber si MarketMind lo acompañará cuando crezca.', 2.5, FALSE, 'Perfil: Valora la visión a largo plazo por encima de la oferta inmediata.'),

-- MarketMind Q6 (FASE 3)
(6, 'Excelencia Tecnológica vs. Accesibilidad', 'MarketMind se posiciona como "La IA más potente al mejor precio".', 3.0, TRUE, 'Eje: Rompe el estigma de que la alta tecnología es inalcanzable.'),
(6, 'Soporte Cercano vs. Globalidad', 'Enfoque en "Acompañamiento Local" frente a gigantes globales.', 2.5, FALSE, 'Eje: El cliente valora hablar con un experto en su mismo idioma.'),
(6, 'Simplicidad vs. Robustez', 'Posicionamiento como la herramienta más fácil de configurar del mundo.', 2.0, FALSE, 'Eje: Atrae a usuarios no técnicos pero limita el uso avanzado.'),

-- Escenario 2: Yachay-Tech
(9, 'Etnografía en el Hogar Rural', 'Observas que los niños usan la tablet como linterna y radio mientras estudian.', 3.0, TRUE, 'Hallazgo: La multifuncionalidad es vital en zonas con cortes de energía.'),
(9, 'Sesiones de Co-creación con Niños', 'Ideas creativas para nuevas funciones de la app Hub.', 2.5, FALSE, 'Hallazgo: El juego es el principal motor de aprendizaje autónomo.'),
(9, 'Test de Resistencia en Terreno', 'Pruebas caídas y exposición al polvo y humedad.', 2.0, FALSE, 'Hallazgo: El hardware reforzado es el factor más valorado por los padres.'),

(10, 'Sondeo de Grupos de Referencia (Docentes)', 'El profesor es el validador máximo de la tecnología educativa.', 3.0, TRUE, 'Hallazgo: Si el docente confía en Kallpa, el padre libera el presupuesto familiar.'),
(10, 'Entrevistas a Líderes Comunales', 'Influencia política sobre la adopción tecnológica.', 2.0, FALSE, 'Hallazgo: Los convenios locales aceleran la distribución masiva.'),
(10, 'Test de Influencia de Pares (Amigos)', 'El deseo de tener lo que el vecino tiene.', 1.5, FALSE, 'Hallazgo: El estatus social es un motor secundario frente a la utilidad.'),

(11, 'Cata de Productos "Blind-Brand"', 'Comparan Kallpa con marcas globales sin saber cuál es cuál.', 3.0, TRUE, 'Hallazgo: Al eliminar el logo, el usuario valora a Kallpa un 40% más.'),
(11, 'Diferencial Semántico (Orgullo Local)', 'Asociación de la marca con valores patrios y éxito.', 2.5, FALSE, 'Hallazgo: El sentimiento nacionalista es fuerte pero volátil.'),

(12, 'Miedo a la Exclusión Digital', 'Teme que su educación sea inferior a la de un joven de ciudad.', 2.5, TRUE, 'Perfil: El estudiante busca herramientas que igualen sus oportunidades.'),
(12, 'Deseo de Entretenimiento Moderno', 'Quiere acceder a apps y juegos de tendencia.', 1.5, FALSE, 'Perfil: Se frustra si la tablet está muy restringida por el sistema educativo.'),
(12, 'Aspiración de Liderazgo Comunal', 'Quiere usar la tecnología para ayudar a su familia y comunidad.', 2.0, FALSE, 'Perfil: Un motivador altruista muy fuerte en zonas rurales.'),

(13, 'Inversión en el Futuro Profesional', 'Prefiere comprar Kallpa que un smartphone de moda para su hijo.', 3.0, TRUE, 'Perfil: El padre ve la tablet como un libro digital infinito y una inversión segura.'),
(13, 'Facilidad de Uso para Adultos', 'Quiere que él también pueda usarla para trámites o noticias.', 2.0, FALSE, 'Perfil: El uso compartido familiar expande el valor percibido del producto.'),

(16, 'Soberanía Tecnológica Regional', 'Orgullo de usar tecnología diseñada en tu propio país.', 3.0, TRUE, 'Eje: Convierte la compra en un acto de identidad y progreso.'),
(16, 'Herramienta de Trabajo Genérica', 'Solo una tablet más.', 1.0, FALSE, 'Eje: No genera lealtad de marca.'),
(16, 'Tecnología Ética y Sostenible', 'Enfoque en el bajo impacto ambiental del ensamblaje local.', 2.5, FALSE, 'Eje: Atrae a un nicho consciente pero menos masivo.'),

(14, 'Premium Nacional accesible', 'Pagar un poco más por lo mejor hecho en Perú.', 3.0, TRUE, 'Eje: Rompe el estigma de "lo nacional es barato".'),
(15, 'Ecosistema Educa-Hub Exclusivo', 'Foco en el contenido que ninguna otra tablet tiene.', 3.0, TRUE, 'Eje: El software es la ventaja competitiva real.'),

-- Completando Opciones faltantes para coherencia total
INSERT INTO opciones (pregunta_id, texto_opcion, feedback, puntos, es_mejor_opcion, resultado) VALUES 
(7, 'Predictibilidad Máxima de Conversión', 'Enfoque total en el algoritmo de IA.', 3.0, TRUE, 'Eje: Nos diferencia por precisión frente a dashboards simples.'),
(7, 'Fácil Integración (Un Click)', 'Enfoque en conectar con Facebook/Google.', 2.0, FALSE, 'Eje: Es un "must", pero no una ventaja única.'),
(7, 'Visualización de Datos Futurista', 'Estética impactante y animada.', 1.5, FALSE, 'Eje: Lo visual atrae, pero la IA convence.'),
(8, 'Líder en Inteligencia PYME', 'Ser la marca de referencia en analítica local.', 3.0, TRUE, 'Eje: El prestigio se construye con resultados regionales.'),
(8, 'Opción Low-Cost Digital', 'La alternativa más económica del mercado.', 1.0, FALSE, 'Eje: Daña el margen y la percepción de calidad.');

COMMIT;
SET SQL_SAFE_UPDATES = 1;

-- Limpieza Final
DELETE FROM simulaciones;
DELETE FROM respuestas_usuario;

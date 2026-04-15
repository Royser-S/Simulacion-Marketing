-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS simulador_marketing;
USE simulador_marketing;

-- 1. TABLA DE ROLES
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL -- 'ADMIN' (Profesor/Admin) y 'ESTUDIANTE'
);

-- 2. TABLA DE USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre_completo VARCHAR(150) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL, -- Validación @cibertec.edu.pe 
    password VARCHAR(255) NOT NULL,
    rol_id BIGINT,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- 3. TABLA DE ESCENARIOS (Contexto Yachay Tech)
CREATE TABLE IF NOT EXISTS escenarios (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(100),
    descripcion_empresa TEXT,
    descripcion_producto TEXT,
    situacion_mercado TEXT,
    imagen_url TEXT -- Ruta de la imagen promocional
);

-- 4. TABLA DE PREGUNTAS (Fases de la simulación)
CREATE TABLE IF NOT EXISTS preguntas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    escenario_id BIGINT,
    fase INT, -- Fase 1, 2 o 3
    sub_fase VARCHAR(50), -- Ej: 'Análisis A', 'Hijo', etc.
    enunciado TEXT,
    orden INT, -- Para manejar el flujo secuencial
    FOREIGN KEY (escenario_id) REFERENCES escenarios(id)
);

-- 5. TABLA DE OPCIONES (Decisiones estratégicas)
CREATE TABLE IF NOT EXISTS opciones (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    pregunta_id BIGINT,
    texto_opcion TEXT,
    feedback TEXT, -- Explicación de la consecuencia 
    puntos DECIMAL(5,2), -- De +0.5 a +3
    es_mejor_opcion BOOLEAN DEFAULT FALSE, -- Para mostrar "la mejor estrategia" al final
    metadata_visual TEXT, -- Para matrices 2x2 u otros visuales (JSON)
    resultado TEXT, -- Para los hallazgos tras la retroalimentación
    FOREIGN KEY (pregunta_id) REFERENCES preguntas(id)
);

-- 6. TABLA DE SIMULACIONES (Progreso del estudiante)
CREATE TABLE IF NOT EXISTS simulaciones (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    usuario_id BIGINT,
    escenario_id BIGINT,
    puntaje_total DECIMAL(5,2) DEFAULT 0,
    estado VARCHAR(20), -- 'EN_PROGRESO', 'FINALIZADO' 
    orden_preguntas TEXT, -- Secuencia aleatoria de IDs (ej: "5,2,10...")
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (escenario_id) REFERENCES escenarios(id)
);

-- 7. TABLA DE RESPUESTAS_USUARIO (Historial de decisiones)
CREATE TABLE IF NOT EXISTS respuestas_usuario (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    simulacion_id BIGINT,
    pregunta_id BIGINT,
    opcion_id BIGINT,
    FOREIGN KEY (simulacion_id) REFERENCES simulaciones(id),
    FOREIGN KEY (pregunta_id) REFERENCES preguntas(id),
    FOREIGN KEY (opcion_id) REFERENCES opciones(id)
);

-- Inserción de roles básicos
INSERT INTO roles (nombre) VALUES ('ADMIN'), ('ESTUDIANTE'), ('DOCENTE');

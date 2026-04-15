# CiberMarketing Lab: Simulador de Consultoría Estratégica 🚀

![Cibertec Logo](frontend/src/assets/cibertec-logo.png)

## 📋 Descripción del Proyecto
CiberMarketing Lab es una plataforma interactiva de simulación educativa diseñada para estudiantes de marketing. El sistema permite a los usuarios actuar como consultores senior, tomando decisiones basadas en datos para resolver desafíos de negocio en tiempo real. 

Este proyecto fue desarrollado bajo una arquitectura **Full-Stack** moderna, integrando un motor de lógica en Spring Boot y una interfaz premium en Angular 18.

---

## 🏗️ Arquitectura y Estructura de Carpetas

### 📂 Root (T2_CIB)
Contiene la orquestación general de los dos grandes bloques del sistema.

*   `backend/`: Núcleo de procesamiento y API REST.
*   `frontend/`: Interfaz de usuario interactiva.
*   `base de datos/`: Scripts SQL para la estructura (`schema.sql`) y contenido estratégico (`seed.sql`).

---

### 📂 Backend (`/backend/proyecto/proyecto`)
Desarrollado con **Java 17** y **Spring Boot**. Utiliza una arquitectura por capas (Controller-Service-Repository).

*   `src/main/java/com/cibertec/proyecto/`:
    *   `controller/`: Endpoints de la API (Simulación, Usuarios, Escenarios).
    *   `service/`: Lógica de negocio (Cálculo de puntajes, flujo de Blueprint).
    *   `model/`: Entidades JPA (Preguntas, Opciones, Respuestas).
    *   `dto/`: Objetos de transferencia de datos para comunicación segura con el frontend.
    *   `repository/`: Interfaces para persistencia de datos con JPA/Hibernate.
*   `resources/application.properties`: Configuración de acceso a la base de datos y servidor.

---

### 📂 Frontend (`/frontend`)
Desarrollado con **Angular 18+**, priorizando la velocidad y una estética premium.

*   `public/assets/scenarios/`: Almacena artes institucionales generados por IA para cada caso de estudio.
*   `src/app/components/`:
    *   `dashboard/`: Vista principal multiescenario.
    *   `simulation/`: El motor de juego (Muestra preguntas, feedback y resultados).
    *   `auth/`: Gestión de login y registro.
*   `src/app/services/`: Comunicación con el backend mediante `HttpClient`.
*   `src/styles.css`: Definición del sistema de diseño (Colores institucionales, tipografía Inter, efectos Glassmorphism).

---

## 🛠️ Tecnologías Utilizadas

*   **Backend**: Spring Boot 3, Spring Data JPA, Hibernate, MySQL, Lombok.
*   **Frontend**: Angular 18, Bootstrap 5 (Layout), Animate.css, html2canvas (para reportes).
*   **Diseño**: Vanilla CSS, Google Fonts (Inter), Iconos de Bootstrap.

---

## 🚀 Guía de Instalación y Uso

### 1. Base de Datos
1.  Crear una base de datos en MySQL llamada `t2_cib`.
2.  Ejecutar el archivo `base de datos/schema.sql` para crear las tablas.
3.  Ejecutar `base de datos/seed.sql` para cargar el contenido estratégico del Sprint 2.

### 2. Ejecutar Backend
1.  Abrir la carpeta `backend/proyecto/proyecto` en tu IDE favorito.
2.  Asegurarse de que `application.properties` tenga tus credenciales de MySQL correctamente configuradas.
3.  Ejecutar la clase `ProyectoApplication.java`. El servidor iniciará en `http://localhost:8080`.

### 3. Ejecutar Frontend
1.  Abrir una terminal en la carpeta `frontend/`.
2.  Instalar dependencias: `npm install`.
3.  Iniciar el servidor: `npm start` (o `ng serve`).
4.  Acceder a `http://localhost:4200`.

---

## 🎯 Objetivo de la T2 (Sprint 2)
Este entregable (`HU05-HU08`) valida el flujo completo de:
1.  Identificación del perfil del consultor.
2.  Ejecución de un **Blueprint de 8 decisiones**.
3.  Retroalimentación en tiempo real (Feedback táctico).
4.  Generación de reporte de resultados con puntaje basado en la estrategia.

---

## 👨‍💻 Autores
*   Equipo de Proyecto Integrador - Cibertec.

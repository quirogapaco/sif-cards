# Matriz Maestra de Requerimientos y Roadmap de Implementación — Plataforma SIF

---

## 1. Análisis de Arquitectura de Base de Datos y Propuesta de Ajustes

Revisando el esquema relacional actual y los objetivos operativos, se identifican dos aspectos estructurales críticos:

### A. Gestión de Membresías y Facturación (TOMAR COMO SUGERENCIA, LA IDEA ES DEFINIR UNA ESTRUCTURA DE BD QUE NOS PERMITA DEFINIR MEMBRESIAS POR USUARIOS O A PERFILES PARA LLEVAR TRAZABILIDAD DE COBROS TIEMPOS,ETC)

Actualmente, el estado de vigencia reside de forma plana en `profiles.subscription_status`, `activated_at` y `expires_at`.

* **Problema:** Si un usuario renueva su suscripción anual, se sobreescribe la fecha sin dejar trazabilidad contable, historial de pagos, comprobantes ni transacciones pasadas.
* **Solución Arquitectónica:** Mantener `subscription_status` y `expires_at` en `profiles` como campos de consulta rápida (caché operativo para el resolver), pero añadir una tabla relacional `subscriptions` o `membership_renewals`:
* `id` (UUID)
* `profile_id` (UUID, FK)
* `org_id` (UUID, FK, nullable para renovaciones corporativas)
* `amount` (NUMERIC)
* `currency` (VARCHAR, e.g., 'USD')
* `payment_method` (VARCHAR: 'transferencia', 'efectivo', 'tarjeta', 'stripe')
* `period_start` (TIMESTAMPTZ)
* `period_end` (TIMESTAMPTZ)
* `status` (VARCHAR: 'paid', 'pending', 'cancelled')
* `notes` / `receipt_url` (TEXT)
* `created_at` (TIMESTAMPTZ)



### B. Matriz de Control de Acceso Basado en Roles (RBAC)

El sistema debe segmentar el acceso en 3 niveles de autorización:

| Módulo / Vista | `superadmin` | `org_admin` | `user` (Final) |
| --- | --- | --- | --- |
| **Lotes y Fábrica de Hardware** | Acceso Total (CRUD + CSV) | Sin acceso | Sin acceso |
| **Directorio de Organizaciones** | Acceso Total | Solo lectura/edición de su propia Org | Sin acceso |
| **Gestión de Usuarios** | Todos los usuarios del sistema | Solo usuarios de su organización | Sin acceso |
| **Inventario de Tarjetas** | Todas las tarjetas del sistema | Solo tarjetas asignadas a su Org | Sus tarjetas vinculadas |
| **Gestión de Perfiles** | Todos los perfiles | Solo perfiles de sus colaboradores | Su propio perfil |
| **Finanzas / Renovaciones** | Facturación global y alertas | Estado de pago de sus licencias B2B | Estado de su suscripción |
| **Analíticas** | Métricas agregadas de plataforma | Métricas agregadas de su Org | Telemetría de su perfil |

---

## 2. Checklist Técnico de Funcionalidades

### Fase I: Núcleo Operativo, Tarjetas y Resolución (Completado)

* [x] **REQ-CORE-001: Esquema de Datos e Integridad Referencial**
* *Descripción:* El sistema debe modelar y ejecutar en PostgreSQL las entidades `users`, `organizations`, `batches`, `cards`, `profiles` y `analytics` con sus restricciones de clave foránea y unicidad correspondientes.


* [x] **REQ-CORE-002: Generación Transaccional de Lotes y Tarjetas**
* *Descripción:* El sistema debe proveer una función RPC en base de datos (`create_batch_with_cards`) que cree un lote y despache de forma atómica de 1 a 1000 registros de tarjetas con tokens aleatorios no colisionables y rutas relativas.


* [x] **REQ-CORE-003: Exportación Masiva para Imprenta**
* *Descripción:* El sistema debe generar archivos CSV en memoria formateados con número de serie, tipo de tarjeta y URL absoluta final (`[https://sif.link/](https://sif.link/)...`) listos para el fabricante de PVC/NFC.


* [x] **REQ-CORE-004: Autenticación Multi-proveedor**
* *Descripción:* El sistema debe permitir el inicio de sesión y registro mediante correo electrónico con contraseña y autenticación social mediante Google OAuth mediante un componente modal reutilizable.


* [x] **REQ-CORE-005: Motor de Doble Tematización (Two-Scope Theming)**
* *Descripción:* El sistema debe desacoplar los estilos de la plataforma administrativa (`sif-*`) de los estilos inyectados a las tarjetas digitales (`card-*`), activando dinámicamente el tema mediante el atributo DOM `data-card-theme`.


* [x] **REQ-CORE-006: Resolutor Físico de Tarjetas (Card Resolver)**
* *Descripción:* El sistema debe interceptar los escaneos en `/t/:token` y `/:prefix/:token`, resolver su estado físico (`inactive`, `active`, `blocked`) y el ciclo de vida de la membresía del perfil asociado, bifurcando la navegación según corresponda.


* [x] **REQ-CORE-007: Visualizador de Perfil Digital Base**
* *Descripción:* El sistema debe maquetar de forma modular el perfil público incorporando banner, avatar, accesos directos de contacto, enlaces sociales, biografía, idiomas, historial educativo y generación dinámica de archivo `.vcf`.


* [x] **REQ-CORE-008: Telemetría Silenciosa y Recolección de Métricas**
* *Descripción:* El sistema debe registrar eventos asíncronos y no bloqueantes en la tabla `analytics` para rastreo de accesos por toque NFC, vistas web, clics a canales de contacto, descarga de vCard y visitas a redes sociales.


* [x] **REQ-CORE-009: Asistente de Onboarding y Activación**
* *Descripción:* El sistema debe guiar al comprador de una tarjeta virgen a autenticarse, completar sus datos profesionales (`ProfileData`), seleccionar una paleta de color con previsualización en vivo y activar el hardware atómicamente.



---

### Fase II: Módulo Administrativo Superadmin

#### Módulo: Fábrica, Lotes y Tarjetas (Ampliación Operativa)

* [ ] **REQ-ADM-001: Reasignación y Vinculación Manual de Tarjetas**
* *Descripción:* El sistema debe permitir a un administrador transferir una tarjeta activa de un usuario/perfil a otro, desvincularla para dejarla inactiva nuevamente, o asignarla de forma forzada sin pasar por el flujo de onboarding.


* [ ] **REQ-ADM-002: Gestión de Estado Físico y Baneo de Tarjetas**
* *Descripción:* El sistema debe proporcionar controles directos para cambiar el estado de cualquier tarjeta entre `active`, `inactive` y `blocked` (por pérdida, robo o falta de pago), impidiendo la resolución del perfil público en tiempo real.


* [ ] **REQ-ADM-003: Asignación de Lotes a Organizaciones**
* *Descripción:* El sistema debe permitir asociar un lote existente o un subconjunto de tarjetas a una organización B2B específica, actualizando su `org_id` y su `url_prefix`.



#### Módulo: Directorio de Usuarios y Cuentas

* [ ] **REQ-ADM-004: Directorio Maestro de Usuarios con Tablas Expandibles**
* *Descripción:* El sistema debe mostrar una tabla paginada de todos los usuarios registrados en `users`, reflejando: Nombre/Email, Rol (`superadmin`, `org_admin`, `user`), Organización vinculada, Total de tarjetas asociadas y Total de perfiles creados.


* [ ] **REQ-ADM-005: Sub-tablas Anidadas de Recursos por Usuario**
* *Descripción:* El sistema debe permitir desplegar la fila de cada usuario (Accordion Row) para visualizar directamente sus tarjetas vinculadas (con serial y token) y sus perfiles creados (con slug y estado), incluyendo enlaces directos para navegar hacia la gestión de cada recurso.


* [ ] **REQ-ADM-006: Gestión de Cuentas (Creación, Cambio de Rol y Suspensión)**
* *Descripción:* El sistema debe permitir a un superadmin crear usuarios manualmente, modificar su rol operativo (`user` ↔ `org_admin` ↔ `superadmin`), vincularlos a una organización y suspender temporalmente el acceso a la plataforma.



#### Módulo: Directorio Corporativo (Organizaciones B2B)

* [ ] **REQ-ADM-007: Directorio y Gestión de Organizaciones**
* *Descripción:* El sistema debe listar las organizaciones creadas, mostrando logotipo, nombre comercial, slug corporativo, total de usuarios vinculados y tarjetas asignadas.


* [ ] **REQ-ADM-008: Creación y Edición de Entornos B2B**
* *Descripción:* El sistema debe proveer un modal/formulario para crear organizaciones definiendo nombre, logotipo corporativo, colores primarios institucionales y ajustes dentro del campo `settings` (JSONB).


* [ ] **REQ-ADM-009: Navegación Relacional Organización ➔ Usuarios**
* *Descripción:* El sistema debe permitir hacer clic en una organización para redirigir al módulo de usuarios aplicando un filtro automático por dicho `org_id`.



#### Módulo: Finanzas, Suscripciones y Renovaciones

* [ ] **REQ-ADM-010: Registro Histórico de Pagos y Membresías**
* *Descripción:* El sistema debe implementar la tabla `subscriptions` / `membership_renewals` para registrar cada cobro anual, método de pago, monto, fecha de inicio y vencimiento.


* [ ] **REQ-ADM-011: Panel de Control de Renovaciones Anuales**
* *Descripción:* El sistema debe clasificar los perfiles y organizaciones en 4 cuadrantes: *Al día*, *Por vencer (próximos 30 días)*, *En período de gracia* y *Vencidos/Suspendidos*.


* [ ] **REQ-ADM-012: Acción Rápida de Renovación Manual**
* *Descripción:* El sistema debe permitir a un administrador registrar un pago (transferencia/efectivo) y extender automáticamente la fecha `expires_at` del perfil por un año adicional, cambiando el estado a `active`.


* [ ] **REQ-ADM-013: Exportación de Reportes Financieros**
* *Descripción:* El sistema debe permitir exportar a CSV/Excel el historial de cobros y proyecciones de renovaciones del mes.



#### Módulo: Catálogo de Perfiles y Plantillas

* [ ] **REQ-ADM-014: Directorio Global de Perfiles Digitales**
* *Descripción:* El sistema debe listar todos los perfiles de la base de datos indicando slug, titular, plantilla activa, paleta de colores, estado de membresía y tarjeta asignada.


* [ ] **REQ-ADM-015: Edición Centralizada de Perfiles**
* *Descripción:* El sistema debe reutilizar el formulario `ProfileForm` dentro del panel de administración para permitir a los administradores editar cualquier campo de `data` (JSONB), avatar, banner o tema de un perfil sin requerir la contraseña del usuario.


* [ ] **REQ-ADM-016: Arquitectura Multi-Plantilla (Template Selector)**
* *Descripción:* El sistema debe desacoplar el componente de renderizado del perfil para soportar diferentes maquetaciones (`standard_bcard`, `minimal_executive`, `creative_portfolio`) según el valor de `profiles.template_type`.



#### Módulo: Dashboard Global Superadmin

* [ ] **REQ-ADM-017: Resumen Ejecutivo de Métricas Globales**
* *Descripción:* El sistema debe consolidar en la vista principal:
* Total de tarjetas producidas, activas en la calle y vírgenes en bodega.
* Total de usuarios activos y clientes corporativos (Orgs).
* Ingresos proyectados por renovaciones anuales del mes corriente.




* [ ] **REQ-ADM-018: Gráficos de Telemetría Global**
* *Descripción:* El sistema debe graficar la interacción acumulada en toda la red de tarjetas (Taps NFC vs. Escaneos QR vs. Descargas de Contacto) en períodos de tiempo seleccionables (7 días, 30 días, anual).



#### Módulo: Configuración Global y Marca Blanca (Settings)

* [ ] **REQ-ADM-019: Gestión de Parámetros del Sistema**
* *Descripción:* El sistema debe permitir configurar la duración del período de gracia (días de tolerancia tras vencimiento), costos estándar de membresías anuales y enlaces oficiales de soporte.


* [ ] **REQ-ADM-020: Configuración de Branding Global**
* *Descripción:* El sistema debe permitir actualizar desde la interfaz los recursos visuales del App Shell (logotipo dorado, plateado, favicons y textos legales de la plataforma).



---

### Fase III: Paneles Especializados por Rol (RBAC)

#### Vista: Panel de Administrador de Organización (`org_admin`)

* [ ] **REQ-ORG-001: Tablero de Control Corporativo**
* *Descripción:* El sistema debe mostrar al administrador de empresa únicamente las estadísticas de su organización: número de colaboradores activos, tarjetas entregadas y total de interacciones comerciales de su equipo.


* [ ] **REQ-ORG-002: Gestión de Empleados y Perfiles Corporativos**
* *Descripción:* El sistema debe permitir al `org_admin` dar de alta a sus colaboradores, asignarles tarjetas de su lote B2B y estandarizar la información institucional (empresa, logo, teléfonos de oficina).


* [ ] **REQ-ORG-003: Estado de Facturación del Contrato Corporativo**
* *Descripción:* El sistema debe mostrar el número de licencias corporativas contratadas, fecha de corte anual del lote y opción de solicitar más tarjetas.



#### Vista: Panel del Usuario Final (`user`)

* [ ] **REQ-USR-001: Mi Perfil Digital (Autogestión)**
* *Descripción:* El sistema debe permitir al cliente final editar toda su información profesional, cambiar sus redes sociales, enlaces, temas y sustituir su avatar/banner mediante una interfaz optimizada para dispositivos móviles.


* [ ] **REQ-USR-002: Panel Personal de Analíticas**
* *Descripción:* El sistema debe mostrar al usuario un resumen del impacto de su tarjeta: cuántas personas tocaron su tarjeta NFC, cuántas guardaron su vCard y qué canales de contacto fueron los más visitados.


* [ ] **REQ-USR-003: Estado de Tarjeta Física y Reporte de Pérdida**
* *Descripción:* El sistema debe permitir al titular ver el estado de su tarjeta vinculada y disponer de un botón de emergencia para "Bloquear tarjeta por extravío".


* [ ] **REQ-USR-004: Estado de Membresía Anual y Renovación**
* *Descripción:* El sistema debe exhibir la fecha exacta de expiración de su perfil digital e instrucciones de renovación cuando resten menos de 30 días.



---

### Fase IV: Landing Page Institucional y Conversión

* [ ] **REQ-PUB-001: Hero Section de Presentación de Marca**
* *Descripción:* El sistema debe contar con una página de inicio pública (`/`) con estética oscura, acentos metálicos oro/plata, animaciones de fluidos y exhibición de tarjetas físicas SIF en 3D/mockup.


* [ ] **REQ-PUB-002: Simulador Interactivo de Tarjetas**
* *Descripción:* El sistema debe incluir en la landing un componente interactivo que permita al visitante alternar colores de tarjetas físicas (Negro Mate, Blanco Mate) y probar en vivo el cambio de temas digitales.


* [ ] **REQ-PUB-003: Sección de Soluciones B2B vs. Profesionales**
* *Descripción:* La landing debe explicar la propuesta de valor para ejecutivos independientes y para empresas que requieren tarjetas con URLs corporativas (`sif.link/:empresa/:nombre`) y panel de control centralizado.


* [ ] **REQ-PUB-004: Acceso Rápido y Call To Action (CTA)**
* *Descripción:* La barra de navegación pública debe contar con botón de "Iniciar Sesión" (que abre el `AuthModal`) para redirigir automáticamente al panel correspondiente según el rol del usuario, y botones directos de contacto/compra.
# Guía de Arquitectura: Dashboard de Analytics

## 1. Resumen Actual de Recolección de Datos

Actualmente, los eventos se registran de forma asíncrona mediante el servicio principal **`src/services/analyticsService.ts`**. Este archivo expone la función `trackEvent` que opera bajo un modelo *fire-and-forget* (no bloquea la interfaz y maneja sus propios errores para evitar problemas con ad-blockers o modo incógnito).

### Archivos Implicados
- `src/services/analyticsService.ts`: Lógica de recolección y envío.
- `src/types/database.ts` (inferido): Definición de tipos de Supabase (`AnalyticsEventType`, `AnalyticsEventInsert`).

### Estructura de los Datos (Tabla `analytics`)
Cada evento se inserta con la siguiente estructura:
- **`profile_id`**: ID del perfil (digital/NFC) donde ocurrió la acción.
- **`event_type`**: Clasifica la acción. Los tipos actuales son:
  - `nfc_tap`: Interacción física con la tarjeta.
  - `profile_view`: Visualización del perfil web.
  - `contact_download`: Descarga de vCard.
  - `direct_contact_click`: Clic en un enlace de contacto directo (WhatsApp, email, teléfono, ubicación).
  - `social_link_click`: Clic en un enlace de red social.
  - `profile_share`: Compartición del perfil (copiar enlace o compartir nativo).
- **`metadata` (JSONB)**: Contiene información específica del evento más propiedades enriquecidas automáticamente del lado del cliente:
  - `_client_ts`: Timestamp exacto en el cliente.
  - `_user_agent`: User agent del navegador.
  - `_referrer`: URL de origen.
  - `_screen_width`: Ancho de pantalla del dispositivo.
  - Propiedades variables según el evento (ej. `channel`, `platform`, `format`, `token`).

> **Nota:** Actualmente **no existen consultas (fetching)** en el frontend para obtener estos datos de vuelta. Se requiere implementar toda la capa de lectura desde cero.

---

## 2. Propuesta Arquitectónica para Consultas (Fetching y RLS)

Dado que la tabla `analytics` crecerá enormemente (time-series data), consultar los registros directamente desde el frontend y agregar/sumar en el navegador será muy ineficiente y causará problemas de rendimiento.

### Recomendación Principal: Funciones RPC de PostgreSQL (Stored Procedures)
Recomiendo utilizar **Funciones RPC** (`CREATE FUNCTION ... RETURNS json`) creadas directamente en la base de datos de Supabase para realizar las agregaciones de métricas en el backend. 

**¿Por qué RPCs?**
1. **Rendimiento:** Las agregaciones se realizan en la base de datos; al frontend solo viajan los totales (ej. `[{ date: '2023-10-01', views: 50, taps: 20 }]`), reduciendo dramáticamente el payload de red.
2. **Seguridad y Jerarquía:** Dentro del RPC podemos leer el token de autenticación (`auth.uid()`), obtener el rol y la organización del usuario, y aplicar los filtros dinámicamente sin necesidad de políticas RLS excesivamente complejas (joins costosos en cada fila de `analytics`).

### Arquitectura de la Solución Backend

#### Opción Recomendada: `SECURITY DEFINER` RPC con Validación de Accesos Interna
Se puede crear una función llamada `get_analytics_dashboard` que tome los siguientes parámetros:
- `p_start_date` (fecha inicio)
- `p_end_date` (fecha fin)
- `p_target_user_id` (opcional, para filtrar un usuario específico)
- `p_target_profile_id` (opcional, para filtrar un perfil específico)

**Lógica interna de la función RPC:**
1. Obtener el `auth.uid()` del usuario que hace la llamada.
2. Consultar la tabla `users` para ver su `role` y `org_id`.
3. Aplicar las reglas de negocio en la consulta principal:
   - **Si es `org_admin`**: Tiene permiso para ver las métricas si el perfil consultado pertenece a un usuario cuyo `org_id` coincide con el suyo.
   - **Si es `user`**: Tiene permiso solo si el `user_id` asociado al perfil coincide con su propio `auth.uid()`.
4. Devolver las métricas agregadas (series de tiempo, distribución de eventos y totales generales).

> **Sobre Vistas (Views) y RLS:** 
> Se podrían usar Políticas RLS sobre la tabla `analytics`. Sin embargo, la política requeriría hacer JOIN con `profiles` y `users` para validar la propiedad y el `org_id`. En tablas de analíticas masivas, evaluar esa política de seguridad *por cada fila procesada* durante una agregación degrada drásticamente el rendimiento de la consulta. Las funciones RPC (como `SECURITY DEFINER`) nos permiten evaluar los permisos una sola vez y luego hacer las consultas de forma directa y eficiente.

---

## 3. Estructura Propuesta para Componentes (React)

Para el frontend, la arquitectura se basará en un enfoque de componentes modulares y el uso de React Context para mantener los filtros (rango de fechas, contexto jerárquico).

### Estructura de Directorios

```text
src/
 └── components/
      └── dashboard/
           ├── DashboardLayout.tsx      # Contenedor principal
           ├── context/
           │    └── DashboardContext.tsx # Estado global del dashboard (fechas, user_id, profile_id)
           ├── filters/
           │    ├── DateRangePicker.tsx # Selector de fechas
           │    ├── OrgUserSelector.tsx # Visible solo para org_admin: dropdown de usuarios
           │    └── ProfileSelector.tsx # Dropdown de perfiles
           ├── summary/
           │    ├── MetricCard.tsx      # Tarjetas KPI individuales
           │    └── MetricsOverview.tsx # Grid con tarjetas (Vistas totales, Taps, CTR)
           └── charts/
                ├── TrafficChart.tsx    # Gráfico de líneas o barras (series de tiempo)
                ├── EventsPieChart.tsx  # Gráfico de torta (distribución de links clickeados)
                └── ReferrerList.tsx    # Tabla de orígenes de tráfico o dispositivos
```

### Comportamiento del Dashboard según el Rol

#### Contexto / Estado (`DashboardContext`)
El contexto almacenará el filtro jerárquico actual:
```typescript
interface DashboardState {
  dateRange: { start: Date; end: Date };
  selectedUserId: string | 'all';    // 'all' solo disponible para org_admin
  selectedProfileId: string | 'all'; // Depende del selectedUserId
}
```

#### Nivel: `org_admin`
- Al entrar al dashboard, `selectedUserId` estará en `'all'`. El `OrgUserSelector` será renderizado, mostrando todos los usuarios de la organización.
- Verá las métricas sumadas de toda la organización.
- Si selecciona a *Usuario Juan* en el `OrgUserSelector`, el `ProfileSelector` se llenará solo con los perfiles de Juan. 
- Puede profundizar seleccionando un perfil de Juan para ver el rendimiento individual.

#### Nivel: `user` (Usuario Normal)
- Al entrar, su `selectedUserId` estará fijo a su propio ID. El componente `OrgUserSelector` **no se renderiza**.
- El `ProfileSelector` mostrará directamente sus propios perfiles.
- Verá las métricas sumadas de *todos sus perfiles*.
- Podrá filtrar por un perfil específico usando su selector.

### Stack Técnico Recomendado para Frontend
- **Fetching:** React Query (o SWR) para llamar a la función RPC de Supabase y mantener caché y estados de carga (`isLoading`, `isError`).
- **Gráficos:** Recharts o Chart.js. Recharts es excelente en React por su naturaleza declarativa y facilidad para ajustarse a temas oscuros/claros o estéticas modernas.
- **Estilos:** TailwindCSS (si está en uso) o CSS puro utilizando tokens de diseño, priorizando *Glassmorphism*, bordes suaves y paletas de colores ricas para asegurar un look "premium" de los datos (e.g. degradados en los gráficos de líneas, tooltips dinámicos con microinteracciones).

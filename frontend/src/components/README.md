# 🧩 Guía de Componentes

Los componentes del frontend están organizados por su ámbito de uso y responsabilidad.

## 📂 Organización

- **`admin/`**: Componentes exclusivos del panel de administración (ej: `ReservationTable`, `CustomerList`).
- **`public/`**: Componentes para la interfaz de cliente (ej: `BookingWizard`, `MenuDisplay`).
- **`common/`**: Elementos de UI reutilizables en ambas interfaces (ej: `Button`, `Modal`, `Input`).
- **`layout/`**: Componentes de estructura como `Navbar`, `Footer` y `Sidebar`.

## 🎨 Estilo
Utilizamos **Vanilla CSS** con variables globales definidas en `src/styles/variables.css` para mantener la consistencia visual. Evitamos el uso de librerías de componentes pesadas para mantener la aplicación ligera y personalizada.

## 🧪 Pruebas
Cada componente complejo debe tener un archivo `.test.tsx` asociado para verificar su comportamiento básico e interacciones del usuario.

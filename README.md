```
└── 📁src                    // Raíz del frontend
    ├── 📁store             // Configuración global de Redux Toolkit
    │   └── store.js
    │
    ├── 📁assets            // Recursos estáticos
    │   ├── 📁styles        // Estilos globales (variables, reset, themes)
    │   └── react.svg       // Otros recursos como imágenes o íconos
    │
    ├── 📁components        // Componentes reutilizables y presentacionales (sin lógica de negocio)
    │   └── 📁common
    │       ├── 📁Layout    // Layout general de la app
    │       │   ├── Layout.css
    │       │   ├── SideBar.jsx
    │       │   └── TopBar.jsx
    │       └── 📁UI        // UI genérica (botones, tarjetas, etc.)
    │           ├── Button.jsx
    │           ├── Card.jsx
    │           └── Spinner.jsx
    │
    ├── 📁features          // Dominios funcionales separados
    │   ├── 📁auth
    │   │   ├── 📁components
    │   │   │   ├── Form.css
    │   │   │   ├── LoginForm.jsx
    │   │   │   └── RegisterForm.jsx
    │   │   ├── 📁pages     // Vistas completas
    │   │   │   ├── LoginPage.jsx
    │   │   │   └── RegisterPage.jsx
    │   │   ├── authSlice.js //estado + reducer + acciones
    │   │   └── authService.js
    │   │
    │   ├── 📁business
    │   │   ├── 📁components
    │   │   ├── 📁pages
    │   │   ├── businessService.js
    │   │   └── businessSlice.js
    │   │
    │   ├── 📁properties
    │   │   ├── 📁components
    │   │   ├── 📁pages
    │   │   ├── propertiesService.js
    │   │   └── propertiesSlice.js
    │   │
    │   ├── 📁prospectos     // Otros módulos futuros
    │   ├── 📁calendar
    │   ├── 📁matching
    │   └── 📁communications
    │
    ├── 📁hooks             // Hooks personalizados
    │   └── useAuth.js
    │
    ├── 📁routes            // Rutas de navegación (React Router)
    │   └── AppRouter.jsx
    │
    ├── 📁utils             // Funciones generales de utilidad
    │   └── api.js          // Axios o configuración de endpoints
    │
    ├── App.jsx            // Componente raíz de la aplicación
    ├── main.jsx           // Punto de entrada principal (ReactDOM)
    ├── index.css          // Estilos base del proyecto
    └── App.css            // Estilos globales específicos del componente App
```
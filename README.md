🎵 Musicalendaria

Proyecto final (TP) de una cartelera musical interactiva.
Este proyecto permite visualizar eventos musicales, artistas y fechas de presentaciones de forma intuitiva.

📌 Descripción
Musicalendaria es una aplicación web que funciona como una cartelera musical, ideal para quienes quieren estar al tanto de conciertos, festivales y presentaciones en vivo cerca de su ubicación o en fechas específicas.

🧩 Características Principales:
📅 Visualización de eventos por fecha.
📍 Filtro por género musical, artista o ubicación.
🎤 Información detallada de artistas y eventos.
🌐 Diseño responsivo para dispositivos móviles y escritorio.
🖱️ Interfaz amigable e intuitiva.
⚙️ Tecnologías Utilizadas:
HTML5 / CSS3
JavaScript 
JSON 
Backend ligero
📦 Instalación
Clona el repositorio:
bash


1
git clone https://github.com/PMAC80/musicalendaria.git 
Navega al directorio del proyecto:
bash


1
cd musicalendaria
Instala las dependencias:
bash


1
npm install
Ejecuta el proyecto:
bash


1
npm start
📚 Estructura del Proyecto


musicalendaria/
│
├── index.html
├── styles/
│   └── main.css
├── scripts/
│   └── app.js
├── assets/
│   └── (imágenes, iconos, etc.)
└── README.md
## 🛠️ Funcionamiento Técnico

El sistema cuenta con dos roles principales:

- **Artista:** Puede registrarse, iniciar sesión y crear eventos musicales. Los eventos creados quedan pendientes de aprobación.
- **Administrador:** Puede iniciar sesión, ver todos los eventos (habilitados y pendientes) y habilitar eventos para que sean visibles en la cartelera pública.

### Flujo de eventos
1. El artista crea un evento desde su panel. El evento se guarda como pendiente (`habilitado = false`).
2. El administrador accede a su panel, donde puede ver todos los eventos y habilitar los que considere aptos.
3. Solo los eventos habilitados aparecen en la cartelera pública para todos los usuarios.

### Tecnologías
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js + Express
- **Base de datos:** MySQL
- **Autenticación:** Manejo de sesiones y control de acceso por rol

Este flujo asegura que solo los eventos validados por el administrador sean publicados, manteniendo la calidad y seguridad de la cartelera.
📝 Notas Adicionales
Este proyecto fue desarrollado como parte de [mencionar curso, materia o institución si es necesario]. 

👨‍💻 Autor
Pablo Curtti
GitHub: @PMAC80
Email: curttipablo@gmail.com 

📬 Contacto
Si tienes alguna duda, sugerencia o encontraste un bug, no dudes en abrir un issue o enviarme un mensaje por GitHub.

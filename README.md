SystemInventoryAI 🚀

Sistem****a de Gestión de Inventarios con Reconocimiento de Imágenes

SystemInventoryAI es una aplicación avanzada para la gestión de inventarios que utiliza visión artificial e inteligencia artificial para el reconocimiento de productos a partir de imágenes. El sistema optimiza la administración de ventas e inventarios mediante la integración de Flask, TensorFlow, MongoDB Atlas y React con TypeScript.

🌟 Características Principales

✅ Reconocimiento Automático de Productos con TensorFlow y ResNet50.
✅ Gestión de Inventarios en tiempo real.
✅ Sistema de Ventas optimizado con MongoDB Atlas.
✅ Autenticación Segura con encriptación de contraseñas usando Flask-Bcrypt.
✅ Generación de Reportes en PDF con ReportLab.
✅ Interfaz Moderna con React, Vite, Tailwind CSS y Zustand.

🛠 Tecnologías Utilizadas

Backend

Flask (Microframework en Python)

MongoDB Atlas (Base de datos NoSQL)

TensorFlow (Reconocimiento de imágenes con IA)

Flask-Bcrypt (Autenticación segura con encriptación de contraseñas)

Flask-CORS (Manejo de CORS para el backend)

ReportLab (Generación de reportes en PDF)

Frontend

React + TypeScript (Interfaz de usuario interactiva)

Vite (Entorno de desarrollo rápido)

Tailwind CSS (Estilización eficiente)

Zustand (Manejo de estado)

⚡ Cómo Ejecutarlo

1️⃣ Clona el repositorio

 git clone https://github.com/angeljrcurtido/SystemInventoryAI.git
 cd SystemInventoryAI

🖥️ Ejecutar el Servidor (Backend)

cd server

# Crea un entorno virtual (opcional pero recomendado)
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate  # Windows

# Instala las dependencias
pip install -r requirements.txt

# Ejecuta el servidor Flask
python app.py

🌐 Ejecutar el Cliente (Frontend)

cd client
npm install
npm run dev

Accede a la aplicación en: http://localhost:5173 (o el puerto de Vite).

🎯 Casos de Uso

📸 Automatización de inventarios mediante reconocimiento de imágenes.
🛒 Gestión de ventas con productos escaneados en tiempo real.
📦 Control de stock eficiente con alertas de reabastecimiento.
📊 Generación de reportes en PDF para auditoría y análisis.

🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas colaborar, por favor sigue estos pasos:

Haz un fork del repositorio.

Crea una rama con tu nueva funcionalidad (git checkout -b nueva-funcionalidad).

Haz commit de tus cambios (git commit -m 'Añadir nueva funcionalidad').

Realiza un push de la rama (git push origin nueva-funcionalidad).

Abre un Pull Request.

📜 Licencia

Este proyecto está bajo la licencia MIT. Puedes usarlo libremente, pero se agradece la atribución. 🙌

🚀 SystemInventoryAI: Optimizando la gestión de inventarios con IA y automatización 🎯

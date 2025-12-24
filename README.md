# 🧪 Playwright E2E Automation – OrangeHRM Demo

Proyecto de **automatización de pruebas End-to-End (E2E)** utilizando **Playwright con TypeScript**, enfocado en aplicar **buenas prácticas profesionales** de testing automatizado sobre una aplicación web real.

---

## 🎯 Objetivo del proyecto

Validar flujos críticos de una aplicación web simulando el comportamiento de un usuario real, asegurando estabilidad, mantenibilidad y claridad en las pruebas automatizadas.

---

## 🌐 Aplicación bajo prueba

- **URL:** https://opensource-demo.orangehrmlive.com
- **Tipo:** Demo pública (OrangeHRM)
- **Credenciales:**
  - Usuario: `Admin`
  - Password: `admin123`

---

## 🧪 Alcance de las pruebas

- ✅ Login exitoso
- ✅ Navegación posterior al login
- 🔜 Base para pruebas CRUD (usuarios)

---

## 🧱 Tecnologías utilizadas

- Playwright
- TypeScript
- Node.js
- Page Object Model (POM)

---

## 📁 Estructura del proyecto

```text
playwright-orangehrm/
├─ tests/
│  ├─ e2e/
│  │  └─ login.spec.ts
│  └─ pages/
│     └─ login.page.ts
├─ playwright.config.ts
├─ package.json
└─ README.md

▶️ Instalación y ejecución
1️⃣ Clonar el repositorio
git clone https://github.com/tu-usuario/playwright-orangehrm.git
cd playwright-orangehrm

2️⃣ Instalar dependencias
npm install

3️⃣ Ejecutar las pruebas
npx playwright test

4️⃣ Ver reporte HTML
npx playwright show-report

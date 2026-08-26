# Scaffold TDD (TypeScript + Vitest)

Un entorno optimizado y ligero para practicar **Desarrollo Guiado por Pruebas (TDD)** con ejecución ultra-rápida y soporte nativo para TypeScript.

## 🚀 Comandos Principales

| Comando | Descripción |
| :--- | :--- |
| `npm test` | Inicia el ejecutor de pruebas **Vitest en modo Watch**. Reacciona instantáneamente a cambios. |
| `npm run test:run` | Ejecuta las pruebas una sola vez (Ideal para CI / verificación puntual). |
| `npm run test:coverage` | Genera reporte de cobertura de código (V8). |
| `npm run typecheck` | Verifica que no existan errores de tipos con TypeScript (`tsc --noEmit`). |
| `npm run build` | Compila el proyecto en la carpeta `dist/`. |

---

## 🔴 🟢 🔵 El Ciclo TDD (Red-Green-Refactor)

1. **🔴 RED (Escribe la prueba primero)**
   - Crea o abre un archivo `src/*.test.ts`.
   - Define una nueva prueba para la funcionalidad deseada antes de implementarla.
   - Ejecuta `npm test` y verifica que la prueba **falle** por la razón esperada.

2. **🟢 GREEN (Haz que la prueba pase)**
   - Escribe el código mínimo necesario en `src/*.ts` para hacer que la prueba pase.
   - Tan pronto como la prueba pase en el runner de Vitest, detente.

3. **🔵 REFACTOR (Mejora el código)**
   - Refactoriza el código y las pruebas manteniendo el diseño limpio, legible y sin duplicación.
   - Confirma que las pruebas siguen estando en **🟢 GREEN**.

---

## 📁 Estructura del Proyecto

```text
├── src/
│   ├── calculator.ts       # Módulo de ejemplo
│   ├── calculator.test.ts  # Pruebas unitarias de ejemplo
│   └── index.ts            # Exportaciones principales
├── package.json            # Scripts y dependencias
├── tsconfig.json           # Configuración de TypeScript
├── vitest.config.ts        # Configuración de Vitest
└── README.md
```

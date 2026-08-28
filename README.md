# Gestion de Reservas - TDD

Modulo TypeScript desarrollado con Vitest para practicar Test-Driven Development sobre la gestion de reservas de un restaurante.

## Componentes principales

- `Restaurant`: servicio de dominio en memoria para crear, cancelar, consultar disponibilidad y listar reservas por fecha.
- `Reservation`: contrato de una reserva con codigo, cliente, cantidad de personas, fecha, hora y estado.
- `CreateReservationInput`: datos obligatorios para crear una reserva.

## Reglas de negocio cubiertas

- Creacion correcta de reservas con codigo unico.
- Validacion de nombre, cantidad de personas, fecha y hora.
- Rechazo por capacidad insuficiente en un horario.
- Cancelacion correcta, codigo inexistente y reserva previamente cancelada.
- Recuperacion de capacidad al cancelar.
- Consulta de reservas por fecha, excluyendo canceladas por defecto y permitiendo incluirlas.

## Comandos

Instalar dependencias:

```bash
npm install
```

Ejecutar pruebas una vez:

```bash
npm run test:run
```

Ejecutar pruebas en modo watch:

```bash
npm test
```

Verificar tipos:

```bash
npm run typecheck
```

Compilar:

```bash
npm run build
```

Ejecutar cobertura:

```bash
npm run test:coverage
```

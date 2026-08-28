# Reporte - Gestion de Reservas para Restaurante

## 1. Descripcion del modulo

Se implemento un modulo de dominio en TypeScript para gestionar reservas de un restaurante usando almacenamiento en memoria. La clase principal es `Restaurant`, configurada con una capacidad maxima por horario.

Componentes principales:

- `Restaurant`: crea reservas, valida disponibilidad, cancela reservas y consulta reservas por fecha.
- `Reservation`: representa una reserva con codigo unico, cliente, cantidad de personas, fecha, hora y estado.
- `CreateReservationInput`: estructura de entrada para registrar una reserva.
- `GetReservationsOptions`: permite decidir si la consulta por fecha incluye reservas canceladas.

## 2. Requerimientos implementados

- RF01 Crear reserva: registra reservas validas y genera codigos unicos con formato `RES-0001`.
- RF02 Consultar disponibilidad: calcula capacidad disponible por fecha y hora.
- RF03 Cancelar reserva: cancela por codigo, rechaza codigos inexistentes y reservas ya canceladas.
- RF04 Consultar reservas: lista reservas de una fecha, ordenadas por hora y codigo. Por diseno, las reservas canceladas se excluyen por defecto y pueden incluirse con `includeCancelled: true`.

Reglas de negocio consideradas:

- El nombre del cliente, fecha y hora son obligatorios.
- La cantidad de personas debe ser un entero mayor que cero.
- La capacidad por horario debe ser un entero mayor que cero.
- Una reserva que supera la capacidad disponible se rechaza.
- Una cancelacion libera la capacidad correspondiente.

## 3. Aplicacion de TDD

La historia local fue reestructurada para que los commits muestren de forma transparente el proceso TDD. Cada ciclo deja primero un commit RED con pruebas fallando, luego un commit GREEN con la implementacion minima y finalmente, cuando corresponde, un commit REFACTOR.

Evidencia Git local:

```text
10891cf test(red): describe reservation creation with unique code
7dc452b feat(green): create reservations with generated codes
a74a313 refactor: centralize reservation copy
7676891 test(red): reject invalid reservation data
2aaa872 feat(green): validate reservation creation data
a9a6a50 refactor: extract reservation input validation
8c52350 test(red): describe reservation slot capacity
7df5b97 feat(green): enforce capacity per reservation slot
99afd6c refactor: extract reserved capacity calculation
88f3107 test(red): describe reservation cancellation
6928893 feat(green): cancel reservations and restore capacity
576dd64 refactor: reuse reservation validation helpers
9dedf7b test(red): describe reservations lookup by date
0054846 feat(green): list reservations by date
a9712a0 refactor: name default availability party size
cbef1da test(red): cover reservation query boundary cases
3ded300 feat(green): validate reservation query parameters
```

Comandos Git ejecutados:

```bash
git status --short
git branch --show-current
git log --oneline
git branch backup/RF04-before-tdd-rewrite
git reset --mixed 319d37c
git add <archivos>
git commit -m "<mensaje TDD>"
git log --oneline --reverse 319d37c..HEAD
```

No se ejecuto `git push`.

### Ciclo 1: creacion correcta de una reserva

- Comportamiento: crear una reserva valida con codigo unico.
- RED: `10891cf test(red): describe reservation creation with unique code`. La prueba fallo porque `restaurant.createReservation is not a function`.
- GREEN: `7dc452b feat(green): create reservations with generated codes`. Se implemento `createReservation`, generacion secuencial de codigos y almacenamiento en memoria.
- REFACTOR: `a74a313 refactor: centralize reservation copy`. Se centralizo la copia defensiva de reservas.
- Resultado: la suite quedo en verde con 8 pruebas exitosas.

Espacio para pantallazo:

```text
[Agregar captura del RED de ciclo 1 o del commit 10891cf si el docente lo solicita]
```

### Ciclo 2: validacion de datos incorrectos

- Comportamiento: rechazar datos obligatorios vacios y cantidades invalidas.
- RED: `7676891 test(red): reject invalid reservation data`. Cinco pruebas fallaron porque la creacion no validaba entrada.
- GREEN: `2aaa872 feat(green): validate reservation creation data`. Se agregaron validaciones de nombre, cantidad, fecha y hora.
- REFACTOR: `a9a6a50 refactor: extract reservation input validation`. Se extrajo `validateReservationInput`.
- Resultado: la suite quedo en verde con 13 pruebas exitosas.

Espacio para pantallazo:

```text
[Agregar captura del RED con 5 fallos de validacion o del GREEN del ciclo 2]
```

### Ciclo 3: capacidad disponible e insuficiente

- Comportamiento: calcular disponibilidad por horario y rechazar reservas que superan la capacidad.
- RED: `8c52350 test(red): describe reservation slot capacity`. Fallo porque `hasAvailability` no existia y no se bloqueaba el sobrecupo.
- GREEN: `7df5b97 feat(green): enforce capacity per reservation slot`. Se implemento `hasAvailability` y el rechazo por capacidad insuficiente.
- REFACTOR: `99afd6c refactor: extract reserved capacity calculation`. Se extrajo el calculo de capacidad reservada.
- Resultado: la suite quedo en verde con 15 pruebas exitosas.

Espacio para pantallazo:

```text
[Agregar captura de Vitest mostrando el caso de capacidad en rojo/verde si es necesario]
```

### Ciclo 4: cancelacion y recuperacion de capacidad

- Comportamiento: cancelar una reserva activa, rechazar codigos inexistentes o ya cancelados y liberar cupo.
- RED: `88f3107 test(red): describe reservation cancellation`. Cuatro pruebas fallaron porque `cancelReservation` no existia.
- GREEN: `6928893 feat(green): cancel reservations and restore capacity`. Se implemento cancelacion por codigo y cambio de estado a `cancelled`.
- REFACTOR: `576dd64 refactor: reuse reservation validation helpers`. Se reutilizaron helpers de validacion para reducir duplicacion.
- Resultado: la suite quedo en verde con 19 pruebas exitosas.

Espacio para pantallazo:

```text
[Agregar captura de la prueba de recuperacion de capacidad o salida de npm run test:run]
```

### Ciclo 5: consulta de reservas por fecha (RF04)

- Comportamiento: obtener reservas por fecha, excluir canceladas por defecto e incluirlas explicitamente si se solicita.
- RED: `9dedf7b test(red): describe reservations lookup by date`. Cuatro pruebas fallaron porque `getReservationsByDate` no existia.
- GREEN: `0054846 feat(green): list reservations by date`. Se implemento `getReservationsByDate`, ordenamiento por hora/codigo, normalizacion de fecha y `includeCancelled`.
- REFACTOR: `a9712a0 refactor: name default availability party size`. Se nombro la constante del valor por defecto de disponibilidad.
- Resultado: RF04 quedo cubierto y la suite paso con 23 pruebas exitosas.

Espacio para pantallazo:

```text
[Agregar captura del RED de RF04 o del GREEN con el commit 0054846]
```

### Ciclo 6: casos frontera de consultas

- Comportamiento: rechazar fecha/hora vacias al consultar disponibilidad y codigo vacio al cancelar.
- RED: `cbef1da test(red): cover reservation query boundary cases`. Tres pruebas fallaron por validaciones ausentes.
- GREEN: `3ded300 feat(green): validate reservation query parameters`. Se reutilizo `requireText` para validar parametros de consulta y cancelacion.
- Resultado: la suite final quedo en verde con 26 pruebas exitosas.

Espacio para pantallazo:

```text
[Agregar captura del RED de 3 fallos o del GREEN final con 26 pruebas exitosas]
```

## 4. Resultados de las pruebas

Comandos ejecutados:

```bash
npm run test:run
npm run typecheck
npm run build
npm run test:coverage
```

Resultado final de `npm run test:run`:

```text
Test Files  2 passed (2)
Tests       26 passed (26)
```

Resultado final de cobertura:

```text
All files      92.96% statements, 95.34% branches, 92.85% functions, 92.96% lines
calculator.ts 100%
restaurant.ts 98.98% statements, 96.77% branches, 100% functions, 98.98% lines
```

Indicacion para pantallazos:

- Si se requieren capturas, agregar imagenes debajo de esta seccion con la salida de `npm run test:run` y `npm run test:coverage`.
- Captura sugerida 1: `git log --oneline --reverse 319d37c..HEAD` mostrando los commits TDD.
- Captura sugerida 2: cualquier ejecucion RED donde Vitest muestre fallos esperados.
- Captura sugerida 3: resultado GREEN final con `26 passed`.

## 5. Reflexion

TDD ayudo a definir primero el comportamiento esperado del modulo: las pruebas obligaron a separar reglas de negocio como validacion de datos, disponibilidad, cancelacion y consulta por fecha antes de concentrarse en la implementacion.

Durante la refactorizacion surgio la necesidad de extraer validadores reutilizables para textos obligatorios y enteros positivos. Esto redujo duplicacion y permitio aplicar las mismas reglas a creacion, disponibilidad, cancelacion y consulta.

La principal dificultad fue escribir pruebas suficientemente especificas antes de tener un diseno final. En particular, RF04 obligo a decidir si las reservas canceladas debian excluirse o identificarse; se eligio excluirlas por defecto y permitir incluirlas mediante una opcion explicita.

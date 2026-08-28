// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface DatosReserva {
    nombreCliente: string;
    cantidadPersonas: number;
    fecha: string;
    hora: string;
}

// ─── Entidades del dominio ────────────────────────────────────────────────────

export class Reserva {
    constructor(
        public codigoReserva: string,
        public nombreCliente: string,
        public cantidadPersonas: number,
        public fecha: string,
        public hora: string
    ) { }
}

// ─── Clase principal ──────────────────────────────────────────────────────────

export class Restaurant {
    private reservas: Reserva[] = [];

    constructor(private capacidadMaxima: number) { }

    crearReserva(datos: DatosReserva): Reserva {
        return new Reserva('1', datos.nombreCliente, datos.cantidadPersonas, datos.fecha, datos.hora);
    }
}

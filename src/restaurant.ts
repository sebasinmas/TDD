import { randomUUID } from 'crypto';

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
        if (!datos.nombreCliente) throw new Error('El nombre del cliente es obligatorio');
        if (!datos.fecha) throw new Error('La fecha es obligatoria');
        if (!datos.hora) throw new Error('La hora es obligatoria');

        const reserva = new Reserva(
            this.generarCodigo(),
            datos.nombreCliente,
            datos.cantidadPersonas,
            datos.fecha,
            datos.hora
        );
        return reserva;
    }

    private generarCodigo(): string {
        return randomUUID();
    }
}

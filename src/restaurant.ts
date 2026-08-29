import { randomUUID } from 'crypto';

export interface DatosReserva {
    nombreCliente: string;
    cantidadPersonas: number;
    fecha: string;
    hora: string;
}

export class Reserva {
    constructor(
        public codigoReserva: string,
        public nombreCliente: string,
        public cantidadPersonas: number,
        public fecha: string,
        public hora: string
    ) { }
}

export class Restaurant {
    private reservas: Reserva[] = [];

    constructor(private capacidadMaxima: number) { }

    crearReserva(datos: DatosReserva): Reserva {
        this.validarDatos(datos);

        const reserva = new Reserva(
            this.generarCodigo(),
            datos.nombreCliente,
            datos.cantidadPersonas,
            datos.fecha,
            datos.hora
        );
        return reserva;
    }

    private validarDatos(datos: DatosReserva): void {
        if (!datos.nombreCliente)        throw new Error('El nombre del cliente es obligatorio');
        if (!datos.fecha)                throw new Error('La fecha es obligatoria');
        if (!datos.hora)                 throw new Error('La hora es obligatoria');
        if (datos.cantidadPersonas <= 0) throw new Error('La cantidad de personas debe ser mayor a cero');

        const formatoFecha = /^\d{4}-\d{2}-\d{2}$/;
        if (!formatoFecha.test(datos.fecha)) throw new Error('Formato de fecha inválido. Se esperaba YYYY-MM-DD');

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaReserva = new Date(datos.fecha);
        if (fechaReserva < hoy) throw new Error('La fecha de la reserva no puede ser anterior a hoy');
    }

    private generarCodigo(): string {
        return randomUUID();
    }
}

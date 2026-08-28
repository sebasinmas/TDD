export class Restaurant {
    reservations: Reserva[] = [];

    constructor(private capacidadMaxima: number) {}

    crearReserva(datos: {
        nombreCliente: string;
        cantidadPersonas: number;
        fecha: string;
        hora: string;
    }): Reserva {
        return new Reserva('1', datos.nombreCliente, datos.cantidadPersonas, datos.fecha, datos.hora);
    }
}


class Reserva {
    constructor(
        public codigoReserva: string,
        public nombreCliente: string,
        public cantidadPersonas: number,
        public fecha: string,
        public hora: string
    ) { }
}

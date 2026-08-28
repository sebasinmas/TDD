export class Restaurant {
    reservations: Reserva[] = [];

    /**
     * @param maxCapacityPerSlot Capacidad máxima de personas por horario.
     */
    constructor(public maxCapacityPerSlot: number) { }

    /**
     * Indica si existe disponibilidad para una fecha, hora y cantidad de personas dadas.
     *
     * @param date Fecha de la reserva (ej. "2026-08-28")
     * @param time Horario de la reserva (ej. "20:00")
     * @param partySize Cantidad de personas de la nueva reserva
     * @returns true si hay disponibilidad, false en caso contrario
     */
    hasAvailability(date: string, time: string, partySize: number): boolean {
        return true;
    }
}


class Reserva {
    constructor(
        public id: string,
        public customers: Customer[],
        public date: string
    ) { }
}

class Customer {
    constructor(public id: string, public name: string) { }
}
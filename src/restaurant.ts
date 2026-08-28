export class Restaurant {
    reservations: Reserva[] = [];
    slotBookings: { date: string; time: string; partySize: number }[] = [];

    /**
     * @param maxCapacityPerSlot Capacidad máxima de personas por horario.
     */
    constructor(public maxCapacityPerSlot: number) { }

    addReservation(date: string, time: string, partySize: number): void {
        this.slotBookings.push({ date, time, partySize });
    }

    /**
     * Indica si existe disponibilidad para una fecha, hora y cantidad de personas dadas.
     *
     * @param date Fecha de la reserva (ej. "2026-08-28")
     * @param time Horario de la reserva (ej. "20:00")
     * @param partySize Cantidad de personas de la nueva reserva
     * @returns true si hay disponibilidad, false en caso contrario
     */
    hasAvailability(date: string, time: string, partySize: number): boolean {
        const occupied = this.slotBookings
            .filter((b) => b.date === date && b.time === time)
            .reduce((sum, b) => sum + b.partySize, 0);

        return occupied + partySize <= this.maxCapacityPerSlot;
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
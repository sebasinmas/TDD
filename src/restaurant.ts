interface SlotBooking {
    date: string;
    time: string;
    partySize: number;
}

export class Restaurant {
    reservations: Reserva[] = [];
    slotBookings: SlotBooking[] = [];

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
        const occupiedSeats = this.getOccupiedSeats(date, time);

        return occupiedSeats + partySize <= this.maxCapacityPerSlot;
    }

    private getOccupiedSeats(date: string, time: string): number {
        return this.slotBookings
            .filter((booking) => booking.date === date && booking.time === time)
            .reduce((sum, booking) => sum + booking.partySize, 0);
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
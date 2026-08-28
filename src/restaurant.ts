export class Restaurant {
    reservations: Reserva[] = [];

    constructor(public maxCapacityPerSlot: number) { }

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
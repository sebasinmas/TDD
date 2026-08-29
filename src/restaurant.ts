export type ReservationStatus = 'active' | 'cancelled';

/**
 * Errores de dominio para operaciones con reservas
 */
export class ReservationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class InvalidReservationIdError extends ReservationError {
    constructor() {
        super('ID de reserva inválido');
    }
}

export class ReservationNotFoundError extends ReservationError {
    constructor(id: string) {
        super(`Reserva no encontrada con ID: ${id}`);
    }
}

export class ReservationAlreadyCancelledError extends ReservationError {
    constructor() {
        super('La reserva ya fue cancelada');
    }
}

export class Customer {
    constructor(
        public readonly id: string,
        public readonly name: string
    ) { }
}

export class Reserva {
    public status: ReservationStatus;

    constructor(
        public readonly id: string,
        public readonly customers: Customer[],
        public readonly date: string,
        status: ReservationStatus = 'active'
    ) {
        this.status = status;
    }

    get partySize(): number {
        return this.customers.length;
    }

    isCancelled(): boolean {
        return this.status === 'cancelled';
    }

    cancel(): void {
        if (this.isCancelled()) {
            throw new ReservationAlreadyCancelledError();
        }
        this.status = 'cancelled';
    }
}

export class Restaurant {
    public reservations: Reserva[] = [];

    constructor(public readonly capacity: number = Infinity) {
        if (capacity < 0) {
            throw new Error('La capacidad no puede ser negativa');
        }
    }

    /**
     * Agrega una reserva a la colección del restaurante.
     * 
     * @param reserva Reserva a agregar
     */
    addReservation(reserva: Reserva): void {
        this.reservations.push(reserva);
    }

    /**
     * Cancela una reserva existente dado su identificador y libera la capacidad.
     * 
     * @param id Identificador de la reserva a cancelar
     * @returns La reserva cancelada
     * @throws {InvalidReservationIdError} Si el ID es nulo, indefinido o vacío
     * @throws {ReservationNotFoundError} Si la reserva no existe
     * @throws {ReservationAlreadyCancelledError} Si la reserva ya fue cancelada
     */
    cancelReservation(id: string): Reserva {
        const normalizedId = this.validateAndNormalizeId(id);
        const reservation = this.findReservationById(normalizedId);

        if (!reservation) {
            throw new ReservationNotFoundError(normalizedId);
        }

        reservation.cancel();
        return reservation;
    }

    /**
     * Obtiene la capacidad disponible para una fecha determinada.
     * 
     * @param date Fecha a consultar (ej. "2026-09-01")
     * @returns Capacidad disponible (capacidad total - personas en reservas activas)
     */
    getAvailableCapacity(date: string): number {
        const occupied = this.reservations
            .filter((r) => r.date === date && !r.isCancelled())
            .reduce((sum, r) => sum + r.partySize, 0);

        return Math.max(0, this.capacity - occupied);
    }

    /**
     * Verifica si hay disponibilidad suficiente para una fecha y cantidad de personas.
     * 
     * @param date Fecha a consultar
     * @param partySize Cantidad de personas requeridas
     * @returns true si hay capacidad suficiente, false en caso contrario
     */
    hasAvailability(date: string, partySize: number): boolean {
        if (partySize <= 0) {
            return false;
        }
        return this.getAvailableCapacity(date) >= partySize;
    }

    private findReservationById(id: string): Reserva | undefined {
        return this.reservations.find((r) => r.id === id);
    }

    private validateAndNormalizeId(id: string): string {
        if (!id || typeof id !== 'string' || id.trim() === '') {
            throw new InvalidReservationIdError();
        }
        return id.trim();
    }
}
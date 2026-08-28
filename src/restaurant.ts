export type ReservationStatus = 'active' | 'cancelled';

export interface CreateReservationInput {
  customerName: string;
  partySize: number;
  date: string;
  time: string;
}

export interface Reservation {
  code: string;
  customerName: string;
  partySize: number;
  date: string;
  time: string;
  status: ReservationStatus;
}

export interface GetReservationsOptions {
  includeCancelled?: boolean;
}

const DEFAULT_REQUESTED_PARTY_SIZE = 1;

export class Restaurant {
  private readonly reservations = new Map<string, Reservation>();
  private nextReservationNumber = 1;

  constructor(private readonly capacityPerSlot: number) {
    this.ensurePositiveInteger(capacityPerSlot, 'La capacidad por horario debe ser mayor que cero');
  }

  createReservation(input: CreateReservationInput): Reservation {
    const reservationData = this.validateReservationInput(input);

    if (!this.hasAvailability(reservationData.date, reservationData.time, reservationData.partySize)) {
      throw new Error('No hay disponibilidad para la fecha y hora solicitada');
    }

    const reservation: Reservation = {
      code: this.generateReservationCode(),
      ...reservationData,
      status: 'active',
    };

    this.reservations.set(reservation.code, reservation);
    return this.copyReservation(reservation);
  }

  hasAvailability(date: string, time: string, requestedPartySize = DEFAULT_REQUESTED_PARTY_SIZE): boolean {
    const requestedDate = this.requireText(date, 'La fecha es obligatoria');
    const requestedTime = this.requireText(time, 'La hora es obligatoria');

    this.ensurePositiveInteger(
      requestedPartySize,
      'La cantidad de personas debe ser mayor que cero',
    );

    const reservedCapacity = this.getReservedCapacityForSlot(requestedDate, requestedTime);
    return reservedCapacity + requestedPartySize <= this.capacityPerSlot;
  }

  cancelReservation(code: string): Reservation {
    const reservationCode = this.requireText(code, 'El código de reserva es obligatorio');
    const reservation = this.reservations.get(reservationCode);

    if (!reservation) {
      throw new Error('Reserva no encontrada');
    }

    if (reservation.status === 'cancelled') {
      throw new Error('La reserva ya fue cancelada');
    }

    const cancelledReservation: Reservation = { ...reservation, status: 'cancelled' };
    this.reservations.set(reservationCode, cancelledReservation);

    return this.copyReservation(cancelledReservation);
  }

  getReservationsByDate(date: string, options: GetReservationsOptions = {}): Reservation[] {
    const requestedDate = this.requireText(date, 'La fecha es obligatoria');

    return Array.from(this.reservations.values())
      .filter((reservation) => reservation.date === requestedDate)
      .filter((reservation) => options.includeCancelled || reservation.status === 'active')
      .sort((left, right) => this.compareReservations(left, right))
      .map((reservation) => this.copyReservation(reservation));
  }

  private validateReservationInput(input: CreateReservationInput): CreateReservationInput {
    const customerName = this.requireText(input.customerName, 'El nombre del cliente es obligatorio');
    const date = this.requireText(input.date, 'La fecha es obligatoria');
    const time = this.requireText(input.time, 'La hora es obligatoria');

    this.ensurePositiveInteger(input.partySize, 'La cantidad de personas debe ser mayor que cero');

    return {
      customerName,
      partySize: input.partySize,
      date,
      time,
    };
  }

  private requireText(value: string, errorMessage: string): string {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      throw new Error(errorMessage);
    }

    return normalizedValue;
  }

  private ensurePositiveInteger(value: number, errorMessage: string): void {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error(errorMessage);
    }
  }

  private getReservedCapacityForSlot(date: string, time: string): number {
    return Array.from(this.reservations.values())
      .filter(
        (reservation) =>
          reservation.date === date && reservation.time === time && reservation.status === 'active',
      )
      .reduce((total, reservation) => total + reservation.partySize, 0);
  }

  private generateReservationCode(): string {
    const code = `RES-${String(this.nextReservationNumber).padStart(4, '0')}`;
    this.nextReservationNumber += 1;
    return code;
  }

  private compareReservations(left: Reservation, right: Reservation): number {
    const timeComparison = left.time.localeCompare(right.time);

    if (timeComparison !== 0) {
      return timeComparison;
    }

    return left.code.localeCompare(right.code);
  }

  private copyReservation(reservation: Reservation): Reservation {
    return { ...reservation };
  }
}

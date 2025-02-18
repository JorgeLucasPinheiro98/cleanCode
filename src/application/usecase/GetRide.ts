import { inject } from "../../infra/di/Registry";
import RideRepository from "../../infra/repository/RideRepository";

export default class GetRide {
    @inject("rideRepository")
    rideRepository!: RideRepository;

    async execute (rideId: string): Promise<Output> {
        const ride = await this.rideRepository.getRideById(rideId);
        return {
            rideId: ride.rideId,
            passengerId: ride.passengerId,
            fromLat: ride.fromLat,
            fromLong: ride.fromLong,
            toLat: ride.toLat,
            toLong: ride.toLong,
            fare: ride.calculateFare(),
            distance: ride.calculateDistance(),
            status: ride.status,
            date: ride.date
        }
    }
}

type Output = {
    rideId: string,
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    fare: number,
    distance: number,
    status: string,
    date: Date
}

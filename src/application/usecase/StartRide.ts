import AccountRepository from "../../infra/repository/AccountRepository";
import { inject } from "../../infra/di/Registry";
import Ride from "../../domain/Ride";
import RideRepository from "../../infra/repository/RideRepository";

export default class StartRide {
    @inject("rideRepository")
    rideRepository!: RideRepository;

    async execute (input: Input): Promise<void> {
        const ride = await this.rideRepository.getRideById(input.rideId);
        ride.start();
        await this.rideRepository.updateRideStatus(ride);
    }
}

type Input = {
    rideId: string
}

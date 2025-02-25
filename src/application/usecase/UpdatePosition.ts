import AccountRepository from "../../infra/repository/AccountRepository";
import { inject } from "../../infra/di/Registry";
import Ride from "../../domain/Ride";
import RideRepository from "../../infra/repository/RideRepository";
import Position from "../../domain/Position";
import PositionRepository from "../../infra/repository/PositionRepository";
import DistanceCalculator from "../../domain/service/DistanceCalculator";
import FareCalculator from "../../domain/service/FareCalculator";

export default class UpdatePosition {
    @inject("positionRepository")
    positionRepository!: PositionRepository;
    @inject("rideRepository")
    rideRepository!: RideRepository;

    async execute (input: Input): Promise<void> {
        const position = Position.create(input.rideId, input.lat, input.long);
        await this.positionRepository.savePosition(position);
        const positions = await this.positionRepository.getPositionsByRideId(input.rideId);
        const distance = DistanceCalculator.calculateFromPositions(positions);
        const fare = FareCalculator.calculate(distance);
        const ride = await this.rideRepository.getRideById(input.rideId);
        ride.setDistance(distance);
        ride.setFare(fare);
        await this.rideRepository.updateRide(ride);
    }
}

type Input = {
    rideId: string,
    lat: number,
    long: number
}

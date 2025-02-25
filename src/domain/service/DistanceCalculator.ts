import Position from "../Position";
import Coord from "../vo/Coord";

// Domain Service
export default class DistanceCalculator {

    static calculateFromPositions (positions: Position[]) {
        let total = 0;
        for (const [index, position] of positions.entries()) {
            const nextPosition = positions[index + 1];
            if (!nextPosition) break;
            total += DistanceCalculator.calculateFromCoord(position.getCoord(), nextPosition.getCoord());
        }
        return total;
    }

    static calculateFromCoord (from: Coord, to: Coord) {
            const earthRadius = 6371;
            const degreesToRadians = Math.PI / 180;
            const deltaLat = (to.getLat() - from.getLat()) * degreesToRadians;
            const deltaLon = (to.getLong() - from.getLong()) * degreesToRadians;
            const a =
                Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(from.getLat() * degreesToRadians) *
                Math.cos(to.getLat() * degreesToRadians) *
                Math.sin(deltaLon / 2) *
                Math.sin(deltaLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = earthRadius * c;
            return Math.round(distance);
        }
}
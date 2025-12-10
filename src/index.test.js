import { Ship } from './module/ship';

describe('Ship', () => {
    test('starts afloat and eventually sinks when hit enough', () => {
        const boat = new Ship('Boat', 2);

        expect(boat.isSunk()).toBe(false);

        boat.gotHit();
        expect(boat.isSunk()).toBe(false);

        boat.gotHit();
        expect(boat.isSunk()).toBe(true);
    });

    test('Ship identity is accessible (public API) not that i will do it 💀', () => {
        const cruiser = new Ship('Cruiser', 3);

        expect(cruiser.name).toBe('Cruiser');
        expect(cruiser.length).toBe(3);
    });
});

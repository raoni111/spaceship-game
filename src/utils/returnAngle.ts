import { Vec2 } from "kaboom";

export default function returnAngle(pos: Vec2) {
    const radio = Math.atan2(pos.y, pos.x);
    const angle = (radio * 180 / Math.PI) + 90;

    return angle
}

export function returnRadio(pos: Vec2): number {
    const radio = Math.floor(Math.atan2(pos.y, pos.x) * 180);

    return radio
}
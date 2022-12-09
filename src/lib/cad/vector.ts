import type { StackBuf } from "./stack";

export type Vector = [
    number, number, number
];

export function dumpVector(vec: Vector, buf: StackBuf) {
    buf.pushVarInt(vec[0]);
    buf.pushVarInt(vec[1]);
    buf.pushVarInt(vec[2]);
}

export function loadVector(buf: StackBuf): Vector {
    return [
        buf.popVarInt(),
        buf.popVarInt(),
        buf.popVarInt()
    ];
}

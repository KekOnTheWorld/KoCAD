import type { StackBuf } from "./stack";

export class Sketch {
    id: number

    constructor(
        id: number
    ) {
        this.id = id;
    }

    dump(buf: StackBuf) {
        buf.pushVarInt(this.id);
    }

    static load(buf: StackBuf): Sketch {
        const id = buf.popVarInt();
        return new Sketch(id);
    }
};

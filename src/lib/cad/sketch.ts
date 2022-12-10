import type { Dumpable, StackBuf } from "./stack";
import { dumpVector, loadVector, type Vector } from "./vector";


// SHAPE TYPE CONSTANTS

export const RECTANGLE_SHAPE = 0;

//

export interface Shape extends Dumpable {}

export function loadShape(buf: StackBuf): Shape {
    const type = buf.pop();
    switch(type) {
        case RECTANGLE_SHAPE:
            return RectangleShape.load(buf);
        default:
            throw new Error(`Shape type ${type} not found!`);
    }
}

export class RectangleShape implements Shape {
    min: Vector
    max: Vector

    constructor(
        min: Vector,
        max: Vector
    ) {
        this.min = min;
        this.max = max;
    }

    dump(buf: StackBuf): void {
        buf.push(RECTANGLE_SHAPE);
        dumpVector(this.min, buf);
        dumpVector(this.max, buf);
    }

    static load(buf: StackBuf): RectangleShape {
        const min = loadVector(buf);
        const max = loadVector(buf);
        return new RectangleShape(min, max);
    }
}


// CONSTRAINT TYPE CONSTANTS

export const DIAMETER_CONSTRAINT = 0;

//

export interface Constraint extends Dumpable {}

export function loadConstraint(buf: StackBuf): Constraint {
    const type = buf.pop();
    switch(type) {
        case DIAMETER_CONSTRAINT:
            return DiameterConstraint.load(buf);
        default:
            throw new Error(`Constraint type ${type} not found!`);
    }
}

export class DiameterConstraint implements Constraint {
    constructor() {
    }

    dump(buf: StackBuf): void {
        buf.push(DIAMETER_CONSTRAINT);
    }

    static load(buf: StackBuf): DiameterConstraint {
        return new DiameterConstraint();
    }
}

//

export class Sketch implements Dumpable {
	id: number;
    shapes: Shape[];
    constraints: Constraint[];

	constructor(
        id: number,
        shapes: Shape[],
        constraints: Constraint[]
    ) {
		this.id = id;
        this.shapes = shapes;
        this.constraints = constraints;
	}

	dump(buf: StackBuf) {
        buf.pushDumpableArray(this.shapes);
        buf.pushDumpableArray(this.constraints);
		buf.pushVarInt(this.id);
	}

	static load(buf: StackBuf): Sketch {
		const id = buf.popVarInt();
        const shapes = buf.popArray(loadShape);
        const constraints = buf.popArray(loadConstraint);
		return new Sketch(id, shapes, constraints);
	}
}

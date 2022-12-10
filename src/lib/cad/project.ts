import { Sketch } from "./sketch";
import type { Dumpable, StackBuf } from "./stack";
import { dumpVector, loadVector, type Vector } from "./vector";

export class Node implements Dumpable {
	position: Vector;
	rotation: Vector;
	sketch: Sketch;

	constructor(position: Vector, rotation: Vector, sketch: Sketch) {
		this.position = position;
		this.rotation = rotation;
		this.sketch = sketch;
	}

	dump(buf: StackBuf) {
        buf.pushVarInt(this.sketch.id);
		dumpVector(this.rotation, buf);
		dumpVector(this.position, buf);
	}

	static load(buf: StackBuf, sketches: Sketch[]): Node {
		const position = loadVector(buf);
		const rotation = loadVector(buf);
		const sketchId = buf.popVarInt();
		const sketch = sketches.find((s) => s.id === sketchId);
		if (!sketch) throw new Error("Sketch not found in sketch table");
		return new Node(position, rotation, sketch);
	}
}

// 1mb
export const PROJECT_BUF_SIZE = 1024 * 1024;

export class Project implements Dumpable {
	sketches: Sketch[];
	nodes: Node[];

	constructor(sketches: Sketch[] = [], nodes: Node[] = []) {
		this.sketches = sketches;
		this.nodes = nodes;
	}

	dump(buf: StackBuf) {
	    buf.pushDumpableArray(this.nodes);
        buf.pushDumpableArray(this.sketches);
    }

	static load(buf: StackBuf): Project {
		const sketches = buf.popArray(Sketch.load);
        const nodes = buf.popArray(buf => Node.load(buf, sketches));
		return new Project(sketches, nodes);
	}
}

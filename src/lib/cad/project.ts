import { Sketch } from "./sketch";
import type { StackBuf } from "./stack";
import { dumpVector, loadVector, type Vector } from "./vector";

export class Node {
	position: Vector;
	rotation: Vector;
	sketch: Sketch;

	constructor(position: Vector, rotation: Vector, sketch: Sketch) {
		this.position = position;
		this.rotation = rotation;
		this.sketch = sketch;
	}

	dump(buf: StackBuf) {
		dumpVector(this.position, buf);
		dumpVector(this.rotation, buf);
		buf.pushVarInt(this.sketch.id);
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

export class Project {
	sketches: Sketch[];
	nodes: Node[];

	constructor(sketches: Sketch[] = [], nodes: Node[] = []) {
		this.sketches = sketches;
		this.nodes = nodes;
	}

	dump(buf: StackBuf) {
		buf.pushVarInt(this.sketches.length);
		this.sketches.forEach((s) => s.dump(buf));
		buf.pushVarInt(this.nodes.length);
		this.nodes.forEach((n) => n.dump(buf));
	}

	static load(buf: StackBuf): Project {
		const sketchesLength = buf.popVarInt();
		const sketches = [];
		for (let i = 0; i < sketchesLength; i++) {
			sketches.push(Sketch.load(buf));
		}
		const nodesLength = buf.popVarInt();
		const nodes = [];
		for (let i = 0; i < nodesLength; i++) {
			nodes.push(Node.load(buf, sketches));
		}
		return new Project(sketches, nodes);
	}
}

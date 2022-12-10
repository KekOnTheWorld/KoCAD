import { fromByteArray, toByteArray } from "base64-js";
import { Sketch } from "./sketch";
import { StackBuf, type Dumpable } from "./stack";
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

export class Project implements Dumpable {
    title: string;
	sketches: Sketch[];
	nodes: Node[];

	constructor(title: string = "Untitled", sketches: Sketch[] = [], nodes: Node[] = []) {
		this.title = title;
        this.sketches = sketches;
		this.nodes = nodes;
	}

    dump(buf: StackBuf) {
	    buf.pushDumpableArray(this.nodes);
        buf.pushDumpableArray(this.sketches);
        buf.pushString(this.title);
    }

	static load(buf: StackBuf): Project {
        const title = buf.popString();
		const sketches = buf.popArray(Sketch.load);
        const nodes = buf.popArray(buf => Node.load(buf, sketches));
		return new Project(title, sketches, nodes);
	}
    
    static toB64(project: Project): string { 
		const buf = new StackBuf(PROJECT_BUF_SIZE);
        project.dump(buf);
        return fromByteArray(buf.slice());
    }


    static fromB64(b64: string): Project {
        const buf = new StackBuf(0, toByteArray(b64));
        return this.load(buf);
    }
}

export const PROJECT_BUF_SIZE = 1024 * 1024; // 1MiB
export const DEFAULT_PROJECT = new Project("Unknown");

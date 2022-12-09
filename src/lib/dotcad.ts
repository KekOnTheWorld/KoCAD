export function getValue(el?: Element): number {
	return parseInt(el?.getAttribute("Value") as string) || 0;
}

export type Bounds = [
	// Min X,Y,Z
	number,
	number,
	number,
	// Max X,Y,Z
	number,
	number,
	number
];

export function getBounds(el: Element): Bounds {
	const minX = getValue(el.getElementsByTagName("X_MIN")[0]);
	const minY = getValue(el.getElementsByTagName("Y_MIN")[0]);
	const minZ = getValue(el.getElementsByTagName("Z_MIN")[0]);
	const maxX = getValue(el.getElementsByTagName("X_MAX")[0]);
	const maxY = getValue(el.getElementsByTagName("Y_MAX")[0]);
	const maxZ = getValue(el.getElementsByTagName("Z_MAX")[0]);

	return [minX, minY, minZ, maxX, maxY, maxZ];
}

export type Point = [
	// X,Y,Z
	number,
	number,
	number
];

export function getPoint(el: Element): Point {
	const x = getValue(el.getElementsByTagName("X")[0]);
	const y = getValue(el.getElementsByTagName("Y")[0]);
	const z = getValue(el.getElementsByTagName("Z")[0]);

	return [x, y, z];
}

export abstract class Shape {}

export class Rectangle extends Shape {
	p1: Point;
	p2: Point;
	p3: Point;
	p4: Point;

	constructor(p1: Point, p2: Point, p3: Point, p4: Point) {
		super();

		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
		this.p4 = p4;
	}

	static fromDOM(el: Element): Rectangle {
		const p1 = getPoint(el.getElementsByTagName("P1")[0]);
		const p2 = getPoint(el.getElementsByTagName("P2")[0]);
		const p3 = getPoint(el.getElementsByTagName("P3")[0]);
		const p4 = getPoint(el.getElementsByTagName("P4")[0]);

		return new Rectangle(p1, p2, p3, p4);
	}
}

export const SHAPES = {
	RECTANGLE: Rectangle.fromDOM
} as { [key: string]: (el: Element) => Shape };

export class CADData {
	shapes: Shape[];

	constructor(shapes: Shape[]) {
		this.shapes = shapes;
	}

	static fromDOM(el: Element): CADData {
		const shapes: Shape[] = [];

		// TODO: Parse shapes
		for (const child of el.children) {
			const shape = SHAPES[child.nodeName];
			if (shape) shapes.push(shape(child));
			else console.log("Unknown shape", child.nodeName);
		}

		return new CADData(shapes);
	}
}

export class Workpiece {
	bounds: Bounds;

	constructor(bounds: Bounds) {
		this.bounds = bounds;
	}

	static fromDOM(el: Element): Workpiece {
		const bounds = getBounds(el);
		return new Workpiece(bounds);
	}
}

export class Sketch {
	workpiece: Workpiece;
	cadData: CADData;

	constructor(workpiece: Workpiece, cadData: CADData) {
		this.workpiece = workpiece;
		this.cadData = cadData;
	}

	static fromXML(xmlDoc: XMLDocument): Sketch {
		const workpiece = Workpiece.fromDOM(xmlDoc.getElementsByTagName("WORKPIECE")[0]);

		const cadData = CADData.fromDOM(xmlDoc.getElementsByTagName("CAD_DATA")[0]);

		return new Sketch(workpiece, cadData);
	}

	static fromText(text: string): Sketch {
		const xmlDoc = new DOMParser().parseFromString(text, "text/xml");
		return Sketch.fromXML(xmlDoc);
	}
}

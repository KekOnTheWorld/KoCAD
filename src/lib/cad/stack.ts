export interface Stack<T> {
	push(entry: T): void;
	pop(): T;
	last(): T;
}

export class StackBuf implements Stack<number> {
	buf: Uint8Array;
	len: number;

	constructor(cap: number) {
		this.buf = new Uint8Array(cap);
		this.len = 0;
	}

	reset() {
		this.len = 0;
	}

	//

	push(byte: number) {
		this.buf[this.len++] = byte;
	}

	pushVarInt(num: number) {
		let bytes = [];
		while (true) {
			bytes.push(((num & 0x7f) << 1) | ((num >>= 7) == 0 ? 0 : 1));
			if (num == 0) break;
		}
		bytes.reverse().forEach((n) => this.push(n));
	}

	//

	pop(): number {
		return this.buf[--this.len];
	}

	popVarInt(): number {
		let result = 0;
		for (let shiftIdx = 0; ; shiftIdx += 7) {
			const num = this.pop();
			result |= (num >> 1) << shiftIdx;
			if (!(num & 1)) break;
		}
		return result;
	}

	//

	last(): number {
		return this.buf[this.len - 1];
	}

	//

	toString(): string {
		return String.fromCharCode(...this.buf.slice(0, this.len));
	}

	static fromString(str: string): StackBuf {
		const buf = new StackBuf(str.length);
		for (let i = 0; i < str.length; i++) {
			buf.push(str.charCodeAt(i));
		}
		return buf;
	}
}

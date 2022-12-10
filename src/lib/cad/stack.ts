export interface Stack<T> {
	push(entry: T): void;
	pop(): T;
	last(): T;
}

export interface Dumpable {
    dump(buf: StackBuf): void;
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

    pushArray<T>(array: T[], dumper: (entry: T, buf: StackBuf) => void) {
        for(const entry of array) dumper(entry, this);
        this.pushVarInt(array.length);
    }

    pushDumpableArray(array: Dumpable[]) {
        for(const entry of array) entry.dump(this);
        this.pushVarInt(array.length);
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

    popArray<T>(loader: (buf: StackBuf) => T): T[] {
        const length = this.popVarInt();
        const result: T[] = [];
        for(let i = 0; i < length; i++) result.push(loader(this));
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

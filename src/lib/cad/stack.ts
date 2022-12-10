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

	constructor(cap: number, buf?: Uint8Array) {
		this.buf = buf || new Uint8Array(cap);
		this.len = buf ? buf.length : 0;
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

    pushBytes(bytes: Uint8Array) {
        for(const byte of bytes.reverse()) this.push(byte);
        this.pushVarInt(bytes.length);
    }

    pushString(str: string) {
        this.pushBytes(new TextEncoder().encode(str));
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

    popBytes(): Uint8Array {
        const length = this.popVarInt();
        const result = new Uint8Array(length);
        for(let i = 0; i < length; i++) result[i] = this.pop();
        return result;
    }

    popString(): string {
        return new TextDecoder().decode(this.popBytes());
    }

	//

	last(): number {
		return this.buf[this.len - 1];
	}

    //

    slice(): Uint8Array {
        return this.buf.slice(0, this.len);
    }
}

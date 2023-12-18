/**
 * @param {Uint8Array|Buffer|string} input
 * @param {string} charset
 * @returns {string}
 */
export function encodeBase64(input: Uint8Array | Buffer | string, charset: string): string;
/**
 * @param {string} input
 * @param {string} charset
 * @returns {string|Buffer}
 */
export function decodeBase64(input: string, charset: string): string | Buffer;
/**
 * @param {Buffer|string} input
 * @param {boolean} wordMode
 * @returns {string}
 */
export function encode(input: Buffer | string, wordMode: boolean): string;
/**
 * @param {string|Buffer} input
 * @param {string} charset
 * @param {boolean} [wordMode]
 * @returns {string|Buffer}
 */
export function decode(input: string | Buffer, charset: string, wordMode?: boolean | undefined): string | Buffer;
/**
 * @param {string|Buffer} input
 * @param {"B"|"Q"|"b"|"q"} type
 * @param {string} charset
 * @returns {string}
 */
export function encodeWord(input: string | Buffer, type: "B" | "Q" | "b" | "q", charset: string): string;
/**
 * @param {string} input
 * @param {boolean} [consumeSubsequentSeparator]
 * @returns {string}
 */
export function decodeWord(input: string, consumeSubsequentSeparator?: boolean | undefined): string;
//# sourceMappingURL=quoted-printable.d.ts.map
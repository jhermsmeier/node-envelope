export = Header;
/**
 * @extends {Map}
 */
declare class Header extends Map<any, any> {
    /**
     * Parse an email message header
     * @param {Buffer} buffer
     * @param {Number} [offset=0]
     * @param {Number} [length]
     * @returns {Header}
     */
    static parse(buffer: Buffer, offset?: number | undefined, length?: number | undefined): Header;
    /**
     * @param {Header} header
     */
    static format(header: Header): void;
    /**
     * Create a new envelope header
     * @param {...[any, any]} argv
     */
    constructor(...argv: [any, any][]);
    /** @type {Array<Array<string>>} Raw headers */
    raw: Array<Array<string>>;
    /**
     * Parse an email message header
     * @param {Buffer} buffer
     * @param {Number} [offset=0]
     * @param {Number} [length]
     * @returns {Header}
     */
    parse(buffer: Buffer, offset?: number | undefined, length?: number | undefined): Header;
    toString(): void;
}
//# sourceMappingURL=header.d.ts.map
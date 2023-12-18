export = Contact;
declare class Contact {
    /**
     * Parse an address
     * @param {string} value
     * @returns {Contact}
     */
    static parse(value: string): Contact;
    /**
     * Format a contact into a string
     * @param {Contact} obj
     * @returns {string}
     */
    static format(obj: Contact): string;
    /**
     * Create a new Contact
     * @param {string} [address]
     * @param {string} [name]
     */
    constructor(address?: string | undefined, name?: string | undefined);
    /** @type {string} Contact name */
    name: string;
    /** @type {string} Email address */
    address: string;
    /**
     * Parse an address
     * @param {string} value
     * @returns {Contact}
     */
    parse(value: string): Contact;
    /**
     * Stringify the contact
     * @returns {string}
     */
    toString(): string;
}
declare namespace Contact {
    let patterns: Array<[RegExp, number, number?]>;
}
//# sourceMappingURL=contact.d.ts.map
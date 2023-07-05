class JIRAFields {
    constructor(value) {
        try {
            this.value = value;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    project() {
        try {
            return this.value ? { key: this.value } : null;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    parent(key) {
        try {
            if (key) {
                return this.value ? { key } : null;
            }

            return this.value ? { id: this.value } : null;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    issuetype() {
        try {
            return this.value ? { id: this.value } : null;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    text() {
        try {
            return this.value;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    number() {
        try {
            if (isNaN(this.value)) throw new Error.Log('Is NaN');

            return this.value;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    paragraph() {
        try {
            return this.value ? {
                content: [
                    {
                        content: [
                            {
                                text: this.value,
                                type: 'text'
                            }
                        ],
                        type: 'paragraph'
                    }
                ],
                type: 'doc',
                version: 1
            } : null;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    comments(action) {
        try {
            return Array.isArray(this.value) ? this.value.map(value => {
                return {
                    [action || 'add']: {
                        body: {
                            content: [
                                {
                                    content: [
                                        {
                                            text: value,
                                            type: 'text'
                                        }
                                    ],
                                    type: 'paragraph'
                                }
                            ],
                            type: 'doc',
                            version: 1
                        }
                    }
                }
            }) : null;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = JIRAFields;

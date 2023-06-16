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
}

module.exports = JIRAFields;

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
            return { key: this.value };
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    issuetype() {
        try {
            return { id: this.value };
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
            return {
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
            };
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = JIRAFields;

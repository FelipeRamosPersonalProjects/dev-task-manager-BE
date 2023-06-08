class Label {
    constructor(setup) {
        try {
            const { displayName, slug } = Object(setup);

            this.displayName = displayName;
            this.slug = slug;
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

module.exports = Label;

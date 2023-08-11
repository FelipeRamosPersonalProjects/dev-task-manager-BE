class ComponentListener {
    constructor(setup, $wrapper) {
        try {
            const { eventName, selector, handler } = Object(setup);

            this.eventName = eventName;
            this.selector = selector;
            this.handler = handler || Function();
            this.$wrapper = $wrapper;
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    add() {
        this.$wrapper.on(this.eventName, this.selector, this.handler);
    }
}

module.exports = ComponentListener;


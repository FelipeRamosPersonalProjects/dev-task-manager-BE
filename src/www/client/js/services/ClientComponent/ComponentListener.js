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
        this.$wrapper.find(this.selector).on(this.eventName, this.handler);
    }
}

module.exports = ComponentListener;


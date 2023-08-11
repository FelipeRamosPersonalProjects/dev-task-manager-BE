import ClientComponent from '../ClientComponent';

export default class Modal extends ClientComponent {
    constructor(setup, modalCtrl) {
        super(setup);

        try {
            const { openState, path } = Object(setup);

            this.UID = crypto.randomUUID(8).toString('hex');
            this.path = `modals/${path}`;
            this.openState = openState || false;
            this.$wrap = $('<div class="modal" modal="standard"></div>');

            this._modalCtrl = () => modalCtrl;
        } catch (err) {
            throw new Error(err);
        }
    }

    get modalCtrl() {
        return this._modalCtrl()
    }

    open() {
        try {
            if (!this.$wrap || !this.$wrap.length) {
                throw 'The modal no longer exist!';
            }

            this.modalCtrl.closeAll();
            this.$wrap.show();
        } catch (err) {
            throw new Error(err);
        }
    }

    toggleMinimize() {
        try {
            if (!this.$wrap || !this.$wrap.length) {
                throw 'The modal no longer exist!';
            }

            // this.modalCtrl.closeAll();
            this.$wrap.toggleClass('minimize');
        } catch (err) {
            throw err;
        }
    }

    close() {
        try {
            if (!this.$wrap || !this.$wrap.length) {
                throw 'The modal no longer exist!';
            }

            this.$wrap.hide();
        } catch (err) {
            throw new Error(err);
        }
    }

    destroy() {
        try {
            const modalIndex = this.modalCtrl.getModalIndex(this);
            
            this.$wrap.remove();
            this.modalCtrl._modals.splice(modalIndex, 1);
        } catch (err) {
            throw new Error(err);
        }
    }
}

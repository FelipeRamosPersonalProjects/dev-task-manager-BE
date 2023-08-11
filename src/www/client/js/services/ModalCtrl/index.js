import Modal from './Modal';

export default class ModalCtrl {
    constructor(setup) {
        try {
            const { autoOpen } = Object(setup);

            this._autoOpen = autoOpen || false;
            this._currentModal;
            this._modals = [];
        } catch (err) {
            throw err;
        }
    }

    getModalIndex(modal) {
        try {
            return this._modals.indexOf(modal);
        } catch (err) {
            throw err;
        }
    }

    getModal(modalUID) {
        try {
            return this._modals.find(modal => modal.UID === modalUID);
        } catch (err) {
            throw err;
        }
    }
    
    async create(setup) {
        try {
            const modal = new Modal(setup, this);
            await modal.load();

            this._modals.push(modal);

            if (this._autoOpen) {
                modal.open();
            } else {
                modal.close();
            }

            $(this.modalSpot || 'body').append(modal.$wrap);
            return modal;
        } catch (err) {
            throw err;
        }
    }

    async subscribeModal(setup) {
        const { path } = Object(setup);

        try {
            setup.data && (setup.data.isLoading = true);
            const modal = new Modal(setup, this);
            await modal.load();

            this._modals.push(modal);

            if (this._autoOpen) {
                modal.open();
            } else {
                modal.close();
            }

            $(this.modalSpot || 'body').append(modal.$wrap);

            setup.data && (setup.data.isLoading = false);
            socketClient.subscribeComponent({
                ...setup,
                $wrap: modal.$wrap,
                path: 'modals/' + path
            });

            return modal;
        } catch (err) {
            throw err;
        }
    }

    open(modalUID) {
        try {
            const modal = this.getModal(modalUID);
            
            if (modal) {
                modal.open();
            }
        } catch (err) {
            throw err;
        }
    }

    close(modalUID) {
        try {
            const modal = this.getModal(modalUID);
            
            if (modal) {
                modal.close();
            }
        } catch (err) {
            throw err;
        }
    }

    closeAll() {
        try {
            this._modals.map(modal => modal.close());
        } catch (err) {
            throw err;
        }
    }

    destroy(modalUID) {
        try {
            const modal = this.getModal(modalUID);
            
            if (modal) {
                modal.destroy();
            }
        } catch (err) {
            throw err;
        }
    }
}

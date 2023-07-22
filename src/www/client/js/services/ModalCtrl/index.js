import Modal from './Modal';

export default class ModalCtrl {
    constructor(setup) {
        try {
            const { autoOpen } = Object(setup);

            this._autoOpen = autoOpen || false;
            this._currentModal;
            this._modals = [];
        } catch (err) {
            throw new Error(err);
        }
    }

    getModalIndex(modal) {
        try {
            return this._modals.indexOf(modal);
        } catch (err) {
            throw new Error(err);
        }
    }

    getModal(modalUID) {
        try {
            return this._modals.find(modal => modal.UID === modalUID);
        } catch (err) {
            throw new Error(err);
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
            throw new Error(err);
        }
    }

    open(modalUID) {
        try {
            const modal = this.getModal(modalUID);
            
            if (modal) {
                modal.open();
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    close(modalUID) {
        try {
            const modal = this.getModal(modalUID);
            
            if (modal) {
                modal.close();
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    closeAll() {
        try {
            this._modals.map(modal => modal.close());
        } catch (err) {
            throw new Error.Log(err);
        }
    }

    destroy(modalUID) {
        try {
            const modal = this.getModal(modalUID);
            
            if (modal) {
                modal.destroy();
            }
        } catch (err) {
            throw new Error.Log(err);
        }
    }
}

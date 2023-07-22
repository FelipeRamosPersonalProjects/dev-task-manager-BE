import { toggleProgress, toggleEditInput } from './helpers/tools';
import ModalCtrl from './services/ModalCtrl';

window.toggleProgress = toggleProgress;
window.toggleEditInput = toggleEditInput;

// Modal Controller
window.modalCtrl = new ModalCtrl({ autoOpen: true });

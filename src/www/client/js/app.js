import './global.js'
import '../scss/style.scss';
import './components/DocPage.script.js';

// Services
import SocketClient from './services/SocketClient';

window.socketClient = new SocketClient({
    host: 'http://localhost',
    port: 5555
});

const pageID = document.body.getAttribute('pageid');
if (pageID) {
    await import(`/src/www/content/${pageID}/pageScript.js`);
}

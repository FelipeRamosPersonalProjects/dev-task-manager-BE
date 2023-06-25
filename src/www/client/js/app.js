import './global.js'
import '../scss/style.scss';
import './components/DocPage.script.js';

const pageID = document.body.getAttribute('pageid');
if (pageID) {
    await import(`/src/www/content/${pageID}/pageScript.js`);
}

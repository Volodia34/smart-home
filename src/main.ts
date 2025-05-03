import './styles/main.scss';
import { initScene } from './scenes/initScene';


console.log('Проєкт запущено ✅');

const heading = document.createElement('h1');
heading.textContent = 'Smart Home: Старт успішний!';
document.body.appendChild(heading);

initScene();

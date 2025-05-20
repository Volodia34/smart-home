import { Header } from './components/Header/Header';
import { HouseVisualization } from './components/HouseVisualization/HouseVisualization';

export class App {
    private root: HTMLElement;

    constructor() {
        this.root = document.getElementById('root')!;
        this.initLayout();
    }

    private initLayout() {
        const header = new Header();
        this.root.appendChild(header.render());

        const viz = new HouseVisualization(this.root);
    }
}

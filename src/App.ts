import { Header } from './components/Header/Header';
import { HouseVisualization } from './components/HouseVisualization/HouseVisualization';
import { DeviceControls } from './components/DeviceControls/DeviceControls'; // Import the new component

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

        const deviceControls = new DeviceControls();
        this.root.appendChild(deviceControls.render());
    }
}

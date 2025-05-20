import { Header } from './components/Header/Header';
import { HouseVisualization } from './components/HouseVisualization/HouseVisualization';
import { DeviceControls } from './components/DeviceControls/DeviceControls';

export class App {
    private root: HTMLElement;
    private viz?: HouseVisualization;
    private deviceControlsInstance?: DeviceControls;

    constructor() {
        this.root = document.getElementById('root')!;
        if (!this.root) {
            console.error('Root element not found!');
            return;
        }
        this.initLayout();
    }

    private initLayout() {
        const header = new Header();
        this.root.appendChild(header.render());

        this.deviceControlsInstance = new DeviceControls();
        const devicesConfig = this.deviceControlsInstance.getDeviceDefinitions();

        this.viz = new HouseVisualization(this.root, devicesConfig);
        this.root.appendChild(this.deviceControlsInstance.render());
    }

    public destroy() {
        if (this.viz) {
            this.viz.destroy();
        }
        this.root.innerHTML = '';
    }
}

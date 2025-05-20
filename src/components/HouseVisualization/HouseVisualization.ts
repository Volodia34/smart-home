import './HouseVisualization.scss';
import { ThreeScene } from '../../scenes/ThreeScene';
import { SmartDevice } from '../DeviceControls/DeviceControls';

export class HouseVisualization {
    private container: HTMLElement;
    private threeScene: ThreeScene | null = null;

    constructor(parent: HTMLElement, devicesConfig: SmartDevice[]) {
        this.container = document.createElement('div');
        this.container.id = 'scene-container';
        parent.appendChild(this.container);

        this.threeScene = new ThreeScene(this.container, devicesConfig);
    }

    public destroy(): void {
        if (this.threeScene) {
            this.threeScene.dispose();
            this.threeScene = null;
        }
        if (this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

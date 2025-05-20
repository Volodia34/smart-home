import './HouseVisualization.scss';
import { ThreeScene } from '../../scenes/ThreeScene';

export class HouseVisualization {
    private container: HTMLElement;

    constructor(parent: HTMLElement) {
        this.container = document.createElement('div');
        this.container.id = 'scene-container';
        parent.appendChild(this.container);

        new ThreeScene(this.container);
    }
}

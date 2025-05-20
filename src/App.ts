import { Header } from './components/Header/Header';
import { HouseVisualization } from './components/HouseVisualization/HouseVisualization';
import { DeviceControls, SmartDevice } from './components/DeviceControls/DeviceControls';
import { Router } from './Router';
import { OverviewPage } from './pages/OverviewPage';
import { DevicesPage } from './pages/DevicesPage';
import { AboutPage } from './pages/AboutPage';

export class App {
    private root: HTMLElement;
    private router!: Router;
    private headerInstance!: Header;
    private houseVisualizationComponent = HouseVisualization;
    private deviceControlsComponent = DeviceControls;

    constructor() {
        this.root = document.getElementById('root')!;
        if (!this.root) {
            console.error('Root element not found!');
            return;
        }

        this.headerInstance = new Header();
        this.root.appendChild(this.headerInstance.render());

        const pageContentContainer = document.createElement('div');
        pageContentContainer.id = 'page-content';
        this.root.appendChild(pageContentContainer);

        this.router = new Router('page-content');
        this.initRoutes();
    }

    private initRoutes() {
        const tempDeviceControls = new DeviceControls();
        const devicesConfig: SmartDevice[] = tempDeviceControls.getDeviceDefinitions();

        this.router.registerHomePageComponents(
            this.houseVisualizationComponent,
            this.deviceControlsComponent,
            devicesConfig
        );

        this.router.registerDevicesConfig(devicesConfig);

        this.router
            .addRoute('/home', this.houseVisualizationComponent, true)
            .addRoute('/overview', OverviewPage)
            .addRoute('/devices', DevicesPage)
            .addRoute('/about', AboutPage);

        const currentPath = window.location.hash.substring(1) || '/home';
        if (window.location.hash) {
            this.router.navigate(currentPath);
        } else {
            this.router.navigate('/home');
        }
    }

    public destroy() {
        this.root.innerHTML = '';
    }
}

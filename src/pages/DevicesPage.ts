
export class DevicesPage {
    constructor(appRoot: HTMLElement) {}

    public render(): HTMLElement {
        const pageElement = document.createElement('div');
        pageElement.classList.add('page-container');
        pageElement.innerHTML = `
            <h1>All Devices</h1>
            <p>This page will list all smart devices in the home with more detailed controls and information.</p>
            <ul>
                <li>Living Room Lamp - ON</li>
                <li>Kitchen Thermostat - 22°C</li>
                <li>Bedroom Fan - OFF</li>
            </ul>
        `;
        return pageElement;
    }

    public destroy(): void {
        // console.log("DevicesPage destroyed");
    }
}

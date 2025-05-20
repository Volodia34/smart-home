import { SmartDevice, SmartDeviceStatus } from '../components/DeviceControls/DeviceControls';
import './DevicesPage.scss';

export class DevicesPage {
    private devices: SmartDevice[];
    private pageElement: HTMLElement;

    constructor(appRoot: HTMLElement, devicesConfig: SmartDevice[]) {
        this.devices = devicesConfig || [];
        this.pageElement = document.createElement('div');
        this.pageElement.classList.add('page-container', 'devices-page');
        appRoot.appendChild(this.pageElement);
    }

    private createDeviceCard(device: SmartDevice): HTMLElement {
        const card = document.createElement('div');
        card.classList.add('device-list-item');
        card.dataset.deviceId = device.id;

        const isActive = device.status === 'on' ||
            device.status === 'unlocked' ||
            device.status === 'brewing' ||
            (typeof device.status === 'number' && device.status > 0);

        if (isActive) {
            card.classList.add('active');
        }

        const iconEl = document.createElement('div');
        iconEl.classList.add('device-item-icon');
        iconEl.textContent = device.icon;

        const infoEl = document.createElement('div');
        infoEl.classList.add('device-item-info');

        const nameEl = document.createElement('div');
        nameEl.classList.add('device-item-name');
        nameEl.textContent = device.name;
        infoEl.appendChild(nameEl);

        const typeEl = document.createElement('div');
        typeEl.classList.add('device-item-type');
        typeEl.textContent = `Type: ${device.type.charAt(0).toUpperCase() + device.type.slice(1)}`;
        infoEl.appendChild(typeEl);

        if (device.details) {
            const detailsEl = document.createElement('div');
            detailsEl.classList.add('device-item-details');
            detailsEl.textContent = device.details;
            infoEl.appendChild(detailsEl);
        }

        const controlsEl = document.createElement('div');
        controlsEl.classList.add('device-item-controls');

        const statusText = document.createElement('span');
        statusText.classList.add('device-item-status-text');

        const statusToggle = document.createElement('button');
        statusToggle.classList.add('device-item-toggle');

        if (typeof device.status === 'number') {
            statusText.textContent = `Current: ${device.status}°C`;
            statusToggle.textContent = 'Adjust';
        } else {
            statusText.textContent = `Status: ${device.status.toUpperCase()}`;
            statusToggle.textContent = device.status === 'on' || device.status === 'unlocked' || device.status === 'brewing' ? 'Turn OFF' : 'Turn ON';
        }

        controlsEl.appendChild(statusText);
        controlsEl.appendChild(statusToggle);

        statusToggle.addEventListener('click', () => this.handleToggleDevice(device, card, statusToggle, statusText));

        card.appendChild(iconEl);
        card.appendChild(infoEl);
        card.appendChild(controlsEl);

        return card;
    }

    private handleToggleDevice(device: SmartDevice, card: HTMLElement, button: HTMLButtonElement, statusTextElement: HTMLElement): void {
        let newStatus: SmartDeviceStatus = device.status;
        let isActiveAfterToggle = false;

        switch (device.type) {
            case 'light':
            case 'tv':
            case 'fan':
            case 'security_camera':
            case 'speaker':
                newStatus = device.status === 'on' ? 'off' : 'on';
                isActiveAfterToggle = newStatus === 'on';
                break;
            case 'door_lock':
                newStatus = device.status === 'locked' ? 'unlocked' : 'locked';
                isActiveAfterToggle = newStatus === 'unlocked';
                break;
            case 'coffee_maker':
                newStatus = device.status === 'off' ? 'brewing' : 'off';
                isActiveAfterToggle = newStatus === 'brewing';
                break;
            case 'thermostat':
                console.log(`Adjusting ${device.name} (current: ${device.status}°C) - UI for adjustment needed.`);
                document.dispatchEvent(new CustomEvent('deviceUpdate', {
                    detail: { id: device.id, type: device.type, status: device.status }
                }));
                return;
        }

        const deviceInList = this.devices.find(d => d.id === device.id);
        if (deviceInList) {
            deviceInList.status = newStatus;
        }
        device.status = newStatus;

        card.classList.toggle('active', isActiveAfterToggle);

        if (typeof newStatus === 'number') {
            statusTextElement.textContent = `Current: ${newStatus}°C`;
            button.textContent = 'Adjust';
        } else {
            statusTextElement.textContent = `Status: ${newStatus.toUpperCase()}`;
            button.textContent = isActiveAfterToggle ? 'Turn OFF' : 'Turn ON';
        }

        console.log(`DevicesPage UI: ${device.name} (ID: ${device.id}) is now ${newStatus}`);
        document.dispatchEvent(new CustomEvent('deviceUpdate', {
            detail: { id: device.id, status: newStatus, type: device.type }
        }));
    }


    public render(): HTMLElement {
        this.pageElement.innerHTML = '';

        const header = document.createElement('header');
        header.classList.add('devices-page-header');
        header.innerHTML = `
            <h1>Manage Your Smart Devices</h1>
            <p>
                View the status of all connected devices in your home. You can toggle their power,
                monitor their activity, and soon, access more detailed settings for each one.
            </p>
        `;
        this.pageElement.appendChild(header);

        if (this.devices.length === 0) {
            const noDevicesMessage = document.createElement('p');
            noDevicesMessage.textContent = 'No smart devices have been configured yet.';
            noDevicesMessage.classList.add('no-devices-message');
            this.pageElement.appendChild(noDevicesMessage);
            return this.pageElement;
        }

        const deviceListContainer = document.createElement('div');
        deviceListContainer.classList.add('device-list-container');

        this.devices.forEach(device => {
            const deviceCardElement = this.createDeviceCard(device);
            deviceListContainer.appendChild(deviceCardElement);
        });

        this.pageElement.appendChild(deviceListContainer);
        return this.pageElement;
    }

    public destroy(): void {
        // console.log("DevicesPage destroyed");
        this.pageElement.innerHTML = '';
    }
}

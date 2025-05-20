import './DeviceControls.scss';

export interface SmartDevice {
    id: string;
    name: string;
    type: 'light' | 'tv' | 'thermostat' | 'fan' | 'door_lock' | 'security_camera' | 'speaker' | 'coffee_maker' | 'custom';
    icon: string;
    status: SmartDeviceStatus;
    details?: string;
    position3D?: { x: number; y: number; z: number };
}

export type SmartDeviceStatus = 'on' | 'off' | number | 'locked' | 'unlocked' | 'brewing';

export class DeviceControls {
    private element: HTMLElement;
    private devices: SmartDevice[] = [
        {
            id: 'Kitchen_CeilingLight', name: 'Kitchen Ceiling Light', type: 'light', icon: '💡', status: 'off',
            position3D: { x: -7.0, y: 0.5, z: 0.5 }
        },
        {
            id: 'LivingRoom_TV', name: 'Living Room TV', type: 'tv', icon: '📺', status: 'off',
            position3D: { x: -5.0, y: 0.5, z: -1.8 }
        },
        {
            id: 'LivingRoom_CeilingLight', name: 'Living Room Ceiling Light', type: 'light', icon: '💡', status: 'on',
            position3D: { x: -1.5, y: 0.7, z: -4.0 }
        },

        {
            id: 'Kitchen_CoffeeMaker', name: 'Coffee Maker', type: 'coffee_maker', icon: '☕', status: 'off',
            position3D: { x: -10.0, y: -0.6, z: 0.0 }
        },
        {
            id: 'Bedroom1_Lamp_Desk', name: 'Bedroom Desk Lamp', type: 'light', icon: '💡', status: 'off',
            position3D: { x: -10.0, y: 0.7, z: -4.0 }
        },
        {
            id: 'Bedroom1_CeilingFan', name: 'Bedroom Ceiling Fan', type: 'fan', icon: '💨', status: 'off',
            position3D: { x: -10.0, y: -1.0, z: -3.0 }
        },
        {
            id: 'Hall_Thermostat', name: 'Hall Thermostat', type: 'thermostat', icon: '🌡️', status: 22,
            position3D: { x: -4.0, y: -0.5, z: -1.8 }
        },
        {
            id: 'FrontDoor_Lock', name: 'Front Door Lock', type: 'door_lock', icon: '🚪', status: 'locked',
            position3D: { x: -0.5, y: -1.0, z: -1.5 }
        }
    ];

    constructor() {
        this.element = document.createElement('div');
        this.element.classList.add('device-controls-panel');
        this.renderDevices();
    }

    public getDeviceDefinitions(): SmartDevice[] {
        return this.devices;
    }

    private renderDevices(): void {
        const title = document.createElement('h2');
        title.textContent = 'My Devices';
        this.element.appendChild(title);

        const grid = document.createElement('div');
        grid.classList.add('devices-grid');

        this.devices.forEach(device => {
            const deviceCard = this.createDeviceCard(device);
            grid.appendChild(deviceCard);
        });
        this.element.appendChild(grid);
    }

    private createDeviceCard(device: SmartDevice): HTMLElement {
        const card = document.createElement('div');
        card.classList.add('device-card');
        const isActive = device.status === 'on' ||
            device.status === 'unlocked' ||
            device.status === 'brewing' ||
            (typeof device.status === 'number' && device.status > 0);

        if (isActive) {
            card.classList.add('active');
        }

        const iconEl = document.createElement('div');
        iconEl.classList.add('device-icon');
        iconEl.textContent = device.icon;

        const nameEl = document.createElement('div');
        nameEl.classList.add('device-name');
        nameEl.textContent = device.name;

        const statusToggle = document.createElement('button');
        statusToggle.classList.add('status-toggle');

        if (typeof device.status === 'number') {
            statusToggle.textContent = `${device.status}°C`;
        } else {
            statusToggle.textContent = device.status.toUpperCase();
        }

        statusToggle.addEventListener('click', () => this.toggleDeviceStatus(device, card, statusToggle));

        card.appendChild(iconEl);
        card.appendChild(nameEl);

        if (device.details) {
            const detailsEl = document.createElement('div');
            detailsEl.classList.add('device-details');
            detailsEl.textContent = device.details;
            card.appendChild(detailsEl);
        }

        card.appendChild(statusToggle);
        return card;
    }

    private toggleDeviceStatus(device: SmartDevice, card: HTMLElement, button: HTMLButtonElement): void {
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
                console.log(`${device.name} current temp: ${device.status}°C. Click to adjust.`);
                document.dispatchEvent(new CustomEvent('deviceUpdate', {
                    detail: { id: device.id, type: device.type, status: device.status }
                }));
                return;
        }

        device.status = newStatus;
        card.classList.toggle('active', isActiveAfterToggle);

        if (typeof device.status === 'number') {
            button.textContent = `${device.status}°C`;
        } else {
            button.textContent = device.status.toUpperCase();
        }

        console.log(`UI: ${device.name} (ID: ${device.id}) is now ${device.status}`);
        document.dispatchEvent(new CustomEvent('deviceUpdate', {
            detail: { id: device.id, status: device.status, type: device.type }
        }));
    }

    public render(): HTMLElement {
        return this.element;
    }
}

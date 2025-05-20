import './DeviceControls.scss';

export interface SmartDevice {
    id: string;
    name: string;
    type: 'light' | 'tv' | 'thermostat' | 'fan' | 'door_lock' | 'security_camera' | 'speaker' | 'coffee_maker' | 'custom';
    icon: string; // Emoji or SVG path
    status: 'on' | 'off' | number | 'locked' | 'unlocked' | 'brewing'; // Status can vary by device type
    details?: string; // Optional additional details like "Active for 3 hours"
}

export class DeviceControls {
    private element: HTMLElement;
    // розширений список пристроїв
    private devices: SmartDevice[] = [
        { id: 'light1', name: 'Living Room Lamp', type: 'light', icon: '💡', status: 'off' },
        { id: 'light2', name: 'Kitchen Light', type: 'light', icon: '💡', status: 'on' },
        { id: 'tv1', name: 'Main TV', type: 'tv', icon: '📺', status: 'off', details: 'Ready to cast' },
        { id: 'thermostat1', name: 'Main Thermostat', type: 'thermostat', icon: '🌡️', status: 22 },
        { id: 'fan1', name: 'Ceiling Fan', type: 'fan', icon: '💨', status: 'on' },
        { id: 'door1', name: 'Front Door', type: 'door_lock', icon: '🚪', status: 'locked' },
        { id: 'camera1', name: 'Porch Camera', type: 'security_camera', icon: '📹', status: 'on', details: 'Recording...' },
        { id: 'speaker1', name: 'Smart Speaker', type: 'speaker', icon: '🔊', status: 'off' },
        { id: 'coffee1', name: 'Coffee Maker', type: 'coffee_maker', icon: '☕', status: 'off' },
        { id: 'light3', name: 'Bedroom Lamp', type: 'light', icon: '💡', status: 'off'},
        { id: 'light4', name: 'Bathroom Light', type: 'light', icon: '💡', status: 'on'},
        { id: 'tv2', name: 'Bedroom TV', type: 'tv', icon: '📺', status: 'on', details: 'Netflix playing'},

    ];

    constructor() {
        this.element = document.createElement('div');
        this.element.classList.add('device-controls-panel');
        this.renderDevices();
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
        // Визначаємо активний стан для різних типів пристроїв
        const isActive = device.status === 'on' ||
            device.status === 'unlocked' ||
            device.status === 'brewing' ||
            (typeof device.status === 'number' && device.status > 0); // для термостата

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

        // Встановлюємо текст кнопки залежно від статусу та типу
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
        let newStatus: SmartDevice['status'] = device.status;
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
                // Для термостата логіка може бути складнішою (наприклад, відкривати модальне вікно для налаштування)
                // Поки що просто логуємо
                console.log(`${device.name} current temp: ${device.status}°C. Click to adjust.`);
                // Для прикладу, можна додати можливість простого збільшення температури
                // if (typeof device.status === 'number') {
                // newStatus = device.status + 1;
                // isActiveAfterToggle = newStatus > 0;
                // }
                return; // Поки не змінюємо статус термостата простим кліком
        }

        device.status = newStatus;
        card.classList.toggle('active', isActiveAfterToggle);

        if (typeof device.status === 'number') {
            button.textContent = `${device.status}°C`;
        } else {
            button.textContent = device.status.toUpperCase();
        }

        console.log(`${device.name} is now ${device.status}`);
        // Тут ви будете викликати подію для оновлення 3D сцени
        // document.dispatchEvent(new CustomEvent('deviceUpdate', { detail: device }));
    }

    public render(): HTMLElement {
        return this.element;
    }
}

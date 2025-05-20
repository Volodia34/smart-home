import './OverviewPage.scss';
import {SmartDevice} from "../components/DeviceControls/DeviceControls.ts";

export class OverviewPage {
    private devices: SmartDevice[];

    constructor(devicesConfig: SmartDevice[]) {
        this.devices = devicesConfig || [];
    }


    private getActiveDevicesCount(): number {
        return this.devices.filter(device => {
            if (typeof device.status === 'number') return device.status > 0;
            return device.status === 'on' || device.status === 'unlocked' || device.status === 'brewing';
        }).length;
    }

    private getSecurityStatus(): { message: string, details: string, isSecure: boolean } {
        const doorLock = this.devices.find(d => d.type === 'door_lock');
        // Можна додати перевірку камер, якщо вони є в конфігурації
        const securityCameras = this.devices.filter(d => d.type === 'security_camera');
        const activeCameras = securityCameras.filter(c => c.status === 'on').length;

        let doorMessage = "Front door status: Unknown";
        let isDoorLocked = false;
        if (doorLock) {
            isDoorLocked = doorLock.status === 'locked';
            doorMessage = `Front Door: ${isDoorLocked ? 'Locked' : 'Unlocked'}`;
        }

        let cameraMessage = "";
        if (securityCameras.length > 0) {
            cameraMessage = `${activeCameras}/${securityCameras.length} cameras active.`;
        }

        const isSystemSecure = isDoorLocked && (securityCameras.length === 0 || activeCameras > 0); // Приклад логіки безпеки

        return {
            message: isSystemSecure ? 'System Secure' : 'Security Alert',
            details: `${doorMessage}. ${cameraMessage}`,
            isSecure: isSystemSecure
        };
    }

    private getThermostatInfo(): { temperature: string, humidity?: string } {
        const thermostat = this.devices.find(d => d.type === 'thermostat');
        if (thermostat && typeof thermostat.status === 'number') {
            // Можна додати вологість, якщо така інформація є
            return { temperature: `${thermostat.status}°C` };
        }
        return { temperature: 'N/A' };
    }

    private getLightingSummary(): string {
        const lights = this.devices.filter(d => d.type === 'light');
        const onLights = lights.filter(l => l.status === 'on').length;
        if (lights.length === 0) return "No smart lights configured.";
        return `${onLights} of ${lights.length} lights are currently on.`;
    }

    public render(): HTMLElement {
        const pageElement = document.createElement('div');
        pageElement.classList.add('page-container', 'overview-page');

        const activeDevicesCount = this.getActiveDevicesCount();
        const security = this.getSecurityStatus();
        const thermostat = this.getThermostatInfo();
        const lightingSummary = this.getLightingSummary();
        const userName = "Homeowner"; // Можна отримувати з налаштувань або автентифікації

        pageElement.innerHTML = `
            <header class="overview-header">
                <h1>Welcome to Your Smart Home, ${userName}!</h1>
                <p class="welcome-message">
                    Here's a quick overview of your home's status. Manage your devices,
                    check security, and control your environment with ease.
                </p>
            </header>

            <section class="key-metrics">
                <div class="metric-card">
                    <div class="metric-icon">💡</div>
                    <div class="metric-label">Lighting</div>
                    <div class="metric-value">${lightingSummary}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon">🌡️</div>
                    <div class="metric-label">Climate</div>
                    <div class="metric-value">Temp: ${thermostat.temperature}</div>
                </div>
                <div class="metric-card ${security.isSecure ? 'secure' : 'insecure'}">
                    <div class="metric-icon">${security.isSecure ? '🛡️' : '⚠️'}</div>
                    <div class="metric-label">Security</div>
                    <div class="metric-value">${security.message}</div>
                    <small class="metric-details">${security.details}</small>
                </div>
                <div class="metric-card">
                    <div class="metric-icon">🔌</div>
                    <div class="metric-label">Active Devices</div>
                    <div class="metric-value">${activeDevicesCount} / ${this.devices.length}</div>
                </div>
            </section>

            <section class="info-panel">
                <h2>Home Status Insights</h2>
                <p>
                    Your smart home system is currently monitoring ${this.devices.length} devices.
                    The overview provides real-time updates on critical aspects such as home security,
                    ambient temperature, and lighting conditions. Use the quick actions below or navigate
                    to the 'Devices' page for more granular control.
                </p>
                <p>
                    Remember to check your security camera feeds if you have them enabled, especially
                    if the system indicates any security alerts. You can also create custom scenes
                    and automations to make your home even smarter!
                </p>
            </section>

            <section class="quick-actions">
                <h2>Quick Actions & Scenes</h2>
                <p>Activate common routines or control groups of devices with a single tap.</p>
                <div class="actions-grid">
                    <button class="action-button" data-action="all_lights_on">
                        <span class="action-icon">💡</span> All Lights On
                    </button>
                    <button class="action-button" data-action="all_lights_off">
                        <span class="action-icon">🌑</span> All Lights Off
                    </button>
                    <button class="action-button" data-action="secure_home">
                        <span class="action-icon">🔒</span> Secure Home
                    </button>
                    <button class="action-button" data-action="movie_time">
                        <span class="action-icon">🎬</span> Movie Time
                    </button>
                     <button class="action-button" data-action="good_morning">
                        <span class="action-icon">☀️</span> Good Morning
                    </button>
                    <button class="action-button" data-action="good_night">
                        <span class="action-icon">🌙</span> Good Night
                    </button>
                </div>
            </section>
        `;

        pageElement.querySelectorAll('.action-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const action = (event.currentTarget as HTMLElement).dataset.action;
                console.log(`Quick Action: ${action} triggered.`);
                alert(`Action: ${action} (Implementation pending)`);
            });
        });

        return pageElement;
    }

    public destroy(): void {
        // console.log("OverviewPage destroyed");
    }
}

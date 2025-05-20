export class OverviewPage {
    private appRoot: HTMLElement;

    constructor(appRoot: HTMLElement) {
        this.appRoot = appRoot;
    }

    public render(): HTMLElement {
        const pageElement = document.createElement('div');
        pageElement.classList.add('page-container');
        pageElement.innerHTML = `
            <h1>Overview</h1>
            <p>This is the smart home overview page. Here you might see a summary of device statuses, energy consumption, etc.</p>
            <p>Current time: ${new Date().toLocaleTimeString()}</p>
        `;
        return pageElement;
    }

    public destroy(): void {
    }
}

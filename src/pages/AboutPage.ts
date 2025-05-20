export class AboutPage {
    constructor(appRoot: HTMLElement) {}

    public render(): HTMLElement {
        const pageElement = document.createElement('div');
        pageElement.classList.add('page-container');
        pageElement.innerHTML = `
            <h1>About Smart Home UI</h1>
            <p>This application is a course project demonstrating an object-oriented approach to building a smart home interface with 3D visualization.</p>
            <p><strong>Technologies Used:</strong></p>
            <ul>
                <li>Vite</li>
                <li>TypeScript</li>
                <li>Three.js</li>
                <li>SCSS</li>
            </ul>
        `;
        return pageElement;
    }

    public destroy(): void {
    }
}

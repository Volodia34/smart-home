import './AboutPage.scss';

export class AboutPage {
    private appRoot?: HTMLElement;
    private devicesConfig?: any[];

    constructor(appRoot?: HTMLElement, devicesConfig?: any[]) {
        this.appRoot = appRoot;
        this.devicesConfig = devicesConfig;
    }

    public render(): HTMLElement {
        const pageElement = document.createElement('div');
        pageElement.classList.add('page-container', 'about-page');

        if (this.appRoot) {
            this.appRoot.innerHTML = '';
        }
        if (this.devicesConfig) {
            console.log('Devices configuration:', this.devicesConfig);
        }

        const projectSection = document.createElement('section');
        projectSection.innerHTML = `
            <h2><span class="icon">💡</span> About the "Smart Home" Project</h2>
            <p>
                Welcome to the "Smart Home" control interface! This project is
                a term paper developed to demonstrate an object-oriented
                approach to creating interactive web applications.
            </p>
            <p>
                The main goal was to create an intuitive user interface
                that allows for the visualization of a 3D model of a house and interaction
                with its virtual devices in real-time. You can control lighting,
                appliances, climate control systems, and security, observing the changes
                directly on the three-dimensional model.
            </p>
            <p>
                The project was developed with an emphasis on modularity, scalability, and clean code,
                utilizing modern web technologies.
            </p>
        `;

        const techSection = document.createElement('section');
        techSection.innerHTML = `
            <h2><span class="icon">🛠️</span> Technology Stack</h2>
            <p>The following set of technologies was used to implement this project:</p>
            <ul class="tech-list">
                <li>
                    <strong>Vite:</strong> A modern build tool for fast web application development.
                    It provides instant Hot Module Replacement (HMR) and an optimized build process.
                </li>
                <li>
                    <strong>TypeScript:</strong> A typed superset of JavaScript that enables the creation
                    of more reliable and scalable applications through static typing and support
                    for object-oriented programming.
                </li>
                <li>
                    <strong>Three.js:</strong> A powerful library for creating and displaying 3D graphics
                    in a web browser using WebGL. It is used for rendering the house model
                    and interactive elements.
                </li>
                <li>
                    <strong>SCSS (Sass):</strong> A CSS preprocessor that extends the capabilities of standard CSS,
                    allowing the use of variables, nesting, mixins, and other useful features
                    for writing cleaner and more organized style code.
                </li>
                <li>
                    <strong>Vanilla JS (OOP):</strong> The core application logic is built on pure JavaScript
                    using object-oriented programming principles to structure
                    components and their interactions.
                </li>
            </ul>
        `;

        const authorSection = document.createElement('section');
        authorSection.innerHTML = `
            <h2><span class="icon">👨‍💻</span> About the Developer</h2>
            <p>
                This term project was developed by Volodia Kisil,
                a student of Lviv University of Trade and Economics, group 251.
            </p>
            <p>
                The aim of this work was to deepen knowledge in web technologies, 3D graphics, and
                object-oriented programming, as well as to create a functional
                prototype of a "Smart Home" system.
            </p>
            <p>
                Thank you for your time and attention to this project!
            </p>
        `;

        pageElement.appendChild(projectSection);
        pageElement.appendChild(techSection);
        pageElement.appendChild(authorSection);

        return pageElement;
    }

    public destroy(): void {
        // console.log("AboutPage destroyed");
    }
}

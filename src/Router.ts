interface Route {
    path: string;
    component: { new (appRoot: HTMLElement, ...args: any[]): { render: () => HTMLElement | void; destroy?: () => void } } | (() => HTMLElement);
    isDefault?: boolean;
}

export class Router {
    private routes: Route[] = [];
    private appRoot: HTMLElement;
    private currentComponent: { render: () => HTMLElement | void; destroy?: () => void } | null = null;
    private homePageComponents: {
        visualization: any;
        controls: any;
        config: any[];
    } | null = null;


    constructor(appRootElementId: string) {
        this.appRoot = document.getElementById(appRootElementId)!;
        if (!this.appRoot) {
            console.error(`Router: Element with ID '${appRootElementId}' not found.`);
            return;
        }
        window.addEventListener('hashchange', this.handleRouteChange.bind(this));
        this.handleRouteChange();
    }

    public addRoute(path: string, component: Route['component'], isDefault: boolean = false): Router {
        this.routes.push({ path, component, isDefault });
        return this;
    }

    public registerHomePageComponents(visualization: any, controls: any, config: any[]): void {
        this.homePageComponents = { visualization, controls, config };
    }

    private handleRouteChange(): void {
        const hash = window.location.hash || '#/'; // Якщо хешу немає, вважаємо це головною
        const path = hash.startsWith('#') ? hash.substring(1) : hash; // Видаляємо '#'

        let route = this.routes.find(r => r.path === path);

        if (!route) {
            route = this.routes.find(r => r.isDefault);
        }

        if (this.currentComponent && this.currentComponent.destroy) {
            this.currentComponent.destroy();
        }
        this.appRoot.innerHTML = ''; // Очищуємо попередній контент

        if (route) {
            if (path === '/home' || (route.isDefault && (path === '/' || path === ''))) {
                if (this.homePageComponents) {
                    const vizInstance = new this.homePageComponents.visualization(this.appRoot, this.homePageComponents.config);

                    const controlsInstance = new this.homePageComponents.controls();
                    this.appRoot.appendChild(controlsInstance.render());

                    this.currentComponent = {
                        render: () => {},
                        destroy: () => {
                            if (vizInstance && vizInstance.destroy) vizInstance.destroy();
                            this.appRoot.innerHTML = '';
                        }
                    };
                } else {
                    console.error("Home page components not registered in router!");
                    this.appRoot.innerHTML = '<h2>Home Page Components Missing</h2>';
                }
            } else {
                if (typeof route.component === 'function' && route.component.prototype && route.component.prototype.render) {
                    const componentInstance = new (route.component as any)(this.appRoot);
                    if (componentInstance.render) {
                        const element = componentInstance.render();
                        if (element instanceof HTMLElement) {
                            this.appRoot.appendChild(element);
                        }
                    }
                    this.currentComponent = componentInstance;
                } else if (typeof route.component === 'function') {
                    const element = (route.component as () => HTMLElement)();
                    this.appRoot.appendChild(element);
                    this.currentComponent = null;
                }
            }
        } else {
            this.appRoot.innerHTML = '<h2>404 - Page Not Found</h2>';
            this.currentComponent = null;
        }
    }

    public navigate(path: string): void {
        window.location.hash = path;
    }
}

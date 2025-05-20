export class Header {
    private navLinks: NodeListOf<HTMLAnchorElement> | null = null;
    private navMenu: HTMLElement | null = null;
    private hamburgerIcon: HTMLElement | null = null;

    public render(): HTMLElement {
        const el = document.createElement('header');
        el.classList.add('header');

        el.innerHTML = `
          <div class="logo">🏠 Smart Home</div>
          <nav>
            <button class="hamburger-icon" aria-label="Toggle menu" aria-expanded="false">
              <span class="hamburger-icon-bar"></span>
              <span class="hamburger-icon-bar"></span>
              <span class="hamburger-icon-bar"></span>
            </button>
            <ul class="nav-menu">
              <li><a href="#/home" class="nav-link">Home</a></li>
              <li><a href="#/overview" class="nav-link">Overview</a></li>
              <li><a href="#/devices" class="nav-link">Devices</a></li>
              <li><a href="#/about" class="nav-link">About</a></li>
            </ul>
          </nav>
        `;

        const toggleButton = document.createElement('button');
        toggleButton.classList.add('theme-toggle');
        toggleButton.textContent = '🌓 Theme';

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.setAttribute('data-theme', savedTheme);
        }

        toggleButton.addEventListener('click', () => {
            const current = document.body.getAttribute('data-theme') ?? 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });

        const navElement = el.querySelector('nav');
        if (navElement) {
            navElement.appendChild(toggleButton);
        }

        this.navLinks = el.querySelectorAll('nav .nav-link');
        this.navMenu = el.querySelector<HTMLElement>('nav .nav-menu');
        this.hamburgerIcon = el.querySelector<HTMLElement>('.hamburger-icon');

        if (this.hamburgerIcon && this.navMenu) {
            this.hamburgerIcon.addEventListener('click', () => {
                const isExpanded = this.hamburgerIcon?.getAttribute('aria-expanded') === 'true' || false;
                this.hamburgerIcon?.setAttribute('aria-expanded', (!isExpanded).toString());
                this.navMenu?.classList.toggle('is-active');
            });
        }

        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.navMenu?.classList.contains('is-active')) {
                    this.hamburgerIcon?.setAttribute('aria-expanded', 'false');
                    this.navMenu.classList.remove('is-active');
                }
            });
        });

        window.addEventListener('hashchange', this.updateActiveLink.bind(this));
        this.updateActiveLink();

        return el;
    }

    private updateActiveLink(): void {
        if (!this.navLinks) return;

        const currentHash = window.location.hash || '#/home';
        this.navLinks.forEach(link => {
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active-link');
            } else {
                link.classList.remove('active-link');
            }
        });
    }
}

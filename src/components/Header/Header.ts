export class Header {
    private navLinks: NodeListOf<HTMLAnchorElement> | null = null;

    public render(): HTMLElement {
        const el = document.createElement('header');
        el.classList.add('header');

        el.innerHTML = `
          <div class="logo">🏠 Smart Home</div>
          <nav>
            <ul>
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


        el.appendChild(toggleButton);

        this.navLinks = el.querySelectorAll('nav .nav-link');
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

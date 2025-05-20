export class Header {
    public render(): HTMLElement {
        const el = document.createElement('header');
        el.classList.add('header');

        el.innerHTML = `
      <div class="logo">🏠 Smart Home</div>
      <nav>
        <ul>
          <li><a href="#/home">Home</a></li>
          <li><a href="#/overview">Overview</a></li>
          <li><a href="#/devices">Devices</a></li>
          <li><a href="#/about">About</a></li>
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

        return el;
    }
}

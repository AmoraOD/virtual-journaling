export interface PageController {
    init(): void;
    destroy?(): void;
}

type Route = {
    path: string;
    page: string;
    title: string;
    controller?: () => Promise<PageController>;
};

const routes: Route[] = [
    { path: "/", page: "journal.html", title: "Journal", controller: () => import("../controller/journal_controller.js"), },
    { path: "/login", page: "login.html", title: "Login", },
    { path: "/menu", page: "menu.html", title: "Menu", },
];

const DEFAULT_ROUTE = "/";

export class Router {
    private outlet: HTMLElement;
    private basePath: string;
    private currentController: PageController | null = null;
    private navigationToken = 0;

    constructor(outletSelector: string, basePath = "/src/public/pages/") {
        const outlet = document.querySelector<HTMLElement>(outletSelector);
        if (!outlet) throw new Error(`Outlet não encontrada: ${outletSelector}`);

        this.outlet = outlet;
        this.basePath = basePath;
    }

    public Start(): void {
        window.addEventListener("hashchange", () => this.handleRoute());
        document.addEventListener("click", (e) => this.handleNavClick(e));

        this.handleRoute();
    }

    public navigate(path: string): void {
        const target = `#${path}`;

        if (window.location.hash === target) this.handleRoute();
        else window.location.hash = target;
    }

    private handleNavClick(event: MouseEvent): void {
        const el = (event.target as HTMLElement).closest<HTMLElement>("[data-route]");

        if (!el?.dataset.nav) return;
        event.preventDefault();
        this.navigate(el.dataset.nav);
    }

    private getCurrentPath(): string {
        const hash = window.location.hash.replace(/^#/, "");
        return hash === "" ? DEFAULT_ROUTE : hash;
    }

    private async handleRoute(): Promise<void> {
        const path = this.getCurrentPath();

        const route =
            routes.find(r => r.path === path) ??
            routes.find(r => r.path === DEFAULT_ROUTE)!;

        const token = ++this.navigationToken;

        this.currentController?.destroy?.();
        this.currentController = null;
        this.outlet.innerHTML = "";

        try {
            const response = await fetch(`${this.basePath}${route.page}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const html = await response.text();

            if (token !== this.navigationToken) return;
            this.outlet.innerHTML = html;

            //Se a rota tem controller, importa e inicializa
            if (route.controller) {
                const mod = await route.controller();
                if (token !== this.navigationToken) return;

                this.currentController = mod;
                mod.init();
            }

            window.scrollTo({ top: 0, behavior: "smooth" });

            document.title = `${route.title} | My Virtual Journaling`;
            this.updateActiveLink(route.path);

        } catch (err) {
            console.error("Erro ao carregar rota:", err);
            this.outlet.innerHTML = `
                <div class="p-5 text-center">
                    <h2>Página não encontrada</h2>
                    <p>Ocorreu um erro ao carregar o conteúdo.</p>
                </div>`;
        }
    }

    private updateActiveLink(activePath: string): void {
        document.querySelectorAll<HTMLAnchorElement>("[data-route]").forEach(a => {
            const linkPath = (a.dataset.nav ?? "").replace(/^#/, "");
            const isActive = linkPath === activePath;

            a.classList.toggle("active", isActive);
            a.setAttribute("aria-current", isActive ? "page" : "false");
        });
    }
}
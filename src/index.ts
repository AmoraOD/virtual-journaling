interface journal_state {
    isOpen:boolean;
    currentPage: number;
}

class VirtualJournal{
    private cover: HTMLElement;
    private pages: HTMLElement;
    private pageContainer: HTMLElement;

    private backButton: HTMLElement;
    private prevButton: HTMLElement;
    private nextButton: HTMLElement;
    private addPageButton: HTMLElement;

    private pageIndicator: HTMLElement;
    private state: journal_state;
    private pagesElements: HTMLElement[] = [];

    private changeColorButton: HTMLElement;
    private colorOptions: HTMLElement;
    private coverText: HTMLElement;

    constructor() {
        this.cover      = document.getElementById("journal-cover")!;
        this.pages      = document.getElementById("journal-pages")!;
        this.pageContainer = document.getElementById("page-container")!;

        this.backButton = document.getElementById("back-to-cover")!;
        this.prevButton = document.getElementById("prev-page")!;
        this.nextButton = document.getElementById("next-page")!;

        this.addPageButton = document.getElementById("add-page")!;
        this.pageIndicator = document.getElementById("indicator")!;

        this.changeColorButton = document.getElementById("change-color")!;
        this.colorOptions      = document.getElementById("color-options")!;
        this.coverText         = document.querySelector(".cover-text") as HTMLElement;

        this.state  = {
            isOpen: false,
            currentPage: 0,
        };

        this.Start();
    }

    private Start(): void {
        this.cover.addEventListener('click', () => this.openJournal());
        this.backButton.addEventListener('click', () => this.closeJournal());

        this.prevButton.addEventListener('click', () => this.prevPage());
        this.nextButton.addEventListener('click', () => this.nextPage());
        this.addPageButton.addEventListener('click', () => this.addPage());

        this.backButton.classList.add('hidden');
        this.pages.classList.add('hidden');

        this.changeColorButton.addEventListener('click', () => this.toggleColorOptions());

        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.config-journal')) {
                this.colorOptions.classList.add('hidden');
            }
        });

        this.addPage(false);
        this.showPage(0);
        this.buildColorOptions();
    }

    private openJournal(): void {
        if (this.state.isOpen) return;
        this.state.isOpen = true;
        this.cover.classList.add('opened');

        this.pages.classList.remove('hidden');
        this.backButton.classList.remove('hidden');
    }

    private closeJournal(): void {
        if (!this.state.isOpen) return;
        this.state.isOpen = false;

        this.cover.classList.remove('opened');
        this.backButton.classList.add('hidden');

        const handleCoverClose = (event : TransitionEvent) => {
            if (event.propertyName !== 'transform') return;

            this.cover.removeEventListener('transitionend', handleCoverClose);
            this.pages.classList.add('hidden');
        };

        this.cover.addEventListener('transitionend', handleCoverClose);
    }

    private createPageElement(): HTMLElement {
        const page = document.createElement('div');
        page.className = 'page';

        const content = document.createElement('div');
        
        content.className = 'page-content';
        content.contentEditable = 'true';
        
        page.appendChild(content);

        return page;
    }

    private addPage(showAfterAdd: boolean = true): void {
        const newPage = this.createPageElement();
        this.pagesElements.push(newPage);
        this.pageContainer.appendChild(newPage);

        if (showAfterAdd) { this.showPage(this.pagesElements.length - 1); }
    }

    private showPage(index:number) : void {
        if (index < 0 || index >= this.pagesElements.length) return;
        this.state.currentPage = index;

        this.pagesElements.forEach((page, i) => {
            page.style.display = (i === index) ? 'flex' : 'none';
        });

        this.pageIndicator.textContent = `${index + 1}`;
    }

    private nextPage(): void{
        if (this.state.currentPage < this.pagesElements.length - 1) {
            this.showPage(this.state.currentPage + 1);
        }
    }

    private prevPage(): void{
        if (this.state.currentPage > 0) {
            this.showPage(this.state.currentPage - 1);
        }
    }

    private readonly coverColors: string[] = [
        '#b6bfd3', // azul (padrão)
        '#7a342f', // vinho
        '#84a87b', // verde sálvia
        '#9d87b9', // lavanda
        '#bb8e41', // Amarelo
        '#d49f8f', // terracota
        '#898a8f', // cinza
    ];

    private buildColorOptions(): void {
    this.coverColors.forEach((color) => {
        const swatch = document.createElement('button');

        swatch.className = 'swatch';
        swatch.style.backgroundColor = color;

        swatch.setAttribute('aria-label', `Cor ${color}`);
        swatch.addEventListener('click', (e) => {
            e.stopPropagation();
            this.applyCoverColor(color);
            this.colorOptions.classList.add('hidden');
        });

        this.colorOptions.appendChild(swatch);
    });
}

    private toggleColorOptions(): void {
        this.colorOptions.classList.toggle('hidden');
    }

    private applyCoverColor(hex: string): void {
        const lighter = this.shade(hex, 0.15);
        const darker = this.shade(hex, -0.45);

        this.cover.style.setProperty('--cover-light', lighter);
        this.cover.style.setProperty('--cover-dark', hex);
        this.cover.style.setProperty('--cover-text', darker);
    }

    /**
     * Clareia (percent > 0) ou escurece (percent < 0) uma cor hex.
     * @param hex  Cor no formato "#rrggbb"
     * @param percent  Ex.: -0.4 = 40% mais escuro; 0.15 = 15% mais claro
     */
    private shade(hex: string, percent: number): string {
        const n = parseInt(hex.replace('#', ''), 16);

        const adjust = (channel: number): number => {
            // Se percent < 0, escurece multiplicando; se > 0, clareia em direção a 255.
            const v = Math.round(
                channel + (percent < 0 ? channel * percent : (255 - channel) * percent)
            );
            
            return Math.max(0, Math.min(255, v));
        };

        const r = adjust((n >> 16) & 0xff);
        const g = adjust((n >> 8) & 0xff);
        const b = adjust(n & 0xff);

        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VirtualJournal();
});
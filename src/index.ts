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

    constructor() {
        this.cover      = document.getElementById("journal-cover")!;
        this.pages      = document.getElementById("journal-pages")!;
        this.pageContainer = document.getElementById("page-container")!;

        this.backButton = document.getElementById("back-to-cover")!;
        this.prevButton = document.getElementById("prev-page")!;
        this.nextButton = document.getElementById("next-page")!;

        this.addPageButton = document.getElementById("add-page")!;
        this.pageIndicator = document.getElementById("indicator")!;

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

        this.addPage(false);
        this.showPage(0);
    }

    private openJournal(): void {
        if (this.state.isOpen) return;
        this.state.isOpen = true;
        this.cover.classList.add('opened');

        setTimeout(() => {
            this.pages.classList.remove('hidden');
            this.backButton.classList.remove('hidden');
        }, 400);
    }

    private closeJournal(): void {
        if (!this.state.isOpen) return;
        this.state.isOpen = false;
        this.pages.classList.add('hidden');

        setTimeout(() => {
            this.cover.classList.remove('opened');
            this.backButton.classList.add('hidden');
        }, 500);
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
            page.style.display = (1 === index) ? 'flex' : 'none';
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
}

document.addEventListener('DOMContentLoaded', () => {
    new VirtualJournal();
});
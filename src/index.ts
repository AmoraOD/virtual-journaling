interface journal_state {
    isOpen:boolean;
    currentPage: number;
}

class VirtualJournal{
    private cover: HTMLElement;
    private pages: HTMLElement;
    private backButton: HTMLElement;
    private state: journal_state;

    constructor() {
        this.cover      = document.getElementById("journal-cover")!;
        this.pages      = document.getElementById("journal-pages")!;
        this.backButton = document.getElementById("back-to-cover")!;
        this.state  = {
            isOpen: false,
            currentPage: 0,
        };

        this.Start();
    }

    private Start(): void {
        this.cover.addEventListener('click', () => this.openJournal());

        this.backButton.addEventListener('click', () => this.closeJournal());
    }

    private openJournal(): void {
        if (this.state.isOpen) return;
        this.state.isOpen = true;
        this.cover.classList.add('opened');

        setTimeout(() => {
            this.pages.classList.remove('hidden');
        }, 400);
    }

    private closeJournal(): void {
        if (!this.state.isOpen) return;
        this.state.isOpen = false;
        this.pages.classList.add('hidden');

        setTimeout(() => {
            this.cover.classList.remove('opened');
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VirtualJournal();
});
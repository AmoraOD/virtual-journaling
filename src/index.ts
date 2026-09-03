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

    private Start(): void{
        this.cover.addEventListener('click', () => this.openJournal());

        this.backButton.addEventListener('click', () => this.closeJournal());
    }

    private openJournal(): void{}

    private closeJournal(): void{}
}
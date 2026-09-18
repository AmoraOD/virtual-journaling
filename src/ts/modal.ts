interface modal_state{
    content: string | HTMLElement;
    onClose: boolean;
}

class ModalBox{
    private options: modal_state;
    private container: HTMLElement;
    private overlay: HTMLDivElement;

    constructor(){
        this.container = document.createElement('div');
        this.overlay   = document.createElement('div');

        this.options = {
            content: 'teste',
            onClose: false,
        }

        this.Start();
    }

    private Start(): void{

    }
}

export default ModalBox;
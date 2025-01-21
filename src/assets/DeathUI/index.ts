import Player from '../player'

class DeathUI {
    public display = false;

    constructor(private readonly deathUIContent: HTMLDivElement, private readonly restartButton: HTMLButtonElement,private readonly player: Player) {
        deathUIContent.classList.add(`display-${this.display}`);
    
        this.update();
        this.buttonEvent();
    }

    update() {
        this.player.ctx.onDeath(() => {
            this.display = true;
            this.deathUIContent.classList.replace('display-false', 'display-true');
        })
    }

    buttonEvent() {
        this.restartButton.onclick = (e) => {
            document.location = '/'
        }
    }
}

export default DeathUI;
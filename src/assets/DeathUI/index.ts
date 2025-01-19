class DeathUI {
    public display = false;

    constructor(private readonly deathUIContent: HTMLInputElement) {
        deathUIContent.classList.add(`display-${this.display}`);
    }
}
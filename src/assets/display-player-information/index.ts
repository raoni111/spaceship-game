class DisplayPlayerInformation {
    protected coinElement: HTMLSpanElement = document.getElementById('coin-amount-content') as HTMLSpanElement;
    protected heartElement: HTMLSpanElement = document.getElementById('heart-amount-content') as HTMLSpanElement;

    displayCoin(coin: number) {
        this.coinElement.textContent = `${coin}`;
    }

    displayHeart(health: number) {
        this.heartElement.textContent = `${health}%`;
    }
}

export default DisplayPlayerInformation
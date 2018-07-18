export class LoaderView extends PIXI.Text {

    constructor() {
        super('loading...', {
            fontSize: 50,
            fill: 0xff0f0f,
        })
        this.anchor.set(0.5);
        PIXI.loader.on('progress', (loader) => {
            this.text = `loading ${loader.progress}%`;
        });
    }
}

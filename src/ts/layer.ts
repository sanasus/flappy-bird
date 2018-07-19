import "pixi-layers";
let topGroup: PIXI.display.Group;
let topLayer: PIXI.display.Layer;

export function addDisplayGroups(App: PIXI.Application): void {
    let stage = new PIXI.display.Stage();
    stage.group.enableSort = true;
    App.stage = stage;

    topGroup = new PIXI.display.Group(1, true);
    // topGroup.on('sort', (sprite: any) => {
    //     sprite.zOrder = -sprite.y;
    // });

    topLayer = new PIXI.display.Layer(topGroup);
    App.stage.addChild(topLayer);
}
export { topGroup, topLayer };
export function hitTestRectangle(r1: any, r2: any[]) {
    let hit, combinedHalfWidths: number[] = [], combinedHalfHeights: number[] = [], vx: number[] = [], vy: number[] = [];
    hit = false;

    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.forEach(el => {
        el.centerX = el.x + el.width / 2;
        el.centerY = el.y + el.height / 2;
        el.halfWidth = el.width / 2;
        el.halfHeight = el.height / 2;
    });
    //original r1.width / 2
    r1.halfWidth = r1.width / 3;
    r1.halfHeight = r1.height / 3;

    r2.forEach((el, i) => {
        vx.push(r1.centerX - el.centerX);
        vy.push(r1.centerY - el.centerY);
        combinedHalfWidths.push(r1.halfWidth + el.halfWidth);
        combinedHalfHeights.push(r1.halfHeight + el.halfHeight);
    });


    for (let i = 0; i < r2.length; i++) {
        vx[i] = r1.centerX - r2[i].centerX;
        vy[i] = r1.centerY - r2[i].centerY;
        combinedHalfWidths[i] = r1.halfWidth + r2[i].halfWidth;
        combinedHalfHeights[i] = r1.halfHeight + r2[i].halfHeight;
        if (Math.abs(vx[i]) < combinedHalfWidths[i]) {
            if (Math.abs(vy[i]) < combinedHalfHeights[i]) {
                return hit = true;
            } else {
                hit = false;
            }
        } else {
            hit = false;
        }
        
    }
    return hit;
};
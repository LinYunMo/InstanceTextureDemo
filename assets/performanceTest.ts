
const {ccclass, property} = cc._decorator;

class BunnyMarkData {
    speedX = 0;
    speedY = 0;
    owner: cc.Node = null;
    innerText = '';

    get x (){
        return this.owner.x;
    }

    get y (){
        return this.owner.y;
    }
}

const bunnyDatas: any[] = [];

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    staticRoot: cc.Node = null;

    @property(cc.Node)
    moveRoot: cc.Node = null;

    @property(cc.Label)
    moveNumber: cc.Label = null;
    @property(cc.Label)
    staticNumber: cc.Label = null;

    @property([cc.Prefab])
    prefabFrames: cc.Prefab[] = [];

    private constNum = 500;

    private maxX = 0;
    private minX = 0;
    private maxY = 0;
    private minY = 0;

    private moveCount = 0;
    private staticCount = 0;

    private currentPrefab: cc.Prefab = null;

    gravity = 0.5;

    onLoad() {
        this.moveCount= 0;
        this.staticCount = 0;

        this.maxX = cc.winSize.width / 2;
        this.maxY = cc.winSize.height / 2;
        this.minX = -this.maxX;
        this.minY = -this.maxY;

        this.currentPrefab = this.prefabFrames[0];
    }

    addMoveNode(){
        let parent = this.moveRoot as cc.Node;

        for(let i = 0; i < this.constNum; i++) {
            let bunny = cc.instantiate(this.currentPrefab);
            const data = new BunnyMarkData();
            data.speedX = Math.random() * 10;
            data.speedY = (Math.random() * 10) - 5;
            data.owner = bunny;
            bunny.setPosition(this.minX + 10, this.maxY * 0.7, 0);
            bunny.anchorY = 1;
            bunny.setScale(0.3, 0.3, 1);
            bunnyDatas.push(data);

            parent.addChild(bunny);
            this.moveCount++;
        }
        let random = Math.floor(Math.random() * 10);
        this.currentPrefab = this.prefabFrames[random];

        this.moveNumber.string = this.moveCount.toString();
    }

    removeMoveNode(){
        // todo
        let parent = this.moveRoot as cc.Node;
        for(let i = 0; i < this.constNum; i++) {
            let child = parent.children[parent.children.length - 1 - i];
            child.destroy();
            bunnyDatas.pop();
            this.moveCount--;
        }

        this.moveNumber.string = this.moveCount.toString();
    }

    addStaticNode(){
        let parent = this.staticRoot as cc.Node;

        for(let i = 0; i < this.constNum; i++) {
            let bunny = cc.instantiate(this.currentPrefab);
            let x = (Math.random() - 0.5) * cc.winSize.width;
            let y = (Math.random() - 0.5) * cc.winSize.height;
            bunny.setPosition(x, y, 0);
            bunny.setScale(0.3, 0.3, 1);

            parent.addChild(bunny);
            this.staticCount++;
        }

        let random = Math.floor(Math.random() * 10);
        this.currentPrefab = this.prefabFrames[random];
        this.staticNumber.string = this.staticCount.toString();
    }

    removeStaticNode(){
        // todo
        let parent = this.staticRoot as cc.Node;
        for(let i = 0; i < this.constNum; i++) {
            let child = parent.children[parent.children.length - 1 - i];
            child.destroy();
            this.staticCount--;
        }

        this.staticNumber.string = this.staticCount.toString();
    }

    update (dt) {
        let parent = this.moveRoot as cc.Node;
        let child;
        for(let i = 0; i < parent.children.length; i++){
            //let child = parent.children[i];
            const bunny = bunnyDatas[i];
            let speedX = bunny.speedX;
            let speedY = bunny.speedY;
            let x = bunny.x + speedX;
            let y = bunny.y - speedY;
            speedY += this.gravity;
            if (x > this.maxX) {
                speedX = -1 * speedX;
                x = this.maxX;
            } else if (x < this.minX) {
                speedX = -1 * speedX;
                x = this.minX;
            }

            if (y < this.minY) {
                speedY = -0.85 * speedY;
                y = this.minY;
                if (Math.random() > 0.5) {
                    speedY = speedY - Math.random() * 6.0;
                }
            } else if (y > this.maxY) {
                speedY = 0.0;
                y = this.maxY;
            }

            bunny.speedX = speedX;
            bunny.speedY = speedY;
            bunny.owner.setPosition(x, y, 0);
        }
    }
}

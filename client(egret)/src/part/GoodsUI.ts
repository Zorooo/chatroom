class GoodsUI extends eui.Component {

    constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompHandler, this);
        this.skinName = "resource/custom_skins/goodsUISkin.exml";
    }

    private uiCompHandler(): void {
        console.log("\t\tGoodsUI uiCompHandler");
        this.btn_send.addEventListener(egret.TouchEvent.TOUCH_TAP,this.sendMessage,this);
        /// 填充数据
        // var dsListHeros: Array<Object> = [
        //     { icon: "goods01_png", goodsName: "魔法石", comment: "法力加成 +3" }
        //     , { icon: "goods02_png", goodsName: "诅咒娃娃", comment: "咒术加成 +3" }
        //     , { icon: "goods03_png", goodsName: "万圣戒指", comment: "敏捷加成 +3" }
        //     , { icon: "goods04_png", goodsName: "斗篷", comment: "耐力加成 +3" }
        //     , { icon: "goods05_png", goodsName: "鹅毛笔", comment: "精神加成 +3" }
        //     , { icon: "goods06_png", goodsName: "血滴子", comment: "嗜血加成 +3" }
        //     , { icon: "goods07_png", goodsName: "屠龙刀", comment: "力量加成 +5" }
        // ];
        // this.listGoods.itemRenderer = GoodsListIRSkin;
        // this.listGoods.dataProvider = new eui.ArrayCollection(dsListHeros);
        this.ws = new WebSocket('ws://127.0.0.1:8888');
        this.ws.onopen = function(e){
            console.log('Connection to server opened');
        }
		var nickname;
		var self = this;
		this.ws.onmessage = function (e) {
			var data = JSON.parse(e.data);
			nickname = data.nickname;
			appendLog(data.type, data.nickname, data.message, data.clientcount);
			console.log("ID: [%s] = %s", data.id, data.message);
			//插入消息
			self.group_msg.addChild(self.newLabel(data.nickname, data.message))
		}
        function appendLog(type, nickname, message, clientcount) {
			console.log(clientcount)
		}
    }
    /**发送消息 */
	private sendMessage() {
		var message = "cxk";
		if (message.length < 1) {
			// console.log("不能发送空内容！");
			return;
		}
		this.ws.send(message);
	}
    private ws:WebSocket;
    private num:number = 1;
    private newLabel(name: string, msg: string) {
        this.num ++;
		var label1: eui.Label = new eui.Label();
		label1.text = name + ":" + msg;
		label1.textColor = 0x000000;
        label1.y = this.num * 20;
		return label1;
	}
    private onButtonClick(e: egret.TouchEvent) {
        this.sendMessage();
    }

    protected createChildren(): void {
        super.createChildren();

    }
    public group_msg:eui.Group;
    public listGoods: eui.List;
    public collection: eui.ArrayCollection;
    public btn_send:eui.Button;
}

class GoodsListIRSkin extends eui.ItemRenderer {


    public goodName: eui.Label;
    public comment: eui.Label;
    public icon: eui.Image;

    constructor() {
        super();
        this.skinName = "resource/custom_skins/goodsListIRSkin.exml";
    }


    protected dataChanged(): void {
        if(!this.data)return;
        this.goodName.text = this.data.goodsName;
        this.comment.text = this.data.comment;
        this.icon.source = this.data.icon;
    }

}
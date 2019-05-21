var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GoodsUI = (function (_super) {
    __extends(GoodsUI, _super);
    function GoodsUI() {
        var _this = _super.call(this) || this;
        _this.num = 1;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.uiCompHandler, _this);
        _this.skinName = "resource/custom_skins/goodsUISkin.exml";
        return _this;
    }
    GoodsUI.prototype.uiCompHandler = function () {
        console.log("\t\tGoodsUI uiCompHandler");
        this.btn_send.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sendMessage, this);
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
        this.ws.onopen = function (e) {
            console.log('Connection to server opened');
        };
        var nickname;
        var self = this;
        this.ws.onmessage = function (e) {
            var data = JSON.parse(e.data);
            nickname = data.nickname;
            appendLog(data.type, data.nickname, data.message, data.clientcount);
            console.log("ID: [%s] = %s", data.id, data.message);
            //插入消息
            self.group_msg.addChild(self.newLabel(data.nickname, data.message));
        };
        function appendLog(type, nickname, message, clientcount) {
            console.log(clientcount);
        }
    };
    /**发送消息 */
    GoodsUI.prototype.sendMessage = function () {
        var message = "cxk";
        if (message.length < 1) {
            // console.log("不能发送空内容！");
            return;
        }
        this.ws.send(message);
    };
    GoodsUI.prototype.newLabel = function (name, msg) {
        this.num++;
        var label1 = new eui.Label();
        label1.text = name + ":" + msg;
        label1.textColor = 0x000000;
        label1.y = this.num * 20;
        return label1;
    };
    GoodsUI.prototype.onButtonClick = function (e) {
        this.sendMessage();
    };
    GoodsUI.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
    };
    return GoodsUI;
}(eui.Component));
__reflect(GoodsUI.prototype, "GoodsUI");
var GoodsListIRSkin = (function (_super) {
    __extends(GoodsListIRSkin, _super);
    function GoodsListIRSkin() {
        var _this = _super.call(this) || this;
        _this.skinName = "resource/custom_skins/goodsListIRSkin.exml";
        return _this;
    }
    GoodsListIRSkin.prototype.dataChanged = function () {
        if (!this.data)
            return;
        this.goodName.text = this.data.goodsName;
        this.comment.text = this.data.comment;
        this.icon.source = this.data.icon;
    };
    return GoodsListIRSkin;
}(eui.ItemRenderer));
__reflect(GoodsListIRSkin.prototype, "GoodsListIRSkin");
//# sourceMappingURL=GoodsUI.js.map
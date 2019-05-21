/**
 * @copyright www.egret.com
 * @author city
 * @desc 这个列表的项渲染器放在了一个EXML文件中(goodsListIRSki
 *      n.exml)，通过设置List实例的itemRenderer属性指向E
 *      XML皮肤类名为其渲染器。
 */

class Main extends eui.UILayer {
    /**
     * 加载进度界面
     * loading process interface
     */
    private loadingView: LoadingUI;
    protected createChildren(): void {
        super.createChildren();
        
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        this.stage.registerImplementation("eui.IAssetAdapter",assetAdapter);
        this.stage.registerImplementation("eui.IThemeAdapter",new ThemeAdapter());
        
        //Config loading process interface
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        
        // initialize the Resource loading library
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }
    
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("loading");
    }
    private isThemeLoadEnd: boolean = false;
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the 
     */
    private onThemeLoadComplete(): void {
        console.log( "theme load ok:", egret.getTimer() );
        this.isThemeLoadEnd = true;
        this.createScene();
    }
    private isResourceLoadEnd: boolean = false;
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        switch (event.groupName ) {
            case "loading":
                console.log( "loading ok:", egret.getTimer() );
                if( this.loadingView.parent ){
                    this.loadingView.parent.removeChild( this.loadingView );
                }

                this._trueLoadingUI = new TrueLoadingUI();
                this.loadPage( "home" );
                break;
            case "home":
                console.log( "home ok:", egret.getTimer() );
                /// clearRESEvents
                this.isResourceLoadEnd = true;
                this.createScene();
                break;
        } 
    }
    
    private clearRESEvents():void{
        //RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        //RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR,this.onResourceLoadError,this);
        //RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
        //RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR,this.onItemLoadError,this);
    }
    
    private createScene(){
        console.log( "createScene:", this.isThemeLoadEnd, this.isResourceLoadEnd );
        if(this.isThemeLoadEnd && this.isResourceLoadEnd){
            this.startCreateScene();
        }
    }
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    }
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        switch (event.groupName) {
            case "loading":
                this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
                break;
            default :
                this._trueLoadingUI.setProgress(event.itemsLoaded, event.itemsTotal);
                break;
        }
    }
    /**
     * 创建场景界面
     * Create scene interface
     */
    private _goodsUI:GoodsUI;

    private _txInfo:egret.TextField;
    
    protected startCreateScene(): void {

        if( this._trueLoadingUI.parent ){
            this._trueLoadingUI.parent.removeChild( this._trueLoadingUI );
        }
        
        this._goodsUI = new GoodsUI();
        // this._goodsUI.horizontalCenter = 0;

        /// 提示信息 （该部分不参与布局）
        // this._txInfo = new egret.TextField;
        // this.addChild( this._txInfo );

        // this._txInfo.size = 28;
        // this._txInfo.x = 50;
        // this._txInfo.y = 50;
        // this._txInfo.textAlign = egret.HorizontalAlign.LEFT;
        // this._txInfo.textColor = 0x000000;
        // this._txInfo.type = egret.TextFieldType.DYNAMIC;
        // this._txInfo.lineSpacing = 6;
        // this._txInfo.multiline = true;
        // this._txInfo.text =
        //     "这是一个游戏中典型的物品列表实例";

        this.addChildAt( this._goodsUI,1000);
        // console.log( "Main.ts this._homeUI:", this._goodsUI.width, this._goodsUI.height );
    }
    
    loadPage( pageName:string ):void{
        this.addChild( this._trueLoadingUI );
        this.idLoading = pageName;
        switch ( pageName ){
            case "goods":
                RES.loadGroup( "heros_goods" );
                break;
            default :
                RES.loadGroup( pageName );
                break;
        }
    }
    private idLoading:string;
    
    private _trueLoadingUI:TrueLoadingUI;

}

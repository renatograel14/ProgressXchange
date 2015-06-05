import commonModule = require("./sidedrawer-common");
import viewModule = require("ui/core/view");
import contentView = require("ui/content-view");
import frame = require("ui/frame");
import utils = require("utils/utils");
import dependencyObservable = require("ui/core/dependency-observable");
import proxy = require("ui/core/proxy");
import bindable = require("ui/core/bindable");

////////////////////////////////////////////////
//native api declarations
declare class NSObject {
    static new(); NSObject;
}

declare class TKSideDrawer {
    static new(): TKSideDrawer;

    initWithHostview(UIView): TKSideDrawer;

    transition: TKSideDrawerTransitionType;
    position: TKSideDrawerPosition;
    isVisible: boolean;
    width: number;
    style: any;
    delegate: TKSideDrawerDelegate;

    footerView: any;
    headerView: any;
    hostview: any;
    content: any;

    show(): void;
    showWithTransition(transition: TKSideDrawerTransitionType): void;
    dismiss(): void;
}

declare class TKSideDrawerView{
    static new(): TKSideDrawerView;
    static alloc(); any;
    mainView: UIView;
    sideDrawerContentView :any;
    sideDrawer: TKSideDrawer;
    initWithFrameMainView(frame: CGRect, mainView: UIView): TKSideDrawerView;
}

declare class TKSideDrawerDelegate {
    static new(): TKSideDrawerDelegate;
}

declare class TKSideDrawerStyle { }; //todo: consider usage of this type for custom styling

declare enum TKSideDrawerTransitionType {
    TKSideDrawerTransitionTypeSlideInOnTop,
    TKSideDrawerTransitionTypeReveal,
    TKSideDrawerTransitionTypePush,
    TKSideDrawerTransitionTypeSlideAlong,
    TKSideDrawerTransitionTypeReverseSlideOut,
    TKSideDrawerTransitionTypeScaleUp,
    TKSideDrawerTransitionTypeFadeIn,
    TKSideDrawerTransitionTypeScaleDownPusher
    // TKSideDrawerTransitionTypeCustom //custom not allowed for now
}

declare enum TKSideDrawerPosition {
    TKSideDrawerPositionLeft,
    TKSideDrawerPositionRight,
    TKSideDrawerPositionTop,
    TKSideDrawerPositionBottom
}

////////////////////////////////////////////////

export class SideDrawer extends commonModule.SideDrawer {

    private _delegate: TKSideDrawerDelegateImpl;
    private _delegateHandler : any;
    set delegate(newDelegate : any){
        this._delegateHandler = newDelegate;
    }
    get delegate() {
        return this._delegateHandler;
    }

    private _ios: TKSideDrawerView;
    get ios(): TKSideDrawerView {
        return this._ios;
    }

    public _mainContentHost: contentView.ContentView;
    public _drawerContentHost: contentView.ContentView;

    constructor() {
        super();
        this._mainContentHost = new contentView.ContentView();
        this._drawerContentHost = new contentView.ContentView();

        this._ios = TKSideDrawerView.alloc().initWithFrameMainView(UIScreen.mainScreen().bounds, this._mainContentHost.ios);
        this._ios.sideDrawerContentView = this._drawerContentHost.ios;

        this._delegate = TKSideDrawerDelegateImpl.new().initWithOwner(this);

        this._ios.sideDrawer.width = this.drawerContentSize;
        this._ios.sideDrawer.style.blurType = 0;
        this._ios.sideDrawer.headerView = null;
        this._ios.sideDrawer.footerView = null;
    }

    //data changed event handlers
    protected _onDrawerLocationChanged(eventData: dependencyObservable.PropertyChangeData) {
        var valueString : string = eventData.newValue.toString();
        var newLocation : commonModule.SideDrawerLocation = commonModule.SideDrawerLocation[valueString];
        switch(newLocation){
            case commonModule.SideDrawerLocation.Left:
                this._ios.sideDrawer.position = TKSideDrawerPosition.TKSideDrawerPositionLeft;
                break;
            case commonModule.SideDrawerLocation.Right:
                this._ios.sideDrawer.position = TKSideDrawerPosition.TKSideDrawerPositionRight;
                break;
            case commonModule.SideDrawerLocation.Top:
                this._ios.sideDrawer.position = TKSideDrawerPosition.TKSideDrawerPositionTop;
                break;
            case commonModule.SideDrawerLocation.Bottom:
                this._ios.sideDrawer.position = TKSideDrawerPosition.TKSideDrawerPositionBottom;
                break;
        }
    }

    protected _onDrawerContentSizeChanged(eventData: dependencyObservable.PropertyChangeData){
        var value : number = eventData.newValue;
        this._ios.sideDrawer.width = value;
    }
    protected _onDrawerTransitionChanged(eventData : dependencyObservable.PropertyChangeData){
        var value : commonModule.DrawerTransitionBase = eventData.newValue;
        this._ios.sideDrawer.transition = value.getNativeContent();
    }

    protected _onMainContentChanged(eventData: dependencyObservable.PropertyChangeData) {
        var drawer = <SideDrawer>eventData.object;
        var newContent = <viewModule.View> eventData.newValue;
        if (newContent instanceof viewModule.View) {
            drawer._mainContentHost.content = newContent;
        }
    }

    protected _onDrawerContentChanged(eventData: dependencyObservable.PropertyChangeData) {
        var drawer = <SideDrawer>eventData.object;
        var newContent = <viewModule.View> eventData.newValue;
        if (newContent instanceof viewModule.View) {
            drawer._drawerContentHost.content = newContent;
        }
    }

    get _nativeView(): TKSideDrawerView {
        return this._ios;
    }

    public closeDrawer(): void {
        this._ios.sideDrawer.dismiss();
    }

    public showDrawer() {
        this._ios.sideDrawer.show();
    }

    public showDrawerWithTransition(transition: commonModule.DrawerTransitionBase) {
        this._ios.sideDrawer.showWithTransition(transition.getNativeContent());
    }

    public dismiss() {
        this._ios.sideDrawer.dismiss();
    }

    public onLoaded() {
        this._addView(this._mainContentHost);
        this._addView(this._drawerContentHost);
        this._ios.sideDrawer.delegate = this._delegate;

        super.onLoaded();
        //this._ios.viewController = frame.topmost().currentPage.ios;
    }

    public onUnloaded() {
        this._removeView(this._mainContentHost);
        this._removeView(this._drawerContentHost);
        super.onUnloaded();
    }

    public _onBindingContextChanged(oldValue: any, newValue: any) {
        super._onBindingContextChanged(oldValue, newValue);
        if (this._mainContentHost instanceof viewModule.View) {
            this._mainContentHost.bindingContext = this.bindingContext;
        }
        if (this._drawerContentHost instanceof viewModule.View) {
            this._drawerContentHost.bindingContext = this.bindingContext;
        }
    }

    public onLayout(left: number, top: number, right: number, bottom: number): void {
        var width = right - left;
        var height = bottom - top;
        this._drawerContentHost.layout(0, 0, this.drawerContentSize, height);
        this._mainContentHost.layout(0, 0, width, height);
    }

    public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void {
        viewModule.View.measureChild(this, this._drawerContentHost, utils.layout.makeMeasureSpec(this.drawerContentSize, utils.layout.EXACTLY), heightMeasureSpec);
        var result = viewModule.View.measureChild(this, this._mainContentHost, widthMeasureSpec, heightMeasureSpec);
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var widthAndState = viewModule.View.resolveSizeAndState(result.measuredWidth, width, widthMode, 0);
        var heightAndState = viewModule.View.resolveSizeAndState(result.measuredHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    }
}

////////////////////////////////////////////////
//              TRANSITIONS
////////////////////////////////////////////////

export class FadeTransition extends commonModule.DrawerTransitionBase{
    getNativeContent() : any{
        return TKSideDrawerTransitionType.TKSideDrawerTransitionTypeFadeIn;
    }
}

export class PushTransition extends commonModule.DrawerTransitionBase{
    getNativeContent() : any{
        return TKSideDrawerTransitionType.TKSideDrawerTransitionTypePush;
    }
}

export class RevealTransition extends commonModule.DrawerTransitionBase{
    getNativeContent() : any{
        return TKSideDrawerTransitionType.TKSideDrawerTransitionTypeReveal;
    }
}

export class ReverseSlideOutTransition extends commonModule.DrawerTransitionBase{
    getNativeContent() : any{
        return TKSideDrawerTransitionType.TKSideDrawerTransitionTypeReverseSlideOut;
    }
}

export class ScaleDownPusherTransition extends commonModule.DrawerTransitionBase{
    getNativeContent() : any{
        return TKSideDrawerTransitionType.TKSideDrawerTransitionTypeScaleDownPusher;
    }
}

export class ScaleUpTransition extends commonModule.DrawerTransitionBase{
    getNativeContent() : any{
        return TKSideDrawerTransitionType.TKSideDrawerTransitionTypeScaleUp;
    }
}

export class SlideAlongTransition extends commonModule.DrawerTransitionBase{
    getNativeContent() : any{
        return TKSideDrawerTransitionType.TKSideDrawerTransitionTypeSlideAlong;
    }
}

export class SlideInOnTopTransition extends commonModule.DrawerTransitionBase{
    getNativeContent() : any{
        return TKSideDrawerTransitionType.TKSideDrawerTransitionTypeSlideInOnTop;
    }
}

////////////////////////////////////////////////
//      Delegate implementation
////////////////////////////////////////////////
class TKSideDrawerDelegateImpl extends NSObject implements TKSideDrawerDelegate {
    public static ObjCProtocols = [TKSideDrawerDelegate];

    static new(): TKSideDrawerDelegateImpl {
        return <TKSideDrawerDelegateImpl>super.new();
    }

    private _owner: SideDrawer;

    public initWithOwner(owner: SideDrawer): TKSideDrawerDelegateImpl {
        this._owner = owner;
        return this;
    }

    willShowSideDrawer(sideDrawer: SideDrawer){
        if (this._owner.delegate && (typeof this._owner.delegate.willShowSideDrawer === 'function')){
            this._owner.delegate.willShowSideDrawer();
        }
    };
    didShowSideDrawer(sideDrawer: SideDrawer){
        if (this._owner.delegate && (typeof this._owner.delegate.didShowSideDrawer === 'function')){
            this._owner.delegate.didShowSideDrawer(sideDrawer);
        }
    };
    willDismissSideDrawer(sideDrawer: SideDrawer){
        if (this._owner.delegate && (typeof this._owner.delegate.willDismissSideDrawer === 'function')){
            this._owner.delegate.willDismissSideDrawer(sideDrawer);
        }
    };
    didDismissSideDrawer(sideDrawer: SideDrawer){
        if (this._owner.delegate && (typeof this._owner.delegate.didDismissSideDrawer === 'function')){
            this._owner.delegate.didDismissSideDrawer(sideDrawer);
        }
    };
}

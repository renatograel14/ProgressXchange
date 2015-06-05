import common = require("./sidedrawer-common");
import view = require("ui/core/view");
import dependencyObservable = require("ui/core/dependency-observable");
import proxy = require("ui/core/proxy");
import utils = require("utils/utils");
import bindable = require("ui/core/bindable");

declare module com {
    module telerik {
        module android {
            module primitives {
                module widget {
                    module sidedrawer {
                        class RadSideDrawer {
                            constructor(any)
                        }
                        enum DrawerLocation{ LEFT, RIGHT, TOP, BOTTOM}
                        module transitions{
                            class PushTransition{}
                            class FadeTransition{}
                            class RevealTransition{}
                            class ReverseSlideOutTransition{}
                            class ScaleDownPusherTransition{}
                            class ScaleUpTransition{}
                            class SlideAlongTransition{}
                            class SlideInOnTopTransition{}
                        }
                    }
                }
            }
        }
    }
}

export class SideDrawer extends common.SideDrawer {

    private _android: any;

    constructor() {
        super();
    }

    _createUI() {
        this._android = new com.telerik.android.primitives.widget.sidedrawer.RadSideDrawer(this._context);
        this._android.setDrawerSize(utils.layout.getDisplayDensity() * this.drawerContentSize);
        this.android.setDrawerTransition(this.drawerTransition.getNativeContent());
        if (this.drawerLocation) {
            this.setDrawerLocation(common.SideDrawerLocation[this.drawerLocation.toString()]);
        }
    }

    get android(): any {
        return this._android;
    }

    public onLoaded() {
        this._addView(this.mainContent);
        this._addView(this.drawerContent);

        super.onLoaded();
    }

    public onUnloaded() {
        this._removeView(this.mainContent);
        this._removeView(this.drawerContent);

        super.onUnloaded();
    }

    protected _onDrawerSizeChanged(data: dependencyObservable.PropertyChangeData) {
        if (!this.android) {
            return;
        }

        if (data.newValue) {
            this.android.setDrawerSize(java.lang.Integer.valueOf(data.newValue));
        }
    }

    protected _onDrawerContentChanged(data: dependencyObservable.PropertyChangeData) {
        if (!this.android) {
            return;
        }

        if (data.oldValue) {
            this.android.setDrawerContent(undefined);

            if (this.isLoaded) {
                this._removeView(data.oldValue);
            }
        }

        if (data.newValue) {
            //This will automatically add the native content in the _addViewToNativeVisualTree...override
            data.newValue.bindingContext = this.bindingContext;
            this._addView(data.newValue);
        }
    }

    protected _onMainContentChanged(data: dependencyObservable.PropertyChangeData) {
        if (!this.android) {
            return;
        }

        if (data.oldValue) {
            this.android.setMainContent(undefined);

            if (this.isLoaded) {
                this._removeView(data.oldValue);
            }
        }

        if (data.newValue) {
            //This will automatically add the native content in the _addViewToNativeVisualTree...override
            data.newValue.bindingContext = this.bindingContext;
            this._addView(data.newValue);
        }
    }

    protected _onDrawerTransitionChanged(data: dependencyObservable.PropertyChangeData) {
        var newTransition = <common.DrawerTransitionBase>data.newValue;
        if (!newTransition) {
            return;
        }
        if (this.android) {
            this.android.setDrawerTransition(newTransition.getNativeContent());
        }
    }

    protected _onDrawerLocationChanged(data: dependencyObservable.PropertyChangeData) {
        super._onDrawerLocationChanged(data);

        if (!this.android) {
            return;
        }

        if (!data.newValue) {
            return;
        }

        var newLocation: string = data.newValue;
        this.setDrawerLocation(common.SideDrawerLocation[newLocation]);
    }

    private setDrawerLocation(newLocation: common.SideDrawerLocation) {
        if (newLocation === common.SideDrawerLocation.Left) {
            this.android.setDrawerLocation(com.telerik.android.primitives.widget.sidedrawer.DrawerLocation.LEFT);
        } else if (newLocation === common.SideDrawerLocation.Top) {
            this.android.setDrawerLocation(com.telerik.android.primitives.widget.sidedrawer.DrawerLocation.TOP);
        } else if (newLocation === common.SideDrawerLocation.Right) {
            this.android.setDrawerLocation(com.telerik.android.primitives.widget.sidedrawer.DrawerLocation.RIGHT);
        } else if (newLocation === common.SideDrawerLocation.Bottom) {
            this.android.setDrawerLocation(com.telerik.android.primitives.widget.sidedrawer.DrawerLocation.BOTTOM);
        }
    }

    public _onBindingContextChanged(oldValue: any, newValue: any) {
        super._onBindingContextChanged(oldValue, newValue);

        if (this.mainContent instanceof view.View) {
            this.mainContent.bindingContext = newValue;
        }

        if (this.drawerContent instanceof view.View) {
            this.drawerContent.bindingContext = newValue;
        }
    }

    public _addViewToNativeVisualTree(child: view.View): boolean {
        if (this._android && child.android) {
            if (this.mainContent === child) {
                this._android.setMainContent(child.android);
                return true;
            }

            if (this.drawerContent === child) {
                this._android.setDrawerContent(child.android);
                return true;
            }
        }

        return false;
    }

    public _removeViewFromNativeVisualTree(child: view.View): void {
        if (this._android && child.android) {
            if (this.mainContent === child) {
                this._android.setMainContent(null);
                (<any>child)._isAddedToNativeVisualTree = false;
            }

            if (this.drawerContent === child) {
                this._android.setDrawerContent(null);
                (<any>child)._isAddedToNativeVisualTree = false;
            }
        }
    }

    public closeDrawer(): void {
        if (this.android) {
            this.android.setIsOpen(false);
        }
    }

    public showDrawer(): void {
        if (this.android) {
            this.android.setIsOpen(true);
        }
    }

    public showDrawerWithTransition(transition: common.DrawerTransitionBase): void {
        if (this.android) {
            this.android.setDrawerTransition(transition.getNativeContent());
            this.showDrawer();
        }
    }
}

export class DrawerTransitionBase extends bindable.Bindable implements common.DrawerTransitionBase {
    getNativeContent(): any {
        return undefined;
    }
}

export class FadeTransition extends DrawerTransitionBase {
    getNativeContent(): any {
        return new com.telerik.android.primitives.widget.sidedrawer.transitions.FadeTransition();
    }
}

export class PushTransition extends DrawerTransitionBase {
    getNativeContent(): any {
        return new com.telerik.android.primitives.widget.sidedrawer.transitions.PushTransition();
    }
}

export class RevealTransition extends DrawerTransitionBase {
    getNativeContent(): any {
        return new com.telerik.android.primitives.widget.sidedrawer.transitions.RevealTransition();
    }
}

export class ReverseSlideOutTransition extends DrawerTransitionBase {
    getNativeContent(): any {
        return new com.telerik.android.primitives.widget.sidedrawer.transitions.ReverseSlideOutTransition();
    }
}

export class ScaleDownPusherTransition extends DrawerTransitionBase {
    getNativeContent(): any {
        return new com.telerik.android.primitives.widget.sidedrawer.transitions.ScaleDownPusherTransition();
    }
}

export class ScaleUpTransition extends DrawerTransitionBase {
    getNativeContent(): any {
        return new com.telerik.android.primitives.widget.sidedrawer.transitions.ScaleUpTransition();
    }
}

export class SlideAlongTransition extends DrawerTransitionBase {
    getNativeContent(): any {
        return new com.telerik.android.primitives.widget.sidedrawer.transitions.SlideAlongTransition();
    }
}

export class SlideInOnTopTransition extends DrawerTransitionBase {
    getNativeContent(): any {
        return new com.telerik.android.primitives.widget.sidedrawer.transitions.SlideInOnTopTransition();
    }
}

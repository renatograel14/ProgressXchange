import dependencyObservable = require("ui/core/dependency-observable");
import proxy = require("ui/core/proxy");
import view = require("ui/core/view");

export enum SideDrawerLocation {
    Left,
    Right,
    Top,
    Bottom
}

export class DrawerTransitionBase{
    getNativeContent() : any {
        return undefined;
    };
}

export class SideDrawer extends view.View {//implements definition.SideDrawer {

    public static drawerTransitionProperty = new dependencyObservable.Property(
        "drawerTransition",
        "SideDrawer",
        new proxy.PropertyMetadata(
            undefined,
            dependencyObservable.PropertyMetadataSettings.AffectsLayout,
            SideDrawer.onDrawerTransitionChanged));

    private static onDrawerTransitionChanged(eventData: dependencyObservable.PropertyChangeData) {
        var classInstance = <SideDrawer>eventData.object;
        classInstance._onDrawerTransitionChanged(eventData);
    }

    public static drawerContentSizeProperty = new dependencyObservable.Property(
        "drawerContentSize",
        "SideDrawer",
        new proxy.PropertyMetadata(
            280,
            dependencyObservable.PropertyMetadataSettings.AffectsLayout,
            SideDrawer.onDrawerContentSizeChanged));

    private static onDrawerContentSizeChanged(eventData: dependencyObservable.PropertyChangeData) {
        var classInstance = <SideDrawer>eventData.object;
        classInstance._onDrawerContentSizeChanged(eventData);
    }

    public static drawerLocationProperty = new dependencyObservable.Property(
        "drawerLocation",
        "SideDrawer",
        new proxy.PropertyMetadata(
            SideDrawerLocation.Left,
            dependencyObservable.PropertyMetadataSettings.AffectsLayout,
            SideDrawer.onDrawerLocationPropertyChanged));

    private static onDrawerLocationPropertyChanged(eventData: dependencyObservable.PropertyChangeData) {
        var classInstance = <SideDrawer>eventData.object;
        classInstance._onDrawerLocationChanged(eventData);
    }

    public static mainContentProperty = new dependencyObservable.Property(
        "mainContent",
        "SideDrawer",
        new proxy.PropertyMetadata(
            undefined,
            dependencyObservable.PropertyMetadataSettings.AffectsLayout,
            SideDrawer._onMainContentPropertyChanged));

    private static _onMainContentPropertyChanged(eventData: dependencyObservable.PropertyChangeData) {
        var classInstance = <SideDrawer>eventData.object;
        classInstance._onMainContentChanged(eventData);
    }

    public static drawerContentProperty = new dependencyObservable.Property(
        "drawerContent",
        "SideDrawer",
        new proxy.PropertyMetadata(
            undefined,
            dependencyObservable.PropertyMetadataSettings.AffectsLayout,
            SideDrawer._onDrawerContentPropertyChanged));

    private static _onDrawerContentPropertyChanged(eventData: dependencyObservable.PropertyChangeData) {
        var classInstance = <SideDrawer>eventData.object;
        classInstance._onDrawerContentChanged(eventData);
    }

    protected _onMainContentChanged(eventData: dependencyObservable.PropertyChangeData) { };

    protected _onDrawerContentChanged(eventData: dependencyObservable.PropertyChangeData) { };

    protected _onDrawerLocationChanged(eventData: dependencyObservable.PropertyChangeData) { };

    protected _onDrawerTransitionChanged(eventData: dependencyObservable.PropertyChangeData) { };

    protected _onDrawerContentSizeChanged(eventData: dependencyObservable.PropertyChangeData) { };

    get drawerTransition(): DrawerTransitionBase {
        return this._getValue(SideDrawer.drawerTransitionProperty);
    }
    set drawerTransition(value: DrawerTransitionBase) {
        this._setValue(SideDrawer.drawerTransitionProperty, value);
    }

    get drawerContentSize(): number {
        return this._getValue(SideDrawer.drawerContentSizeProperty);
    }
    set drawerContentSize(value: number) {
        this._setValue(SideDrawer.drawerContentSizeProperty, value);
    }

    get drawerLocation(): SideDrawerLocation {
        return this._getValue(SideDrawer.drawerLocationProperty);
    }
    set drawerLocation(value: SideDrawerLocation) {
        this._setValue(SideDrawer.drawerLocationProperty, value);
    }

    get drawerContent(): view.View {
        return this._getValue(SideDrawer.drawerContentProperty);
    }
    set drawerContent(value: view.View) {
        this._setValue(SideDrawer.drawerContentProperty, value);
    }

    get mainContent(): view.View {
        return this._getValue(SideDrawer.mainContentProperty);
    }
    set mainContent(value: view.View) {
        this._setValue(SideDrawer.mainContentProperty, value);
    }

    get delegate(): any {
        return undefined;
    }

    set delegate(value: any) { };

    public showDrawer(): void { }

    public closeDrawer(): void { }

    public showDrawerWithTransition(transition: DrawerTransitionBase): void { }

    get _childrenCount(): number {
        var count = 0;
        if (this.drawerContent) {
            count++;
        }
        if (this.mainContent) {
            count++;
        }

        return count;
    }

    public _eachChildView(callback: (child: view.View) => boolean) {

        if (this.mainContent) {
            callback(this.mainContent);
        }

        if (this.drawerContent) {
            callback(this.drawerContent);
        }
    }

    get android(): any {
        return undefined;
    }

    get ios(): any {
        return undefined;
    }
}

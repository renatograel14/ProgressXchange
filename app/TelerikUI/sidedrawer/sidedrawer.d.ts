declare module "sidedrawer" {
    import view = require("ui/core/view");
    import dependencyObservable = require("ui/core/dependency-observable");
    import bindable = require("ui/core/bindable");


    export class SideDrawer {

        android: any;
        ios: any;

        mainContent: view.View;
        drawerContent: view.View;
        drawerContentSize: number;
        drawerTransition : DrawerTransitionBase;
        drawerLocation : SideDrawerLocation;
        delegate: any;

        public closeDrawer(): void;
        public showDrawer(): void;
        public showDrawerWithTransition(transition: DrawerTransitionBase);

        public static mainContentProperty: dependencyObservable.Property;
        public static drawerContentProperty: dependencyObservable.Property;
        public static drawerContentSizeProperty: dependencyObservable.Property;
        public static drawerTransitionProperty : dependencyObservable.Property;
        public static drawerLocationProperty : dependencyObservable.Property;
   }

   export enum SideDrawerLocation {
        Left,
        Right,
        Top,
        Bottom
    }

    export class DrawerTransitionBase{
        getNativeContent() : any;
    }

    export class FadeTransition extends DrawerTransitionBase{
    }

    export class PushTransition extends DrawerTransitionBase{
    }

    export class RevealTransition extends DrawerTransitionBase{
    }

    export class ReverseSlideOutTransition extends DrawerTransitionBase{
    }

    export class ScaleDownPusherTransition extends DrawerTransitionBase{
    }

    export class ScaleUpTransition extends DrawerTransitionBase{
    }

    export class SlideAlongTransition extends DrawerTransitionBase{
    }

    export class SlideInOnTopTransition extends DrawerTransitionBase{
    }
    // export class CustomTransition extends DrawerTransitionBase{
    // }
}

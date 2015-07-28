# TelerikNEXT conference app - sample code
Open source cross-platform [TelerikNEXT conference](http://www.teleriknext.com) app built with NativeScript.

![Telerik Next cross-platform mobile app - all sessions view](https://www.nativescript.org/images/default-source/default-album/telerik-next-all-sessions.png)
![Telerik Next cross-platform mobile app - navigation drawer](https://www.nativescript.org/images/default-source/default-album/telerik-next-nav-drawer.png)

You can see the application in action by downloading it from the [App Store](https://itunes.apple.com/bg/app/teleriknext/id982525766?mt=8) or [Google Play](https://play.google.com/store/apps/details?id=org.nativescript.TelerikNEXT&hl=en).

Use this application to find-out how to implement common mobile scenarios with NativeScript.

This application is using the drawer component from Telerik UI for [iOS](http://www.telerik.com/ios-ui/sidedrawer) and [Android](http://www.telerik.com/android-ui/sidedrawer). You can add drawer libraries to NativeScript app using our [CLI library add command](https://github.com/NativeScript/nativescript-cli#the-commands).

To get started with NativeScript apps please use our [getting started with NativeScript guide](http://docs.nativescript.org/getting-started).

## Running the sample

1. Make sure you have the [NativeScript Command-line Interface](https://www.npmjs.com/package/nativescript) and (grunt-cli)[https://github.com/gruntjs/grunt-cli] installed as well as all the prerequisites for the NativeScript development.

2. Clone and install npm dependencies
  ```
  git clone https://github.com/NativeScript/sample-TelerikNEXT.git
  cd sample-TelerikNEXT
  npm install
  ```

3. Compile the TypeScript code to JavaScript
  ```
  grunt ts:build
  ```

4. Add TelerikUI libraries
  
  4.1. For Adnroid - extract you distribution of Telerik UI for Android inside `\install\lib\Telerik_UI_for_Android` folder and then run:
  ```
  grunt init-android
  ```

  4.2. For iOS- extract you distribution of Telerik UI for iOS inside `\install\lib\Telerik_UI_for_iOS` folder and then run:
  ```
  grunt init-ios
  ```

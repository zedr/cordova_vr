default: build

plugins/cordova-plugin-crosswalk-webview:
	@cordova plugin add cordova-plugin-crosswalk-webview

build: plugins/cordova-plugin-crosswalk-webview

platforms/android:
	cordova platform add android

platforms/android/build/outputs/apk/android-android-armv7-debug.apk: platforms/android
	cordova build android

apk: platforms/android/build/outputs/apk/android-android-armv7-debug.apk

clean:
	@rm -rf plugins/* platforms/*

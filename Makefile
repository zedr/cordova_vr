cordova_bin=node_modules/cordova/bin/cordova

default: build

${cordova_bin}:
	npm install cordova

plugins/cordova-plugin-crosswalk-webview: ${cordova_bin}
	${cordova_bin} plugin add cordova-plugin-crosswalk-webview

build: plugins/cordova-plugin-crosswalk-webview

platforms/android: ${cordova_bin}
	${cordova_bin} platform add android

platforms/android/build/outputs/apk/android-android-armv7-debug.apk: platforms/android ${cordova_bin}
	${cordova_bin}} build android

apk: platforms/android/build/outputs/apk/android-android-armv7-debug.apk

clean:
	@rm -rf plugins/* platforms/*

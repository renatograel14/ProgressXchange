module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-contrib-clean');

    var androidHome = process.env.ANDROID_HOME;
    var android_UI_base = "install/lib/Telerik_UI_for_Android";
    var android_UI = android_UI_base + "/Controls/Eclipse/";
    var ios_UI_base = "install/lib/Telerik_UI_for_iOS";
    var ios_UI = ios_UI_base + "/embedded/TelerikUI/Debug/TelerikUI.framework";

    grunt.initConfig({
        ts: {
            build: {
                src: "app/**/*.ts",
                options: {
                    module: "commonjs",
                    target: "es5",
                    sourceMap: false,
                    declaration: false,
                    removeComments: true,
                    compiler: "node_modules/typescript/bin/tsc",
                    noEmitOnError: false
                }
            }
        },
        copy: {
            iosInstall: {
                expand: true,
                cwd: 'install',
                src: [
                    'ios/**/*',
                ],
                dest: 'platforms'
            },

            androidInstall: {
                expand: true,
                cwd: 'install',
                src: [
                    'android/**/*',
                ],
                dest: 'platforms'
            },

            androidAppCompat: {
                expand: true,
                cwd: androidHome + "/extras/android/support/v7/appcompat",
                src: [
                    '**/*',
                ],
                dest: 'lib/Android/appcompat'
            },


        },
        clean: {
            appCompat: {
                expand: true,
                src: [
                    'platforms/android/libs/android-support-v4.jar'
                ]
            }
        },

        shell: {
            androidAddLibs: {
                command: [
                    'echo Adding platform...',
                    'tns platform add android',
                    'echo Adding Telerik UI for Android libs...',
                    'tns library add android "' + android_UI + 'Primitives"',
                    'tns library add android "' + android_UI + 'Common"',
                    'echo Fixing src folders...',
                    'mkdir "lib/Android/Common/src"',
                    'mkdir "lib/Android/Primitives/src"'
                ].join('&&')
            },

            andoirdFixTargets: {
                command: [
                    'android update project -t "android-21" -p "lib/Android/appcompat"',
                    'android update project -t "android-21" -p "lib/Android/Primitives"',
                    'android update project -t "android-21" -p "lib/Android/Common"'
                ].join('&&')
            },

            iosAddLibs: {
                command: [
                    'echo Adding platform...',
                    'tns platform add ios',
                    'echo Adding Telerik UI for Android libs...',
                    'tns library add ios "' + ios_UI,
                ].join('&&')
            }

        },
        env: {
            ngSample: {
                NSDIST: '../deps/NativeScript/bin/dist',
            }
        }

    });

    grunt.registerTask("check-android-home", function () {
        if (!androidHome) {
            grunt.fail.fatal("ANDROID_HOME environmental variable not defined.");
        }
    });

    grunt.registerTask("check-android-ui", function () {
        if (!(grunt.file.isDir(android_UI, 'Common') && grunt.file.isDir(android_UI, 'Primitives'))) {
            grunt.fail.fatal("Please copy Telerik UI controls for Android in '" + android_UI_base + "' folder.");
        }
    });

    grunt.registerTask("check-ios-ui", function () {
        if (!grunt.file.isDir(ios_UI)) {
            grunt.fail.fatal("Please copy Telerik UI controls for IOS in '" + ios_UI_base +"' folder.");
        }
    });

    grunt.registerTask("init-android", [
        "check-android-home",
        "check-android-ui",
        "shell:androidAddLibs",
        "clean:appCompat",
        "copy:androidAppCompat",
        "shell:andoirdFixTargets",
        "copy:androidInstall",
    ]);

    grunt.registerTask("init-ios", [
        "check-ios-ui",
        "shell:iosAddLibs",
        "copy:iosInstall",
    ]);

    grunt.registerTask("default", "ts:build");
};

module.exports = function(grunt) {

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
    });

    grunt.loadNpmTasks("grunt-ts");

    grunt.registerTask("default", "ts:build");

};

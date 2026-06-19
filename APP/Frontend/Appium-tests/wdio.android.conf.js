exports.config = {
    runner: 'local',
    port: 4723,
    path: '/',
    specs: [
        './tests/**/*.test.js'
    ],
    exclude: [],
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:deviceName': 'Android Emulator',
        'appium:platformVersion': '11.0',
        'appium:automationName': 'UiAutomator2',
        'appium:app': '../app/build/outputs/apk/debug/app-debug.apk',
        'appium:appPackage': 'com.publiceye.app',
        'appium:appActivity': 'com.publiceye.app.presentation.auth.AuthActivity',
        'appium:noReset': false,
        'appium:fullReset': false
    }],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: [
        ['appium', {
            args: {
                address: 'localhost',
                port: 4723
            },
            command: 'appium'
        }]
    ],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
}

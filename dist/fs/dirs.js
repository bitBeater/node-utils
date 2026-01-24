"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOsAppInstallDir = getOsAppInstallDir;
exports.getOsSharedDataDir = getOsSharedDataDir;
exports.getOsSysConfDir = getOsSysConfDir;
exports.getOsUsrConfDir = getOsUsrConfDir;
exports.getOsUserHomeDir = getOsUserHomeDir;
exports.getOsUserBinDir = getOsUserBinDir;
exports.getOsDeskotpDir = getOsDeskotpDir;
const path_1 = require("path");
/**
 * Directory for storing app data during development.
 * This ensures that isn't required special permissions to write to the directory and it's isolated from system directories. */
function getOsAppInstallDir() {
    switch (process.platform) {
        case 'linux':
            return '/opt';
        case 'darwin':
            return '/Applications';
        case 'win32':
            return 'C:\\Program Files';
        default:
            throw new Error(`Unsupported OS: ${process.platform}`);
    }
}
/**
 * Architecture-independent (shared) data.
 * e.g. C:\ProgramData\ on win32 or /usr/share on Linux.
 */
function getOsSharedDataDir() {
    switch (process.platform) {
        case 'linux':
            return (0, path_1.resolve)('/usr', 'share');
        case 'darwin':
            return '~/Library/Application Support';
        case 'win32':
            return process.env.APPDATA;
        default:
            throw new Error(`Unsupported OS: ${process.platform}`);
    }
}
/**
 * OS-specific system wide dir for app configurations.
 */
function getOsSysConfDir() {
    switch (process.platform) {
        case 'linux':
            return (0, path_1.resolve)('/etc');
        case 'darwin':
            return (0, path_1.resolve)('/Library/Application Support');
        case 'win32':
            return process.env.APPDATA;
        default:
            throw new Error(`Unsupported OS: ${process.platform}`);
    }
}
/**
 * USER-specific dir for app configurations.
 */
function getOsUsrConfDir() {
    switch (process.platform) {
        case 'linux':
        case 'darwin':
            return (0, path_1.resolve)(getOsUserHomeDir(), '.config');
        case 'win32':
            return process.env.LOCALAPPDATA;
        default:
            throw new Error(`Unsupported OS: ${process.platform}`);
    }
}
/**
 * Returns the home directory of the current OS user.
 * e.g. C:\Users\<user> on win32 or /home/<user> on Linux.
 */
function getOsUserHomeDir() {
    switch (process.platform) {
        case 'linux':
        case 'darwin':
            return process.env.HOME;
        case 'win32':
            return process.env.USERPROFILE;
        default:
            throw new Error(`Unsupported OS: ${process.platform}`);
    }
}
function getOsUserBinDir() {
    switch (process.platform) {
        case 'linux':
            return (0, path_1.resolve)(getOsUserHomeDir(), '.local', 'bin');
        case 'darwin':
            return (0, path_1.resolve)(getOsUserHomeDir(), 'bin');
        case 'win32':
            return getOsAppInstallDir();
        default:
            throw new Error(`Unsupported OS: ${process.platform}`);
    }
}
function getOsDeskotpDir() {
    return (0, path_1.resolve)(getOsUserHomeDir(), 'Desktop');
}
//# sourceMappingURL=dirs.js.map
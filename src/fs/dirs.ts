import { resolve } from 'path';

/**
 * Directory for storing app data during development.
 * This ensures that isn't required special permissions to write to the directory and it's isolated from system directories. */
export function getOsAppInstallDir(): string {
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
export function getOsSharedDataDir(): string {
    switch (process.platform) {
        case 'linux':
            return resolve('/usr', 'share');
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
export function getOsSysConfDir(): string {
    switch (process.platform) {
        case 'linux':
            return resolve('/etc');
        case 'darwin':
            return resolve('/Library/Application Support');
        case 'win32':
            return process.env.APPDATA;
        default:
            throw new Error(`Unsupported OS: ${process.platform}`);
    }
}

/**
 * USER-specific dir for app configurations.
 */
export function getOsUsrConfDir(): string {
    switch (process.platform) {
        case 'linux':
        case 'darwin':
            return resolve(getOsUserHomeDir(), '.config');
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
export function getOsUserHomeDir(): string {
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

export function getOsUserBinDir(): string {
    switch (process.platform) {
        case 'linux':
            return resolve(getOsUserHomeDir(), '.local', 'bin');
        case 'darwin':
            return resolve(getOsUserHomeDir(), 'bin');
        case 'win32':
            return getOsAppInstallDir();
        default:
            throw new Error(`Unsupported OS: ${process.platform}`);
    }
}

export function getOsDeskotpDir(): string {
    return resolve(getOsUserHomeDir(), 'Desktop');
}

/**
 * Directory for storing app data during development.
 * This ensures that isn't required special permissions to write to the directory and it's isolated from system directories. */
export declare function getOsAppInstallDir(): string;
/**
 * Architecture-independent (shared) data.
 * e.g. C:\ProgramData\ on win32 or /usr/share on Linux.
 */
export declare function getOsSharedDataDir(): string;
/**
 * OS-specific system wide dir for app configurations.
 */
export declare function getOsSysConfDir(): string;
/**
 * USER-specific dir for app configurations.
 */
export declare function getOsUsrConfDir(): string;
/**
 * Returns the home directory of the current OS user.
 * e.g. C:\Users\<user> on win32 or /home/<user> on Linux.
 */
export declare function getOsUserHomeDir(): string;
export declare function getOsUserBinDir(): string;
export declare function getOsDeskotpDir(): string;
//# sourceMappingURL=dirs.d.ts.map
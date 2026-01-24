export declare const TILDE_NOTATION_REX: RegExp;
export declare const PATH_REX: RegExp;
/**
 * Checks if the given path is in tilde notation.
 *
 * @param path - The path to check.
 * @returns `true` if the path is in tilde notation, `false` otherwise.
 */
export declare function isTildeNotation(path: string): boolean;
/**
 * Expands a tilde (~) notation in a path to the user's home directory.
 *
 * @param path - The path containing the tilde (~) notation.
 * @returns The expanded path with the tilde (~) notation replaced by the user's home directory.
 */
export declare function expandTilde(path: string): string;
/**
 * Resolves a path to an absolute path.
 * like `path.resolve` but also expands tilde notation.
 *
 * @param path - The path to resolve.
 * @returns The resolved absolute path.
 */
export declare function resolve(path: string): string;
/**
 * Checks if the given string is a path synthax.
 */
export declare function isPathSynthax(string: string): boolean;
//# sourceMappingURL=paths.d.ts.map
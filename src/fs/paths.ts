import { resolve as _resolve, join } from 'path';
import { getOsUserHomeDir } from './dirs';

export const TILDE_NOTATION_REX = /^~[/|\\]?/;
export const PATH_REX = /\//;

/**
 * Checks if the given path is in tilde notation.
 * 
 * @param path - The path to check.
 * @returns `true` if the path is in tilde notation, `false` otherwise.
 */
export function isTildeNotation(path: string) {
    return TILDE_NOTATION_REX.test(path);
}

/**
 * Expands a tilde (~) notation in a path to the user's home directory.
 * 
 * @param path - The path containing the tilde (~) notation.
 * @returns The expanded path with the tilde (~) notation replaced by the user's home directory.
 */
export function expandTilde(path: string): string {
    return join(getOsUserHomeDir(), path.replace(TILDE_NOTATION_REX, ''));
}

/**
 * Resolves a path to an absolute path.
 * like `path.resolve` but also expands tilde notation.
 * 
 * @param path - The path to resolve.
 * @returns The resolved absolute path.
 */

export function resolve(path: string): string {
    return isTildeNotation(path) ? expandTilde(path) : _resolve(path);
}


/**
 * Checks if the given string is a path synthax.
 */
export function isPathSynthax(string: string): boolean {
    return PATH_REX.test(string) || isTildeNotation(string);
}
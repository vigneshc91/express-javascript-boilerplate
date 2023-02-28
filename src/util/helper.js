import { createHash } from 'crypto';

/**
 * Get the random string of given number
 * @param length number
 */
export function getRandomString(length = 6) {
    return Math.random().toString(36).substring(2, length);
}

/**
 * Get the SHA512 hash of the given string
 * @param value string
 */
export function getSHA512Hash(value) {
    const hash = createHash('sha512');
    return hash.update(value).digest('hex');
}

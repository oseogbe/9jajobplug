/**
 * Slugify a string for URLs
 */
export function slugify(text: string): string {
    const base = text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^a-z0-9\-]/g, '')    // Remove all non-alphanumeric except -
        .replace(/-+/g, '-')             // Replace multiple - with single -
        .replace(/^-+|-+$/g, '');        // Trim - from start/end
    return `${base}-${generateUniqueString()}`;
}

/**
 * Generate a random alphanumeric string of given length
 */
export function generateUniqueString(length = 6): string {
    return Math.random().toString(36).substring(2, 2 + length);
}

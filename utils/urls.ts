import { readFile } from "fs/promises";

/**
 * Parses URLs from JSON file content.
 *
 * @param fileContent - The JSON file content as a string
 * @returns Array of URLs parsed from the JSON
 * @throws Error if the JSON does not contain an array
 */
export function parseJSONUrls(fileContent: string): string[] {
    const urls = JSON.parse(fileContent);
    if (!Array.isArray(urls)) {
        throw new Error("JSON file must contain an array of URLs");
    }
    return urls;
}

/**
 * Parses URLs from text file content, filtering out comments and empty lines.
 *
 * @param fileContent - The text file content as a string
 * @returns Array of URLs, one per line (comments and empty lines are filtered)
 */
export function parseTextUrls(fileContent: string): string[] {
    return fileContent
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"));
}

/**
 * Validates that the URLs array is not empty.
 *
 * @param urls - Array of URLs to validate
 * @throws Error if the array is empty
 */
export function validateUrls(urls: string[]): void {
    if (urls.length === 0) {
        throw new Error("No valid URLs found in file or arguments.");
    }
}

/**
 * Gets URLs from either a file or direct command-line arguments.
 *
 * @param argv - Command-line arguments object containing file, format, and urls
 * @returns Array of URLs parsed from file or arguments
 * @throws Error if no URLs are provided or if file parsing fails
 */
export async function getUrls(argv: any): Promise<string[]> {
    let urls: string[] = [];

    if (argv.file) {
        const fileContent = await readFile(argv.file, "utf-8");

        if (argv.format === "json") {
            urls = parseJSONUrls(fileContent);
        } else {
            urls = parseTextUrls(fileContent);
        }
    } else if (argv.urls && argv.urls.length > 0) {
        urls = argv.urls as string[];
    } else {
        throw new Error("No URLs provided. Use --file or provide URLs as arguments.");
    }

    validateUrls(urls);
    return urls;
}


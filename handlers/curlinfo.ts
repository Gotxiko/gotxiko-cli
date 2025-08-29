import { exec } from "child_process";
import { promisify } from "util";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const execAsync = promisify(exec);

// Get the absolute path to the scripts directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const scriptsDir = join(__dirname, "..", "scripts");
const curlInfoScript = join(scriptsDir, "curlinfo.sh");

/**
 * Parse URLs from JSON file content
 */
export function parseJSONUrls(fileContent: string): string[] {
    const urls = JSON.parse(fileContent);
    if (!Array.isArray(urls)) {
        throw new Error("JSON file must contain an array of URLs");
    }
    return urls;
}

/**
 * Parse URLs from text file content, filtering out comments and empty lines
 */
export function parseTextUrls(fileContent: string): string[] {
    return fileContent
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#")); // Ignore empty lines and comments
}

/**
 * Validate that URLs array is not empty
 */
export function validateUrls(urls: string[]): void {
    if (urls.length === 0) {
        throw new Error("No valid URLs found in file or arguments.");
    }
}

/**
 * Get URLs from either file or direct arguments
 */
export async function getUrls(argv: any): Promise<string[]> {
    let urls: string[] = [];

    // Handle file input
    if (argv.file) {
        const fileContent = await readFile(argv.file, "utf-8");

        if (argv.format === "json") {
            urls = parseJSONUrls(fileContent);
        } else {
            // txt format - one URL per line
            urls = parseTextUrls(fileContent);
        }
    } else if (argv.urls && argv.urls.length > 0) {
        // Handle direct URL arguments
        urls = argv.urls as string[];
    } else {
        throw new Error("No URLs provided. Use --file or provide URLs as arguments.");
    }

    validateUrls(urls);
    return urls;
}

export async function handleCurlInfo(argv: any) {
    try {
        const urls = await getUrls(argv);

        const { stdout, stderr } = await execAsync(`${curlInfoScript} ${urls.map((url) => `"${url}"`).join(" ")}`);

        if (stdout) console.log(stdout.trim());
        if (stderr) console.error(stderr.trim());
    } catch (error: any) {
        // Display the script output even if it exits with error code
        if (error.stdout) console.log(error.stdout.trim());
        if (error.stderr) console.error(error.stderr.trim());
    }
}

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

/**
 * Gets the absolute path to the scripts directory.
 * Handles different bundling scenarios (bundled vs development).
 *
 * @returns The absolute path to the scripts directory
 * @throws Error if the scripts directory cannot be found
 */
export function getScriptsDir(): string {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    
    const pathsToTry = [
        join(__dirname, "..", "scripts"),
        join(__dirname, "..", "..", "scripts"),
        join(__dirname, "..", "..", "..", "scripts"),
    ];
    
    for (const scriptsDir of pathsToTry) {
        if (existsSync(scriptsDir)) {
            return scriptsDir;
        }
    }
    
    throw new Error(`Scripts directory not found. Tried: ${pathsToTry.join(", ")}. Make sure scripts are included in the package.`);
}

/**
 * Gets the path to a specific script file.
 *
 * @param scriptName - The name of the script file (e.g., "sslcheck.sh")
 * @returns The absolute path to the script file
 */
export function getScriptPath(scriptName: string): string {
    const scriptsDir = getScriptsDir();
    return join(scriptsDir, scriptName);
}


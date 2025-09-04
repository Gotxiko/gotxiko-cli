import { exec } from "child_process";
import { promisify } from "util";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const execAsync = promisify(exec);

// Get the absolute path to the scripts directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const scriptsDir = join(__dirname, "..", "scripts");
const gitSwitchScript = join(scriptsDir, "gitswitch.sh");

/**
 * Validate that username and email are provided
 */
export function validateGitUserArgs(argv: any): void {
    if (!argv.username || !argv.email) {
        throw new Error("Both username and email are required. Usage: gcli gitswitch <username> <email>");
    }
}

export async function handleGitSwitch(argv: any) {
    try {
        validateGitUserArgs(argv);

        const { stdout, stderr } = await execAsync(`${gitSwitchScript} "${argv.username}" "${argv.email}"`);

        if (stdout) console.log(stdout.trim());
        if (stderr) console.error(stderr.trim());
    } catch (error: any) {
        // Display the script output even if it exits with error code
        if (error.stdout) console.log(error.stdout.trim());
        if (error.stderr) console.error(error.stderr.trim());
        
        // If it's our validation error, don't show the exec error
        if (error.message.includes("Both username and email are required")) {
            console.error(error.message);
        }
    }
}

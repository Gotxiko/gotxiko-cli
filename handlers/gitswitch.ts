import { exec } from "child_process";
import { promisify } from "util";
import { getScriptPath } from "../utils/scripts";

const execAsync = promisify(exec);

const gitSwitchScript = getScriptPath("gitswitch.sh");

/**
 * Validates that username and email are provided in the arguments.
 *
 * @param argv - Command-line arguments object
 * @throws Error if username or email is missing
 */
export function validateGitUserArgs(argv: any): void {
    if (!argv.username || !argv.email) {
        throw new Error("Both username and email are required. Usage: gcli gitswitch <username> <email>");
    }
}

/**
 * Handles git user switching for the local repository.
 *
 * @param argv - Command-line arguments containing username and email
 */
export async function handleGitSwitch(argv: any) {
    try {
        validateGitUserArgs(argv);

        const { stdout, stderr } = await execAsync(`${gitSwitchScript} "${argv.username}" "${argv.email}"`);

        if (stdout) console.log(stdout.trim());
        if (stderr) console.error(stderr.trim());
    } catch (error: any) {
        if (error.stdout) console.log(error.stdout.trim());
        if (error.stderr) console.error(error.stderr.trim());

        if (error.message.includes("Both username and email are required")) {
            console.error(error.message);
        }
    }
}

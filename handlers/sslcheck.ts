import { exec } from "child_process";
import { promisify } from "util";
import { getScriptPath } from "../utils/scripts";
import { getUrls } from "../utils/urls";

const execAsync = promisify(exec);

const sslCheckScript = getScriptPath("sslcheck.sh");

/**
 * Handles SSL certificate checking for the given URLs.
 *
 * @param argv - Command-line arguments containing URLs or file path
 */
export async function handleSSLCheck(argv: any) {
    try {
        const urls = await getUrls(argv);

        const { stdout, stderr } = await execAsync(`${sslCheckScript} ${urls.map((url) => `"${url}"`).join(" ")}`);

        if (stdout) console.log(stdout.trim());
        if (stderr) console.error(stderr.trim());
    } catch (error: any) {
        if (error.stdout) console.log(error.stdout.trim());
        if (error.stderr) console.error(error.stderr.trim());
    }
}

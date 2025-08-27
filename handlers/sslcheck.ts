import { exec } from "child_process";
import { promisify } from "util";
import { readFile } from "fs/promises";

const execAsync = promisify(exec);

export async function handleSSLCheck(argv: any) {
    try {
        let urls: string[] = [];

        // Handle file input
        if (argv.file) {
            const fileContent = await readFile(argv.file, "utf-8");

            if (argv.format === "json") {
                urls = JSON.parse(fileContent);
                if (!Array.isArray(urls)) {
                    throw new Error("JSON file must contain an array of URLs");
                }
            } else {
                // txt format - one URL per line
                urls = fileContent
                    .split("\n")
                    .map((line) => line.trim())
                    .filter((line) => line && !line.startsWith("#")); // Ignore empty lines and comments
            }
        } else if (argv.urls && argv.urls.length > 0) {
            // Handle direct URL arguments
            urls = argv.urls as string[];
        } else {
            console.error("Error: No URLs provided. Use --file or provide URLs as arguments.");
            process.exit(1);
        }

        if (urls.length === 0) {
            console.error("Error: No valid URLs found in file or arguments.");
            process.exit(1);
        }

        const { stdout, stderr } = await execAsync(`./scripts/sslcheck.sh ${urls.map((url) => `"${url}"`).join(" ")}`);

        if (stdout) console.log(stdout.trim());
        if (stderr) console.error(stderr.trim());
    } catch (error: any) {
        // Display the script output even if it exits with error code
        if (error.stdout) console.log(error.stdout.trim());
        if (error.stderr) console.error(error.stderr.trim());
    }
}

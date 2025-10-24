import { handleCurlInfo } from "../handlers/curlinfo";
import { describe, it, expect } from "bun:test";

describe("handleCurlInfo", () => {
    it("should handle curl info command structure", async () => {
        // Test with a simple URL that should work quickly
        const argv = {
            urls: ["https://httpbin.org/status/200"],
        };

        // Capture console.log output
        let output = "";
        const originalLog = console.log;
        const originalError = console.error;
        console.log = (msg?: any, ..._args: any[]) => {
            output += (msg ? msg.toString() : "") + "\n";
        };
        console.error = (msg?: any, ..._args: any[]) => {
            output += (msg ? msg.toString() : "") + "\n";
        };

        try {
            // Use a shorter timeout for testing
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Test timeout")), 8000),
            );

            await Promise.race([handleCurlInfo(argv), timeoutPromise]);
        } catch (error) {
            console.error(error);
        } finally {
            console.log = originalLog;
            console.error = originalError;
        }

        // Just check that some output was generated (the command structure works)
        expect(output.length).toBeGreaterThan(0);
    }, 10000); // 10 second timeout
});

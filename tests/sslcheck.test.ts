import { handleSSLCheck } from "../handlers/sslcheck";
import { describe, it, expect } from "bun:test";

describe("handleSSLCheck", () => {
    it("should print SSL check output for the urls.json file", async () => {
        // Test with a .json file containing URLs
        const argv = {
            file: "tests/data/urls.json",
            format: "json",
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
            await handleSSLCheck(argv);
        } finally {
            console.log = originalLog;
            console.error = originalError;
        }

        // The .sh script prints a header and certificate info, so check for expected output
        expect(output).toContain("SSL Certificate Checker");
        expect(output).toMatch(/Subject:/);
        expect(output).toMatch(/Issuer:/);
        expect(output).toMatch(/Valid From:/);
        expect(output).toMatch(/Valid Until:/);
        expect(output).toMatch(/Status:/);
    });
});

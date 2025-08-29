#!/usr/bin/env bun

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { handleSSLCheck } from "./handlers/sslcheck";
import { handleCurlInfo } from "./handlers/curlinfo";

const _argv = yargs(hideBin(process.argv))
    .scriptName("gcli")
    .command(
        "sslcheck [urls..]",
        "Check SSL certificates for given URLs or from a file",
        {
            urls: {
                describe: "URLs to check SSL certificates for (can also use --file)",
                type: "string",
                array: true,
            },
            file: {
                describe: "Path to file containing URLs (JSON array or text file with one URL per line)",
                type: "string",
                alias: "f",
            },
            format: {
                describe: "Format of the input file",
                type: "string",
                choices: ["json", "txt"],
                default: "txt",
                alias: "F",
            },
        },
        handleSSLCheck,
    )
    .command(
        "curlinfo [urls..]",
        "Get curl info including redirects, headers, and response details for given URLs",
        {
            urls: {
                describe: "URLs to check with curl (can also use --file)",
                type: "string",
                array: true,
            },
            file: {
                describe: "Path to file containing URLs (JSON array or text file with one URL per line)",
                type: "string",
                alias: "f",
            },
            format: {
                describe: "Format of the input file",
                type: "string",
                choices: ["json", "txt"],
                default: "txt",
                alias: "F",
            },
        },
        handleCurlInfo,
    )
    .help().argv;

# Gotxiko CLI

A small but powerful CLI tool for various useful development tasks including SSL certificate checking, curl information gathering, and git user switching.

## Installation

https://www.npmjs.com/package/gotxiko-cli

### Using npm

```bash
npm install -g gotxiko-cli
```

## Usage

After installation, you can use the `gcli` command:

```bash
gcli --help
```

### Commands

Gotxiko CLI provides three powerful commands for common development tasks:

## 🔒 SSL Certificate Check (`sslcheck`)

Check SSL certificates for websites and get detailed certificate information including expiration dates, issuer details, and validity status.

### What it does:
- Retrieves SSL certificate information from websites
- Shows certificate subject, issuer, and validity dates
- Calculates days until expiration with color-coded status
- Supports multiple URLs at once
- Works with both direct URL arguments and file input

### Usage Examples:

```bash
# Check SSL for specific URLs
gcli sslcheck https://example.com https://google.com

# Check SSL from a text file (one URL per line)
gcli sslcheck --file urls.txt

# Check SSL from a JSON file
gcli sslcheck --file urls.json --format json

# Check SSL with explicit format specification
gcli sslcheck --file urls.txt --format txt
```

### Output:
The command provides color-coded output showing:
- ✅ **Valid** (90+ days remaining)
- ⚠️ **Expires Soon** (30-90 days remaining) 
- ⚠️ **Expires Very Soon** (0-30 days remaining)
- ❌ **Expired** (past expiration date)

## 🌐 Curl Information (`curlinfo`)

Get comprehensive curl information including HTTP headers, redirect chains, response codes, and detailed request/response analysis.

### What it does:
- Performs HEAD requests to get HTTP headers
- Follows redirect chains and shows the complete path
- Displays response codes, timing information, and redirect counts
- Shows detailed curl verbose output for debugging
- Supports multiple URLs and file input

### Usage Examples:

```bash
# Get curl info for specific URLs
gcli curlinfo https://example.com https://google.com

# Get curl info from a text file
gcli curlinfo --file urls.txt

# Get curl info from a JSON file
gcli curlinfo --file urls.json --format json

# Check redirect behavior
gcli curlinfo https://bit.ly/short-url
```

### Output:
The command provides detailed information including:
- HTTP response headers
- Final URL after redirects
- HTTP status codes
- Redirect chain analysis
- Connection timing
- Full curl verbose output

## 🔄 Git User Switch (`gitswitch`)

Switch git user configuration locally for the current repository without affecting global git settings.

### What it does:
- Sets `user.name` and `user.email` locally for the current repository
- Does NOT modify global git configuration
- Validates that you're in a git repository
- Shows confirmation of the changes made
- Perfect for working with multiple git identities

### Usage Examples:

```bash
# Switch to work account
gcli gitswitch "John Doe" "john.doe@company.com"

# Switch to personal account
gcli gitswitch "John Doe" "john.doe@gmail.com"

# Switch to open source contributor identity
gcli gitswitch "johndoe" "john@opensource.dev"
```

### Output:
The command provides:
- Confirmation of successful user switch
- Display of current local git configuration
- Clear indication that changes are local only
- Error handling for invalid repositories

## File Formats

Both `sslcheck` and `curlinfo` commands support reading URLs from files in two formats:

### Text Format (`.txt`)
- One URL per line
- Comments starting with `#` are ignored
- Empty lines are ignored
- Default format (no `--format` flag needed)

Example `urls.txt`:
```
# Production websites
https://example.com
https://google.com
https://github.com

# Development sites
https://localhost:3000
```

### JSON Format (`.json`)
- Array of URL strings
- Must specify `--format json` flag
- Useful for programmatic URL lists

Example `urls.json`:
```json
[
  "https://example.com",
  "https://google.com", 
  "https://github.com"
]
```

### File Usage Examples:
```bash
# Text file (default format)
gcli sslcheck --file urls.txt
gcli curlinfo --file urls.txt

# JSON file (explicit format)
gcli sslcheck --file urls.json --format json
gcli curlinfo --file urls.json --format json
```

## Quick Reference

| Command | Purpose | Key Features |
|---------|---------|--------------|
| `gcli sslcheck` | SSL certificate validation | Expiration dates, issuer info, color-coded status |
| `gcli curlinfo` | HTTP request analysis | Headers, redirects, timing, verbose output |
| `gcli gitswitch` | Local git user switching | Repository-only changes, multiple identities |

### Common Options:
- `--file, -f`: Read URLs from file
- `--format, -F`: File format (txt/json)
- `--help`: Show command help

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Gotxiko - [GitHub](https://github.com/Gotxiko)

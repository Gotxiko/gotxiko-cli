# Gotxiko CLI

A small but powerful CLI tool for various useful development tasks including SSL certificate checking, curl information gathering, and git user switching.

## Installation

### Using npm

```bash
npm install -g gotxiko-cli
```

### Using yarn

```bash
yarn global add gotxiko-cli
```

### Using bun

```bash
bun install -g gotxiko-cli
```

## Usage

After installation, you can use the `gcli` command:

```bash
gcli --help
```

### Commands

#### SSL Certificate Check

Check SSL certificates for given URLs or from a file:

```bash
# Check SSL for specific URLs
gcli sslcheck https://example.com https://google.com

# Check SSL from a file
gcli sslcheck --file urls.txt
gcli sslcheck --file urls.json --format json
```

#### Curl Information

Get detailed curl information including redirects, headers, and response details:

```bash
# Get curl info for specific URLs
gcli curlinfo https://example.com https://google.com

# Get curl info from a file
gcli curlinfo --file urls.txt
gcli curlinfo --file urls.json --format json
```

#### Git User Switch

Switch git user locally in the current repository (not globally):

```bash
gcli gitswitch "Your Name" "your.email@example.com"
```

## File Formats

The tool supports two file formats for URL input:

- **TXT format**: One URL per line
- **JSON format**: Array of URL strings

Example `urls.txt`:

```
https://example.com
https://google.com
https://github.com
```

Example `urls.json`:

```json
["https://example.com", "https://google.com", "https://github.com"]
```

## Development

### Prerequisites

- Node.js 18+ or Bun
- TypeScript 5+

### Setup

```bash
git clone https://github.com/Gotxiko/gotxiko-cli.git
cd gotxiko-cli
bun install
```

### Build

```bash
bun run build
```

### Format Code

```bash
bun run format
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Gotxiko - [GitHub](https://github.com/Gotxiko)

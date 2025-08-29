#!/bin/bash

# Curl Info Checker
# Usage: ./curlinfo.sh <url1> [url2] [url3] ...

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to check curl info for a URL
check_curl_info() {
    local url=$1

    echo -e "${BLUE}🌐 Checking curl info for: ${YELLOW}$url${NC}"
    echo "=================================================="

    # Use curl with verbose output to capture redirects and headers
    # -L follows redirects
    # -I shows headers only (HEAD request)
    # -v verbose output
    # -s silent mode (no progress meter)
    # --max-redirs 10 to prevent infinite redirects

    echo -e "${CYAN}📋 Headers (HEAD request):${NC}"
    echo "----------------------------------------------"

    # Get headers with HEAD request
    headers_output=$(curl -I -L --max-redirs 10 -s "$url" 2>/dev/null)

    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error: Could not connect to $url${NC}"
        echo "   This could be due to:"
        echo "   - Invalid URL"
        echo "   - Network connectivity issues"
        echo "   - Server not responding"
        echo ""
        return 1
    fi

    # Display headers
    echo "$headers_output" | while IFS= read -r line; do
        if [[ $line =~ ^HTTP ]]; then
            echo -e "${GREEN}$line${NC}"
        elif [[ $line =~ ^[A-Za-z-]+: ]]; then
            echo -e "${YELLOW}$line${NC}"
        else
            echo "$line"
        fi
    done

    echo ""
    echo -e "${CYAN}🔄 Redirect Chain:${NC}"
    echo "----------------------------------------------"

    # Get redirect information using curl with verbose output
    redirect_info=$(curl -L --max-redirs 10 -s -o /dev/null -w "\
Final URL: %{url_effective}
HTTP Code: %{http_code}
Total Time: %{time_total}s
Connect Time: %{time_connect}s
Redirect Count: %{num_redirects}
Redirect Time: %{time_redirect}s
" "$url" 2>&1)

    if [ $? -eq 0 ]; then
        echo "$redirect_info" | while IFS= read -r line; do
            if [[ $line =~ "Final URL:" ]]; then
                echo -e "${GREEN}$line${NC}"
            elif [[ $line =~ "HTTP Code:" ]]; then
                echo -e "${BLUE}$line${NC}"
            elif [[ $line =~ "Redirect Count:" ]]; then
                echo -e "${CYAN}$line${NC}"
            else
                echo "$line"
            fi
        done
    else
        echo -e "${RED}❌ Could not get redirect information${NC}"
    fi

    echo ""
    echo -e "${CYAN}📊 Full Request Details:${NC}"
    echo "----------------------------------------------"

    # Get full curl verbose output (limited to avoid too much output)
    full_info=$(curl -L --max-redirs 10 -v -s "$url" 2>&1 | head -50)

    # Extract and highlight important parts
    echo "$full_info" | while IFS= read -r line; do
        if [[ $line =~ ^\* ]]; then
            echo -e "${BLUE}$line${NC}"
        elif [[ $line =~ ^\> ]]; then
            echo -e "${GREEN}$line${NC}"
        elif [[ $line =~ ^\< ]]; then
            echo -e "${YELLOW}$line${NC}"
        elif [[ $line =~ "HTTP/" ]]; then
            echo -e "${CYAN}$line${NC}"
        else
            echo "$line"
        fi
    done

    echo ""
}

# Main function
main() {
    if [ $# -eq 0 ]; then
        echo -e "${RED}Error: No URL provided${NC}"
        echo "Usage: $0 <url1> [url2] [url3] ..."
        echo "Example: $0 https://google.com https://github.com"
        exit 1
    fi

    echo -e "${BLUE}🌐 Curl Info Checker${NC}"
    echo "================================="
    echo ""

    for url in "$@"; do
        check_curl_info "$url"
        echo ""
    done
}

# Run main function with all arguments
main "$@"

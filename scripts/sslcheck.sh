#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

extract_hostname() {
    local url=$1
    url=$(echo "$url" | sed 's|https*://||' | sed 's|/.*||')
    echo "$url"
}

check_ssl_cert() {
    local url=$1
    local hostname=$(extract_hostname "$url")

    echo -e "${BLUE}Checking ${YELLOW}$hostname${NC}"

    cert_info=$(echo | openssl s_client -servername "$hostname" -connect "$hostname":443 2>/dev/null | openssl x509 -noout -text 2>/dev/null)

    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Could not retrieve certificate for $hostname${NC}"
        echo "   This could be due to:"
        echo "   - Invalid hostname"
        echo "   - SSL/TLS not enabled on port 443"
        echo "   - Firewall blocking connection"
        echo ""
        return 1
    fi

    subject=$(echo "$cert_info" | grep "Subject:" | sed 's/Subject: //' | sed 's/^[[:space:]]*//')
    issuer=$(echo "$cert_info" | grep "Issuer:" | sed 's/Issuer: //' | sed 's/^[[:space:]]*//')
    not_before=$(echo "$cert_info" | grep "Not Before:" | sed 's/Not Before: //' | sed 's/^[[:space:]]*//')
    not_after=$(echo "$cert_info" | grep "Not After :" | sed 's/Not After : //' | sed 's/^[[:space:]]*//')

    if command -v date >/dev/null 2>&1; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            expiry_timestamp=$(date -j -f "%b %d %H:%M:%S %Y %Z" "$not_after" "+%s" 2>/dev/null)
        else
            expiry_timestamp=$(date -d "$not_after" "+%s" 2>/dev/null)
        fi

        if [ $? -eq 0 ]; then
            current_timestamp=$(date "+%s")
            seconds_until_expiry=$((expiry_timestamp - current_timestamp))
            days_until_expiry=$((seconds_until_expiry / 86400))

            if [ $days_until_expiry -lt 0 ]; then
                expiry_status="${RED}EXPIRED (${days_until_expiry} days ago)${NC}"
            elif [ $days_until_expiry -le 30 ]; then
                expiry_status="${RED}EXPIRES SOON (${days_until_expiry} days)${NC}"
            elif [ $days_until_expiry -le 90 ]; then
                expiry_status="${YELLOW}EXPIRES IN ${days_until_expiry} days${NC}"
            else
                expiry_status="${GREEN}Valid (${days_until_expiry} days remaining)${NC}"
            fi
        else
            expiry_status="${YELLOW}Could not calculate days remaining${NC}"
        fi
    else
        expiry_status="${YELLOW}Date calculation not available${NC}"
    fi

    echo -e "${GREEN}Subject:${NC} $subject"
    echo -e "${GREEN}Issuer:${NC} $issuer"
    echo -e "${GREEN}Valid From:${NC} $not_before"
    echo -e "${GREEN}Valid Until:${NC} $not_after"
    echo -e "${GREEN}Status:${NC} $expiry_status"
    echo ""
}

main() {
    if [ $# -eq 0 ]; then
        echo -e "${RED}Error: No URL provided${NC}"
        echo "Usage: $0 <url1> [url2] [url3] ..."
        echo "Example: $0 https://google.com https://github.com"
        exit 1
    fi

    for url in "$@"; do
        check_ssl_cert "$url"
    done
}

main "$@"

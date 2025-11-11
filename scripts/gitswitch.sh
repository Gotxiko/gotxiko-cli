#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${RED}Error: Not in a git repository${NC}"
        echo "   Please run this command from within a git repository."
        exit 1
    fi
}

switch_git_user() {
    local username=$1
    local email=$2
    
    echo -e "${BLUE}Switching Git User (Local Repository Only)${NC}"
    echo "=============================================="
    echo ""
    
    if git config --local user.name "$username"; then
        echo -e "${GREEN}Set local user.name to: ${YELLOW}$username${NC}"
    else
        echo -e "${RED}Failed to set user.name${NC}"
        exit 1
    fi
    
    if git config --local user.email "$email"; then
        echo -e "${GREEN}Set local user.email to: ${YELLOW}$email${NC}"
    else
        echo -e "${RED}Failed to set user.email${NC}"
        exit 1
    fi
    
    echo ""
    echo -e "${GREEN}Git user switched${NC}"
    echo ""
    echo -e "${BLUE}Current local git configuration:${NC}"
    echo -e "  ${YELLOW}Name:${NC}  $(git config --local user.name)"
    echo -e "  ${YELLOW}Email:${NC} $(git config --local user.email)"
    echo ""
    echo -e "${YELLOW}Note: This only affects the current repository.${NC}"
    echo -e "${YELLOW}Global git configuration remains unchanged.${NC}"
}

main() {
    if [ $# -ne 2 ]; then
        echo -e "${RED}Error: Invalid number of arguments${NC}"
        echo "Usage: $0 <username> <email>"
        echo "Example: $0 \"John Doe\" \"john.doe@example.com\""
        exit 1
    fi
    
    local username=$1
    local email=$2
    
    if [ -z "$username" ] || [ -z "$email" ]; then
        echo -e "${RED}Error: Username and email cannot be empty${NC}"
        exit 1
    fi
    
    check_git_repo
    
    switch_git_user "$username" "$email"
}

main "$@"

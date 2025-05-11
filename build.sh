#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

function log_step() {
  echo -e "${CYAN}==============================="
  echo -e "${YELLOW}==> $1${NC}"
  echo -e "${CYAN}===============================${NC}"
}

function build_package() {
  local path=$1
  local command=$2
  log_step "Building ${GREEN}${path}${NC} with '${command}'"
  cd "$path" || exit 1
  eval "$command"
  cd - > /dev/null || exit 1
}

build_package "./packages/ai" "npm run build"
build_package "./packages/server" "npm run build"
build_package "./packages/ui" "npm run build:all"

echo -e "${GREEN}✓ All builds completed successfully.${NC}"
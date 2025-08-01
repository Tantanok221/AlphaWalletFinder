# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Development Commands

- **Run the application**: `deno task dev`
- **Run tests**: `deno task test`
- **Start Redis**: `docker compose up -d redis`
- **Stop Redis**: `docker compose down`

## Architecture Overview

This is a Deno-based Solana wallet analysis tool that uses the Helius SDK to
fetch and analyze NFT/asset data from Solana addresses.

### Core Structure

- **main.ts**: Entry point that initializes Helius provider and fetches assets
  for a specific wallet address
- **helper/**: Utility modules
  - **env.ts**: Environment variable management
  - **helius.ts**: Helius SDK provider initialization and configuration
- **service/**: Currently empty, likely for future service implementations

### Key Dependencies

- **Helius SDK**: Primary integration for Solana RPC calls and asset data
  retrieval
- **Infisical**: Used for secure environment variable management in development
- **Deno Standard Library**: For testing utilities

### Environment Setup

The application requires a `HELIUS_API_TOKEN` environment variable, managed
through Infisical in development. The Helius provider is initialized in
helper/helius.ts and creates a singleton instance for API interactions.

### Testing

Uses Deno's built-in test framework with standard assertions. Test files follow
the `*_test.ts` naming convention.

### Naming Convention

function: camelCase class: camelCase type: PascalCase folder: snake_case file
name: camelCase

## Development Reminders

- Remember to run tests and try them out when writing new code/tests, everytime
  run test, run every test instead of a specific file

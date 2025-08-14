# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal collection of SyncNext plugins for streaming video content. The project structure consists of plugin configurations and JavaScript implementations for various video streaming sources.

## Development Commands

- `npm test` - Runs the test suite using node_Test.js
- `npm install` - Installs dependencies (crypto-js, node-fetch, txml)

## Architecture

### Plugin Structure
Each plugin consists of two main files:
- **Configuration file** (`.json`): Defines plugin metadata, host URL, file dependencies, and page configurations
- **Implementation file** (`.js`): Contains JavaScript functions for data scraping and processing

### Key Components

**sourcesv3_qoli.json**: Main configuration file containing an array of plugin definitions with:
- `id`: Unique identifier
- `name`: Display name  
- `api`: Plugin URL using `syncnextPlugin://` protocol
- `Cover`: Thumbnail image URL
- `Search`: Boolean indicating search capability

**alpha_v2/ directory**: Contains plugin implementations including:
- Individual plugin files (e.g., bdys.js, nivod.js, libvio.js)
- Shared utilities (util.js, txml.js, crypto-js.min.js)
- Configuration files matching each JavaScript implementation

### Plugin Implementation Pattern

Each plugin JavaScript file follows a standard structure:
- `buildMedias(inputURL)`: Main function for fetching and parsing media listings
- `Episodes(inputURL)`: Function for retrieving episode information
- `buildURL(href)`: URL normalization helper
- Uses `$http.fetch()` for HTTP requests and `tXml` for HTML parsing
- Returns data via `$next.toMedias()` callback

### Dependencies
- **crypto-js**: Cryptographic functions for authentication/signing
- **node-fetch**: HTTP client for API requests  
- **txml**: Lightweight XML/HTML parser

## Plugin Development Notes

- All plugins use the SyncNext plugin protocol (`syncnextPlugin://`)
- JavaScript files should use backtick-quoted `user script` declaration
- HTML parsing relies on className-based element selection
- URL building should handle both relative and absolute paths
- Plugin metadata must match between .json config and .js implementation files
# Repository Guidelines

## Project Structure & Module Organization
- `alpha_v2/`: Primary plugin source. Each plugin has a `.js` implementation and a matching `.json` config (same basename).
- `sourcesv3_qoli.json`: Aggregate list of plugin definitions used for subscription feeds.
- `Docs/`: Reference documentation and notes for SyncNext/MoonTV usage.
- `package.json`: Node dependencies used by local tooling (crypto-js, node-fetch, txml, ws).

## Build, Test, and Development Commands
- `npm install`: Install dependencies for local scripting and quick validation.
- `npm test`: Runs `node node_Test.js` as configured, but the file is currently missing. Update the script or add the file if you add tests.

## Coding Style & Naming Conventions
- JavaScript: follow existing style in `alpha_v2/*.js` (2-space indentation, semicolons, camelCase function names).
- Plugin files: include the required `` `user script` `` header; keep standard entry points like `buildMedias`, `Episodes`, `buildURL`, and optional `Search`.
- Naming: keep `.json` and `.js` filenames identical (e.g., `bdys.json` + `bdys.js`).
- JSON config: keep keys aligned with existing configs (`id`, `name`, `api`, `Cover`, `Search`, etc.).

## Testing Guidelines
- No formal test framework is set up. If you add tests, document them here and update `package.json` scripts.
- Prefer lightweight node scripts for quick checks against known URLs; keep fixtures small.

## Commit & Pull Request Guidelines
- Commit messages follow emoji + conventional style, e.g., `🐛 fix(moontv): ...` or `🔧 chore(config): ...`.
- Keep commit subjects short; use the body for details when changes are non-trivial.
- PRs should describe the affected plugin(s), include sample source URLs, and mention any changes to `sourcesv3_qoli.json`.

## Plugin Development Notes
- Ensure `.json` metadata matches the `.js` implementation and any exported IDs.
- Use `buildURL()` to normalize relative URLs.
- Validate output payloads before calling `$next.toMedias()` / `$next.toEpisodes()`.

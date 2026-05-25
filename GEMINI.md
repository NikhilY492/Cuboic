## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- In Gemini CLI, the reliable explicit custom command is `/graphify ...`
- If the user asks to build, update, query, path, or explain the graph, use the installed `/graphify` custom command or the configured `graphify` MCP server instead of ad-hoc file traversal
- After modifying code files in this session, run `npx graphify hook-rebuild` to keep the graph current

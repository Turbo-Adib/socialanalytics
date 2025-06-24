# MCP (Model Context Protocol) Setup Guide

This project uses MCP servers to enhance AI assistance capabilities. We've configured two MCP servers:

1. **Sequential Thinking** - Helps with step-by-step problem solving and complex reasoning
2. **Context7** - Provides enhanced context management and memory capabilities

## Installation

The MCP servers have been installed globally:
```bash
npm install -g @modelcontextprotocol/server-sequential-thinking
npm install -g @upstash/context7-mcp
```

## Configuration for Claude Desktop

To use these MCP servers with Claude Desktop, you need to add the configuration to your Claude Desktop config file.

### Location of Config File:
- **Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### Add this configuration:

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "UPSTASH_VECTOR_REST_URL": "your-upstash-vector-url-here",
        "UPSTASH_VECTOR_REST_TOKEN": "your-upstash-vector-token-here"
      }
    }
  }
}
```

## Setting up Context7

Context7 requires an Upstash Vector database. To set it up:

1. Create an account at [Upstash](https://upstash.com/)
2. Create a new Vector database
3. Copy your REST URL and REST TOKEN
4. Replace the placeholder values in the configuration

## Using MCP in Development

When these MCP servers are active, Claude will have access to:

### Sequential Thinking Tools:
- `create_thought_sequence`: Break down complex problems
- `add_thought`: Add steps to the thinking process
- `get_thought_sequence`: Review the thinking process
- `update_thought_status`: Track progress on thoughts
- `search_thoughts`: Find relevant thoughts

### Context7 Tools:
- Enhanced context management
- Better memory across conversations
- Improved understanding of project structure

## Verifying Installation

After setting up the configuration and restarting Claude Desktop, you should see the MCP tools available in Claude's tool list.

## Troubleshooting

1. **MCP servers not showing up**: 
   - Ensure Claude Desktop is completely closed and restarted
   - Check the config file syntax is valid JSON
   - Verify the MCP servers are installed globally

2. **Context7 errors**:
   - Ensure you have valid Upstash credentials
   - Check that the Vector database is created and active

3. **Command not found**:
   - Make sure `npx` is available in your PATH
   - Try using the full path to npx in the command

## Project Integration

This project's CLAUDE.md file has been updated to document the MCP integration, ensuring future AI assistants understand these enhanced capabilities are available.
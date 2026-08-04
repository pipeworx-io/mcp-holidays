# mcp-holidays

Holidays MCP — wraps Nager.Date API (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_holidays` | Get all public holidays for a country and year. Returns holiday names and dates. Provide country code (e.g., "US", "GB", "DE") and year. |
| `is_today_holiday` | Check if today is a public holiday in a given country. Returns whether it's a holiday and the holiday name if applicable. Provide country code (e.g., "US", "GB"). |
| `next_holidays` | Get upcoming public holidays from today onward for a country. Returns holiday names and dates. Provide country code (e.g., "US", "GB", "DE"). |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "holidays": {
      "url": "https://gateway.pipeworx.io/holidays/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Holidays data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

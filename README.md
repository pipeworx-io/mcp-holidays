# @pipeworx/mcp-holidays

MCP server for public holidays — worldwide holiday data by country and year. Wraps the [Nager.Date API](https://date.nager.at/) (free, no auth required).

## Tools

| Tool | Description |
|------|-------------|
| `get_holidays` | Get public holidays for a country and year |
| `is_today_holiday` | Check whether today is a public holiday in a given country |
| `next_holidays` | Get upcoming public holidays for a country |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "holidays": {
      "url": "https://gateway.pipeworx.io/holidays/mcp"
    }
  }
}
```

Or run via CLI:

```bash
npx pipeworx use holidays
```

## License

MIT

/**
 * Holidays MCP — wraps Nager.Date API (free, no auth)
 *
 * Tools:
 * - get_holidays: public holidays for a country and year
 * - is_today_holiday: check if today is a public holiday in a country
 * - next_holidays: upcoming public holidays for a country
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://date.nager.at/api/v3';

type Holiday = {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
};

const tools: McpToolExport['tools'] = [
  {
    name: 'get_holidays',
    description:
      'Get public holidays for a country and year. Uses ISO 3166-1 alpha-2 country codes (e.g., "US", "GB", "DE").',
    inputSchema: {
      type: 'object',
      properties: {
        country_code: {
          type: 'string',
          description: 'ISO 3166-1 alpha-2 country code (e.g., US, GB, DE, FR)',
        },
        year: {
          type: 'number',
          description: 'The year to retrieve holidays for (e.g., 2025)',
        },
      },
      required: ['country_code', 'year'],
    },
  },
  {
    name: 'is_today_holiday',
    description:
      'Check whether today is a public holiday in the given country.',
    inputSchema: {
      type: 'object',
      properties: {
        country_code: {
          type: 'string',
          description: 'ISO 3166-1 alpha-2 country code (e.g., US, GB, DE, FR)',
        },
      },
      required: ['country_code'],
    },
  },
  {
    name: 'next_holidays',
    description:
      'Get upcoming public holidays for a country (from today forward).',
    inputSchema: {
      type: 'object',
      properties: {
        country_code: {
          type: 'string',
          description: 'ISO 3166-1 alpha-2 country code (e.g., US, GB, DE, FR)',
        },
      },
      required: ['country_code'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_holidays':
      return getHolidays(args.country_code as string, args.year as number);
    case 'is_today_holiday':
      return isTodayHoliday(args.country_code as string);
    case 'next_holidays':
      return nextHolidays(args.country_code as string);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function formatHoliday(h: Holiday) {
  return {
    date: h.date,
    name: h.name,
    local_name: h.localName,
    global: h.global,
    counties: h.counties ?? null,
    types: h.types,
  };
}

async function getHolidays(countryCode: string, year: number) {
  const code = countryCode.toUpperCase();
  const res = await fetch(
    `${BASE_URL}/PublicHolidays/${encodeURIComponent(String(year))}/${encodeURIComponent(code)}`,
  );
  if (res.status === 404) throw new Error(`No holiday data for country: "${code}"`);
  if (!res.ok) throw new Error(`Nager.Date error: ${res.status}`);

  const data = (await res.json()) as Holiday[];
  return {
    country_code: code,
    year,
    holidays: data.map(formatHoliday),
  };
}

async function isTodayHoliday(countryCode: string) {
  const code = countryCode.toUpperCase();
  const res = await fetch(
    `${BASE_URL}/IsTodayPublicHoliday/${encodeURIComponent(code)}`,
  );
  // 200 = yes, 204 = no, 404 = unknown country
  if (res.status === 404) throw new Error(`Unknown country code: "${code}"`);
  if (res.status !== 200 && res.status !== 204) {
    throw new Error(`Nager.Date error: ${res.status}`);
  }

  return {
    country_code: code,
    is_holiday: res.status === 200,
  };
}

async function nextHolidays(countryCode: string) {
  const code = countryCode.toUpperCase();
  const res = await fetch(
    `${BASE_URL}/NextPublicHolidays/${encodeURIComponent(code)}`,
  );
  if (res.status === 404) throw new Error(`No holiday data for country: "${code}"`);
  if (!res.ok) throw new Error(`Nager.Date error: ${res.status}`);

  const data = (await res.json()) as Holiday[];
  return {
    country_code: code,
    upcoming_holidays: data.map(formatHoliday),
  };
}

export default { tools, callTool } satisfies McpToolExport;

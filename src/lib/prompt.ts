export function buildContextProtocol(
  query: string,
  metric: string,
  data: { period: string; value: number; unit: string }[],
  definitions: string
) {
  const hist = data.map(d => `${d.period}: ${d.value} ${d.unit}`).join('\n');
  return `
You are an energy data analyst using only EIA.gov data.

Definitions: ${definitions}

Historical Data for ${metric}:
${hist}

User Query: ${query}

Protocol Guidelines:
- Compute week-over-week changes (absolute & %).
- Compare consistently across periods.
- Cite EIA series ID and dates.
- Be factual; do not hallucinate.
- Explain implications briefly.
`;
}

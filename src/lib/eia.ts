import { EIA_API_KEY } from '$env/static/private';

const BASE = 'https://api.eia.gov/v2/';

export async function fetchEiaData(
  seriesId: string,
  periods = 4
): Promise<{ period: string; value: number; unit: string }[]> {
  const url = `${BASE}petroleum/data/?api_key=${EIA_API_KEY}` +
    `&facets[seriesId][]=${seriesId}` +
    `&frequency=weekly&data[]=value&sort[0][column]=period&sort[0][direction]=desc&num=${periods}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('EIA API error');
  const json = await res.json();
  return json.response.data.map((d: any) => ({
    period: d.period,
    value: d.value,
    unit: d['value-units'] || 'thousand barrels per day'
  }));
}

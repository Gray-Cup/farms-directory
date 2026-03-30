export type RegionSlug = 'south-india' | 'north-east-india' | 'east-india' | 'north-india' | 'west-india'

export interface Region {
  label: string
  slug: RegionSlug
  states: string[]
  headline: string
  body: string
}

export const REGIONS: Region[] = [
  {
    slug: 'south-india',
    label: 'South India',
    states: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Telangana'],
    headline: 'Coffee & Tea Farms in South India',
    body: `South India is the heartland of Indian coffee. The Western Ghats — spanning Karnataka, Kerala, and Tamil Nadu — produce the majority of India's arabica and robusta coffee at elevations between 900m and 1,500m. Karnataka's Coorg and Chikmagalur districts are the most well-known growing regions, while the Nilgiris and Wayanad add their own distinct character. South Indian tea estates, particularly in Tamil Nadu's Nilgiris, produce some of India's finest orthodox teas. Browse all coffee and tea farms listed from South India below.`,
  },
  {
    slug: 'north-east-india',
    label: 'North East India',
    states: ['Assam', 'Meghalaya', 'Arunachal Pradesh', 'Manipur', 'Nagaland', 'Mizoram', 'Tripura', 'Sikkim'],
    headline: 'Coffee & Tea Farms in North East India',
    body: `North East India is synonymous with tea. Assam produces the world's largest single-origin tea — a bold, malty black tea grown on the floodplains of the Brahmaputra river at low elevations. Sikkim and Meghalaya have emerging specialty coffee and tea estates at higher altitudes. The region's unique climate, abundant rainfall, and rich biodiversity make it one of the most important tea-growing zones in the world. Browse all farms listed from North East India below.`,
  },
  {
    slug: 'east-india',
    label: 'East India',
    states: ['West Bengal', 'Odisha', 'Jharkhand', 'Bihar'],
    headline: 'Coffee & Tea Farms in East India',
    body: `East India is home to Darjeeling — arguably the most famous tea-growing region in the world. West Bengal's Darjeeling district produces a light, floral tea with a distinctive muscatel character, grown at elevations up to 2,000m in the foothills of the Himalayas. The region is known for its first-flush and second-flush harvests. Browse all coffee and tea farms listed from East India below.`,
  },
  {
    slug: 'north-india',
    label: 'North India',
    states: ['Himachal Pradesh', 'Uttarakhand', 'Jammu and Kashmir', 'Jammu & Kashmir'],
    headline: 'Coffee & Tea Farms in North India',
    body: `North India's tea gardens are among the highest-altitude growing regions in the world. Himachal Pradesh's Kangra valley has a long history of tea cultivation dating back to the 1800s, producing a delicate, light-coloured brew. Uttarakhand's Kumaon region is home to small-batch specialty tea estates gaining recognition for their quality. Browse all farms listed from North India below.`,
  },
  {
    slug: 'west-india',
    label: 'West India',
    states: ['Maharashtra', 'Goa', 'Gujarat', 'Rajasthan'],
    headline: 'Coffee & Tea Farms in West India',
    body: `West India is an emerging region for specialty coffee, with Maharashtra's tribal belt and hilly areas increasingly attracting smallholder coffee cultivation. While not as established as South India, farms in this region are growing in number and quality. Browse all coffee and tea farms listed from West India below.`,
  },
]

export function getRegion(slug: string): Region | undefined {
  return REGIONS.find(r => r.slug === slug)
}

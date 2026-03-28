import { getCoffeeFarms, getTeaFarms } from '@/lib/farms'
import DirectoryClient from '@/components/DirectoryClient'
import type { CoffeeFarmData, TeaFarmData } from '@farms/db'

// This page is statically generated at build time from the JSON data files.
// To add new farms, merge a PR that updates data/coffee-farms.json or data/tea-farms.json.
export const dynamic = 'force-static'

// Strip contact fields so they are never embedded in the static HTML.
// Contact info is fetched on-demand via /api/contact after Turnstile verification.
function stripContact<T extends CoffeeFarmData | TeaFarmData>(farms: T[]): T[] {
  return farms.map(({ phone: _p, email: _e, ...rest }) => rest as T)
}

export default function HomePage() {
  const coffeeFarms = stripContact(getCoffeeFarms())
  const teaFarms = stripContact(getTeaFarms())

  return <DirectoryClient coffeeFarms={coffeeFarms} teaFarms={teaFarms} />
}

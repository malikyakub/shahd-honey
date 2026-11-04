// Drop final images into src/assets/images as <product-id>.png|webp and hero.png|webp.
// They are picked up automatically at build time; until then a styled placeholder is shown.
const files = import.meta.glob('../assets/images/*.{png,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const byName: Record<string, string> = {}
for (const [path, url] of Object.entries(files)) {
  const file = path.split('/').pop()!
  const name = file.replace(/\.(png|webp)$/, '')
  // Prefer .webp when both exist
  if (!byName[name] || file.endsWith('.webp')) byName[name] = url
}

export function imageFor(name: string): string | undefined {
  return byName[name]
}

import fs from 'node:fs';
import path from 'node:path';

interface FontSourceEntry {
  readonly urlPath: string;
  readonly format: 'woff2' | 'woff' | 'truetype' | 'opentype';
  readonly priority: number;
  readonly weight: string;
  readonly style: 'normal' | 'italic';
}

const FONT_FORMAT_MAP: Record<
  string,
  { readonly format: FontSourceEntry['format']; readonly priority: number }
> = {
  '.woff2': { format: 'woff2', priority: 1 },
  '.woff': { format: 'woff', priority: 2 },
  '.ttf': { format: 'truetype', priority: 3 },
  '.otf': { format: 'opentype', priority: 4 },
};

const WEIGHT_RULES: ReadonlyArray<{
  readonly pattern: RegExp;
  readonly weight: string;
}> = [
  { pattern: /(?:^|[-_\s.])(vf|variable)(?:$|[-_\s.])/i, weight: '100 900' },
  { pattern: /(?:^|[-_\s.])(thin|hairline|100)(?:$|[-_\s.])/i, weight: '100' },
  {
    pattern: /(?:^|[-_\s.])(extralight|extra[-_]?light|ultralight|200)(?:$|[-_\s.])/i,
    weight: '200',
  },
  { pattern: /(?:^|[-_\s.])(light|300)(?:$|[-_\s.])/i, weight: '300' },
  {
    pattern: /(?:^|[-_\s.])(regular|normal|book|400)(?:$|[-_\s.])/i,
    weight: '400',
  },
  { pattern: /(?:^|[-_\s.])(medium|500)(?:$|[-_\s.])/i, weight: '500' },
  {
    pattern: /(?:^|[-_\s.])(semibold|semi[-_]?bold|demibold|600)(?:$|[-_\s.])/i,
    weight: '600',
  },
  { pattern: /(?:^|[-_\s.])(bold|700)(?:$|[-_\s.])/i, weight: '700' },
  {
    pattern: /(?:^|[-_\s.])(extrabold|extra[-_]?bold|ultrabold|800)(?:$|[-_\s.])/i,
    weight: '800',
  },
  {
    pattern: /(?:^|[-_\s.])(black|heavy|fat|900)(?:$|[-_\s.])/i,
    weight: '900',
  },
];

function detectWeightFromFilename(baseName: string): string | null {
  for (const rule of WEIGHT_RULES) {
    if (rule.pattern.test(baseName)) {
      return rule.weight;
    }
  }
  return null;
}

function scanFontDirectory(
  directoryPath: string,
  publicPrefix: string
): FontSourceEntry[] {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  } catch {
    return [];
  }

  const discovered: Array<FontSourceEntry & { readonly detectedWeight: string | null }> =
    [];

  for (const entry of entries) {
    if (!entry.isFile() || entry.name.startsWith('.')) {
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    const formatInfo = FONT_FORMAT_MAP[ext];
    if (!formatInfo) {
      continue;
    }

    const baseName = path.basename(entry.name, ext);
    const detectedWeight = detectWeightFromFilename(baseName);
    const isItalic = /(?:^|[-_\s.])italic(?:$|[-_\s.])/i.test(baseName);

    discovered.push({
      urlPath: `${publicPrefix}/${encodeURIComponent(entry.name)}`,
      format: formatInfo.format,
      priority: formatInfo.priority,
      detectedWeight,
      weight: detectedWeight ?? '400',
      style: isItalic ? 'italic' : 'normal',
    });
  }

  if (discovered.length === 0) {
    return [];
  }

  // If a single base weight (or single variable/unweighted file) is uploaded,
  // expose full weight range 100..900 so all headings and weights render cleanly.
  const distinctWeights = new Set(
    discovered.map((item) => item.detectedWeight ?? 'default')
  );
  const singleGroup = distinctWeights.size === 1;

  return discovered.map((item) => ({
    urlPath: item.urlPath,
    format: item.format,
    priority: item.priority,
    weight:
      singleGroup && item.detectedWeight === null ? '100 900' : item.weight,
    style: item.style,
  }));
}

/**
 * Automatically scans `public/fonts/persian/` (with fallback to `public/fonts/`)
 * for uploaded `.woff2`, `.woff`, `.ttf`, or `.otf` font files and builds CSS
 * `@font-face` rules for the `'RasmanPersianCustom'` font family.
 */
export function getCustomPersianFontCss(): string {
  const persianDir = path.join(process.cwd(), 'public', 'fonts', 'persian');
  let fonts = scanFontDirectory(persianDir, '/fonts/persian');

  if (fonts.length === 0) {
    const rootFontsDir = path.join(process.cwd(), 'public', 'fonts');
    fonts = scanFontDirectory(rootFontsDir, '/fonts');
  }

  if (fonts.length === 0) {
    return '';
  }

  const grouped = new Map<string, FontSourceEntry[]>();
  for (const font of fonts) {
    const key = `${font.style}:${font.weight}`;
    const bucket = grouped.get(key) ?? [];
    bucket.push(font);
    grouped.set(key, bucket);
  }

  const rules: string[] = [];
  for (const [, bucket] of grouped) {
    const sorted = [...bucket].sort((a, b) => a.priority - b.priority);
    const { weight, style } = sorted[0];
    const srcList = sorted
      .map((item) => `url('${item.urlPath}') format('${item.format}')`)
      .join(', ');

    rules.push(
      `@font-face{font-family:'RasmanPersianCustom';src:${srcList};font-weight:${weight};font-style:${style};font-display:swap;}`
    );
  }

  return rules.join('');
}

import type { Locale } from '@/lib/config/site';

export type BlogCategoryId =
  | 'all'
  | 'sustainable'
  | 'materials'
  | 'urban'
  | 'theory';

export interface LocalizedText {
  readonly en: string;
  readonly fa: string;
}

export interface BlogCategory {
  readonly id: BlogCategoryId;
  readonly label: LocalizedText;
}

export type AuthorSocialPlatform = 'facebook' | 'x' | 'instagram' | 'linkedin';

export interface AuthorSocialLink {
  readonly platform: AuthorSocialPlatform;
  readonly href: string;
}

export interface BlogAuthor {
  readonly name: LocalizedText;
  readonly role: LocalizedText;
  readonly bio: LocalizedText;
  readonly avatar: string;
  readonly socials: readonly AuthorSocialLink[];
}

export interface BlogSection {
  readonly heading?: LocalizedText;
  readonly paragraph: LocalizedText;
}

export interface BlogPost {
  readonly slug: string;
  readonly categoryId: Exclude<BlogCategoryId, 'all'>;
  readonly title: LocalizedText;
  readonly excerpt: LocalizedText;
  readonly monthLabel: LocalizedText;
  readonly dayNumber: string;
  readonly fullDate: LocalizedText;
  readonly isoDate: string;
  readonly readMinutes: number;
  readonly author: BlogAuthor;
  readonly coverImage: string;
  readonly coverAlt: LocalizedText;
  readonly coverCaption: LocalizedText;
  readonly sections: readonly BlogSection[];
}

export const BLOG_CATEGORIES: readonly BlogCategory[] = [
  {
    id: 'all',
    label: { en: 'All Essays', fa: 'همه مقالات' },
  },
  {
    id: 'sustainable',
    label: { en: 'Sustainable Architecture', fa: 'معماری پایدار' },
  },
  {
    id: 'materials',
    label: { en: 'Materials & Craft', fa: 'مصالح و ساخت' },
  },
  {
    id: 'urban',
    label: { en: 'Urban Tectonics', fa: 'تکتونیک شهری' },
  },
  {
    id: 'theory',
    label: { en: 'Spatial Theory', fa: 'نظریه فضا' },
  },
] as const;

const AUTHORS = {
  dariush: {
    name: { en: 'Dariush Rasman', fa: 'داریوش رسمان' },
    role: { en: 'Principal Architect', fa: 'معمار ارشد' },
    bio: {
      en: 'Investigating climate-responsive courtyards, vernacular masonry, and quiet architectural permanence across arid landscapes.',
      fa: 'پژوهشگر حیاط‌های اقلیمی، بنایی بومی و ماندگاری آرام معماری در بسترهای خشک و نیمه‌خشک.',
    },
    avatar: '/images/team/dariush-rasman.jpg',
    socials: [
      { platform: 'facebook', href: 'https://facebook.com/rasmanstudio' },
      { platform: 'x', href: 'https://x.com/rasmanstudio' },
      { platform: 'instagram', href: 'https://instagram.com/rasmanstudio' },
      { platform: 'linkedin', href: 'https://linkedin.com/company/rasmanstudio' },
    ],
  },
  sara: {
    name: { en: 'Sara Farahmand', fa: 'سارا فرهمند' },
    role: { en: 'Materials Researcher', fa: 'پژوهشگر مصالح' },
    bio: {
      en: 'Focuses on compacted earth, breathable lime plasters, and low-embodied-carbon tectonics for contemporary cultural venues.',
      fa: 'متمرکز بر خاک کوبیده، اندودهای تنفس‌پذیر آهکی و تکتونیک کم‌کربن برای فضاهای فرهنگی معاصر.',
    },
    avatar: '/images/team/sara-farahmand.jpg',
    socials: [
      { platform: 'facebook', href: 'https://facebook.com/rasmanstudio' },
      { platform: 'x', href: 'https://x.com/rasmanstudio' },
      { platform: 'instagram', href: 'https://instagram.com/rasmanstudio' },
      { platform: 'linkedin', href: 'https://linkedin.com/company/rasmanstudio' },
    ],
  },
  navid: {
    name: { en: 'Navid Mansouri', fa: 'نوید منصوری' },
    role: { en: 'Timber & Structural Lead', fa: 'سرپرست سازه‌های چوبی' },
    bio: {
      en: 'Explores precision CNC-milled timber grids, dry-assembled joinery, and reversible structures for sensitive terrain.',
      fa: 'بررسی شبکه‌های چوبی دقیق، اتصالات خشک‌چین و سازه‌های برگشت‌پذیر در بسترهای حساس طبیعی.',
    },
    avatar: '/images/team/navid-mansouri.jpg',
    socials: [
      { platform: 'facebook', href: 'https://facebook.com/rasmanstudio' },
      { platform: 'x', href: 'https://x.com/rasmanstudio' },
      { platform: 'instagram', href: 'https://instagram.com/rasmanstudio' },
      { platform: 'linkedin', href: 'https://linkedin.com/company/rasmanstudio' },
    ],
  },
  mina: {
    name: { en: 'Mina Tavakoli', fa: 'مینا توکلی' },
    role: { en: 'Urban Designer', fa: 'طراح شهری' },
    bio: {
      en: 'Works on pedestrian-first regeneration, shaded civic thresholds, and adaptive reuse within historic city cores.',
      fa: 'فعال در بازآفرینی پیاده‌محور، آستانه‌های سایه‌دار عمومی و استفاده مجدد تطبیقی در هسته‌های تاریخی شهر.',
    },
    avatar: '/images/team/mina-tavakoli.jpg',
    socials: [
      { platform: 'facebook', href: 'https://facebook.com/rasmanstudio' },
      { platform: 'x', href: 'https://x.com/rasmanstudio' },
      { platform: 'instagram', href: 'https://instagram.com/rasmanstudio' },
      { platform: 'linkedin', href: 'https://linkedin.com/company/rasmanstudio' },
    ],
  },
} as const;

export const BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: 'from-blank-plot-to-living-courtyard',
    categoryId: 'sustainable',
    title: {
      en: 'From Blank Plot to Living Courtyard: A Passive Architecture Ritual',
      fa: 'از زمین خام تا حیاط زنده: آیین طراحی معماری غیرفعال',
    },
    excerpt: {
      en: 'How courtyard proportion, timber shading louvers, and limestone thermal mass cut mechanical cooling demand by seventy percent.',
      fa: 'چگونه تناسبات حیاط، لوورهای سایه‌بان چوبی و جرم حرارتی سنگ آهک نیاز به سرمایش مکانیکی را تا هفتاد درصد کاهش می‌دهند.',
    },
    monthLabel: { en: 'Nov', fa: 'آبان' },
    dayNumber: '14',
    fullDate: { en: 'November 14, 2026', fa: '۲۳ آبان ۱۴۰۵' },
    isoDate: '2026-11-14',
    readMinutes: 4,
    author: AUTHORS.dariush,
    coverImage: '/images/blog/courtyard-ritual.jpg',
    coverAlt: {
      en: 'Minimalist courtyard residence framed with timber shading louvers and natural stone',
      fa: 'خانه حیاط‌دار مینیمال با لوورهای چوبی و سنگ طبیعی',
    },
    coverCaption: {
      en: 'Proportion and shadow replace mechanical force. Photo: Rasman Archive',
      fa: 'تناسب و سایه جایگزین نیروی مکانیکی می‌شوند. عکس: آرشیو رسمان',
    },
    sections: [
      {
        paragraph: {
          en: 'An empty plot can feel deceptively quiet, yet wind vectors, solar altitude, and seasonal dust are already drawing invisible boundaries across the earth. The discipline of passive architecture begins by reading those forces before placing a single structural line.',
          fa: 'یک زمین خالی در ظاهر ساکت به نظر می‌رسد، اما جهت باد، زاویه تابش خورشید و اقلیم فصلی پیشاپیش مرزهای نامرئی خود را بر خاک ترسیم کرده‌اند. معماری غیرفعال با خوانش همین نیروها پیش از کشیدن نخستین خط آغاز می‌شود.',
        },
      },
      {
        heading: {
          en: 'Calibrating the Courtyard Proportion',
          fa: 'تنظیم تناسبات حیاط مرکزی',
        },
        paragraph: {
          en: 'When courtyard width stays below twice the perimeter wall height, afternoon shadows lock cool air inside the lower volume. Paired with a shallow stone basin and native drought-tolerant olive trees, night-flush ventilation drops interior peak temperatures dramatically.',
          fa: 'هنگامی که عرض حیاط کمتر از دو برابر ارتفاع دیوارهای پیرامونی باشد، سایه‌های بعدازظهر هوای خنک را در لایه پایین نگه می‌دارند. ترکیب این هندسه با حوض کم‌عمق سنگی و درختان مقاوم بومی، دمای اوج داخلی را به‌شدت کاهش می‌دهد.',
        },
      },
      {
        heading: {
          en: 'Thermal Mass as Silent Infrastructure',
          fa: 'جرم حرارتی به‌مثابه زیرساخت خاموش',
        },
        paragraph: {
          en: 'Thick limestone walls absorb midday radiation slowly and release it after midnight when plateau temperatures fall. Instead of fighting the climate with oversized compressors, the building envelope itself performs the thermal work quietly for decades.',
          fa: 'دیوارهای ضخیم سنگ آهک تابش نیمروز را به‌آرامی جذب کرده و پس از نیمه‌شب که هوای فلات سرد می‌شود آزاد می‌کنند. به‌جای مقابله با اقلیم با تجهیزات پرمصرف، خود پوسته ساختمان برای دهه‌ها کار حرارتی را بی‌صدا انجام می‌دهد.',
        },
      },
    ],
  },
  {
    slug: 'rammed-earth-and-clerestory-light',
    categoryId: 'materials',
    title: {
      en: 'Rammed Earth and Clerestory Light: Returning Raw Soil to Cultural Space',
      fa: 'خاک کوبیده و نورگیر سقفی: بازگشت خاک خام به فضای فرهنگی',
    },
    excerpt: {
      en: 'Exploring compacted earth walls in modern galleries—an assembly that unifies structural mass, acoustic warmth, and geological texture.',
      fa: 'بررسی دیوارهای خاک کوبیده در گالری‌های معاصر؛ ترکیبی که جرم سازه‌ای، گرمای آکوستیک و بافت زمین‌شناختی را یکپارچه می‌کند.',
    },
    monthLabel: { en: 'Nov', fa: 'آبان' },
    dayNumber: '08',
    fullDate: { en: 'November 8, 2026', fa: '۱۷ آبان ۱۴۰۵' },
    isoDate: '2026-11-08',
    readMinutes: 5,
    author: AUTHORS.sara,
    coverImage: '/images/blog/rammed-earth-light.jpg',
    coverAlt: {
      en: 'Cultural gallery interior with layered rammed-earth walls and linear skylight',
      fa: 'فضای داخلی گالری با دیوارهای لایه‌ای خاک کوبیده و نورگیر خطی',
    },
    coverCaption: {
      en: 'Layered soil strata illuminated by northern clerestory daylight.',
      fa: 'لایه‌های فشرده خاک در نور ملایم نورگیر شمالی.',
    },
    sections: [
      {
        paragraph: {
          en: 'Raw excavated subsoil carries the exact chromatic signature of its site. Compacted in thin lifts inside timber formwork, it transitions from loose aggregate into monolithic load-bearing walls with a fraction of concrete’s embodied carbon.',
          fa: 'خاک برداشت‌شده از خود سایت دقیقاً امضای رنگی همان سرزمین را در خود دارد. هنگامی که در لایه‌های نازک درون قالب چوبی کوبیده می‌شود، از دانه‌های سست به دیوارهای یکپارچه با کسری از کربن بتن تبدیل می‌گردد.',
        },
      },
      {
        heading: {
          en: 'Grazing Light Across Mineral Strata',
          fa: 'تابش مماس نور بر لایه‌های معدنی',
        },
        paragraph: {
          en: 'Placing continuous clerestory slots directly along the wall plane turns subtle compaction seams into a living geological relief. As the sun arcs overhead, gallery walls shift from warm ochre to deep umber without harsh glare on artworks.',
          fa: 'قرار دادن شکاف‌های نورگیر سقفی در امتداد صفحه دیوار، درزهای ظریف کوبش خاک را به نقش‌برجسته‌ای زنده بدل می‌کند. با حرکت خورشید، دیوارها بدون خیرگی روی آثار، طیف‌های گرم و آرام می‌گیرند.',
        },
      },
    ],
  },
  {
    slug: 'timber-grids-and-swiss-precision',
    categoryId: 'materials',
    title: {
      en: 'Timber Grids and Swiss Precision: Why Mass Timber Defines Tomorrow',
      fa: 'شبکه‌های چوبی و دقت ساخت: چرا چوب مهندسی‌شده آینده را می‌سازد',
    },
    excerpt: {
      en: 'Precision CNC-milled glulam grids accelerate assembly while turning contemporary pavilions into verifiable carbon sinks.',
      fa: 'شبکه‌های چوب لمینت دقیق سرعت اجرا را بالا می‌برند و پاویون‌های معاصر را به مخازن قابل سنجش جذب کربن تبدیل می‌کنند.',
    },
    monthLabel: { en: 'Nov', fa: 'آبان' },
    dayNumber: '01',
    fullDate: { en: 'November 1, 2026', fa: '۱۰ آبان ۱۴۰۵' },
    isoDate: '2026-11-01',
    readMinutes: 6,
    author: AUTHORS.navid,
    coverImage: '/images/blog/mass-timber-grid.jpg',
    coverAlt: {
      en: 'Exposed mass timber structural grid overlooking alpine terrain',
      fa: 'شبکه سازه‌ای چوب مهندسی‌شده در برابر چشم‌انداز کوهستانی',
    },
    coverCaption: {
      en: 'Dry-bolted structural grids allow complete future disassembly.',
      fa: 'اتصالات خشک سازه‌ای امکان جداسازی کامل در آینده را فراهم می‌کنند.',
    },
    sections: [
      {
        paragraph: {
          en: 'Engineered mass timber bridges craft heritage and digital fabrication. Every beam-to-column mortise is milled off-site to sub-millimeter tolerances, shrinking on-site noise, dust, and construction waste to near zero.',
          fa: 'چوب مهندسی‌شده پیوندی میان میراث ساخت و تولید دیجیتال برقرار می‌کند. هر اتصال تیر به ستون با دقت زیرمیلی‌متری در کارگاه آماده می‌شود و ضایعات و آلودگی صوتی کارگاه را به حداقل می‌رساند.',
        },
      },
      {
        heading: {
          en: 'Designing for Reversible Assembly',
          fa: 'طراحی برای مونتاژ برگشت‌پذیر',
        },
        paragraph: {
          en: 'By replacing wet adhesives with concealed stainless connectors, timber frames behave like architectural furniture: components can be inspected, repaired, or relocated intact after decades of service.',
          fa: 'با جایگزینی چسب‌های تر با اتصالات مکانیکی پنهان، قاب‌های چوبی همچون مبلمان معماری عمل می‌کنند؛ قطعات پس از دهه‌ها قابل بازبینی، مرمت یا جابه‌جایی کامل هستند.',
        },
      },
    ],
  },
  {
    slug: 'shaded-pedestrian-thresholds',
    categoryId: 'urban',
    title: {
      en: 'Shaded Pedestrian Thresholds: Reclaiming the Street Edge for Slow Life',
      fa: 'آستانه‌های سایه‌دار پیاده: بازپس‌گیری لبه خیابان برای زندگی آرام',
    },
    excerpt: {
      en: 'Small recessed arcades, permeable stone paving, and micro-plazas soften the brutal divide between private plots and civic avenues.',
      fa: 'ایوان‌های فرورفته، سنگفرش‌های نفوذپذیر و میدانچه‌های خُرد مرز خشن میان پلاک‌های خصوصی و معابر شهری را نرم می‌کنند.',
    },
    monthLabel: { en: 'Oct', fa: 'مهر' },
    dayNumber: '24',
    fullDate: { en: 'October 24, 2026', fa: '۲ آبان ۱۴۰۵' },
    isoDate: '2026-10-24',
    readMinutes: 4,
    author: AUTHORS.mina,
    coverImage: '/images/blog/pedestrian-arcade.jpg',
    coverAlt: {
      en: 'Quiet shaded urban arcade with textured stone pavement and soft sunlight',
      fa: 'رواق سایه‌دار شهری با کف‌سازی سنگی و نور ملایم',
    },
    coverCaption: {
      en: 'Civic generosity begins in the first two meters of every facade.',
      fa: 'سخاوت شهری در دو متر نخست هر نما شکل می‌گیرد.',
    },
    sections: [
      {
        paragraph: {
          en: 'Cities become memorable not at expressway intersections, but along the two-meter threshold where a building meets the sidewalk. Setting ground-floor glazing back beneath a modest overhang gives pedestrians shade, rain shelter, and visual rhythm.',
          fa: 'شهرها نه در تقاطع بزرگراه‌ها، بلکه در آستانه دو متری برخورد ساختمان با پیاده‌رو در حافظه می‌مانند. عقب‌نشینی طبقه همکف زیر یک سایه‌بان ساده به عابران سایه، پناه و ریتم بصری می‌بخشد.',
        },
      },
      {
        heading: {
          en: 'Permeable Ground & Urban Cooling',
          fa: 'کف‌سازی نفوذپذیر و خنک‌سازی شهری',
        },
        paragraph: {
          en: 'Replacing sealed asphalt strips with dry-laid basalt pavers channels winter storms directly into street-tree root zones, sustaining mature canopies that cool entire blocks.',
          fa: 'جایگزینی آسفالت نفوذناپذیر با سنگفرش خشک‌چین بازالتی، آب باران را مستقیماً به ریشه درختان معبر هدایت می‌کند و تاج‌پوششی پایدار برای خنک‌سازی محله می‌سازد.',
        },
      },
    ],
  },
  {
    slug: 'quietness-as-spatial-material',
    categoryId: 'theory',
    title: {
      en: 'Quietness as a Spatial Material: Notes on Restraint & Proportion',
      fa: 'سکوت به‌مثابه مصالح فضایی: یادداشت‌هایی درباره خویشتن‌داری و تناسب',
    },
    excerpt: {
      en: 'Why removing redundant joints, decorative trim, and visual noise lets daylight and human presence become the true ornament of a room.',
      fa: 'چرا حذف درزهای اضافی، تزیینات زائد و شلوغی بصری اجازه می‌دهد نور روز و حضور انسان آرایه واقعی فضا شوند.',
    },
    monthLabel: { en: 'Oct', fa: 'مهر' },
    dayNumber: '16',
    fullDate: { en: 'October 16, 2026', fa: '۲۴ مهر ۱۴۰۵' },
    isoDate: '2026-10-16',
    readMinutes: 3,
    author: AUTHORS.dariush,
    coverImage: '/images/blog/spatial-quietness.jpg',
    coverAlt: {
      en: 'Serene monochrome architectural interior with pure geometry and daylight band',
      fa: 'فضای داخلی تک‌رنگ و آرام معماری با هندسه خالص و باریکه نور',
    },
    coverCaption: {
      en: 'Restraint clarifies every remaining edge.',
      fa: 'خویشتن‌داری هر لبه باقی‌مانده را شفاف‌تر می‌کند.',
    },
    sections: [
      {
        paragraph: {
          en: 'Visual fatigue enters architecture long before structural failure. When every surface demands attention, none of them can offer rest. Restraint is not emptiness; it is the deliberate calibration of fewer, better-resolved junctions.',
          fa: 'خستگی بصری بسیار پیش از فرسودگی سازه‌ای وارد معماری می‌شود. هنگامی که هر سطحی طلب توجه کند، هیچ‌یک آرامش نمی‌بخشند. خویشتن‌داری به معنای تهی‌بودن نیست؛ بلکه تنظیم دقیق اتصالات کمتر اما پخته‌تر است.',
        },
      },
      {
        heading: {
          en: 'Editing Until Only Structure Speaks',
          fa: 'ویرایش تا لحظه‌ای که تنها ساختار سخن بگوید',
        },
        paragraph: {
          en: 'In studio reviews, our most productive question is rarely what to add—it is which line can be dissolved without weakening spatial clarity. What remains acquires an unmistakable gravity.',
          fa: 'در نقدهای استودیو، پربارترین پرسش ما به ندرت این است که چه چیزی اضافه کنیم؛ بلکه این است که کدام خط را می‌توان حذف کرد بدون آنکه شفافیت فضا آسیب ببیند.',
        },
      },
    ],
  },
] as const;

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getNextBlogPost(currentSlug: string): BlogPost {
  const index = BLOG_POSTS.findIndex((post) => post.slug === currentSlug);
  const nextIndex = index === -1 ? 0 : (index + 1) % BLOG_POSTS.length;
  return BLOG_POSTS[nextIndex];
}

export function getBlogCategoryById(id: BlogCategoryId): BlogCategory {
  return (
    BLOG_CATEGORIES.find((cat) => cat.id === id) ?? BLOG_CATEGORIES[0]
  );
}

export function getBlogLocalizedText(text: LocalizedText, locale: Locale): string {
  return text[locale] ?? text.en;
}

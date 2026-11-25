import type { Locale } from '@/lib/config/site';
import type { LocalizedText } from '@/lib/data/blog';

export type ProjectMode = 'sustainable' | 'urban';

export type ProjectTypeId =
  | 'all'
  | 'residential'
  | 'cultural'
  | 'urbanMixed'
  | 'hospitality';

export type ProjectStatusId = 'all' | 'concept' | 'inProgress' | 'completed';

export type ProjectLocationId =
  | 'all'
  | 'yazd'
  | 'shiraz'
  | 'kashan'
  | 'lavasan'
  | 'tehran'
  | 'isfahan';

export type ProjectArchitectId =
  | 'dariush'
  | 'sara'
  | 'navid'
  | 'kian'
  | 'mina';

export type ProjectYearId = '2026' | '2025' | '2024';

export type ProjectMaterialId =
  | 'rammedEarth'
  | 'limestone'
  | 'timber'
  | 'brick'
  | 'limePlaster'
  | 'glassSteel';

export type ProjectAreaId = 'small' | 'medium' | 'large';

export type ProjectColorId =
  | 'ochre'
  | 'limestone'
  | 'terracotta'
  | 'timber'
  | 'charcoal'
  | 'olivine';

export interface ProjectMetric {
  readonly label: LocalizedText;
  readonly value: string;
}

export interface ProjectNarrativeSection {
  readonly heading: LocalizedText;
  readonly paragraph: LocalizedText;
}

export interface ProjectGalleryFrame {
  readonly image: string;
  readonly alt: LocalizedText;
  readonly caption: LocalizedText;
}

export interface ArchitecturalProject {
  readonly slug: string;
  readonly mode: ProjectMode;
  readonly type: Exclude<ProjectTypeId, 'all'>;
  readonly status: Exclude<ProjectStatusId, 'all'>;
  readonly location: Exclude<ProjectLocationId, 'all'>;
  readonly architectId: ProjectArchitectId;
  readonly year: ProjectYearId;
  readonly areaSqm: string;
  readonly areaRange: ProjectAreaId;
  readonly materials: readonly ProjectMaterialId[];
  readonly colorPalette: ProjectColorId;
  readonly title: LocalizedText;
  readonly subtitle: LocalizedText;
  readonly overview: LocalizedText;
  readonly client: LocalizedText;
  readonly leadArchitect: LocalizedText;
  readonly heroImage: string;
  readonly heroAlt: LocalizedText;
  readonly heroCaption: LocalizedText;
  readonly metrics: readonly ProjectMetric[];
  readonly sections: readonly ProjectNarrativeSection[];
  readonly gallery: readonly ProjectGalleryFrame[];
}

export const PROJECT_MODE_OPTIONS: readonly ProjectMode[] = [
  'sustainable',
  'urban',
] as const;

export const PROJECT_MODE_ARTWORK: Record<ProjectMode, string> = {
  sustainable:
    '/assets/aistudio/Mountain_nature_sketch_with_trees_31d8447d_2K_fdc58cb5.jpg',
  urban:
    '/assets/aistudio/__________________________714accf1_2K_c02dc2ea.jpg',
} as const;

export const PROJECT_TYPE_OPTIONS: readonly ProjectTypeId[] = [
  'all',
  'residential',
  'cultural',
  'urbanMixed',
  'hospitality',
] as const;

export const PROJECT_STATUS_OPTIONS: readonly ProjectStatusId[] = [
  'all',
  'concept',
  'inProgress',
  'completed',
] as const;

export const PROJECT_LOCATION_OPTIONS: readonly ProjectLocationId[] = [
  'all',
  'yazd',
  'shiraz',
  'kashan',
  'lavasan',
  'tehran',
  'isfahan',
] as const;

export const PROJECT_ARCHITECT_OPTIONS: readonly ProjectArchitectId[] = [
  'dariush',
  'sara',
  'navid',
  'kian',
  'mina',
] as const;

export const PROJECT_YEAR_OPTIONS: readonly ProjectYearId[] = [
  '2026',
  '2025',
  '2024',
] as const;

export const PROJECT_MATERIAL_OPTIONS: readonly ProjectMaterialId[] = [
  'rammedEarth',
  'limestone',
  'timber',
  'brick',
  'limePlaster',
  'glassSteel',
] as const;

export const PROJECT_AREA_OPTIONS: readonly ProjectAreaId[] = [
  'small',
  'medium',
  'large',
] as const;

export const PROJECT_COLOR_OPTIONS: readonly ProjectColorId[] = [
  'ochre',
  'limestone',
  'terracotta',
  'timber',
  'charcoal',
  'olivine',
] as const;

export const PROJECT_COLOR_SWATCHES: Record<ProjectColorId, string> = {
  ochre: '#c79c6e',
  limestone: '#d8d0c3',
  terracotta: '#b36b4d',
  timber: '#8a6242',
  charcoal: '#4a4b49',
  olivine: '#597838',
} as const;

export const ARCHITECTURAL_PROJECTS: readonly ArchitecturalProject[] = [
  {
    slug: 'yazd-desert-pavilion',
    mode: 'sustainable',
    type: 'cultural',
    status: 'completed',
    location: 'yazd',
    architectId: 'dariush',
    year: '2025',
    areaSqm: '1,420',
    areaRange: 'medium',
    materials: ['rammedEarth', 'limePlaster', 'timber'],
    colorPalette: 'ochre',
    title: {
      en: 'Yazd Desert Pavilion',
      fa: 'کوشک کویری یزد',
    },
    subtitle: {
      en: 'Exhibition pavilion crafted with compacted earth walls and a shallow central reflecting basin for passive desert cooling.',
      fa: 'پاویون نمایشگاهی با دیوارهای خاک کوبیده و حوض میانی کم‌عمق برای خنک‌سازی طبیعی در حاشیه کویر.',
    },
    overview: {
      en: 'Anchored at the arid threshold of Yazd, this cultural pavilion harvests prevailing northwest desert winds through calibrated rammed-earth wind-catchers and a linear evaporative water court.',
      fa: 'کوشک کویری یزد در آستانه اقلیم خشک این شهر، با بهره‌گیری از دیوارهای قطور خاک کوبیده و بادگیرهای بازطراحی‌شده، نسیم قالب را از روی حوض آب به فضای نمایشگاهی هدایت می‌کند.',
    },
    client: {
      en: 'Yazd Spatial Art Foundation',
      fa: 'بنیاد هنرهای فضایی یزد',
    },
    leadArchitect: {
      en: 'Dariush Rasman',
      fa: 'داریوش رسمان',
    },
    heroImage: '/images/projects/yazd-hero.jpg',
    heroAlt: {
      en: 'Yazd Desert Pavilion with monolithic rammed earth walls and reflecting pool',
      fa: 'کوشک کویری یزد با دیوارهای یکپارچه خاک کوبیده و حوض بازتاب',
    },
    heroCaption: {
      en: 'Monolithic compacted soil envelope framing morning desert shadows.',
      fa: 'پوسته یکپارچه خاک کوبیده در تعامل با سایه‌های بامداد کویر.',
    },
    metrics: [
      {
        label: { en: 'Passive Cooling Gain', fa: 'کاهش نیاز سرمایشی' },
        value: '72%',
      },
      {
        label: { en: 'Local Site Soil Ratio', fa: 'سهم خاک بومی سایت' },
        value: '84%',
      },
      {
        label: { en: 'Net Carbon Reduction', fa: 'کاهش کربن نهفته' },
        value: '61%',
      },
    ],
    sections: [
      {
        heading: {
          en: 'Stratified Earth & Night Flush Ventilation',
          fa: 'لایه‌بندی خاک و تهویه شبانه',
        },
        paragraph: {
          en: 'Excavated subsoil from the plot perimeter was compacted in 150 mm pneumatic lifts to form 600 mm thick thermal walls. After sunset, roof clerestory vents flush daytime heat upward while shaded stone portals draw cool courtyard air across the gallery floor.',
          fa: 'خاک حاصل از گودبرداری پیرامون سایت در لایه‌های ۱۵ سانتی‌متری کوبیده شد تا دیوارهایی با ضخامت ۶۰ سانتی‌متر و جرم حرارتی بالا شکل بگیرد. پس از غروب، دریچه‌های سقفی هوای گرم را تخلیه و هوای خنک حیاط را جایگزین می‌کنند.',
        },
      },
      {
        heading: {
          en: 'Quiet Tactility & Filtered Daylight',
          fa: 'بافت آرام و نور فیلترشده روز',
        },
        paragraph: {
          en: 'Deep recessed roof slots eliminate harsh desert glare while washing the mineral grain of the earth walls in shifting seasonal daylight, creating a contemplative gallery that operates cleanly with minimal mechanical assistance.',
          fa: 'نورگیرهای فرورفته در سقف، خیرگی شدید آفتاب کویر را حذف کرده و نور غیرمستقیم را بر بافت طبیعی دیوارها می‌تابانند تا فضایی آرام و کم‌مصرف برای نمایش آثار پدید آید.',
        },
      },
    ],
    gallery: [
      {
        image: '/images/projects/yazd-detail-1.jpg',
        alt: {
          en: 'Shaded courtyard loggia and shallow stone pool',
          fa: 'ایوان سایه‌دار حیاط و حوض کم‌عمق سنگی',
        },
        caption: {
          en: 'Evaporative courtyard axis calibrated to summer sun angles.',
          fa: 'محور تبخیری حیاط متناسب با زوایای آفتاب تابستان.',
        },
      },
      {
        image: '/images/projects/yazd-detail-2.jpg',
        alt: {
          en: 'Rammed earth wall grain bathed in indirect zenith light',
          fa: 'بافت لایه‌ای خاک کوبیده در نور ملایم سقفی',
        },
        caption: {
          en: 'Structural soil compaction bands left raw and breathable.',
          fa: 'لایه‌های خام خاک کوبیده بدون اندود پوشاننده.',
        },
      },
    ],
  },
  {
    slug: 'shiraz-passive-courtyard',
    mode: 'sustainable',
    type: 'residential',
    status: 'completed',
    location: 'shiraz',
    architectId: 'dariush',
    year: '2024',
    areaSqm: '680',
    areaRange: 'small',
    materials: ['limestone', 'timber', 'limePlaster'],
    colorPalette: 'limestone',
    title: {
      en: 'Shiraz Passive Courtyard House',
      fa: 'خانه حیاط‌دار غیرفعال شیراز',
    },
    subtitle: {
      en: 'Contemporary reinterpretation of the central-courtyard house with shaded terraces, bitter-orange garden, and cross ventilation.',
      fa: 'بازخوانی معاصر خانه حیاط‌مرکزی با تراس‌های سایه‌دار، باغ نارنج و تهویه متقاطع شبانه.',
    },
    overview: {
      en: 'Organized around a sunken garden of mature bitter-orange trees, this residence restores Shiraz courtyard microclimates through deep limestone reveals, operable timber mashrabiyas, and rainwater cistern storage.',
      fa: 'این خانه پیرامون گودال‌باغی با درختان نارنج سازمان‌دهی شده و با بهره‌گیری از عمق پنجره‌ها، کرکره‌های چوبی متحرک و مخزن ذخیره باران، خرداقلیم آرام خانه‌های قدیمی شیراز را بازآفرینی می‌کند.',
    },
    client: {
      en: 'Private Commission',
      fa: 'سفارش خصوصی',
    },
    leadArchitect: {
      en: 'Dariush Rasman',
      fa: 'داریوش رسمان',
    },
    heroImage: '/images/projects/shiraz-courtyard-hero.jpg',
    heroAlt: {
      en: 'Shiraz Passive Courtyard House timber louvers and stone garden threshold',
      fa: 'خانه حیاط‌دار شیراز با لوورهای چوبی و آستانه باغ سنگی',
    },
    heroCaption: {
      en: 'Timber shading screens filter afternoon light across the stone courtyard.',
      fa: 'سایه‌بان‌های چوبی نور بعدازظهر را بر سنگفرش حیاط تعدیل می‌کنند.',
    },
    metrics: [
      {
        label: { en: 'Cooling Energy Saved', fa: 'صرفه‌جویی سرمایش' },
        value: '68%',
      },
      {
        label: { en: 'Rainwater Recycled', fa: 'بازیافت آب باران' },
        value: '100%',
      },
      {
        label: { en: 'Daylight Autonomy', fa: 'استقلال نور طبیعی' },
        value: '89%',
      },
    ],
    sections: [
      {
        heading: {
          en: 'Layered Thresholds Between Sun & Shade',
          fa: 'آستانه‌های لایه‌لایه میان آفتاب و سایه',
        },
        paragraph: {
          en: 'Rather than sealing the family behind reflective glass, all living rooms open onto deep semi-outdoor iwans that adjust seasonally via sliding cedar louvers, allowing spring fragrance and night breezes to circulate freely.',
          fa: 'به‌جای محصور کردن فضا پشت شیشه‌های مسدود، تمام فضاهای نشیمن به ایوان‌های نیمه‌باز عمیق باز می‌شوند تا نسیم شبانه و عطر بهارنارنج در جریان باشد.',
        },
      },
      {
        heading: {
          en: 'Acoustic & Thermal Limestone Envelope',
          fa: 'پوسته آهکی عایق صوت و حرارت',
        },
        paragraph: {
          en: 'Locally quarried travertine and breathable lime mortar regulate indoor humidity naturally across seasonal swings while anchoring the residence quietly into its neighborhood street wall.',
          fa: 'سنگ تراورتن معادن محلی و ملات آهک تنفس‌پذیر ضمن تنظیم رطوبت داخلی، بدنه‌ای آرام و هم‌نشین با بافت کوچه می‌آفرینند.',
        },
      },
    ],
    gallery: [
      {
        image: '/images/projects/shiraz-courtyard-1.jpg',
        alt: {
          en: 'Sunken courtyard garden with citrus trees and limestone paving',
          fa: 'حیاط فرورفته با درختان نارنج و کف‌سازی سنگی',
        },
        caption: {
          en: 'Sunken microclimate lowered two meters below street datum.',
          fa: 'گودال‌باغ پایین‌تر از تراز کوچه برای حفظ هوای خنک.',
        },
      },
      {
        image: '/images/projects/shiraz-courtyard-2.jpg',
        alt: {
          en: 'Minimalist limestone stair lit by vertical skylight slot',
          fa: 'پله سنگی مینیمال در امتداد نورگیر عمودی',
        },
        caption: {
          en: 'Thermal chimney stair core drawing warm air upward.',
          fa: 'هسته پلکان عمل‌کننده به‌عنوان دودکش حرارتی طبیعی.',
        },
      },
    ],
  },
  {
    slug: 'kashan-rammed-earth',
    mode: 'sustainable',
    type: 'hospitality',
    status: 'inProgress',
    location: 'kashan',
    architectId: 'sara',
    year: '2026',
    areaSqm: '2,150',
    areaRange: 'medium',
    materials: ['rammedEarth', 'limePlaster', 'brick'],
    colorPalette: 'terracotta',
    title: {
      en: 'Kashan Rammed-Earth Retreat',
      fa: 'اقامتگاه خاک کوبیده کاشان',
    },
    subtitle: {
      en: 'Low-rise earth-toned hospitality ensemble with layered earthen walls and shaded loggias facing a pomegranate orchard.',
      fa: 'مجموعه اقامتی کم‌ارتفاع همرنگ زمین با دیوارهای لایه‌لایه خاکی و ایوان‌های رو به باغ انار.',
    },
    overview: {
      en: 'Nestled at the edge of an old pomegranate orchard outside Kashan, sixteen clustered guest suites step gently below the horizon line, linked by vaulted mud-brick passages and silent water channels.',
      fa: 'در حاشیه یک باغ انار کهن در بیرون کاشان، شانزده سوئیت اقامتی با ارتفاعی کمتر از تاج درختان و متصل به گذرهای طاق‌دار و جوی‌های آب طراحی شده‌اند.',
    },
    client: {
      en: 'Kavir Slow Hospitality Group',
      fa: 'گروه مهمان‌نوازی آرام کویر',
    },
    leadArchitect: {
      en: 'Sara Farahmand',
      fa: 'سارا فرهمند',
    },
    heroImage: '/images/projects/kashan-hero.jpg',
    heroAlt: {
      en: 'Kashan Rammed-Earth Retreat earthen loggias beside pomegranate garden',
      fa: 'اقامتگاه خاک کوبیده کاشان و ایوان‌های رو به باغ انار',
    },
    heroCaption: {
      en: 'Low earthen suites recessed among orchard irrigation terraces.',
      fa: 'واحدهای کم‌ارتفاع خاکی در میان تراس‌های باغ انار.',
    },
    metrics: [
      {
        label: { en: 'Virgin Concrete Avoided', fa: 'کاهش مصرف بتن' },
        value: '76%',
      },
      {
        label: { en: 'Thermal Lag Time', fa: 'تاخیر فازی حرارتی' },
        value: '11.5h',
      },
      {
        label: { en: 'Water Loop Recovery', fa: 'بازچرخانی آب خاکستری' },
        value: '85%',
      },
    ],
    sections: [
      {
        heading: {
          en: 'Earth-Toned Permanence & Orchard Respect',
          fa: 'هم‌رنگی با خاک و احترام به باغات',
        },
        paragraph: {
          en: 'Zero mature orchard trees were displaced during site planning. Guest pavilions thread neatly along historical irrigation furrows, preserving root zones while using excavated clay from service trenches to mold every wall on site.',
          fa: 'در جانمایی مجموعه هیچ درخت بالغی جابه‌جا نشد؛ واحدها در امتداد جوی‌های تاریخی آبیاری چیده شده و خاک برداشته شده از پی‌ها در ساخت تمام دیوارها به کار رفته است.',
        },
      },
    ],
    gallery: [
      {
        image: '/images/projects/kashan-detail-1.jpg',
        alt: {
          en: 'Vaulted brick corridor leading toward orchard garden',
          fa: 'دالان طاق‌دار آجری رو به باغ انار',
        },
        caption: {
          en: 'Passive shaded colonnade linking guest suites.',
          fa: 'رواق سایه‌دار متصل‌کننده فضاهای اقامتی.',
        },
      },
      {
        image: '/images/projects/kashan-detail-2.jpg',
        alt: {
          en: 'Minimalist bedroom suite finished in natural lime plaster',
          fa: 'سوئیت اقامتی با اندود طبیعی آهک و خاک',
        },
        caption: {
          en: 'Raw earthen plaster surfaces crafted by local artisans.',
          fa: 'اندود کاهگل اصلاح‌شده و آهک با اجرای استادکاران بومی.',
        },
      },
    ],
  },
  {
    slug: 'lavasan-timber-pavilion',
    mode: 'sustainable',
    type: 'cultural',
    status: 'concept',
    location: 'lavasan',
    architectId: 'navid',
    year: '2026',
    areaSqm: '540',
    areaRange: 'small',
    materials: ['timber', 'limestone', 'glassSteel'],
    colorPalette: 'timber',
    title: {
      en: 'Lavasan Timber & Botanical Pavilion',
      fa: 'پاویون چوبی و باغ گیاه‌شناسی لواسان',
    },
    subtitle: {
      en: 'Lightweight engineered-timber structure poised above an Alborz mountain slope with reversible dry joinery and minimal ground disturbance.',
      fa: 'سازه سبک چوب مهندسی‌شده بر فراز شیب کوهستان البرز با اتصالات قابل جداسازی و کمترین دستکاری زمین.',
    },
    overview: {
      en: 'Hovering delicately over rocky Alborz topography on slender steel micropiles, this botanical study pavilion replaces heavy concrete retaining walls with a CNC-milled larch diagrid that can be disassembled without leaving a permanent scar.',
      fa: 'این پاویون پژوهشی گیاه‌شناسی بر روی پایه‌های باریک فولادی بر فراز شیب صخره‌ای لواسان معلق شده تا بدون خاک‌برداری و دیوارهای سنگین بتنی، سازه‌ای تمام‌چوب و قابل بازگردانی به طبیعت شکل بگیرد.',
    },
    client: {
      en: 'Alborz Highland Flora Trust',
      fa: 'بنیاد پژوهش‌های گیاهی البرز',
    },
    leadArchitect: {
      en: 'Navid Mansouri',
      fa: 'نوید منصوری',
    },
    heroImage: '/images/projects/lavasan-hero.jpg',
    heroAlt: {
      en: 'Lavasan Timber Pavilion elevated timber structure on mountain slope',
      fa: 'پاویون چوبی لواسان بر فراز شیب کوهستانی',
    },
    heroCaption: {
      en: 'Dry-assembled glulam grid floating above native alpine grass.',
      fa: 'شبکه چوب مهندسی‌شده معلق بر فراز پوشش گیاهی بومی.',
    },
    metrics: [
      {
        label: { en: 'Soil Excavation Cut', fa: 'کاهش خاک‌برداری' },
        value: '91%',
      },
      {
        label: { en: 'Dry-Joint Reversible', fa: 'اتصالات قابل جداسازی' },
        value: '100%',
      },
      {
        label: { en: 'Net Carbon Stored', fa: 'تثبیت خالص کربن' },
        value: '148t',
      },
    ],
    sections: [
      {
        heading: {
          en: 'Reversible Mountain Tectonics',
          fa: 'تکتونیک برگشت‌پذیر در کوهستان',
        },
        paragraph: {
          en: 'Every timber member arrives numbered from off-site digital fabrication and locks with concealed stainless dowels. Snow melt passes unobstructed beneath the raised floor deck, keeping natural slope drainage completely intact.',
          fa: 'تمام قطعات چوبی پس از ساخت دقیق کارگاهی با اتصالات خشک در محل مونتاژ می‌شوند و آب حاصل از ذوب برف بدون مانع از زیر عرشه مرتفع پاویون عبور می‌کند.',
        },
      },
    ],
    gallery: [
      {
        image: '/images/projects/lavasan-detail-1.jpg',
        alt: {
          en: 'Interior view of precision CNC timber ceiling grid',
          fa: 'نمای داخلی شبکه سقف چوبی دقیق',
        },
        caption: {
          en: 'Reciprocal larch grid framing high Alborz ridges.',
          fa: 'سازه مشبک چوبی قاب‌گیرنده چشم‌انداز البرز.',
        },
      },
      {
        image: '/images/projects/lavasan-detail-2.jpg',
        alt: {
          en: 'Cantilevered timber viewing terrace over valley floor',
          fa: 'تراس کنسول چوبی رو به دره',
        },
        caption: {
          en: 'Point-supported foundation leaves natural stone untouched.',
          fa: 'تکیه‌گاه‌های نقطه‌ای بدون تخریب بستر سنگی کوه.',
        },
      },
    ],
  },
  {
    slug: 'kerman-solar-cloister',
    mode: 'sustainable',
    type: 'residential',
    status: 'inProgress',
    location: 'yazd',
    architectId: 'kian',
    year: '2026',
    areaSqm: '920',
    areaRange: 'small',
    materials: ['rammedEarth', 'limestone', 'timber'],
    colorPalette: 'ochre',
    title: {
      en: 'Bafgh Solar Thermal Cloister',
      fa: 'سرای حرارتی خورشیدی بافق',
    },
    subtitle: {
      en: 'Net-zero courtyard cluster integrating subterranean earth tubes and shaded clay-brick solar chimneys.',
      fa: 'مجموعه مسکونی با انرژی صفر متکی بر کانال‌های خنک‌کننده زیرزمینی و دودکش‌های خورشیدی آجری.',
    },
    overview: {
      en: 'Designed for an arid plateau neighborhood, this clustered residence pre-cools incoming supply air four meters underground before rising gently through brick living alcoves.',
      fa: 'این مجموعه مسکونی با هدایت هوای تازه از کانال‌های خنک عمق چهار متری خاک پیش از ورود به فضاهای نشیمن، آسایش حرارتی تمام‌فصل را تضمین می‌کند.',
    },
    client: {
      en: 'Plateau Housing Cooperative',
      fa: 'تعاونی مسکن اقلیمی فلات',
    },
    leadArchitect: {
      en: 'Kian Sohrabi',
      fa: 'کیان سهرابی',
    },
    heroImage: '/images/projects/cloister-hero.jpg',
    heroAlt: {
      en: 'Solar thermal brick cloister courtyard with deep arch shadows',
      fa: 'سرای آجری حرارتی با سایه‌عمیق رواق‌ها',
    },
    heroCaption: {
      en: 'Recessed brick thresholds shield glazing from peak summer solar load.',
      fa: 'آستانه‌های فرورفته آجری برای محافظت بازشوها در تابستان.',
    },
    metrics: [
      {
        label: { en: 'Net Grid Independence', fa: 'خودکفایی انرژی' },
        value: '94%',
      },
      {
        label: { en: 'Earth-Tube Delta T', fa: 'اختلاف دمای کانال خاک' },
        value: '-11°C',
      },
      {
        label: { en: 'Embodied Carbon Drop', fa: 'کاهش کربن ساخت' },
        value: '58%',
      },
    ],
    sections: [
      {
        heading: {
          en: 'Subterranean Cooling Meets Brick Craft',
          fa: 'تلاقی خنکای زیرزمین و هنر آجرچینی',
        },
        paragraph: {
          en: 'Paired with roof-integrated terracotta solar tiles, buried masonry labyrinths stabilize indoor comfort across 30-degree diurnal swings without noisy exterior condenser units.',
          fa: 'تلفیق کانال‌های زیرزمینی با سفال‌های خورشیدی یکپارچه بام، نوسان دمایی روز و شب کویر را بدون تجهیزات پرصدا متعادل می‌سازد.',
        },
      },
    ],
    gallery: [
      {
        image: '/images/projects/cloister-detail-1.jpg',
        alt: {
          en: 'Shaded brick loggia looking onto native garden',
          fa: 'ایوان سایه‌دار آجری رو به باغ بومی',
        },
        caption: {
          en: 'Hand-laid buff kiln brick walls calibrated to desert dust.',
          fa: 'دیوارهای آجری دست‌چین هماهنگ با رنگ‌مایه کویر.',
        },
      },
      {
        image: '/images/projects/cloister-detail-2.jpg',
        alt: {
          en: 'Minimalist interior brick arch and warm daylight',
          fa: 'قوس آجری داخلی و نور طبیعی گرم',
        },
        caption: {
          en: 'Filtered north light entering across thick masonry reveals.',
          fa: 'نور ملایم شمالی در عمق جرزهای آجری.',
        },
      },
    ],
  },
  {
    slug: 'fereshteh-biophilic-terraces',
    mode: 'urban',
    type: 'urbanMixed',
    status: 'inProgress',
    location: 'tehran',
    architectId: 'mina',
    year: '2026',
    areaSqm: '5,800',
    areaRange: 'large',
    materials: ['limestone', 'glassSteel', 'timber'],
    colorPalette: 'olivine',
    title: {
      en: 'Fereshteh Biophilic Terraces',
      fa: 'ساختمان تراس‌های زیست‌اقلیمی فرشته',
    },
    subtitle: {
      en: 'Mixed-use urban building combining porous brick screens and stepped green terraces to temper the street microclimate.',
      fa: 'بنای چندعملکردی شهری با پوسته متخلخل آجر و تراس‌های سبز پلکانی برای تعدیل ریزاقلیم خیابان.',
    },
    overview: {
      en: 'Positioned along a dense northern Tehran avenue, this nine-story mixed-use structure carves deep planted loggias out of its southern facade, offering acoustic relief, dappled shadow, and active urban greenery at street scale.',
      fa: 'این بنای نه طبقه چندعملکردی در بافت متراکم شمال تهران، با عقب‌نشینی‌های سبز در جبهه جنوبی و پوسته آجر مشبک، پیوندی زنده میان حریم داخلی و هوای تازه خیابان برقرار می‌کند.',
    },
    client: {
      en: 'Fereshteh Urban Development',
      fa: 'توسعه شهری فرشته',
    },
    leadArchitect: {
      en: 'Mina Tavakoli',
      fa: 'مینا توکلی',
    },
    heroImage: '/images/projects/fereshteh-hero.jpg',
    heroAlt: {
      en: 'Fereshteh Biophilic Terraces stepped planted balconies and brick facade',
      fa: 'ساختمان تراس‌های زیست‌اقلیمی فرشته با نمای آجر و بالکن‌های سبز',
    },
    heroCaption: {
      en: 'Porous brick veil and planted terraces soften the urban avenue edge.',
      fa: 'پوسته آجر مشبک و تراس‌های گیاهی برای تلطیف جداره خیابان.',
    },
    metrics: [
      {
        label: { en: 'Planted Facade Area', fa: 'سطح سبز نما' },
        value: '42%',
      },
      {
        label: { en: 'Street Noise Drop', fa: 'کاهش تراز صدا' },
        value: '-14dB',
      },
      {
        label: { en: 'Solar Heat Rejection', fa: 'دفع بار تابشی' },
        value: '64%',
      },
    ],
    sections: [
      {
        heading: {
          en: 'Stepped Canopy Along Dense Urban Edge',
          fa: 'تراس‌های پلکانی در جداره متراکم شهری',
        },
        paragraph: {
          en: 'Instead of a flat curtain wall radiating heat back to pedestrians, cantilevered planter slabs host drought-resilient cypress, pomegranate, and climbing jasmine, shading offices while cooling street-level air.',
          fa: 'به‌جای نمای شیشه‌ای یکدست و گرم‌کننده خیابان، دال‌های سبز پلکانی میزبان گیاهان مقاوم بومی هستند تا ضمن سایه‌اندازی بر دفاتر، دمای پیاده‌رو را کاهش دهند.',
        },
      },
    ],
    gallery: [
      {
        image: '/images/projects/fereshteh-detail-1.jpg',
        alt: {
          en: 'Street-level shaded café colonnade and porous brick wall',
          fa: 'رواق سایه‌دار همکف و جداره آجری مشبک',
        },
        caption: {
          en: 'Public street arcade widening the pedestrian sidewalk.',
          fa: 'تعریض پیاده‌رو از طریق رواق عمومی همکف.',
        },
      },
      {
        image: '/images/projects/fereshteh-detail-2.jpg',
        alt: {
          en: 'Double-height studio loft opening to planted terrace',
          fa: 'فضای کار دوطبقه رو به تراس سبز',
        },
        caption: {
          en: 'Natural cross-ventilation drawn across planted loggias.',
          fa: 'تهویه متقاطع از میان تراس‌های گیاهی.',
        },
      },
    ],
  },
  {
    slug: 'isfahan-botanical-atrium',
    mode: 'urban',
    type: 'cultural',
    status: 'completed',
    location: 'isfahan',
    architectId: 'dariush',
    year: '2025',
    areaSqm: '3,100',
    areaRange: 'large',
    materials: ['brick', 'glassSteel', 'limestone'],
    colorPalette: 'terracotta',
    title: {
      en: 'Isfahan Olive Courtyard Gallery',
      fa: 'گالری حیاط زیتون اصفهان',
    },
    subtitle: {
      en: 'Public stone atrium and travertine arches enclosing a central olive garden, timber lattice skylight, and reflecting pool.',
      fa: 'آتریوم عمومی سنگی و طاق‌های تراورتن با باغ زیتون میانی، نورگیر مشبک چوبی و حوض بازتاب.',
    },
    overview: {
      en: 'Transforming a former industrial warehouse near the Zayandeh Rud axis, this civic cultural hub stitches two historic neighborhoods back together via a freely accessible covered olive court.',
      fa: 'این مرکز فرهنگی عمومی با باززنده‌سازی یک کارگاه قدیمی در نزدیکی محور زاینده‌رود، دو محله شهری را از طریق یک حیاط سرپوشیده با درختان زیتون و دسترسی آزاد پیوند می‌دهد.',
    },
    client: {
      en: 'Isfahan Civic Culture Trust',
      fa: 'موسسه فرهنگ شهری اصفهان',
    },
    leadArchitect: {
      en: 'Dariush Rasman',
      fa: 'داریوش رسمان',
    },
    heroImage: '/images/projects/isfahan-hero.jpg',
    heroAlt: {
      en: 'Isfahan Olive Courtyard Gallery travertine arches and central olive tree garden',
      fa: 'گالری حیاط زیتون اصفهان با طاق‌های تراورتن و باغ زیتون میانی',
    },
    heroCaption: {
      en: 'Civic travertine arcade framing the sunlit central olive court.',
      fa: 'رواق سنگی تراورتن در پیرامون حیاط آفتاب‌گیر زیتون.',
    },
    metrics: [
      {
        label: { en: 'Adaptive Structure Reused', fa: 'بازیافت اسکلت موجود' },
        value: '79%',
      },
      {
        label: { en: 'Public Civic Footprint', fa: 'فضای عمومی آزاد' },
        value: '55%',
      },
      {
        label: { en: 'Atrium Thermal Stability', fa: 'پایداری دمایی آتریوم' },
        value: '±3°C',
      },
    ],
    sections: [
      {
        heading: {
          en: 'Adaptive Civic Stitching',
          fa: 'پیوند مجدد بافت شهری و میراث صنعتی',
        },
        paragraph: {
          en: 'Preserving the existing steel trusses while cladding newly inserted vaults in brushed local travertine cut demolition waste dramatically and created an acoustic sanctuary open from morning until midnight.',
          fa: 'حفظ خرپاهای موجود و ترکیب آن با طاق‌های تراورتن برش‌خورده محلی، ضایعات تخریب را به حداقل رسانده و پناهگاهی فرهنگی در مقیاس شهر پدید آورده است.',
        },
      },
    ],
    gallery: [
      {
        image: '/images/projects/isfahan-detail-1.jpg',
        alt: {
          en: 'Timber lattice skylight casting geometric light across stone hall',
          fa: 'نورگیر مشبک چوبی و بازی نور روی سنگ کف',
        },
        caption: {
          en: 'Glare-free museum daylight modulated by cedar louvers.',
          fa: 'نور کنترل‌شده نمایشگاهی با مشبک‌های چوب سدر.',
        },
      },
      {
        image: '/images/projects/isfahan-detail-2.jpg',
        alt: {
          en: 'Quiet reading room overlooking courtyard reflecting pool',
          fa: 'تالار مطالعه رو به حوض بازتاب حیاط',
        },
        caption: {
          en: 'Civic reading room integrated into the north arcade.',
          fa: 'تالار مطالعه عمومی در جبهه شمالی رواق.',
        },
      },
    ],
  },
  {
    slug: 'tehran-valiasr-threshold',
    mode: 'urban',
    type: 'urbanMixed',
    status: 'concept',
    location: 'tehran',
    architectId: 'mina',
    year: '2026',
    areaSqm: '4,400',
    areaRange: 'large',
    materials: ['limestone', 'glassSteel', 'limePlaster'],
    colorPalette: 'charcoal',
    title: {
      en: 'Valiasr Shaded Civic Threshold',
      fa: 'گذر سایه‌دار شهری ولیعصر',
    },
    subtitle: {
      en: 'Pedestrian-first urban infill with permeable ground-floor passageways connecting neighborhood alleys beneath canopy plane trees.',
      fa: 'فضای شهری پیاده‌محور با گذرهای نفوذپذیر همکف در اتصال کوچه‌های پیرامون و هم‌زیستی با چنارهای ولیعصر.',
    },
    overview: {
      en: 'Reimagining the commercial infill lot along Tehran’s historic tree-lined axis, the ground plane yields entirely to shaded public movement, bookstores, and sunken water steps synced with historical qanat channels.',
      fa: 'در بازآفرینی یک پلاک تجاری در محور تاریخی ولیعصر، تمام تراز همکف به گذر عمومی سایه‌دار، کتاب‌فروشی‌ها و پله‌آب‌های هم‌تراز قنات قدیمی اختصاص یافته است.',
    },
    client: {
      en: 'Tehran Urban Regeneration Lab',
      fa: 'آزمایشگاه بازآفرینی شهری تهران',
    },
    leadArchitect: {
      en: 'Mina Tavakoli',
      fa: 'مینا توکلی',
    },
    heroImage: '/images/projects/valiasr-hero.jpg',
    heroAlt: {
      en: 'Valiasr Shaded Civic Threshold permeable urban passage and stone steps',
      fa: 'گذر سایه‌دار ولیعصر و پله‌های سنگی پیاده‌راه',
    },
    heroCaption: {
      en: 'Permeable urban podium pulling plane-tree canopy into the block interior.',
      fa: 'سکوی نفوذپذیر شهری در امتداد سایه چنارهای خیابان.',
    },
    metrics: [
      {
        label: { en: 'Ground Plane Public', fa: 'همکف عمومی و باز' },
        value: '82%',
      },
      {
        label: { en: 'Pedestrian Shortcut', fa: 'تسهیل مسیر پیاده' },
        value: '2 Axes',
      },
      {
        label: { en: 'Heat Island Mitigation', fa: 'کاهش جزیره گرما' },
        value: '-4.2°C',
      },
    ],
    sections: [
      {
        heading: {
          en: 'Giving the Ground Back to the Street',
          fa: 'بازگرداندن همکف به شهروندان',
        },
        paragraph: {
          en: 'By elevating office and studio volumes onto slender cast-stone columns, two perpendicular public alleys pierce through the site, turning private real estate into civic oxygen.',
          fa: 'با بالا بردن حجم‌های اداری روی ستون‌های سنگی باریک، دو محور پیاده عمود بر هم از دل پروژه عبور می‌کنند و فضای خصوصی را به ریه عمومی محله پیوند می‌زنند.',
        },
      },
    ],
    gallery: [
      {
        image: '/images/projects/valiasr-detail-1.jpg',
        alt: {
          en: 'Covered pedestrian plaza with minimalist stone benches',
          fa: 'پلازای سرپوشیده پیاده با نشیمن‌های سنگی مینیمال',
        },
        caption: {
          en: 'Public amphitheater steps welcoming afternoon readings.',
          fa: 'پله‌نشیمن‌های عمومی برای نشست‌های عصرگاهی شهر.',
        },
      },
      {
        image: '/images/projects/valiasr-detail-2.jpg',
        alt: {
          en: 'Night illumination of timber soffits above civic passage',
          fa: 'نورپردازی شبانه سقف چوبی گذر عمومی',
        },
        caption: {
          en: 'Warm low-glare lighting extending evening safety.',
          fa: 'نورپردازی گرم و غیرخیره‌کننده برای سرزندگی شبانه.',
        },
      },
    ],
  },
  {
    slug: 'shiraz-brick-arcade',
    mode: 'urban',
    type: 'residential',
    status: 'completed',
    location: 'shiraz',
    architectId: 'kian',
    year: '2024',
    areaSqm: '2,640',
    areaRange: 'medium',
    materials: ['brick', 'limePlaster', 'timber'],
    colorPalette: 'terracotta',
    title: {
      en: 'Shiraz Brick Arcade & Courtyard Flats',
      fa: 'مجموعه رواق آجر و باغ مسکونی شیراز',
    },
    subtitle: {
      en: 'Medium-density urban housing block balancing private recessed loggias with shared neighborhood courtyard life.',
      fa: 'مسکن شهری با تراکم میانه در ایجاد تعادل میان ایوان‌های خصوصی فرورفته و حیاط اشتراکی محله.',
    },
    overview: {
      en: 'Challenging anonymous apartment blocks, twelve dual-aspect residences wrap a central mulberry garden where neighbors share light, cross breezes, and shaded summer seating.',
      fa: 'این مجموعه با شکستن الگوی آپارتمان‌های بسته، دوازده واحد دوطرفه را پیرامون یک باغ توت مرکزی می‌چیند تا تمام خانه‌ها از نور و تهویه متقاطع بهره‌مند شوند.',
    },
    client: {
      en: 'Shiraz Urban Housing Trust',
      fa: 'بنیاد مسکن شهری شیراز',
    },
    leadArchitect: {
      en: 'Kian Sohrabi',
      fa: 'کیان سهرابی',
    },
    heroImage: '/images/projects/arcade-hero.jpg',
    heroAlt: {
      en: 'Shiraz Brick Arcade multi-family residential courtyard facade',
      fa: 'نمای آجری و حیاط مرکزی مجموعه مسکونی شیراز',
    },
    heroCaption: {
      en: 'Recessed brick arches give every apartment a sheltered outdoor room.',
      fa: 'رواق‌های فرورفته آجری برای هر واحد یک اتاق باز سرپوشیده می‌سازند.',
    },
    metrics: [
      {
        label: { en: 'Dual-Aspect Units', fa: 'واحدهای دوبر نور' },
        value: '100%',
      },
      {
        label: { en: 'Shared Garden Share', fa: 'سهم حیاط اشتراکی' },
        value: '38%',
      },
      {
        label: { en: 'Brick Craft Origin', fa: 'آجر محلی اقلیمی' },
        value: '100%',
      },
    ],
    sections: [
      {
        heading: {
          en: 'Urban Density Without Losing Courtyard Sky',
          fa: 'تراکم شهری بدون از دست دادن آسمان حیاط',
        },
        paragraph: {
          en: 'Split-level circulation bridges cross the narrow garden void so every corridor feels like an outdoor bridge among treetops rather than an artificially lit hallway.',
          fa: 'پل‌های ارتباطی باز در میان فضای سبز حیاط عبور می‌کنند تا راهروهای ورودی به‌جای فضاهای بسته، تجربه قدم زدن میان تاج درختان را تداعی کنند.',
        },
      },
    ],
    gallery: [
      {
        image: '/images/projects/arcade-detail-1.jpg',
        alt: {
          en: 'Private recessed balcony looking into central mulberry court',
          fa: 'ایوان خصوصی فرورفته رو به حیاط درخت توت',
        },
        caption: {
          en: 'Deep masonry thresholds ensure visual privacy across units.',
          fa: 'جرزهای عمیق برای حفظ محرمیت بصری میان واحدها.',
        },
      },
      {
        image: '/images/projects/arcade-detail-2.jpg',
        alt: {
          en: 'Open-air staircase bridge spanned across garden courtyard',
          fa: 'پلکان نیمه‌باز در میان حیاط مرکزی',
        },
        caption: {
          en: 'Naturally ventilated circulation core.',
          fa: 'هسته دسترسی با تهویه تماماً طبیعی.',
        },
      },
    ],
  },
  {
    slug: 'tehran-laleh-cultural-annex',
    mode: 'urban',
    type: 'hospitality',
    status: 'completed',
    location: 'tehran',
    architectId: 'sara',
    year: '2025',
    areaSqm: '1,850',
    areaRange: 'medium',
    materials: ['limestone', 'timber', 'limePlaster'],
    colorPalette: 'limestone',
    title: {
      en: 'Laleh Park Atelier & Residence',
      fa: 'اقامتگاه و آتلیه پارک لاله تهران',
    },
    subtitle: {
      en: 'Adaptive boutique residence and exhibition café overlooking old sycamores through quiet brushed-concrete and timber frames.',
      fa: 'اقامتگاه بوتیک و کافه‌گالری شهری رو به درختان کهنسال پارک لاله با ترکیب بتن اکسپوز و قاب‌های چوبی.',
    },
    overview: {
      en: 'Refurbishing a 1970s modernist frame beside Laleh Park, new acoustic timber glazing and a public art bookshop activate the corner plot while honoring the structural clarity of the original concrete grid.',
      fa: 'با مرمت اسکلت مدرن دهه پنجاه در همسایگی پارک لاله، پوسته چوبی دوجداره و کتاب‌فروشی هنر در همکف، نبض تازه‌ای به نبش خیابان بخشیده شده است.',
    },
    client: {
      en: 'Laleh Cultural Hospitality',
      fa: 'خانه فرهنگ و اقامتگاه لاله',
    },
    leadArchitect: {
      en: 'Sara Farahmand',
      fa: 'سارا فرهمند',
    },
    heroImage: '/images/projects/laleh-hero.jpg',
    heroAlt: {
      en: 'Laleh Park Atelier facade with architectural concrete and timber windows',
      fa: 'نمای اقامتگاه لاله با بتن معماری و پنجره‌های چوبی',
    },
    heroCaption: {
      en: 'Original 1970s structural bay restored with slim cedar fenestration.',
      fa: 'مده‌بندی اصیل سازه با بازشوهای باریک چوب سدر.',
    },
    metrics: [
      {
        label: { en: 'Structural Frame Kept', fa: 'حفظ اسکلت اصلی' },
        value: '96%',
      },
      {
        label: { en: 'Acoustic Glazing Gain', fa: 'عایق صوتی پنجره' },
        value: '-38dB',
      },
      {
        label: { en: 'Public Ground Café', fa: 'تعامل با فضای عمومی' },
        value: '320m²',
      },
    ],
    sections: [
      {
        heading: {
          en: 'Adaptive Urban Memory',
          fa: 'حافظه شهری در باززنده‌سازی مدرن',
        },
        paragraph: {
          en: 'Instead of tearing down embodied urban history, surgical interior incisions introduce natural daylight shafts across three guest levels and an open ground-floor reading lounge.',
          fa: 'به‌جای تخریب بنای موجود، برش‌های ظریف سقفی نور طبیعی را به سه طبقه اقامتی و تالار مطالعه عمومی همکف هدایت می‌کند.',
        },
      },
    ],
    gallery: [
      {
        image: '/images/projects/laleh-detail-1.jpg',
        alt: {
          en: 'Ground floor art bookshop and concrete structural columns',
          fa: 'کتاب‌فروشی هنر همکف و ستون‌های بتنی',
        },
        caption: {
          en: 'Double-height bookshop open toward the park avenue.',
          fa: 'کتاب‌فروشی دوطبقه بازشونده به حاشیه پارک.',
        },
      },
      {
        image: '/images/projects/laleh-detail-2.jpg',
        alt: {
          en: 'Minimalist timber suite overlooking sycamore canopy',
          fa: 'سوئیت اقامتی مینیمال رو به شاخسار چنارها',
        },
        caption: {
          en: 'Warm acoustic oak panelling inside quiet upper guest rooms.',
          fa: 'دیوارکوب چوب بلوط برای آرامش آکوستیک اتاق‌ها.',
        },
      },
    ],
  },
] as const;

export function getProjectLocalizedText(
  text: LocalizedText,
  locale: Locale
): string {
  return text[locale] ?? text.en;
}

export function getProjectBySlug(
  slug: string
): ArchitecturalProject | undefined {
  return ARCHITECTURAL_PROJECTS.find((project) => project.slug === slug);
}

export function getNextProject(currentSlug: string): ArchitecturalProject {
  const index = ARCHITECTURAL_PROJECTS.findIndex(
    (project) => project.slug === currentSlug
  );
  if (index === -1) return ARCHITECTURAL_PROJECTS[0];
  return ARCHITECTURAL_PROJECTS[(index + 1) % ARCHITECTURAL_PROJECTS.length];
}

export function getPreviousProject(
  currentSlug: string
): ArchitecturalProject {
  const index = ARCHITECTURAL_PROJECTS.findIndex(
    (project) => project.slug === currentSlug
  );
  if (index === -1) {
    return ARCHITECTURAL_PROJECTS[ARCHITECTURAL_PROJECTS.length - 1];
  }
  return ARCHITECTURAL_PROJECTS[
    (index - 1 + ARCHITECTURAL_PROJECTS.length) %
      ARCHITECTURAL_PROJECTS.length
  ];
}

export function getProjectGalleryFrames(
  project: ArchitecturalProject
): readonly ProjectGalleryFrame[] {
  const modeSupplementalImages: Record<ProjectMode, readonly [string, string]> = {
    sustainable: [
      '/images/projects/kashan-detail-1.jpg',
      '/images/projects/shiraz-courtyard-2.jpg',
    ],
    urban: [
      '/images/projects/isfahan-detail-1.jpg',
      '/images/projects/arcade-detail-2.jpg',
    ],
  };

  const [extraA, extraB] = modeSupplementalImages[project.mode];

  const extraFrames: readonly ProjectGalleryFrame[] = [
    {
      image: project.heroImage,
      alt: {
        en: `${project.title.en} primary architectural view`,
        fa: `نمای اصلی معماری ${project.title.fa}`,
      },
      caption: project.heroCaption,
    },
    {
      image: extraA === project.gallery[0]?.image ? extraB : extraA,
      alt: {
        en: `${project.title.en} spatial and material study`,
        fa: `مطالعه فضایی و مصالح ${project.title.fa}`,
      },
      caption: project.subtitle,
    },
  ];

  return [...project.gallery, ...extraFrames];
}

export function getProjectDesignDocuments(
  project: ArchitecturalProject
): readonly ProjectGalleryFrame[] {
  return [
    {
      image: '/images/projects/doc-plan.jpg',
      alt: {
        en: `${project.title.en} architectural floor plan & axis study`,
        fa: `پلان معماری و محورهای فضایی ${project.title.fa}`,
      },
      caption: {
        en: 'Ground Floor Plan & Spatial Circulation Diagram',
        fa: 'پلان طبقه همکف و دیاگرام سیرکولاسیون فضایی',
      },
    },
    {
      image: '/images/projects/doc-section.jpg',
      alt: {
        en: `${project.title.en} longitudinal climatic section`,
        fa: `مقطع طولی و تحلیل اقلیمی ${project.title.fa}`,
      },
      caption: {
        en: 'Longitudinal Environmental Section & Daylight Angle',
        fa: 'مقطع طولی عملکرد اقلیمی و زاویه تابش نور',
      },
    },
    {
      image: '/images/projects/doc-elevation.jpg',
      alt: {
        en: `${project.title.en} structural envelope elevation`,
        fa: `نمای ساختاری و پوسته ${project.title.fa}`,
      },
      caption: {
        en: 'Structural Envelope & Passive Ventilation Sheet',
        fa: 'شیت نمای سازه‌ای و جریان تهویه طبیعی',
      },
    },
  ];
}

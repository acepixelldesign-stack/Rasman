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
  readonly ar?: string;
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
    label: { en: 'All Essays', fa: 'همه مقالات', ar: 'جميع المقالات' },
  },
  {
    id: 'sustainable',
    label: {
      en: 'Sustainable Architecture',
      fa: 'معماری پایدار',
      ar: 'العمارة المستدامة',
    },
  },
  {
    id: 'materials',
    label: {
      en: 'Materials & Craft',
      fa: 'مصالح و ساخت',
      ar: 'المواد والحرفية',
    },
  },
  {
    id: 'urban',
    label: {
      en: 'Urban Tectonics',
      fa: 'تکتونیک شهری',
      ar: 'التكتونيك الحضري',
    },
  },
  {
    id: 'theory',
    label: { en: 'Spatial Theory', fa: 'نظریه فضا', ar: 'نظرية الفضاء' },
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
      ar: 'من أرض خاوية إلى فناء حي: طقوس العمارة البيئية السلبية',
    },
    excerpt: {
      en: 'How courtyard proportion, timber shading louvers, and limestone thermal mass cut mechanical cooling demand by seventy percent.',
      fa: 'چگونه تناسبات حیاط، لوورهای سایه‌بان چوبی و جرم حرارتی سنگ آهک نیاز به سرمایش مکانیکی را تا هفتاد درصد کاهش می‌دهند.',
      ar: 'كيف تخفض نسب الفناء وكاسرات الشمس الخشبية والكتلة الحرارية للحجر الجيري الحاجة إلى التبريد الميكانيكي بنسبة سبعين في المائة.',
    },
    monthLabel: { en: 'Nov', fa: 'آبان', ar: 'نوفمبر' },
    dayNumber: '14',
    fullDate: {
      en: 'November 14, 2026',
      fa: '۲۳ آبان ۱۴۰۵',
      ar: '١٤ نوفمبر ٢٠٢٦',
    },
    isoDate: '2026-11-14',
    readMinutes: 7,
    author: AUTHORS.dariush,
    coverImage: '/images/blog/courtyard-ritual.jpg',
    coverAlt: {
      en: 'Minimalist courtyard residence framed with timber shading louvers and natural stone',
      fa: 'خانه حیاط‌دار مینیمال با لوورهای چوبی و سنگ طبیعی',
      ar: 'مسكن بفناء داخلي مع كاسرات شمس خشبية وحجر طبيعي',
    },
    coverCaption: {
      en: 'Proportion and shadow replace mechanical force. Photo: Rasman Archive',
      fa: 'تناسب و سایه جایگزین نیروی مکانیکی می‌شوند. عکس: آرشیو رسمان',
      ar: 'النسب والظلال تحل محل القوة الميكانيكية.',
    },
    sections: [
      {
        paragraph: {
          en: 'An empty plot can feel deceptively quiet, yet wind vectors, solar altitude, and seasonal dust are already drawing invisible boundaries across the earth. The discipline of passive architecture begins by reading those forces carefully before placing a single structural line on paper. On Iran’s central plateau, where daytime summer highs routinely cross forty degrees while desert nights plunge twenty degrees cooler, ignoring site microclimate condemns a building to decades of mechanical dependency.',
          fa: 'یک زمین خالی در ظاهر ساکت و بی‌تحرک به نظر می‌رسد، اما جهت بادهای غالب، زاویه تابش خورشید و گردوغبار فصلی پیشاپیش مرزهای نامرئی خود را بر خاک ترسیم کرده‌اند. انضباط معماری غیرفعال با خوانش دقیق همین نیروها پیش از کشیدن نخستین خط سازه‌ای آغاز می‌شود. در فلات مرکزی که دمای روزهای تابستان به آسانی از چهل درجه می‌گذرد و شب‌ها تا بیست درجه خنک‌تر می‌شود، بی‌توجهی به خرداقلیم سایت بنا را برای دهه‌ها به تجهیزات مکانیکی وابسته می‌کند.',
          ar: 'قد تبدو قطعة الأرض الخالية هادئة في ظاهرها، غير أن اتجاهات الرياح وارتفاع الشمس والغبار الموسمي ترسم مسبقاً حدوداً غير مرئية فوق التربة. يبدأ انضباط العمارة السلبية بقراءة هذه القوى بدقة قبل رسم أول خط إنشائي، إذ إن تجاهل المناخ المصغّر للموقع يحكم على المبنى بعقود من الاعتماد على التبريد الميكانيكي.',
        },
      },
      {
        heading: {
          en: 'Reading Wind, Dust, and Solar Altitude',
          fa: 'خوانش باد، غبار و زاویه تابش خورشید',
          ar: 'قراءة الرياح والغبار وارتفاع الشمس',
        },
        paragraph: {
          en: 'Our studio visits every unbuilt site across at least three different times of day before sketching massing. Morning air movement reveals where cool downdrafts settle naturally along low perimeter contours; late afternoon glare exposes which western elevations must remain thick, deep, and protected. Rather than orienting glazing purely toward a picturesque view, we calibrate apertures like optical instruments—wide toward calm winter sun, recessed and filtered toward high summer radiation.',
          fa: 'در استودیو رسمان، پیش از هرگونه اتود حجمی، در حداقل سه نوبت مختلف روز در سایت حضور پیدا می‌کنیم. جریان هوای بامداد نشان می‌دهد توده هوای خنک در کدام شیب‌های زمین ته‌نشین می‌شود و تابش شدید بعدازظهر آشکار می‌سازد کدام جبهه‌های غربی باید ضخیم، عمیق و سایه‌دار باقی بمانند. به‌جای گشودن بازشوها صرفاً رو به منظره، هر پنجره را مانند ابزار نوری دقیق تنظیم می‌کنیم؛ گشوده رو به آفتاب ملایم زمستان و عقب‌نشسته و فیلترشده در برابر تابش تند تابستان.',
          ar: 'يزور استوديونا كل موقع في ثلاث أوقات مختلفة من اليوم قبل رسم أي كتلة معمارية. تكشف حركة هواء الصباح أين تستقر التيارات الباردة، بينما يوضح وهج الظهيرة أي الواجهات الغربية يجب أن تبقى سميكة ومظللة، فتُعاير الفتحات كأدوات بصرية دقيقة.',
        },
      },
      {
        heading: {
          en: 'Calibrating the Courtyard Proportion',
          fa: 'تنظیم تناسبات حیاط مرکزی',
          ar: 'معايرة نسب الفناء الداخلي',
        },
        paragraph: {
          en: 'When courtyard width stays below twice the perimeter wall height, afternoon shadows lock cool air inside the lower volume instead of allowing convective turbulence to flush it away. Paired with a shallow dark-stone water basin and drought-tolerant olive and pomegranate trees, evaporative cooling lowers ambient courtyard temperature by five to seven degrees. The courtyard ceases to be an ornamental void; it acts as a silent thermal lung shared by every room.',
          fa: 'هنگامی که عرض حیاط کمتر از دو برابر ارتفاع دیوارهای پیرامونی حفظ شود، سایه‌های بعدازظهر لایه هوای خنک را در عمق حیاط نگه می‌دارند و اجازه نمی‌دهند جریان‌های همرفتی گرم آن را پراکنده کنند. ترکیب این هندسه با حوض سنگی کم‌عمق و درختان کم‌آب‌بر زیتون و انار، دمای محیط حیاط را پنج تا هفت درجه کاهش می‌دهد. در این حالت، حیاط دیگر یک فضای خالی تزیینی نیست؛ بلکه ریه حرارتی خاموشی است که تمام فضاهای خانه از آن تنفس می‌کنند.',
          ar: 'عندما يبقى عرض الفناء أقل من ضعف ارتفاع الجدران المحيطة، تحبس ظلال الظهيرة الهواء البارد في الجزء السفلي. ومع حوض مائي حجري ضحل وأشجار الزيتون المقاومة للجفاف، تنخفض الحرارة المحيطة بخمس إلى سبع درجات، فيتحول الفناء إلى رئة حرارية صامتة للمنزل.',
        },
      },
      {
        heading: {
          en: 'Thermal Mass as Silent Infrastructure',
          fa: 'جرم حرارتی به‌مثابه زیرساخت خاموش',
          ar: 'الكتلة الحرارية كبنية تحتية صامتة',
        },
        paragraph: {
          en: 'Thick limestone and brick masonry assemblies absorb midday radiation slowly across an eight-to-ten-hour thermal lag and release gentle warmth only after midnight when plateau temperatures drop sharply. By placing breathable mineral insulation on the exterior side of the structural mass, interior wall planes stabilize room temperatures across abrupt seasonal transitions. Instead of fighting climate with oversized compressors, the building envelope itself performs the thermal labor silently for decades.',
          fa: 'دیوارهای ضخیم سنگ آهک و آجر تابش نیمروز را با تاخیر حرارتی هشت تا ده ساعته به‌آرامی در خود ذخیره می‌کنند و گرمای ملایم آن را تنها پس از نیمه‌شب که هوای فلات سرد می‌شود آزاد می‌سازند. قرار دادن عایق معدنی تنفس‌پذیر در جبهه بیرونی جرم سازه‌ای باعث می‌شود جداره‌های داخلی دمای اتاق را در نوسانات شدید فصلی پایدار نگه دارند. بدین ترتیب، به‌جای نبرد با اقلیم توسط دستگاه‌های پرمصرف، خود پوسته ساختمان برای دهه‌ها کار حرارتی را بی‌صدا و بی‌نیاز به نگهداری انجام می‌دهد.',
          ar: 'تمتص جدران الحجر الجيري السميكة إشعاع الظهيرة ببطء بفارق زمني يتراوح بين ثماني وعشر ساعات، ثم تطلق دفئاً لطيفاً بعد منتصف الليل عندما تنخفض الحرارة. وهكذا يؤدي غلاف المبنى العمل الحراري بصمت لعقود دون الحاجة إلى ضواغط ضخمة.',
        },
      },
      {
        heading: {
          en: 'Timber Louvers and Dynamic Daylight',
          fa: 'لوورهای چوبی و ریتم پویا در نور روز',
          ar: 'كاسرات الخشب وإيقاع ضوء النهار',
        },
        paragraph: {
          en: 'Operable vertical timber louvers along the courtyard loggia bridge interior stillness and exterior luminosity. Slatted at forty-five degrees in thermally modified ash, they intercept low-angle glare while allowing cross-breezes to wash unhindered across living ceilings. Throughout the day, crisp linear shadow patterns slowly traverse travertine floors like an architectural sundial, giving occupants a visceral awareness of passing hours without visual noise.',
          fa: 'لوورهای عمودی و متحرک چوبی در امتداد ایوان حیاط، پیوندی ظریف میان آرامش درون و درخشش بیرون ایجاد می‌کنند. این تیغه‌ها که از چوب ترمو با زاویه چهل‌وپنج درجه ساخته شده‌اند، تابش زننده زاویه پایین را مهار می‌کنند اما به نسیم عرضی اجازه می‌دهند آزادانه زیر سقف فضاهای نشیمن جریان یابد. در طول روز، خطوط منظم سایه همچون ساعت آفتابی معماری به‌آرامی روی کف سنگ تراورتن حرکت می‌کنند و گذر زمان را بدون شلوغی بصری ملموس می‌سازند.',
          ar: 'تشكّل كاسرات الخشب الرأسية المتحركة على امتداد الرواق جسراً بين سكون الداخل وإشراق الخارج، إذ تحجب الوهج الحاد وتسمح بمرور النسيم المتقاطع، بينما ترسم الظلال الخطية إيقاعاً هادئاً فوق الأرضيات الحجرية.',
        },
      },
      {
        heading: {
          en: 'Measured Post-Occupancy Stillness',
          fa: 'آرامش سنجش‌شده پس از بهره‌برداری',
          ar: 'السكون المُقاس بعد الإشغال',
        },
        paragraph: {
          en: 'One full year after handover, temperature loggers placed inside our Yazd and Kashan residences confirmed a seventy-percent reduction in active cooling hours compared with code-compliant concrete villas nearby. Yet the metric residents mention most often is acoustic rather than energetic: without constant fan hum, the sound of wind through olive leaves and water trickling into stone returns to daily domestic life.',
          fa: 'یک سال کامل پس از بهره‌برداری، حسگرهای ثبت دما در خانه‌های ساخته‌شده در یزد و کاشان کاهش هفتاددرصدی ساعات کارکرد سیستم سرمایش مکانیکی را در مقایسه با ویلاهای بتنی متعارف همجوار تایید کردند. با این حال، شاخصی که ساکنان بیش از همه از آن یاد می‌کنند نه عدد مصرف انرژی، بلکه کیفیت آکوستیک فضاست؛ با خاموش‌شدن همهمه مداوم فن‌ها، صدای نسیم میان برگ‌های زیتون و جریان آرام آب دوباره به زندگی روزمره بازمی‌گردد.',
          ar: 'بعد عام كامل من الإشغال، أكدت أجهزة قياس الحرارة في مساكننا بيزد وكاشان انخفاض ساعات التبريد النشط بنسبة سبعين في المائة. ومع ذلك، فإن ما يذكره السكان أكثر من الطاقة هو الهدوء الصوتي وعودة صوت الريح والماء إلى الحياة اليومية.',
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
      ar: 'الطين المدكوك وإضاءة المناور العلوية: عودة التربة الخام إلى الفضاء الثقافي',
    },
    excerpt: {
      en: 'Exploring compacted earth walls in modern galleries—an assembly that unifies structural mass, acoustic warmth, and geological texture.',
      fa: 'بررسی دیوارهای خاک کوبیده در گالری‌های معاصر؛ ترکیبی که جرم سازه‌ای، گرمای آکوستیک و بافت زمین‌شناختی را یکپارچه می‌کند.',
      ar: 'استكشاف جدران الطين المدكوك في صالات العرض المعاصرة، حيث تتوحد الكتلة الإنشائية والدفء الصوتي والملمس الجيولوجي.',
    },
    monthLabel: { en: 'Nov', fa: 'آبان', ar: 'نوفمبر' },
    dayNumber: '08',
    fullDate: {
      en: 'November 8, 2026',
      fa: '۱۷ آبان ۱۴۰۵',
      ar: '٨ نوفمبر ٢٠٢٦',
    },
    isoDate: '2026-11-08',
    readMinutes: 8,
    author: AUTHORS.sara,
    coverImage: '/images/blog/rammed-earth-light.jpg',
    coverAlt: {
      en: 'Cultural gallery interior with layered rammed-earth walls and linear skylight',
      fa: 'فضای داخلی گالری با دیوارهای لایه‌ای خاک کوبیده و نورگیر خطی',
      ar: 'معرض ثقافي بجدران من الطين المدكوك المتدرج ومنور خطي علوي',
    },
    coverCaption: {
      en: 'Layered soil strata illuminated by northern clerestory daylight.',
      fa: 'لایه‌های فشرده خاک در نور ملایم نورگیر شمالی.',
      ar: 'طبقات التربة المضغوطة مضاءة بنور المنور الشمالي.',
    },
    sections: [
      {
        paragraph: {
          en: 'Raw excavated subsoil carries the exact chromatic and mineral signature of its terrain. Compacted in disciplined twelve-centimeter lifts inside reusable timber formwork, it transitions from loose aggregate into monolithic load-bearing walls with less than a fifth of reinforced concrete’s embodied carbon. When visitors step into a rammed-earth gallery for the first time, their pace slows instinctively—the material radiates a grounded warmth rarely encountered in white-box exhibition halls.',
          fa: 'خاک برداشت‌شده از لایه‌های زیرین خود سایت دقیقاً امضای رنگی و معدنی همان سرزمین را در خود دارد. هنگامی که این خاک در لایه‌های منظم دوازده‌سانتی‌متری درون قالب‌های چوبی قابل استفاده مجدد کوبیده می‌شود، از دانه‌های سست به دیوارهای باربر یکپارچه با کمتر از یک‌پنجم کربن نهفته بتن مسلح تبدیل می‌گردد. وقتی بازدیدکنندگان برای نخستین بار وارد گالری خاک کوبیده می‌شوند، گام‌هایشان ناخودآگاه آرام‌تر می‌شود؛ این مصالح گرمایی اصیل ساطع می‌کند که به‌ندرت در سالن‌های نمایشگاهی سفید و استریل دیده می‌شود.',
          ar: 'تحمل التربة المستخرجة من الموقع البصمة اللونية والمعدنية الدقيقة للأرض نفسها. وعند دكّها في طبقات منتظمة داخل قوالب خشبية، تتحول إلى جدران حاملة متماسكة بأقل من خُمس الكربون المتجسد في الخرسانة المسلحة.',
        },
      },
      {
        heading: {
          en: 'Soil Testing, Clay Balance, and Structural Honesty',
          fa: 'آزمون خاک، تعادل رس و صداقت سازه‌ای',
          ar: 'اختبار التربة وتوازن الطين والصدق الإنشائي',
        },
        paragraph: {
          en: 'Not every soil straight from foundation excavation can become an enduring gallery wall. Our materials lab runs sedimentation, shrinkage, and compressive tests across dozens of trial cylinders until sand, gravel, silt, and clay reach natural equilibrium. By grading aggregates precisely instead of overloading mixes with Portland cement, the finished wall stays vapor-permeable—actively absorbing excess indoor moisture during crowded exhibition openings and releasing it gently overnight.',
          fa: 'هر خاکی که از گودبرداری فونداسیون به‌دست می‌آید به‌تنهایی برای ساخت دیواری ماندگار کافی نیست. در آزمایشگاه مصالح استودیو، ده‌ها نمونه استوانه‌ای تحت آزمون دانه‌بندی، انقباض و مقاومت فشاری قرار می‌گیرند تا نسبت ماسه، شن، لای و رس به تعادل طبیعی برسد. با اصلاح دقیق دانه‌بندی به‌جای افزودن بی‌رویه سیمان پرتلند، دیوار نهایی تنفس‌پذیر باقی می‌ماند و رطوبت اضافی هوا را در افتتاحیه‌های شلوغ جذب و در طول شب به‌آرامی آزاد می‌کند.',
          ar: 'ليست كل تربة صالحة مباشرة لبناء جدار دائم. يُجري مختبر المواد لدينا اختبارات التدرج الحبيبي والانكماش والضغط حتى تتوازن الرمال والحصى والطمي والطين دون الإفراط في الأسمنت، ليبقى الجدار قابلاً للتنفس وموازناً للرطوبة.',
        },
      },
      {
        heading: {
          en: 'Grazing Light Across Mineral Strata',
          fa: 'تابش مماس نور بر لایه‌های معدنی',
          ar: 'الضوء الملامس عبر الطبقات المعدنية',
        },
        paragraph: {
          en: 'Placing continuous northern clerestory slots directly along the wall plane turns subtle compaction seams into a living geological relief. Because grazing daylight enters steeply from above and washes vertically down the earth face, micro-aggregates cast crisp millimeter shadows without spilling direct ultraviolet radiation onto fragile artworks or manuscripts hung across the center of the room.',
          fa: 'قرار دادن شکاف‌های پیوسته نورگیر سقفی شمالی دقیقاً در امتداد صفحه دیوار، درزهای ظریف کوبش خاک را به نقش‌برجسته‌ای زمین‌شناختی و زنده بدل می‌کند. از آنجا که نور روز با زاویه تند از بالا می‌تابد و سطح دیوار را عمودی شست‌وشو می‌دهد، ریزدانه‌های معدنی سایه‌های میلی‌متری دقیق می‌سازند بی‌آنکه تابش مستقیم فرابنفش به آثار هنری و نسخه‌های حساس آسیب بزند.',
          ar: 'يحوّل وضع فتحات الإضاءة العلوية الشمالية بمحاذاة سطح الجدار خطوط الدك الدقيقة إلى نحت جيولوجي حي، حيث ينساب الضوء عمودياً ليبرز الملمس دون تعريض الأعمال الفنية للأشعة المباشرة.',
        },
      },
      {
        heading: {
          en: 'Acoustic Absorption Without Synthetic Panels',
          fa: 'جذب آکوستیک بدون پنل‌های مصنوعی',
          ar: 'الامتصاص الصوتي دون ألواح صناعية',
        },
        paragraph: {
          en: 'Contemporary museums often struggle with brittle reverberation caused by smooth drywall, terrazzo, and expansive glass. Porous mineral earth surfaces scatter mid- and high-frequency reflections organically, trimming reverberation time below 0.8 seconds without hiding architecture behind perforated acoustic drop ceilings. Conversation remains intimate even when eighty visitors share the same double-height hall.',
          fa: 'موزه‌های معاصر اغلب از بازتاب تند و آزاردهنده صدا میان دیوارهای گچی صیقلی، کف سنگ و شیشه‌های وسیع رنج می‌برند. سطح متخلخل خاک معدنی بازتاب فرکانس‌های میانی و بالا را به‌طور طبیعی می‌شکند و زمان واخنش فضا را بدون نیاز به سقف‌های کاذب آکوستیک مصنوعی به زیر هشت‌دهم ثانیه می‌رساند. در نتیجه گفت‌وگوها حتی با حضور هشتاد بازدیدکننده در سالنی با سقف بلند، صمیمی و شفاف باقی می‌ماند.',
          ar: 'تشتّت أسطح الطين المسامية الانعكاسات الصوتية الحادة بشكل طبيعي، مما يخفض زمن الصدى إلى أقل من ٠.٨ ثانية دون الحاجة إلى أسقف صوتية مستعارة، فتبقى المحادثات هادئة حتى في القاعات المزدحمة.',
        },
      },
      {
        heading: {
          en: 'Detailing Thresholds and Shadow Gaps',
          fa: 'جزئیات آستانه‌ها و درزهای سایه',
          ar: 'تفاصيل العتبات وفواصل الظل',
        },
        paragraph: {
          en: 'Where compacted earth meets steel lintels, oak doors, or honed limestone plinths, precision detailing protects vulnerable edges from everyday abrasion. We separate earth lifts from damp ground using forty-centimeter bush-hammered stone bases and recess black-steel shadow reveals wherever joinery abuts soil. Those deliberate three-centimeter pauses honor the contrast between machine precision and hand-tamped geological craft.',
          fa: 'در محل برخورد خاک کوبیده با نعل‌درگاه‌های فولادی، درهای بلوط یا ازاره سنگ آهک، جزئیات دقیق اجرایی لبه‌های حساس را در برابر سایش روزمره محافظت می‌کند. لایه‌های خاک با ازاره سنگی چهل‌سانتی‌متری از رطوبت زمین جدا می‌شوند و در هر محل اتصال نجاری به دیوار، درز سایه سه‌سانتی‌متری از فولاد سیاه تعریف می‌گردد تا تقابل دقت صنعتی و ساخت دست‌ساز خاک شفاف و خوانا بماند.',
          ar: 'عند التقاء الطين المدكوك بالعتبات الفولاذية أو أبواب البلوط، تحمي القواعد الحجرية الجدران من الرطوبة، بينما تبرز فواصل الظل الدقيقة التباين بين الدقة الصناعية والحرفية اليدوية للأرض.',
        },
      },
      {
        heading: {
          en: 'Architecture That Can Return to Earth',
          fa: 'معماری‌ای که می‌تواند دوباره به خاک بازگردد',
          ar: 'عمارة قادرة على العودة إلى الأرض',
        },
        paragraph: {
          en: 'Perhaps the quietest ethical triumph of unstabilized rammed earth is circularity. If a cultural pavilion is ever dismantled a century from now, its walls do not become toxic landfill rubble; crushed and moistened, the mineral body simply returns to the landscape from which it was lifted. Building with raw soil reminds us that permanence and humility are not opposites.',
          fa: 'شاید آرام‌ترین پیروزی اخلاقی خاک کوبیده بدون افزودنی‌های شیمیایی، چرخه کامل بازگشت‌پذیری آن باشد. اگر یک پاویون فرهنگی یک قرن دیگر برچیده شود، دیوارهایش به نخاله سمی تبدیل نمی‌شوند؛ بلکه با خردشدن و رطوبت، دوباره به همان بستر طبیعی که از آن برخاسته‌اند بازمی‌گردند. ساختن با خاک خام یادآور می‌شود که ماندگاری و فروتنی در تضاد با یکدیگر نیستند.',
          ar: 'ربما يكمن أعظم انتصار أخلاقي للطين المدكوك في دوريته الكاملة؛ فإذا فُكّك الجناح بعد قرن، تعود جدرانه بسلام إلى التربة التي وُلدت منها، مذكّرةً إيانا بأن الديمومة والتواضع لا يتعارضان.',
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
      ar: 'الشبكات الخشبية والدقة السويسرية: لماذا يرسم الخشب الهندسي ملامح الغد',
    },
    excerpt: {
      en: 'Precision CNC-milled glulam grids accelerate assembly while turning contemporary pavilions into verifiable carbon sinks.',
      fa: 'شبکه‌های چوب لمینت دقیق سرعت اجرا را بالا می‌برند و پاویون‌های معاصر را به مخازن قابل سنجش جذب کربن تبدیل می‌کنند.',
      ar: 'تسرّع شبكات الخشب الرقائقي المصنّعة رقمياً عملية التركيب وتحول الأجنحة المعاصرة إلى مخازن كربون قابلة للقياس.',
    },
    monthLabel: { en: 'Nov', fa: 'آبان', ar: 'نوفمبر' },
    dayNumber: '01',
    fullDate: {
      en: 'November 1, 2026',
      fa: '۱۰ آبان ۱۴۰۵',
      ar: '١ نوفمبر ٢٠٢٦',
    },
    isoDate: '2026-11-01',
    readMinutes: 8,
    author: AUTHORS.navid,
    coverImage: '/images/blog/mass-timber-grid.jpg',
    coverAlt: {
      en: 'Exposed mass timber structural grid overlooking alpine terrain',
      fa: 'شبکه سازه‌ای چوب مهندسی‌شده در برابر چشم‌انداز کوهستانی',
      ar: 'شبكة إنشائية مكشوفة من الخشب الهندسي تطل على تضاريس جبلية',
    },
    coverCaption: {
      en: 'Dry-bolted structural grids allow complete future disassembly.',
      fa: 'اتصالات خشک سازه‌ای امکان جداسازی کامل در آینده را فراهم می‌کنند.',
      ar: 'تتيح الوصلات الجافة تفكيكاً كاملاً في المستقبل.',
    },
    sections: [
      {
        paragraph: {
          en: 'Engineered mass timber bridges centuries-old joinery heritage and contemporary five-axis digital fabrication. Every beam-to-column mortise, concealed shear plate slot, and service chase is milled off-site to sub-millimeter tolerances directly from our BIM geometry. When structural components arrive on site wrapped and numbered, erection unfolds with the calm choreography of cabinetmaking—shrinking site noise, dust, and construction waste to near zero.',
          fa: 'چوب مهندسی‌شده پیوندی اصیل میان میراث چندصدساله نجاری سازه‌ای و تولید دیجیتال پنج‌محوره برقرار می‌کند. هر کام‌وزبانه اتصال تیر به ستون، شیار صفحه برشی پنهان و مسیر تاسیسات مستقیماً از مدل دقیق BIM با دقت زیرمیلی‌متری در کارگاه تراش داده می‌شود. هنگام ورود قطعات شماره‌گذاری‌شده به سایت، نصب سازه با آرامش و نظم ساخت مبلمان پیش می‌رود و آلودگی صوتی، گردوغبار و ضایعات کارگاه را به نزدیک صفر می‌رساند.',
          ar: 'يجسر الخشب الهندسي بين تراث النجارة العريق والتصنيع الرقمي خماسي المحاور، حيث تُفرّز كل وصلة بدقة دون المليمتر مسبقاً في الورشة، مما يقلص ضجيج الموقع ومخلفات البناء إلى أدنى حد.',
        },
      },
      {
        heading: {
          en: 'Structural Rhythm as Spatial Ornament',
          fa: 'ریتم سازه‌ای به‌مثابه آرایه فضایی',
          ar: 'الإيقاع الإنشائي كزينة مكانية',
        },
        paragraph: {
          en: 'When spruce and larch glulam grids remain openly expressed inside a pavilion, architecture no longer requires secondary suspended ceilings or decorative cladding to feel complete. A disciplined 3.6-meter structural bay governs daylight skylights, furniture placement, and acoustic ceiling baffles in one unified proportion system. Every horizontal beam carries load, frames sky views, and anchors human scale simultaneously.',
          fa: 'هنگامی که شبکه سازه‌ای چوب لمینت بدون پوشش پنهان‌کننده در فضای داخلی نمایان می‌ماند، معماری دیگر نیازی به سقف کاذب ثانویه یا نازک‌کاری تزیینی برای کامل به نظر رسیدن ندارد. یک مدول سازه‌ای منظم سه‌متر و شصت‌سانتی‌متری هم‌زمان نورگیرها، چیدمان مبلمان و بافل‌های آکوستیک سقف را در یک نظام تناسبات واحد سامان می‌دهد؛ هر تیر افقی هم بار سازه‌ای را تحمل می‌کند، هم قاب آسمان را می‌سازد و هم مقیاس انسانی فضا را تثبیت می‌کند.',
          ar: 'عندما تبقى شبكة الخشب الهندسي مكشوفة، لا يعود المبنى بحاجة إلى أسقف مستعارة أو تكسية تزيينية، إذ يحكم المديول الإنشائي الموحّد المناور والأثاث والمعالجة الصوتية في تناغم واحد.',
        },
      },
      {
        heading: {
          en: 'Designing for Reversible Assembly',
          fa: 'طراحی برای مونتاژ برگشت‌پذیر',
          ar: 'التصميم للتجميع القابل للعكس',
        },
        paragraph: {
          en: 'Conventional steel-and-concrete construction locks materials together permanently, turning future renovation into demolition. By replacing wet chemical adhesives with concealed stainless-steel dowels and dry-bolted connectors, timber frames behave like architectural furniture. Each structural element carries a digital material passport—meaning columns, slabs, and rafters can be inspected, repaired, or relocated intact after decades of service.',
          fa: 'ساخت‌وساز متعارف فولادی و بتنی مصالح را به‌صورت برگشت‌ناپذیر در هم قفل می‌کند و هر بازسازی آینده را به تخریب بدل می‌سازد. با جایگزینی چسب‌های شیمیایی تر با پین‌های فولاد ضدزنگ پنهان و اتصالات خشک پیچ‌ومهره‌ای، قاب‌های چوبی همچون مبلمان معماری عمل می‌کنند. هر عضو سازه‌ای شناسنامه دیجیتال مصالح دارد و پس از دهه‌ها بهره‌برداری قابل بازبینی، مرمت یا جابه‌جایی سالم به پروژه‌ای دیگر است.',
          ar: 'باستبدال المواد اللاصقة الرطبة بوصلات فولاذية مخفية ومثبّتات جافة، تتصرف الهياكل الخشبية كأثاث معماري يمكن فحصه أو صيانته أو نقله بالكامل بعد عقود من الخدمة.',
        },
      },
      {
        heading: {
          en: 'Moisture Intelligence and Weathering Details',
          fa: 'هوشمندی در برابر رطوبت و جزئیات کهنگی',
          ar: 'الذكاء الرطوبي وتفاصيل التعتيق',
        },
        paragraph: {
          en: 'Longevity in mass timber depends almost entirely on keeping end-grain dry and ventilated. We lift every timber column clear of grade on galvanized knife-plate pedestals, project deep roof eaves to shelter facade battens from driving snow and rain, and detail drip-grooves beneath every sill. Properly protected from trapped moisture, untreated larch weathers gracefully from honey gold to silver grey over three winters.',
          fa: 'طول عمر سازه‌های چوبی تقریباً به‌طور کامل به خشک و تهویه‌دار نگه‌داشتن سرمقطع الیاف چوب وابسته است. تمامی ستون‌های چوبی روی کف‌ستون‌های گالوانیزه با فاصله از سطح زمین قرار می‌گیرند، پیش‌آمدگی عمیق بام جداره‌ها را از باران و برف مایل حفظ می‌کند و زیر تمامی لبه پنجره‌ها آبچکان دقیق تعبیه می‌شود. چوب لارکس بدون پوشش مصنوعی در پناه این جزئیات طی سه زمستان با وقار از طلایی عسلی به خاکستری نقره‌ای تغییر رنگ می‌دهد.',
          ar: 'تعتمد ديمومة الخشب على حماية أطرافه من الرطوبة المحبوسة عبر رفع الأعمدة فوق قواعد معدنية وتوفير رفارف عميقة للسقف، مما يسمح للخشب بالتعتيق بأناقة إلى الرمادي الفضي.',
        },
      },
      {
        heading: {
          en: 'Fire Safety Through Char Layer Physics',
          fa: 'ایمنی حریق از طریق فیزیک لایه زغالی',
          ar: 'السلامة من الحريق عبر فيزياء طبقة التفحم',
        },
        paragraph: {
          en: 'Contrary to common intuition, heavy cross-laminated timber performs with remarkable predictability under fire exposure. Unlike unprotected steel that softens abruptly at high heat, dense timber chars slowly at a known rate of roughly 0.65 millimeters per minute, forming an insulating carbonized crust that shields the load-bearing structural core beneath for ninety to one hundred twenty minutes.',
          fa: 'برخلاف تصور رایج، مقاطع سنگین چوب مهندسی‌شده در برابر آتش عملکردی کاملاً قابل پیش‌بینی دارند. برخلاف فولاد بدون پوشش که در دمای بالا به‌ناگهان مقاومت خود را از دست می‌دهد، چوب فشرده با نرخ مشخص حدود شش‌دهم میلی‌متر در دقیقه به‌آرامی زغالی می‌شود و لایه‌ای عایق تشکیل می‌دهد که هسته باربر داخلی را تا نود تا صدوبیست دقیقه ایمن نگه می‌دارد.',
          ar: 'على عكس الاعتقاد الشائع، يتفحّم الخشب الكثيف بمعدل بطيء ومعروف مشكّلاً طبقة عازلة تحمي القلب الإنشائي الحامل لمدة تصل إلى ساعتين، بخلاف الفولاذ المكشوف الذي يفقد صلابته فجأة.',
        },
      },
      {
        heading: {
          en: 'Verified Carbon Sequestration in Practice',
          fa: 'جذب کربن قابل سنجش در عمل',
          ar: 'تخزين الكربون القابل للتحقق عملياً',
        },
        paragraph: {
          en: 'Sourced exclusively from FSC-certified regenerative forests where replanting exceeds harvest, one cubic meter of engineered timber locks away nearly one metric ton of atmospheric carbon dioxide for the lifespan of the structure. Pairing timber superstructures with low-carbon rammed-earth cores lets our studio deliver public buildings that act not merely as less-harmful objects, but as measurable climatic stewards.',
          fa: 'چوب‌هایی که منحصراً از جنگل‌های پایدار دارای گواهی بازکاشت تامین می‌شوند، در هر مترمکعب نزدیک به یک تن دی‌اکسیدکربن اتمسفری را در طول عمر بنا حبس می‌کنند. ترکیب اسکلت چوبی با هسته‌های خاک کوبیده کم‌کربن به استودیو امکان می‌دهد بناهای عمومی بسازد که صرفاً «کم‌ضررتر» نیستند، بلکه به‌عنوان امانت‌داران قابل سنجش اقلیم عمل می‌کنند.',
          ar: 'يحجز كل متر مكعب من الخشب المستدام قرابة طن متري من ثاني أكسيد الكربون طوال عمر المبنى، ومع دمجه بنوى من الطين المدكوك تتحول المباني العامة إلى حراس حقيقيين للمناخ.',
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
      ar: 'العتبات المظلّلة للمشاة: استعادة حافة الشارع للحياة الهادئة',
    },
    excerpt: {
      en: 'Small recessed arcades, permeable stone paving, and micro-plazas soften the brutal divide between private plots and civic avenues.',
      fa: 'ایوان‌های فرورفته، سنگفرش‌های نفوذپذیر و میدانچه‌های خُرد مرز خشن میان پلاک‌های خصوصی و معابر شهری را نرم می‌کنند.',
      ar: 'تُلطّف الأروقة الغائرة والأرصفة الحجرية النفاذة والساحات المصغّرة الحدّ القاسي بين الملكيات الخاصة والشوارع العامة.',
    },
    monthLabel: { en: 'Oct', fa: 'مهر', ar: 'أكتوبر' },
    dayNumber: '24',
    fullDate: {
      en: 'October 24, 2026',
      fa: '۲ آبان ۱۴۰۵',
      ar: '٢٤ أكتوبر ٢٠٢٦',
    },
    isoDate: '2026-10-24',
    readMinutes: 6,
    author: AUTHORS.mina,
    coverImage: '/images/blog/pedestrian-arcade.jpg',
    coverAlt: {
      en: 'Quiet shaded urban arcade with textured stone pavement and soft sunlight',
      fa: 'رواق سایه‌دار شهری با کف‌سازی سنگی و نور ملایم',
      ar: 'رواق حضري هادئ ومظلّل بأرضية حجرية وضوء شمس ناعم',
    },
    coverCaption: {
      en: 'Civic generosity begins in the first two meters of every facade.',
      fa: 'سخاوت شهری در دو متر نخست هر نما شکل می‌گیرد.',
      ar: 'يبدأ الكرم الحضري في المترين الأولين من كل واجهة.',
    },
    sections: [
      {
        paragraph: {
          en: 'Cities become memorable not at expressway intersections or skyline silhouettes, but along the two-meter threshold where a building meets the sidewalk. When contemporary developments push opaque boundary walls straight onto the property line, streets deteriorate into hot transit corridors devoid of pause or shelter. Setting ground-floor glazing back beneath a modest colonnade restores shade, rain cover, and human cadence to everyday walking.',
          fa: 'شهرها نه در تقاطع بزرگراه‌ها و نه در خط آسمان برج‌ها، بلکه در همان آستانه دو متری برخورد ساختمان با پیاده‌رو در حافظه می‌مانند. هنگامی که ساخت‌وسازهای معاصر دیوارهای صلب را تا آخرین میلی‌متر حد مالکیت پیش می‌برند، خیابان‌ها به دالان‌های داغ و بی‌وقفه عبور تقلیل می‌یابند. عقب‌نشینی طبقه همکف زیر یک رواق متواضع، سایه، پناهگاه باران و ریتم انسانی را به پیاده‌روی روزمره بازمی‌گرداند.',
          ar: 'تُخلَّد المدن في الذاكرة عند عتبة المترين حيث يلتقي المبنى بالرصيف، لا عند تقاطعات الطرق السريعة. ويستعيد تراجع الطابق الأرضي تحت رواق بسيط الظل والمأوى والإيقاع الإنساني للمشي اليومي.',
        },
      },
      {
        heading: {
          en: 'The Generosity of the Two-Meter Setback',
          fa: 'سخاوت عقب‌نشینی دو متری در همکف',
          ar: 'كرم التراجع الحضري لمسافة مترين',
        },
        paragraph: {
          en: 'Giving back a narrow strip of private ground floor to public circulation is one of the highest-impact civic gestures an architect can negotiate with a client. Far from reducing commercial value, shaded frontages double dwell time outside neighborhood bookshops, studios, and cafes—turning passing errands into spontaneous social encounters while keeping storefront glass cool without heavy air curtains.',
          fa: 'بخشیدن نواری باریک از طبقه همکف ملک خصوصی به حرکت پیاده شهروندان، یکی از اثرگذارترین کنش‌های مدنی است که معمار می‌تواند با کارفرما به توافق برساند. این فضا نه‌تنها ارزش تجاری را کاهش نمی‌دهد، بلکه زمان مکث مردم در برابر کتابفروشی‌ها، استودیوها و کافه‌های محله را دو برابر می‌کند و ضمن خنک نگه‌داشتن ویترین‌ها، عبور روزمره را به مواجهه اجتماعی دلپذیر بدل می‌سازد.',
          ar: 'لا يقلّل تخصيص شريط مظلّل من الطابق الأرضي للمشاة من القيمة التجارية، بل يضاعف وقت التوقف أمام المكتبات والاستوديوهات والمقاهي ويحفظ برودة الواجهات الزجاجية.',
        },
      },
      {
        heading: {
          en: 'Permeable Ground and Urban Cooling',
          fa: 'کف‌سازی نفوذپذیر و خنک‌سازی شهری',
          ar: 'الأرضيات النفاذة وتبريد المدينة',
        },
        paragraph: {
          en: 'Impervious asphalt traps solar heat long after sunset and overwhelms municipal storm drains during sudden autumn cloudbursts. Replacing sealed paving strips with dry-laid basalt pavers bedded on crushed gravel channels rainwater directly into street-tree root trenches. Healthy plane and elm canopies flourish as a result, lowering street-level radiant heat across entire city blocks.',
          fa: 'آسفالت نفوذناپذیر گرمای خورشید را تا ساعت‌ها پس از غروب حبس می‌کند و در رگبارهای ناگهانی پاییزی شبکه فاضلاب شهر را دچار آب‌گرفتگی می‌سازد. جایگزینی کف‌سازی بسته با سنگفرش خشک‌چین بازالتی روی بستر شن، آب باران را مستقیماً به گودال ریشه درختان معبر هدایت می‌کند و تاج‌پوششی سالم و پرپشت می‌پروراند که دمای تابشی کل محله را پایین می‌آورد.',
          ar: 'توجّه أحجار البازلت المرصوفة جافاً مياه الأمطار مباشرة نحو جذور أشجار الشارع، مما ينمّي مظلات شجرية صحية تخفض الحرارة الإشعاعية على مستوى الأحياء بأكملها.',
        },
      },
      {
        heading: {
          en: 'Seating Woven Into Architectural Plinths',
          fa: 'نشیمن‌های تنیده‌شده در ازاره معماری',
          ar: 'مقاعد مدمجة في القواعد المعمارية',
        },
        paragraph: {
          en: 'Public seating works best when it belongs structurally to the building rather than appearing as an afterthought bolted to the curb. Extending a honed travertine window sill forty-five centimeters outward at knee height creates an effortless resting ledge for elderly neighbors, parents with strollers, and students reading in morning shade—inviting lingering without requiring commercial consumption.',
          fa: 'نشیمن عمومی زمانی بهترین کارکرد را دارد که بخشی اصیل از ساختار بنا باشد، نه نیمکتی که در پایان کار کنار جدول پیچ شده است. امتداد دادن ازاره سنگ تراورتن به اندازه چهل‌وپنج سانتی‌متر در ارتفاع زانو، نشیمنگاهی بی‌تکلف برای سالمندان محله، والدین و دانشجویانی که در سایه صبح مطالعه می‌کنند فراهم می‌سازد؛ مکانی برای مکث بی‌آنکه نیازی به خرید و مصرف باشد.',
          ar: 'يعمل الجلوس العام بأفضل صورة حين ينبثق من بنية المبنى نفسها، عبر مدّ قاعدة حجر الترافرتين بارتفاع مريح ليصبح مكاناً للراحة في الظل دون اشتراط أي استهلاك تجاري.',
        },
      },
      {
        heading: {
          en: 'Nighttime Light Without Glare',
          fa: 'نورپردازی شبانه بدون خیرگی',
          ar: 'إضاءة ليلية خالية من الوهج',
        },
        paragraph: {
          en: 'After dusk, pedestrian safety depends on even, warm vertical illumination rather than harsh overhead floodlights that deepen nearby shadows. Shielded 2700K linear grazing fixtures tucked beneath arcade soffits wash masonry texture gently, guiding footsteps with visual clarity while preserving dark-sky serenity above the roofline.',
          fa: 'پس از غروب آفتاب، امنیت پیاده به نورپردازی عمودی یکنواخت و گرم وابسته است، نه پروژکتورهای تند و خشن که سایه‌های اطراف را تاریک‌تر می‌کنند. چراغ‌های خطی گرم و مخفی‌شده در زیرسقف رواق‌ها، بافت سنگ و آجر را به‌نرمی روشن می‌کنند و ضمن راهنمایی امن عابران، آرامش آسمان شب را بالای خط بام حفظ می‌نمایند.',
          ar: 'تعتمد سلامة المشاة ليلاً على إضاءة دافئة ومخفية تحت سقوف الأروقة تبرز ملمس الحجر وتهدي الخطى بوضوح دون وهج قاسٍ يفسد سكون سماء الليل.',
        },
      },
      {
        heading: {
          en: 'A Network of Quiet Civic Rooms',
          fa: 'شبکه‌ای از اتاق‌های آرام شهری',
          ar: 'شبكة من الغرف الحضرية الهادئة',
        },
        paragraph: {
          en: 'No single facade transforms a metropolis overnight, yet when three or four neighboring plots adopt continuous shaded thresholds, an unmistakable micro-district emerges. People begin choosing the quieter street over the fastest arterial road—proving that spatial dignity is contagious once citizens experience it underfoot.',
          fa: 'هیچ نمای منفردی یک کلان‌شهر را یک‌شبه دگرگون نمی‌کند، اما هنگامی که سه یا چهار پلاک همجوار آستانه‌های سایه‌دار پیوسته را می‌پذیرند، خردمحله‌ای زنده و متمایز شکل می‌گیرد. شهروندان به‌تدریج خیابان آرام‌تر را بر مسیر سریع‌تر ترجیح می‌دهند و نشان می‌دهند که کرامت فضایی به‌محض تجربه‌شدن زیر گام‌های مردم، مسری و تکثیرپذیر است.',
          ar: 'لا تغيّر واجهة واحدة مدينة كاملة بين ليلة وضحاها، لكن حين تتبنى عدة مبانٍ متجاورة عتبات مظلّلة متصلة، يولد حيّ مصغّر يختار الناس المشي فيه طوعاً.',
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
      ar: 'الهدوء كمادة مكانية: ملاحظات في الرصانة والنسب',
    },
    excerpt: {
      en: 'Why removing redundant joints, decorative trim, and visual noise lets daylight and human presence become the true ornament of a room.',
      fa: 'چرا حذف درزهای اضافی، تزیینات زائد و شلوغی بصری اجازه می‌دهد نور روز و حضور انسان آرایه واقعی فضا شوند.',
      ar: 'لماذا يتيح إزالة الفواصل الزائدة والزخارف والضجيج البصري لضوء النهار وحضور الإنسان أن يصبحا الزينة الحقيقية للمكان.',
    },
    monthLabel: { en: 'Oct', fa: 'مهر', ar: 'أكتوبر' },
    dayNumber: '16',
    fullDate: {
      en: 'October 16, 2026',
      fa: '۲۴ مهر ۱۴۰۵',
      ar: '١٦ أكتوبر ٢٠٢٦',
    },
    isoDate: '2026-10-16',
    readMinutes: 6,
    author: AUTHORS.dariush,
    coverImage: '/images/blog/spatial-quietness.jpg',
    coverAlt: {
      en: 'Serene monochrome architectural interior with pure geometry and daylight band',
      fa: 'فضای داخلی تک‌رنگ و آرام معماری با هندسه خالص و باریکه نور',
      ar: 'فضاء داخلي معماري هادئ أحادي اللون بهندسة نقية وحزمة ضوء نهار',
    },
    coverCaption: {
      en: 'Restraint clarifies every remaining edge.',
      fa: 'خویشتن‌داری هر لبه باقی‌مانده را شفاف‌تر می‌کند.',
      ar: 'الرصانة تزيد كل حافة متبقية وضوحاً.',
    },
    sections: [
      {
        paragraph: {
          en: 'Visual fatigue enters architecture long before structural failure. When every wall, ceiling soffit, and cabinet handle competes for attention, none of them can offer mental rest. Architectural quietness is never emptiness or cold austerity; it is the deliberate calibration of fewer, better-resolved junctions so the eye settles effortlessly upon light, shadow, and human company.',
          fa: 'خستگی بصری بسیار پیش از فرسودگی سازه‌ای وارد معماری می‌شود. هنگامی که هر دیوار، شکست سقف و دستگیره کابینت برای جلب توجه رقابت می‌کند، هیچ‌یک نمی‌توانند آرامش ذهنی ببخشند. سکوت معماری هرگز به معنای تهی‌بودن یا سردی نیست؛ بلکه تنظیم آگاهانه اتصالات کمتر اما پخته‌تر است تا چشم بی‌تکلف بر نور، سایه و حضور انسان آرام گیرد.',
          ar: 'يتسلل الإرهاق البصري إلى العمارة قبل أي خلل إنشائي بكثير. وليس الهدوء المعماري فراغاً بارداً، بل هو معايرة واعية لوصلات أقل وأكثر إتقاناً تتيح للعين الاستقرار على الضوء والظل والحضور الإنساني.',
        },
      },
      {
        heading: {
          en: 'Editing Until Only Structure Speaks',
          fa: 'ویرایش تا لحظه‌ای که تنها ساختار سخن بگوید',
          ar: 'التحرير حتى لا يتحدث سوى البناء نفسه',
        },
        paragraph: {
          en: 'In studio design reviews, our most productive question is rarely what to add—it is which molding, cover strip, or redundant change of material can be dissolved without weakening spatial clarity. Hiding curtain tracks inside recessed ceiling pockets and aligning door heads with window lintels removes dozens of fragmented horizontal lines, allowing room geometry to read in a single calm breath.',
          fa: 'در جلسات نقد طراحی استودیو، پربارترین پرسش ما به‌ندرت این است که چه چیزی اضافه کنیم؛ بلکه این است که کدام قرنیز، نوار پوشاننده یا تغییر مصالح زائد را می‌توان حذف کرد بی‌آنکه شفافیت فضا آسیب ببیند. پنهان‌کردن ریل پرده در شیار سقف و هم‌ترازکردن بالای درها با نعل‌درگاه پنجره‌ها ده‌ها خط افقی پراکنده را حذف می‌کند و اجازه می‌دهد هندسه اتاق در یک نفس آرام خوانده شود.',
          ar: 'في مراجعات الاستوديو، نادراً ما نسأل ماذا نضيف، بل أي خط أو تفصيل زائد يمكن حذفه دون إضعاف الوضوح المكاني، فتُقرأ هندسة الغرفة في نفس واحد هادئ.',
        },
      },
      {
        heading: {
          en: 'Material Palette of Three Honest Surfaces',
          fa: 'پالت مصالح بر پایه سه سطح صادق',
          ar: 'لوحة مواد من ثلاثة أسطح صادقة',
        },
        paragraph: {
          en: 'Across most commissions we limit the primary material vocabulary to three tactile partners—commonly lime plaster, honed local stone, and matte oiled timber. Restricting variety deepens craft attention: carpenters and masons invest their precision into flawless mitered corners and hand-troweled mineral sheen instead of juggling seven competing trade transitions.',
          fa: 'در اغلب پروژه‌ها دایره واژگان مصالح اصلی را به سه شریک ملموس محدود می‌کنیم؛ معمولاً اندود آهکی، سنگ بومی مات و چوب روغن‌خورده طبیعی. محدودکردن تنوع، عمق مهارت ساخت را افزایش می‌دهد؛ نجاران و سنگ‌کاران به‌جای درگیری با هفت اتصال متضاد، تمام دقت خود را صرف فارسی‌بری بی‌نقص گوشه‌ها و بافت دست‌ساز سطوح معدنی می‌کنند.',
          ar: 'نحصر المواد الأساسية غالباً في ثلاثة شركاء متناغمين مثل الجص الجيري والحجر المحلي والخشب المدهون بالزيت، مما يعمّق إتقان الحرفيين ويحفظ صفاء الفراغ.',
        },
      },
      {
        heading: {
          en: 'Proportion Felt Before It Is Measured',
          fa: 'تناسبی که پیش از اندازه‌گیری احساس می‌شود',
          ar: 'نسب تُحَسّ قبل أن تُقاس',
        },
        paragraph: {
          en: 'Long before a guest notices ceiling height in meters, their nervous system registers the ratio between enclosure and openness. A compressed entry vestibule with a 2.4-meter timber soffit makes the subsequent 3.6-meter daylight living room feel expansive without wasting floor area. Proportion choreographs emotional cadence silently through compression, release, and framed horizon.',
          fa: 'بسیار پیش از آنکه مهمانی ارتفاع سقف را به متر حدس بزند، سیستم عصبی او نسبت میان محصوریت و گشودگی را درک می‌کند. یک هشتی ورودی فشرده با سقف چوبی دو متر و چهل‌سانتی‌متری باعث می‌شود نشیمن نورگیر بعدی با ارتفاع سه متر و شصت‌سانتی‌متر بی‌آنکه زیربنا هدر رفته باشد وسیع و نفس‌گیر احساس شود. تناسب ریتم عاطفی فضا را از طریق فشردگی، گشایش و قاب‌گیری افق هدایت می‌کند.',
          ar: 'قبل أن يدرك الزائر ارتفاع السقف بالأمتار، يشعر جسده بنسبة الانغلاق والانفتاح؛ فالمدخل المنخفض يمنح غرفة المعيشة التالية اتساعاً مهيباً دون هدر في المساحة.',
        },
      },
      {
        heading: {
          en: 'Daylight as the Sole Changing Ornament',
          fa: 'نور روز به‌عنوان یگانه آرایه متغیر فضا',
          ar: 'ضوء النهار بوصفه الزينة المتجددة الوحيدة',
        },
        paragraph: {
          en: 'A quiet mineral plaster wall is never static; it acts as a calibrated canvas for atmospheric weather. Crisp winter sun paints sharp geometric blades across lime plaster at ten in the morning, while overcast November skies turn the same room into a luminous silver sanctuary. No applied mural or chandelier can rival the quiet drama of natural light crossing an uncluttered plane.',
          fa: 'یک دیوار ساده با اندود آهکی هرگز ایستا نیست؛ بلکه بوم دقیق تغییرات جوّی و فصلی است. خورشید شفاف زمستان ساعت ده صبح تیغه‌های هندسی تیز بر دیوار می‌کشد و آسمان ابری آبان همان اتاق را به پناهگاهی نقره‌ای و درخشان بدل می‌کند. هیچ تزیین الحاقی یا لوستر پرزرق‌وبرقی نمی‌تواند با درام آرام نور طبیعی بر یک صفحه بی‌آلایش رقابت کند.',
          ar: 'ليس الجدار الجصي الهادئ ساكناً أبداً، بل يعمل كلوحة حيّة لتغيرات الطقس والضوء، ولا تضاهي أي زخرفة مضافة جمال انسياب النور الطبيعي عبر سطح نقي.',
        },
      },
      {
        heading: {
          en: 'Leaving Space for Life to Complete the Room',
          fa: 'باقی‌گذاشتن فضا برای آنکه زندگی اتاق را کامل کند',
          ar: 'ترك مساحة لتكمل الحياة تفاصيل الغرفة',
        },
        paragraph: {
          en: 'Over-designed rooms reject their inhabitants—a single stack of books or coat draped over a chair disturbs their fragile perfection. Quiet architecture welcomes daily life generously. Because the underlying spatial grid and tonal harmony remain steady, books, ceramics, woven rugs, and family gatherings enrich the room effortlessly rather than creating disorder.',
          fa: 'اتاق‌های بیش‌ازحد طراحی‌شده ساکنان خود را پس می‌زنند؛ به‌گونه‌ای که یک دسته کتاب یا پالتوی روی صندلی، کمال شکننده آن‌ها را بر هم می‌زند. معماری آرام با سخاوت پذیرای زندگی روزمره است؛ زیرا شبکه فضایی و هارمونی رنگی زیرین چنان استوارند که کتاب‌ها، سفال‌ها، فرش‌های دست‌بافت و گردهمایی‌های خانوادگی بی‌آنکه شلوغی بسازند، فضا را غنی‌تر و زنده‌تر می‌کنند.',
          ar: 'ترحّب العمارة الهادئة بالحياة اليومية بسخاء؛ فبفضل ثبات الشبكة المكانية والانسجام اللوني، تُثري الكتب والخزف والاجتماعات العائلية الغرفة بدلاً من أن تُحدث فيها فوضى.',
        },
      },
    ],
  },
  {
    slug: 'wind-catchers-and-night-purge-ventilation',
    categoryId: 'sustainable',
    title: {
      en: 'Wind-Catchers Reimagined: Night-Purge Shafts for Desert Houses',
      fa: 'بازآفرینی بادگیر: شفت‌های تخلیه شبانه در خانه‌های کویری',
      ar: 'إعادة تصور الملاقف: مداخن التهوية الليلية في البيوت الصحراوية',
    },
    excerpt: {
      en: 'Translating centuries-old Yazdi airflow physics into silent stack-ventilation chimneys integrated with contemporary masonry walls.',
      fa: 'ترجمه فیزیک جریان‌هوای کهن یزد به دودکش‌های تهویه دودکشی بی‌صدا در دل دیوارهای بنایی معاصر.',
      ar: 'ترجمة فيزياء الهواء التقليدية في يزد إلى مداخن تهوية طبيعية صامتة مدمجة في الجدران الحجرية المعاصرة.',
    },
    monthLabel: { en: 'Jul', fa: 'تیر', ar: 'يوليو' },
    dayNumber: '22',
    fullDate: {
      en: 'July 22, 2026',
      fa: '۳۱ تیر ۱۴۰۵',
      ar: '٢٢ يوليو ٢٠٢٦',
    },
    isoDate: '2026-07-22',
    readMinutes: 6,
    author: AUTHORS.dariush,
    coverImage: '/images/projects/yazd-hero.jpg',
    coverAlt: {
      en: 'Minimalist desert pavilion with recessed wind-catching chimney and shaded stone courtyard',
      fa: 'پاویون کویری مینیمال با شفت بادگیر توکار و حیاط سنگی سایه‌دار',
      ar: 'جناح صحراوي بسيط بمدخنة تهوية مدمجة وفناء حجري مظلل',
    },
    coverCaption: {
      en: 'Stack-effect intake tower calibrated to prevailing summer breezes in Yazd.',
      fa: 'برج مکش هوا با اثر دودکشی، تنظیم‌شده هم‌جهت با بادهای غالب تابستانی یزد.',
      ar: 'برج سحب هواء يعمل بتأثير المدخنة وفق اتجاه الرياح الصيفية السائدة في يزد.',
    },
    sections: [
      {
        heading: {
          en: 'Reading the Night Sky as a Cooling Reservoir',
          fa: 'خواندن آسمان شب به‌عنوان مخزن سرمایش',
          ar: 'قراءة سماء الليل كخزان للتبريد الطبيعي',
        },
        paragraph: {
          en: 'In arid plateaus, clear night skies drop ambient temperatures by fifteen to twenty degrees Celsius after sunset. Rather than sealing buildings behind mechanical chillers, our desert houses open automated top-level dampers after dusk, drawing cool nocturnal air across exposed stone floors so the thermal mass begins every morning pre-cooled.',
          fa: 'در فلات‌های خشک، آسمان صاف شب پس از غروب آفتاب دما را پانزده تا بیست درجه کاهش می‌دهد. خانه‌های کویری ما به‌جای حبس‌شدن پشت چیلرهای مکانیکی، پس از غروب دریچه‌های فوقانی را می‌گشایند تا هوای خنک شبانه از روی کف‌های سنگی عبور کند و جرم حرارتی هر صبح را خنک آغاز نماید.',
          ar: 'في الهضاب الجافة تنخفض درجات الحرارة ليلاً بشكل كبير بعد الغروب، فتفتح بيوتنا منافذها العلوية لتمرير الهواء البارد فوق الأرضيات الحجرية وتبريد الكتلة الحرارية قبل الصباح.',
        },
      },
      {
        heading: {
          en: 'Aerodynamic Geometry Without Ornamental Excess',
          fa: 'هندسه آیرودینامیک بدون پیرایه تزیینی',
          ar: 'هندسة هوائية دقيقة بلا زخارف زائدة',
        },
        paragraph: {
          en: 'CFD simulations reveal that smooth chamfered internal baffles increase airflow velocity by nearly thirty percent compared to sharp square ducts. By folding the wind shaft directly into the stairwell core, the vertical circulation becomes both a sculptural light well and a silent climatic engine.',
          fa: 'شبیه‌سازی‌های دینامیک سیالات نشان می‌دهد پخ‌کردن لبه‌های داخلی شفت، سرعت جریان هوا را تا سی درصد نسبت به کانال‌های قائم افزایش می‌دهد. با ادغام شفت باد در هسته پلکان، حرکت عمودی بنا همزمان به نورگیر مجسمه‌وار و موتور اقلیمی بی‌صدا تبدیل می‌شود.',
          ar: 'تُظهر محاكاة تدفق الهواء أن تليين الحواف الداخلية يزيد سرعة التهوية بنسبة ثلاثين في المائة، وبدمج بئر الهواء مع نواة الدرج يتحول الفراغ إلى بئر نور ومحرك مناخي صامت.',
        },
      },
      {
        heading: {
          en: 'Evaporative Micro-Basins at Entry Thresholds',
          fa: 'حوضچه‌های تبخیری خرد در آستانه ورودی',
          ar: 'أحواض التبخر الدقيقة عند عتبات الدخول',
        },
        paragraph: {
          en: 'Even a shallow two-meter basalt water sheet positioned directly beneath the intake louver lowers incoming air temperature by four degrees while requiring minimal replenishment. Because the basin stays shaded by deep roof overhangs, evaporation occurs only when warm dry air sweeps across its surface.',
          fa: 'حتی یک صفحه آب کم‌عمق بازالتی به طول دو متر در زیر دریچه ورودی، دمای هوای واردشونده را تا چهار درجه کاهش می‌دهد و مصرف آب بسیار ناچیزی دارد. از آنجا که حوضچه زیر سایه عمیق پیش‌آمدگی سقف قرار می‌گیرد، تبخیر تنها هنگام عبور جریان هوای گرم و خشک رخ می‌دهد.',
          ar: 'حتى حوض مائي ضحل من البازلت أسفل منفذ الهواء يخفض حرارة الهواء الداخل أربع درجات مع استهلاك ضئيل للمياه بفضل تظليله المستمر.',
        },
      },
      {
        heading: {
          en: 'Seasonal Reversibility for Winter Sun',
          fa: 'برگشت‌پذیری فصلی برای خورشید زمستان',
          ar: 'قابلية التكيّف الموسمي مع شمس الشتاء',
        },
        paragraph: {
          en: 'When November arrives, insulated timber shutters seal the upper leeward vents and transform the shaft into a south-facing solar chimney that warms descending air gently. One architectural volume thus serves opposing climates without a single kilowatt of fossil backup.',
          fa: 'با فرارسیدن آبان، کرکره‌های عایق چوبی دریچه‌های بالایی را می‌بندند و شفت را به دودکش خورشیدی رو به جنوب تبدیل می‌کنند که هوای ورودی را به آرامی گرم می‌سازد؛ به این ترتیب یک حجم واحد پاسخگوی دو فصل متضاد است.',
          ar: 'مع حلول الشتاء تُغلق المصاريع الخشبية المعزولة الفتحات العلوية ليصبح البرج مدخنة شمسية تدفئ الهواء الداخل بهدوء دون استهلاك طاقة إضافية.',
        },
      },
    ],
  },
  {
    slug: 'lime-plaster-and-breathable-masonry',
    categoryId: 'materials',
    title: {
      en: 'Breathable Skins: Why Traditional Lime Plaster Outlasts Acrylic Paint',
      fa: 'پوسته‌های تنفس‌پذیر: چرا اندود آهک سنتی از رنگ آکریلیک ماندگارتر است',
      ar: 'أغلفة متنفسة: لماذا يدوم الجص الجيري التقليدي أكثر من الطلاء الصناعي',
    },
    excerpt: {
      en: 'Exploring vapor permeability, self-healing carbonation, and tactile depth across mineral wall finishes.',
      fa: 'بررسی نفوذپذیری بخار، کربناسیون خودترمیم‌شونده و عمق لمسی در اندودهای معدنی دیوار.',
      ar: 'استكشاف نفاذية البخار والكربنة ذاتية الالتئام والعمق الحسي في التشطيبات الجدارية المعدنية.',
    },
    monthLabel: { en: 'Jul', fa: 'تیر', ar: 'يوليو' },
    dayNumber: '04',
    fullDate: {
      en: 'July 4, 2026',
      fa: '۱۳ تیر ۱۴۰۵',
      ar: '٤ يوليو ٢٠٢٦',
    },
    isoDate: '2026-07-04',
    readMinutes: 6,
    author: AUTHORS.sara,
    coverImage: '/images/projects/kashan-hero.jpg',
    coverAlt: {
      en: 'Hand-troweled mineral lime wall illuminated by grazing morning daylight',
      fa: 'دیوار اندود آهک معدنی دست‌ساز زیر نور مایل صبحگاهی',
      ar: 'جدار من الجص الجيري اليدوي مضاء بنور الصباح المائل',
    },
    coverCaption: {
      en: 'Three-coat slaked lime render pigmented with crushed local ochre in Kashan.',
      fa: 'اندود سه‌لایه آهک شکفته با رنگدانه خاک اخرای محلی در کاشان.',
      ar: 'ثلاث طبقات من الجص الجيري المطفأ الممزوج بأصباغ ترابية محلية في كاشان.',
    },
    sections: [
      {
        heading: {
          en: 'Trapped Moisture vs. Capillary Equilibrium',
          fa: 'رطوبت محبوس در برابر تعادل مویینگی',
          ar: 'الرطوبة المحبوسة مقابل التوازن الشعري',
        },
        paragraph: {
          en: 'Synthetic elastomeric coatings seal masonry behind a plastic film that traps rising vapor until blistering and spalling inevitably follow. Slaked lime mortar remains microporous, allowing walls to absorb humidity spikes during winter rain and release moisture effortlessly once sunshine returns.',
          fa: 'پوشش‌های الاستومری مصنوعی، مصالح بنایی را پشت یک لایه پلاستیکی حبس می‌کنند و بخار محبوس سرانجام باعث طبله‌کردن و پوسته‌شدن دیوار می‌شود. ملات آهک شکفته ریزمتخلخل است و به دیوار اجازه می‌دهد رطوبت باران زمستانی را جذب و در آفتاب به‌سادگی دفع کند.',
          ar: 'تحبس الطلاءات الصناعية الرطوبة داخل الجدار حتى تتقشر السطوح، بينما يبقى الجص الجيري مسامياً يمتص الرطوبة ويطلقها بتوازن طبيعي مع تغير الطقس.',
        },
      },
      {
        heading: {
          en: 'The Slow Chemistry of Self-Healing Micro-Cracks',
          fa: 'شیمی آرام خودترمیمی ترک‌های مویی',
          ar: 'الكيمياء الهادئة لالتئام التشققات الدقيقة ذاتياً',
        },
        paragraph: {
          en: 'Unlike brittle Portland cement, air lime hardens by absorbing atmospheric carbon dioxide back into calcium carbonate. When hairline settlement fissures appear, trace moisture dissolves free lime inside the pore matrix and recrystallizes across the micro-gap automatically.',
          fa: 'برخلاف سیمان پرتلند شکننده، آهک هوایی با جذب دی‌اکسید کربن جو به کربنات کلسیم سخت می‌شود. هرگاه ترک‌های مویی نشست پدید آید، رطوبت اندک آهک آزاد درون بافت را حل کرده و شکاف ریز را به‌طور خودکار دوباره بلوری و ترمیم می‌کند.',
          ar: 'يتصلب الجير الهوائي بامتصاص ثاني أكسيد الكربون، وعند ظهور تشققات دقيقة تعمل الرطوبة على إعادة تبلور الجير الحر وإغلاق الشق تلقائياً.',
        },
      },
      {
        heading: {
          en: 'Optical Softness Under Grazing Sunlight',
          fa: 'لطافت نوری زیر تابش مایل آفتاب',
          ar: 'نعومة بصرية تحت أشعة الشمس المائلة',
        },
        paragraph: {
          en: 'Because mineral lime contains crystalline calcite grains rather than flat titanium latex, light refracts shallowly beneath the surface before returning to the eye. Rooms finished in lime glow softly even on overcast afternoons without harsh specular glare.',
          fa: 'از آنجا که آهک معدنی به‌جای لاتکس تخت حاوی دانه‌های بلوری کلسیت است، نور پیش از بازتاب به چشم در عمق میکرونی سطح می‌شکند. ازاین‌رو اتاق‌های اندودشده با آهک حتی در عصرهای ابری بدون خیرگی آزاردهنده درخششی مخملی دارند.',
          ar: 'بفضل بلورات الكالسيت الدقيقة في الجير المعدني، يتشتت الضوء بلطف داخل السطح مانحاً الغرف توهجاً دافئاً دون وهج حاد.',
        },
      },
      {
        heading: {
          en: 'Circular Maintenance Across Generations',
          fa: 'نگهداری چرخه‌پذیر در گذر نسل‌ها',
          ar: 'صيانة دائرية مستدامة عبر الأجيال',
        },
        paragraph: {
          en: 'Refreshing a lime wall twenty years later requires no toxic chemical strippers—only a single mineral limewash coat that bonds chemically to the existing substrate. Architecture ages gracefully when its skin matures like stone rather than peeling like packaging.',
          fa: 'نوسازی یک دیوار آهکی پس از بیست سال به هیچ رنگ‌بر شیمیایی نیاز ندارد؛ تنها یک دست دوغاب معدنی آهک با لایه زیرین پیوند شیمیایی برقرار می‌کند. معماری زمانی با وقار پیر می‌شود که پوسته‌اش مانند سنگ پخته شود نه مانند بسته‌بندی پوسته بیندازد.',
          ar: 'لا يحتاج تجديد الجدار الجيري بعد عشرين عاماً إلى مزيلات كيميائية، بل طبقة واحدة من غسول الجير تتحد كيميائياً مع السطح القائم ليشيخ المبنى بوقار.',
        },
      },
    ],
  },
  {
    slug: 'courtyard-microclimates-in-dense-tehran',
    categoryId: 'urban',
    title: {
      en: 'Pocket Courtyards: Carving Acoustic Sanctuaries Inside Dense Urban Blocks',
      fa: 'حیاط‌های جیبی: تراشیدن پناهگاه‌های آکوستیک در دل بلوک‌های متراکم شهری',
      ar: 'الأفنية الجيبية: نحت ملاذات صوتية داخل الكتل الحضرية الكثيفة',
    },
    excerpt: {
      en: 'How recessed mid-block voids and stepped green terraces reduce street traffic noise by eighteen decibels in metropolitan housing.',
      fa: 'چگونه فضاهای خالی میان‌بلوکی و تراس‌های سبز پلکانی صدای ترافیک خیابان را در مسکن کلان‌شهری تا هجده دسی‌بل کاهش می‌دهند.',
      ar: 'كيف تخفض الفراغات الوسطية والمدرجات الخضراء ضوضاء المرور بمقدار ثمانية عشر ديسيبل في الإسكان الحضري.',
    },
    monthLabel: { en: 'Jun', fa: 'خرداد', ar: 'يونيو' },
    dayNumber: '16',
    fullDate: {
      en: 'June 16, 2026',
      fa: '۲۶ خرداد ۱۴۰۵',
      ar: '١٦ يونيو ٢٠٢٦',
    },
    isoDate: '2026-06-16',
    readMinutes: 7,
    author: AUTHORS.mina,
    coverImage: '/images/projects/valiasr-hero.jpg',
    coverAlt: {
      en: 'Urban apartment facade stepping inward around a planted pocket courtyard',
      fa: 'نمای آپارتمان شهری با عقب‌نشینی پیرامون یک حیاط جیبی سبز',
      ar: 'واجهة سكنية حضرية تتراجع للداخل حول فناء جيبي مزروع',
    },
    coverCaption: {
      en: 'Acoustic buffer court inserted off a primary Tehran boulevard.',
      fa: 'حیاط میانگیر صوتی تعبیه‌شده در جوار یکی از بلوارهای اصلی تهران.',
      ar: 'فناء عازل للصوت أُدرج على مقربة من أحد الشوارع الرئيسية في طهران.',
    },
    sections: [
      {
        heading: {
          en: 'Reframing Setback Regulations as Civic Gifts',
          fa: 'بازخوانی ضوابط عقب‌نشینی به‌عنوان هدیه شهری',
          ar: 'إعادة قراءة ارتدادات البناء بوصفها هبة مدنية',
        },
        paragraph: {
          en: 'Conventional speculative apartments maximize floor-plate edges right up to the property line, trapping every bedroom against exhaust fumes and headlight glare. By shifting ten percent of the allowable footprint inward into a sculpted pocket court, every unit gains dual-aspect cross-ventilation and a calm green horizon.',
          fa: 'آپارتمان‌های متعارف سطح اشغال را تا آخرین سانتی‌متر مرز زمین پیش می‌برند و تمام اتاق‌ها را در معرض دود و نور خودروها قرار می‌دهند. با انتقال ده درصد از سطح زیربنا به درون یک حیاط جیبی تراش‌خورده، تمام واحدها از تهویه دوطرفه و افقی سبز و آرام بهره‌مند می‌شوند.',
          ar: 'بنقل عشرة في المائة من مساحة البناء نحو فناء داخلي منحوت، تحصل كل وحدة سكنية على تهوية متقاطعة وإطلالة خضراء هادئة بعيداً عن ضوضاء الشارع.',
        },
      },
      {
        heading: {
          en: 'Stepped Masonry Baffles for Sound Attenuation',
          fa: 'موانع بنایی پلکانی برای میراسازی صوت',
          ar: 'حواجز طوبية متدرجة لامتصاص الضوضاء',
        },
        paragraph: {
          en: 'Sound waves bounce ruthlessly between parallel glass facades. Introducing serrated brick piers, timber planters, and deep recessed loggias breaks specular reflection paths so street roar dissipates before reaching upper residential balconies.',
          fa: 'امواج صوتی میان نماهای شیشه‌ای موازی بی‌وقفه بازتاب می‌یابند. افزودن پایه‌های آجری دندانه‌دار، فلاورباکس‌های چوبی و ایوان‌های فرورفته مسیر بازتاب مستقیم صوت را می‌شکند و هیاهوی خیابان پیش از رسیدن به بالکن‌های مسکونی میرا می‌شود.',
          ar: 'يكسر تدرّج الدعائم الطوبية والشرفات الغائرة مسارات انعكاس الصوت، فيتبدد ضجيج الشارع قبل وصوله إلى الطوابق السكنية العليا.',
        },
      },
      {
        heading: {
          en: 'Shared Thresholds That Revive Neighborliness',
          fa: 'آستانه‌های مشترک برای احیای همسایگی',
          ar: 'عتبات مشتركة تُحيي روح الجيرة',
        },
        paragraph: {
          en: 'When elevator lobbies open directly onto sunlit courtyard bridges instead of fluorescent windowless corridors, casual morning greetings return effortlessly. Small communal benches beneath deciduous mulberry trees turn circulation space into an everyday neighborhood living room.',
          fa: 'هنگامی که لابی آسانسور به‌جای راهروی بی‌نور و فلورسنت، رو به پل‌های آفتاب‌گیر حیاط باز می‌شود، سلام‌های صبحگاهی همسایگان دوباره جان می‌گیرد. نیمکت‌های کوچک زیر سایه درختان توت، فضای حرکتی را به نشیمن روزمره همسایگی بدل می‌کنند.',
          ar: 'حين تنفتح ردهات المصاعد على جسور مشمسة مطلة على الفناء بدلاً من الممرات المغلقة، تعود التحية الصباحية الدافئة وتتحول الحركة اليومية إلى لقاء إنساني.',
        },
      },
      {
        heading: {
          en: 'Measurable Urban Heat-Island Relief',
          fa: 'کاهش ملموس جزیره گرمایی شهری',
          ar: 'تخفيف ملموس لظاهرة الجزيرة الحرارية الحضرية',
        },
        paragraph: {
          en: 'Surface thermography recorded across three summers showed courtyard pavements running eleven degrees cooler than adjacent asphalt streets. Multiplied across a city district, pocket courts act as distributed lungs cooling the broader metropolitan fabric.',
          fa: 'دمانگاری سطحی در طول سه تابستان نشان داد کف‌سازی حیاط‌ها یازده درجه خنک‌تر از آسفالت خیابان‌های مجاور باقی می‌ماند. تکثیر این حیاط‌های جیبی در مقیاس محله، همچون ریه‌های توزیع‌شده بافت کلان‌شهر را خنک می‌کند.',
          ar: 'أظهرت القياسات الحرارية على مدى ثلاثة فصول صيف انخفاض حرارة أرضيات الأفنية إحدى عشرة درجة مقارنة بالأسفلت المجاور، لتعمل كرئات تبريد موزعة في المدينة.',
        },
      },
    ],
  },
  {
    slug: 'mountain-topography-and-stone-anchoring',
    categoryId: 'sustainable',
    title: {
      en: 'Touching the Slope Lightly: Stepped Foundations in Mountain Terrain',
      fa: 'تماس لطیف با شیب: پی‌سازی پلکانی در بسترهای کوهستانی',
      ar: 'ملامسة المنحدر برفق: الأساسات المتدرجة في التضاريس الجبلية',
    },
    excerpt: {
      en: 'Designing hillside retreats in Lavasan that step with natural contours instead of dynamiting flat concrete pads.',
      fa: 'طراحی اقامتگاه‌های دامنه‌ای در لواسان همگام با خطوط تراز طبیعی زمین به‌جای تسطیح خشن و بتن‌ریزی گسترده.',
      ar: 'تصميم ملاذات جبلية في لواسان تتدرج مع خطوط الكنتور الطبيعية بدلاً من تسوية الأرض بالخرسانة.',
    },
    monthLabel: { en: 'May', fa: 'اردیبهشت', ar: 'مايو' },
    dayNumber: '29',
    fullDate: {
      en: 'May 29, 2026',
      fa: '۸ خرداد ۱۴۰۵',
      ar: '٢٩ مايو ٢٠٢٦',
    },
    isoDate: '2026-05-29',
    readMinutes: 6,
    author: AUTHORS.navid,
    coverImage: '/images/projects/lavasan-hero.jpg',
    coverAlt: {
      en: 'Stepped stone and timber mountain residence nestled along rocky alpine contours',
      fa: 'اقامتگاه کوهستانی سنگی و چوبی پلکانی هم‌نشین با شیب صخره‌ای دامنه',
      ar: 'مسكن جبلي متدرج من الحجر والخشب يحتضن تضاريس المنحدر الصخري',
    },
    coverCaption: {
      en: 'Excavated bedrock reused directly as dry-laid retaining courses in Lavasan.',
      fa: 'استفاده مستقیم از سنگ‌های حاصل از گودبرداری در دیوارهای حائل خشکه‌چین لواسان.',
      ar: 'إعادة استخدام الصخور المستخرجة من الموقع مباشرة في جدران استنادية جافة في لواسان.',
    },
    sections: [
      {
        heading: {
          en: 'Zero-Export Earthwork Balance',
          fa: 'توازن خاک‌برداری بدون خروج خاک از سایت',
          ar: 'توازن أعمال الحفر دون ترحيل التربة خارج الموقع',
        },
        paragraph: {
          en: 'Hillside construction routinely hauls hundreds of truckloads of excavated stone off-site only to import quarried cladding weeks later. By breaking floor plates into three modest split levels aligned with natural contour lines, we cut excavation volume by sixty percent and dress every retaining wall with stone recovered on site.',
          fa: 'ساخت‌وسازهای کوهستانی معمولاً صدها کامیون سنگ و خاک را از سایت خارج و هفته‌ها بعد سنگ نما وارد می‌کنند. با شکستن پلان به سه تراز نیم‌طبقه همگام با خطوط تراز طبیعی، حجم گودبرداری را شصت درصد کاهش دادیم و تمام دیوارهای حائل را با سنگ بومی همان سایت ساختیم.',
          ar: 'بتقسيم المسقط إلى ثلاثة مستويات متدرجة تواكب خطوط الكنتور الطبيعية، خفضنا حجم الحفر بنسبة ستين في المائة وأعدنا توظيف حجارة الموقع نفسها في الجدران.',
        },
      },
      {
        heading: {
          en: 'Preserving Seasonal Snowmelt Channels',
          fa: 'حفظ مسیرهای طبیعی آب‌شدن برف‌های فصلی',
          ar: 'الحفاظ على مجاري ذوبان الثلوج الموسمية',
        },
        paragraph: {
          en: 'Blocking natural mountain swales triggers hydrostatic pressure and soil erosion downstream. Lifting the central living bridge on slender stone piers lets spring snowmelt pass unobstructed beneath the house into terraced orchard cisterns.',
          fa: 'مسدودکردن آبراه‌های طبیعی کوهستان باعث فشار هیدرواستاتیک و فرسایش خاک در پایین‌دست می‌شود. بالا آوردن پل نشیمن مرکزی روی پایه‌های سنگی باریک اجازه می‌دهد رواناب برف بهاری بدون مانع از زیر خانه به آب‌انبارهای باغ پلکانی هدایت شود.',
          ar: 'يتيح رفع جسر المعيشة المركزي على دعائم حجرية نحيفة مرور مياه ذوبان الثلج الربيعي بحرية نحو صهاريج البساتين المتدرجة.',
        },
      },
      {
        heading: {
          en: 'Winter Solar Gain Through Clerestory Roof Monitors',
          fa: 'جذب خورشید زمستانی از طریق نورگیرهای سقفی',
          ar: 'اكتساب شمس الشتاء عبر المناور السقفية العلوية',
        },
        paragraph: {
          en: 'Steep northern slopes lose afternoon sun early in December. Sawtooth timber roof monitors tilt southward at thirty-two degrees, capturing low winter rays deep into earth-sheltered bedrooms while shielding summer zenith heat.',
          fa: 'دامنه‌های شمالی در آذرماه زودتر آفتاب بعدازظهر را از دست می‌دهند. نورگیرهای سقفی دندانه‌اره‌ای چوبی با شیب سی‌ودو درجه رو به جنوب، پرتوهای مایل زمستانی را تا عمق اتاق‌های نیمه‌مدفون هدایت می‌کنند.',
          ar: 'تلتقط المناور السقفية الخشبية المائلة جنوباً أشعة شمس الشتاء المنخفضة نحو الغرف المحمية بالتراب، مع حجب حرارة الصيف العمودية.',
        },
      },
      {
        heading: {
          en: 'Architecture That Disappears Into the Ridge',
          fa: 'معماری‌ای که در خط‌الراس محو می‌شود',
          ar: 'عمارة تذوب بهدوء في خط الأفق الجبلي',
        },
        paragraph: {
          en: 'Planted native thyme and fescue roofs stitch the building silhouette back into the surrounding mountainside. Viewed from across the valley, the house reads not as an alien white villa, but as a quiet geological outcrop.',
          fa: 'بام‌های پوشیده از آویشن و علف‌های بومی، سیلوئت بنا را دوباره به دامنه کوه پیوند می‌دهند؛ به‌گونه‌ای که از آن‌سوی دره، خانه نه ویلایی سفید و بیگانه، بلکه برون‌زد سنگی آرامی در دل طبیعت دیده می‌شود.',
          ar: 'تعيد الأسطح المزروعة بالنباتات الجبلية المحلية دمج كتلة المبنى في المنحدر، فيبدو من الوادي كتكوين صخري هادئ لا كجسم غريب.',
        },
      },
    ],
  },
  {
    slug: 'geometry-of-threshold-and-shadow',
    categoryId: 'theory',
    title: {
      en: 'In Praise of the Threshold: Designing the Five-Second Transition',
      fa: 'در ستایش آستانه: طراحی گذار پنج‌ثانیه‌ای از شهر به خانه',
      ar: 'في مديح العتبة: تصميم الانتقال الهادئ بين المدينة والبيت',
    },
    excerpt: {
      en: 'Why great architecture never dumps visitors straight from street to living room, and how compressed entryways calm human perception.',
      fa: 'چرا معماری اصیل هرگز بازدیدکننده را مستقیم از خیابان به نشیمن پرتاب نمی‌کند و چگونه ورودی‌های فشرده ادراک انسان را آرام می‌سازند.',
      ar: 'لماذا لا تنقل العمارة الأصيلة الزائر مباشرة من الشارع إلى غرفة المعيشة، وكيف تهدّئ المداخل الانتقالية الإدراك الإنساني.',
    },
    monthLabel: { en: 'May', fa: 'اردیبهشت', ar: 'مايو' },
    dayNumber: '11',
    fullDate: {
      en: 'May 11, 2026',
      fa: '۲۱ اردیبهشت ۱۴۰۵',
      ar: '١١ مايو ٢٠٢٦',
    },
    isoDate: '2026-05-11',
    readMinutes: 6,
    author: AUTHORS.dariush,
    coverImage: '/images/projects/cloister-hero.jpg',
    coverAlt: {
      en: 'Quiet recessed stone vestibule framing a bright sunlit courtyard beyond',
      fa: 'هشتی سنگی فرورفته و آرام با قابی رو به حیاط آفتاب‌گیر',
      ar: 'دهليز حجري غائر وهادئ يؤطّر فناءً مشمساً خلفه',
    },
    coverCaption: {
      en: 'Entry vestibule sequence calibrated for visual adaptation from bright noon glare.',
      fa: 'توالی هشتی ورودی تنظیم‌شده برای تطبیق چشم از تابش تند ظهر.',
      ar: 'تسلسل دهليز الدخول المضبوط لتكيّف العين عند الانتقال من وهج الظهيرة.',
    },
    sections: [
      {
        heading: {
          en: 'Visual Decompression Between Sun and Shade',
          fa: 'تعدیل بصری میان آفتاب تند و سایه آرام',
          ar: 'تهدئة بصرية بين وهج الشمس وظل الداخل',
        },
        paragraph: {
          en: 'Stepping directly from ninety-thousand-lux noon sunlight into a dimly lit foyer blinds the eye for several uncomfortable seconds. Historic Persian hashti vestibules solved this biologically: a half-lit stone recess pauses movement, adjusts pupil dilation, and lowers heart rate before revealing the inner sanctuary.',
          fa: 'ورود ناگهانی از تابش نود هزار لوکس آفتاب ظهر به فضایی کم‌نور، چشم را برای چند ثانیه دچار خیرگی می‌کند. هشتی‌های تاریخی ایران این مسئله را با درک دقیق فیزیولوژیک حل کرده بودند: مکثی کوتاه در فضای نیمه‌روشن سنگی، تطبیق مردمک چشم و کاهش ضربان قلب پیش از گشوده‌شدن پناهگاه درونی.',
          ar: 'حلّت دهاليز الهشتي التاريخية صدمة الانتقال المفاجئ من شمس الظهيرة إلى الظل عبر وقفة مكانية نصف مضاءة تهيئ البصر وتهدئ الإيقاع الداخلي.',
        },
      },
      {
        heading: {
          en: 'The Oblique Turn and Spatial Privacy',
          fa: 'چرخش مایل و حریم فضایی',
          ar: 'الالتفاف المائل وخصوصية الفراغ',
        },
        paragraph: {
          en: 'A ninety-degree bend inside the threshold protects domestic intimacy without hostile walls or frosted decals. Guests glimpse a slice of water or foliage ahead, drawn inward by curiosity rather than abrupt exposure.',
          fa: 'یک چرخش نود درجه‌ای در دل آستانه، حریم خانه را بدون دیوارهای خشن یا شیشه‌های مات حفظ می‌کند. مهمان برشی از آب یا شاخ‌وبرگ را در پیش رو می‌بیند و با کنجکاوی آرام به درون فراخوانده می‌شود.',
          ar: 'يحمي الانعطاف بزاوية قائمة خصوصية البيت دون حواجز قاسية، إذ يلمح الضيف شريحة من الضوء أو الماء تقوده بلطف نحو الداخل.',
        },
      },
      {
        heading: {
          en: 'Tactile Grounding Underfoot',
          fa: 'تغییر بافت زیر پا به‌عنوان نشانه گذار',
          ar: 'تغيّر ملمس الأرضية كعلامة حسية للانتقال',
        },
        paragraph: {
          en: 'Shifting from rough bush-hammered granite at the street curb to honed limestone pavers inside the porch communicates arrival through the soles of one’s shoes. Sound softens simultaneously as footsteps pass under a cedar timber soffit.',
          fa: 'تغییر کف‌سازی از گرانیت تیشه‌ای زبر در لبه خیابان به سنگ آهک صیقلی در ایوان ورودی، حس رسیدن را از طریق کف پا منتقل می‌کند؛ و همزمان با ورود زیر سقف چوب سدر، طنین قدم‌ها آرام و مخملی می‌شود.',
          ar: 'يعلن تغيّر الأرضية من الجرانيت الخشن إلى الحجر الجيري المصقول لحظة الوصول عبر الإحساس تحت القدمين مع هدوء صدى الخطوات تحت السقف الخشبي.',
        },
      },
      {
        heading: {
          en: 'Holding Space for Arrival and Farewell',
          fa: 'نگه‌داشتن فضا برای خوشامد و بدرقه',
          ar: 'احتضان لحظات الاستقبال والوداع',
        },
        paragraph: {
          en: 'When real-estate spreadsheets delete entry porches as "unproductive square meters," houses lose the very room where coats are shed, umbrellas drip, and friends linger for one final conversation. Generous thresholds are never wasted—they hold the emotional hinge of daily life.',
          fa: 'هنگامی که جداول سودآوری بسازوبفروش ایوان ورودی را به‌عنوان «مترمربع غیرمفید» حذف می‌کنند، خانه دقیقاً فضایی را از دست می‌دهد که در آن پالتوها آویخته می‌شود و دوستان برای آخرین گفت‌وگو مکث می‌کنند. آستانه‌های سخاوتمندانه هرگز هدررفت فضا نیستند؛ آن‌ها لولای عاطفی زندگی روزمره‌اند.',
          ar: 'حين تُلغى شرفات الدخول بحجة توفير المساحة، تفقد البيوت المسرح اليومي للاستقبال والوداع؛ فالعتبة السخية هي المفصل العاطفي للعمارة.',
        },
      },
    ],
  },
  {
    slug: 'brick-vaults-and-contemporary-shells',
    categoryId: 'materials',
    title: {
      en: 'Compression Poetry: Unreinforced Brick Vaults in Contemporary Studios',
      fa: 'شعر فشار: طاق‌های آجری بدون آرماتور در استودیوهای معاصر',
      ar: 'شعرية الانضغاط: الأقبية الطوبية غير المسلحة في الاستوديوهات المعاصرة',
    },
    excerpt: {
      en: 'Combining parametric catenary curves with hand-laid local kiln bricks to span eight-meter galleries with minimal steel.',
      fa: 'ترکیب منحنی‌های زنجیره‌ای پارامتریک با آجرهای کوره محلی برای پوشاندن دهانه‌های هشت‌متری با حداقل مصرف فولاد.',
      ar: 'الجمع بين المنحنيات البارامترية والطوب المحلي اليدوي لتغطية فضاءات عرضها ثمانية أمتار بأقل قدر من الفولاذ.',
    },
    monthLabel: { en: 'Apr', fa: 'فروردین', ar: 'أبريل' },
    dayNumber: '24',
    fullDate: {
      en: 'April 24, 2026',
      fa: '۴ اردیبهشت ۱۴۰۵',
      ar: '٢٤ أبريل ٢٠٢٦',
    },
    isoDate: '2026-04-24',
    readMinutes: 7,
    author: AUTHORS.sara,
    coverImage: '/images/projects/isfahan-hero.jpg',
    coverAlt: {
      en: 'Graceful catenary brick vault spanning a luminous minimalist cultural hall',
      fa: 'طاق آجری زنجیره‌ای ظریف بر فراز تالار فرهنگی مینیمال و روشن',
      ar: 'قبو طوبي انسيابي يغطي قاعة ثقافية مضيئة وبسيطة',
    },
    coverCaption: {
      en: 'Hand-laid buff kiln brick rib vaulting spanning an Isfahan craft gallery.',
      fa: 'طاق دنده‌ای با آجر قزاقی دست‌چین بر فراز گالری صنایع‌دستی در اصفهان.',
      ar: 'قبو طوبي مضلّع مرصوف يدوياً فوق صالة حرفية في أصفهان.',
    },
    sections: [
      {
        heading: {
          en: 'Form Follows Pure Compression',
          fa: 'فرم پیرو فشار خالص',
          ar: 'الشكل يتبع الانضغاط الصافي',
        },
        paragraph: {
          en: 'Flat concrete slabs fight gravity through tension steel and massive embodied carbon. By computing thrust lines digitally before laying a single brick, modern compression vaults achieve slim fourteen-centimeter shell thicknesses that carry roof loads effortlessly through pure geometry.',
          fa: 'دال‌های تخت بتنی با تکیه بر میلگرد کششی و کربن نهفته سنگین با گرانش می‌جنگند. با محاسبه دقیق خطوط رانش پیش از چیدن نخستین آجر، طاق‌های فشاری معاصر با ضخامت ظریف چهارده سانتی‌متر بار بام را صرفاً از طریق هندسه خالص منتقل می‌کنند.',
          ar: 'بحساب خطوط الدفع رقمياً قبل وضع أول طوبة، تحقق الأقبية الانضغاطية المعاصرة سماكة رشيقة تبلغ أربعة عشر سنتيمتراً تحمل الأوزان بالهندسة الصافية.',
        },
      },
      {
        heading: {
          en: 'Digital Templates Meet Master Masons',
          fa: 'الگوهای دیجیتال در دستان استادکاران بنا',
          ar: 'القوالب الرقمية في أيدي البنّائين المهرة',
        },
        paragraph: {
          en: 'Rather than replacing traditional masons with robots, we cut reusable CNC plywood guide ribs that snap into place in two hours. Master bricklayers then lay herringbone courses freehand using fast-setting gypsum mortar, merging ancestral skill with millimeter precision.',
          fa: 'به‌جای جایگزینی بنایان سنتی با ربات، قالب‌های راهنمای چندلایه برش‌خورده با CNC می‌سازیم که ظرف دو ساعت نصب می‌شوند. سپس استادکاران آجرچین رگ‌های جناغی را با ملات گچ زودگیر اجرا می‌کنند و مهارت نیاکان با دقت میلی‌متری پیوند می‌خورد.',
          ar: 'بدلاً من استبدال الحرفيين، نستخدم أضلاع توجيه خشبية دقيقة تتيح للبنّائين رصف الطوب يدوياً بمهارة تقليدية ودقة مليمترية.',
        },
      },
      {
        heading: {
          en: 'Acoustic Warmth Beneath Curved Ceilings',
          fa: 'گرمای آکوستیک زیر سقف‌های منحنی',
          ar: 'دفء صوتي تحت الأسقف المقوسة',
        },
        paragraph: {
          en: 'Open mortar joints and subtle brick surface porosity scatter high-frequency speech reflections naturally. Combined with shallow rib undulations, vaulted exhibition rooms eliminate flutter echo without suspended fiberglass tiles.',
          fa: 'بندکشی‌های فرورفته و تخلخل طبیعی آجر، بازتاب‌های فرکانس بالای گفتار را به‌طور طبیعی پخش می‌کنند و سالن‌های نمایشگاهی طاق‌دار بدون نیاز به تایل‌های آکوستیک کاذب از پژواک آزاردهنده رها می‌شوند.',
          ar: 'تعمل مسامية الطوب والفواصل الغائرة على تشتيت الانعكاسات الصوتية الحادة، فتتخلص القاعات المقوسة من الصدى دون أسقف مستعارة.',
        },
      },
      {
        heading: {
          en: 'Local Kilns, Local Economies',
          fa: 'کوره‌های بومی، اقتصادهای بومی',
          ar: 'أفران محلية واقتصاد محلي مستدام',
        },
        paragraph: {
          en: 'Sourcing clay bricks within forty kilometers of the construction site keeps eighty percent of structural expenditure inside regional workshops while slashing freight emissions—proving that low-carbon beauty is also socially restorative.',
          fa: 'تأمین آجر از شعاع چهل کیلومتری کارگاه، هشتاد درصد هزینه سازه را در کارگاه‌های بومی منطقه حفظ و آلایندگی حمل‌ونقل را به‌شدت کاهش می‌دهد؛ گواهی بر اینکه زیبایی کم‌کربن از نظر اجتماعی نیز ترمیم‌گر است.',
          ar: 'يبقي الاعتماد على الأفران القريبة ثمانين في المائة من تكلفة الهيكل داخل الاقتصاد المحلي ويخفض انبعاثات النقل بشكل جذري.',
        },
      },
    ],
  },
  {
    slug: 'adaptive-reuse-of-midcentury-warehouses',
    categoryId: 'urban',
    title: {
      en: 'Second Lives: Turning Mid-Century Brick Warehouses Into Public Studios',
      fa: 'زیست دوم: تبدیل انبارهای آجری میان‌سده به استودیوهای عمومی',
      ar: 'حياة ثانية: تحويل المستودعات الطوبية إلى استوديوهات ثقافية عامة',
    },
    excerpt: {
      en: 'Why the greenest building is the one already standing, and how surgical timber insertions unlock civic vibrancy.',
      fa: 'چرا سبزترین ساختمان همان بنایی است که هم‌اکنون پابرجاست و چگونه الحاقات چوبی جراحی‌شده حیات مدنی را بیدار می‌کنند.',
      ar: 'لماذا يُعد المبنى القائم أكثر المباني استدامة، وكيف تُحيي التدخلات الخشبية الدقيقة الفضاء المدني.',
    },
    monthLabel: { en: 'Apr', fa: 'فروردین', ar: 'أبريل' },
    dayNumber: '08',
    fullDate: {
      en: 'April 8, 2026',
      fa: '۱۹ فروردین ۱۴۰۵',
      ar: '٨ أبريل ٢٠٢٦',
    },
    isoDate: '2026-04-08',
    readMinutes: 6,
    author: AUTHORS.mina,
    coverImage: '/images/projects/arcade-hero.jpg',
    coverAlt: {
      en: 'Restored brick industrial hall with inserted timber mezzanine and sunlit reading bays',
      fa: 'سالن صنعتی آجری مرمت‌شده با نیم‌طبقه چوبی و فضاهای مطالعه نورگیر',
      ar: 'قاعة صناعية طوبية مرممة مع ميزانين خشبي حديث ومساحات قراءة مشمسة',
    },
    coverCaption: {
      en: 'Reversible birch mezzanine floating clear of historic load-bearing masonry walls.',
      fa: 'نیم‌طبقه چوبی برگشت‌پذیر با فاصله ظریف از دیوارهای آجری باربر تاریخی.',
      ar: 'ميزانين خشبي قابل للفك يطفو بمسافة دقيقة عن الجدران الطوبية التاريخية.',
    },
    sections: [
      {
        heading: {
          en: 'Honoring Embodied Carbon and Cultural Memory',
          fa: 'پاسداشت کربن نهفته و حافظه فرهنگی',
          ar: 'احترام الكربون المجسّد والذاكرة الثقافية',
        },
        paragraph: {
          en: 'Demolishing a structurally sound 1960s masonry warehouse discards decades of embodied energy and erases neighborhood continuity. Preserving the weathered brick shell immediately saves hundreds of tons of CO2 before a single new fixture is installed.',
          fa: 'تخریب یک انبار آجری سالم دهه چهل، دهه‌ها انرژی نهفته را هدر می‌دهد و پیوستگی حافظه محله را پاک می‌کند. حفظ پوسته آجری فرسوده‌نما پیش از نصب حتی یک تجهیز جدید، صدها تن دی‌اکسید کربن را صرفه‌جویی می‌کند.',
          ar: 'يهدر هدم مستودع طوبي متين عقوداً من الطاقة المجسدة ويمحو ذاكرة الحي، بينما يوفر الإبقاء على هيكله مئات الأطنان من الانبعاثات.',
        },
      },
      {
        heading: {
          en: 'Reversible Box-in-Box Timber Insertions',
          fa: 'الحاقات چوبی برگشت‌پذیر جعبه در جعبه',
          ar: 'تدخلات خشبية عكسية بنظام الصندوق داخل الصندوق',
        },
        paragraph: {
          en: 'Instead of chasing electrical conduits into historic brickwork, we insert freestanding cross-laminated timber pavilions set sixty centimeters inside the outer walls. The interstitial gap circulates warm air evenly while letting visitors read old and new layers with complete honesty.',
          fa: 'به‌جای شیارزدن در دیوارهای آجری تاریخی برای لوله‌کشی، پاویون‌های مستقل چوبی با فاصله شصت سانتی‌متر درون پوسته اصلی قرار می‌دهیم. فضای میانی هم هوا را یکنواخت به گردش درمی‌آورد و هم خوانایی صادقانه لایه کهن و نو را حفظ می‌کند.',
          ar: 'بدلاً من تكسير الطوب التاريخي للتمديدات، نُدرج أجنحة خشبية مستقلة تبعد ستين سنتيمتراً عن الجدران لتسمح بقراءة القديم والجديد بصدق تام.',
        },
      },
      {
        heading: {
          en: 'Carving Skylight Lanterns Through Sawtooth Roofs',
          fa: 'گشودن فانوس‌های نورگیر در بام‌های دندانه‌اره‌ای',
          ar: 'فتح مناور ضوئية عبر الأسقف الصناعية المسننة',
        },
        paragraph: {
          en: 'Industrial trusses were built to deliver shadow-free north light to factory floors—the exact illumination coveted by bookshops, design ateliers, and community galleries. Replacing corrugated asbestos sheets with triple-glazed north monitors revives luminous spaciousness effortlessly.',
          fa: 'خرپاهای صنعتی برای رساندن نور یکنواخت شمالی به کف کارگاه ساخته شده بودند؛ دقیقاً همان نوری که کتاب‌فروشی‌ها، آتلیه‌های طراحی و گالری‌های محلی به آن نیاز دارند. جایگزینی ورق‌های فرسوده با نورگیرهای سه‌جداره شمالی، روشنایی بی‌نظیری را زنده می‌کند.',
          ar: 'صُممت الجملونات الصناعية لجلب ضوء الشمال المتجانس، وبإعادة تزجيجها بزجاج ثلاثي عازل تستعيد القاعات إشراقها المثالي للاستوديوهات والمكتبات.',
        },
      },
      {
        heading: {
          en: 'Opening Blind Alley Walls to Pedestrian Life',
          fa: 'گشودن دیوارهای کور به روی زندگی پیاده',
          ar: 'فتح الجدران الصماء أمام حركة المشاة',
        },
        paragraph: {
          en: 'Punching three arched timber doorways along a previously blank service alley turns a forgotten back street into an active cultural passage linking cafés, print workshops, and neighborhood seating.',
          fa: 'گشودن سه درگاه چوبی قوسی در امتداد کوچه‌ای که پیش‌تر دیواری کور داشت، پس‌کوچه‌ای فراموش‌شده را به گذرگاهی زنده و فرهنگی پیونددهنده کافه‌ها، کارگاه‌های چاپ و نشیمن‌های محلی بدل می‌کند.',
          ar: 'يحوّل فتح ثلاثة مداخل خشبية مقوسة على طول جدار أصمّ سابقاً زقاقاً منسياً إلى ممر ثقافي حي نابض بالحياة.',
        },
      },
    ],
  },
  {
    slug: 'rainwater-gardens-and-permeable-plazas',
    categoryId: 'sustainable',
    title: {
      en: 'Sponge Courtyards: Harvesting Winter Rain Beneath Permeable Stone',
      fa: 'حیاط‌های اسفنجی: استحصال باران زمستانی در زیر سنگ‌فرش‌های نفوذپذیر',
      ar: 'الأفنية الإسفنجية: حصاد أمطار الشتاء تحت الأحجار النفاذة',
    },
    excerpt: {
      en: 'Replacing impermeable concrete drives with gravel-jointed limestone slabs and buried cisterns that irrigate gardens year-round.',
      fa: 'جایگزینی مسیرهای بتنی نفوذناپذیر با اسلب‌های آهکی بندباز و آب‌انبارهای زیرسطحی برای آبیاری سالانه باغچه‌ها.',
      ar: 'استبدال الممرات الخرسانية الصماء بألواح حجرية نفاذة وصهاريج تحت أرضية لري الحدائق طوال العام.',
    },
    monthLabel: { en: 'Mar', fa: 'اسفند', ar: 'مارس' },
    dayNumber: '20',
    fullDate: {
      en: 'March 20, 2026',
      fa: '۲۹ اسفند ۱۴۰۴',
      ar: '٢٠ مارس ٢٠٢٦',
    },
    isoDate: '2026-03-20',
    readMinutes: 6,
    author: AUTHORS.dariush,
    coverImage: '/images/projects/shiraz-courtyard-hero.jpg',
    coverAlt: {
      en: 'Permeable limestone courtyard paving bordered by drought-adapted cypress and citrus trees',
      fa: 'کف‌سازی سنگ آهک نفوذپذیر حیاط در کنار درختان سرو و نارنج مقاوم به کم‌آبی',
      ar: 'بلاط حجر جيري نفاذ في فناء محاط بأشجار السرو والنارنج المقاومة للجفاف',
    },
    coverCaption: {
      en: 'Open-joint Shiraz limestone slabs draining directly into sub-base pebble beds.',
      fa: 'اسلب‌های سنگ آهک شیراز با بند باز متصل به بستر قلوه‌سنگی زیرسطحی.',
      ar: 'ألواح حجر شيراز بفواصل مفتوحة تصرف المياه مباشرة نحو طبقة الحصى التحتية.',
    },
    sections: [
      {
        heading: {
          en: 'Treating Every Raindrop as Architectural Gold',
          fa: 'نگاه به هر قطره باران به‌عنوان طلای معماری',
          ar: 'التعامل مع كل قطرة مطر كثروة معمارية',
        },
        paragraph: {
          en: 'Semi-arid cities receive their entire annual rainfall in a handful of intense winter storms, yet sealed yards rush ninety percent of that precious water straight into municipal storm drains. Designing every roof scupper and stone joint as part of a closed hydrological circuit keeps rainwater exactly where roots need it.',
          fa: 'شهرهای نیمه‌خشک کل بارش سالانه خود را در چند بارندگی شدید زمستانی دریافت می‌کنند، اما حیاط‌های آب‌بندی‌شده نود درصد این آب ارزشمند را به جوی خیابان می‌ریزند. طراحی تمام ناودان‌ها و بندهای سنگ به‌صورت یک مدار هیدرولوژیک بسته، باران را درست در اختیار ریشه‌ها نگه می‌دارد.',
          ar: 'تستقبل المدن شبه الجافة أمطارها في عواصف محدودة، لذا يضمن تصميم المزاريب وفواصل الحجر كدائرة مائية مغلقة حفظ كل قطرة داخل تربة الموقع.',
        },
      },
      {
        heading: {
          en: 'Gravel-Bed Permeable Stone Paving',
          fa: 'سنگ‌فرش نفوذپذیر روی بستر شن و قلوه‌سنگ',
          ar: 'تبليط حجري نفاذ فوق فرشة من الحصى المتدرج',
        },
        paragraph: {
          en: 'Laying six-centimeter limestone slabs over graded crushed aggregate with twelve-millimeter basalt-chip joints eliminates mortar cracking, resists freeze-thaw cycles, and absorbs heavy cloudbursts without puddles.',
          fa: 'چیدن اسلب‌های شش‌سانتی‌متری سنگ آهک روی بستر سنگ‌دانه درجه‌بندی‌شده با بندهای دوازده‌میلی‌متری پرشده از خرده‌بازالت، هم ترک‌خوردگی ملات را حذف می‌کند و هم رگبارهای شدید را بدون جمع‌شدن آب جذب می‌نماید.',
          ar: 'يمنع وضع الألواح الحجرية فوق طبقات حصى متدرجة بفواصل مملوءة بفتات البازلت تشقق المونة ويمتص الأمطار الغزيرة دون برك مائية.',
        },
      },
      {
        heading: {
          en: 'Buried Cisterns Beneath Entry Terraces',
          fa: 'آب‌انبارهای مدفون در زیر تراس‌های ورودی',
          ar: 'صهاريج مدفونة أسفل شرفات الدخول',
        },
        paragraph: {
          en: 'A twelve-cubic-meter underground retention tank tucked beneath the arrival terrace stores filtered roof runoff at constant earth temperature, sustaining drip irrigation for olive, pomegranate, and rosemary plantings throughout July and August.',
          fa: 'مخزن ذخیره دوازده مترمکعبی مدفون زیر تراس ورودی، رواناب تصفیه‌شده بام را در دمای ثابت زمین نگه می‌دارد و آبیاری قطره‌ای درختان زیتون، انار و رزماری را در اوج تیر و مرداد تأمین می‌کند.',
          ar: 'يخزّن الخزان المدفون أسفل الشرفة مياه الأسطح المرشحة في حرارة الأرض الثابتة ليغذي الري بالتنقيط طوال أشهر الصيف الحارة.',
        },
      },
      {
        heading: {
          en: 'Seasonal Choreography of Water Sound',
          fa: 'طراحی ریتم فصلی صدای آب',
          ar: 'تصميم الإيقاع الموسمي لصوت الماء',
        },
        paragraph: {
          en: 'During winter storms, visible carved stone runnels guide rainwater musically from roof spouts into settling basins before vanishing underground—celebrating rain as a cherished seasonal event rather than an engineering nuisance.',
          fa: 'در بارندگی‌های زمستانی، جوی‌های تراش‌خورده سنگی آب باران را با نغمه دلنشین از ناودان‌ها به حوضچه ته‌نشینی و سپس مخزن زیرزمینی هدایت می‌کنند و باران را به‌عنوان رخدادی ستودنی جشن می‌گیرند.',
          ar: 'توجّه القنوات الحجرية المنحوتة مياه الأمطار الشتوية بإيقاع موسيقي ظاهر قبل اختفائها في الصهريج، احتفاءً بالمطر كحدث موسمي بهيج.',
        },
      },
    ],
  },
  {
    slug: 'proportion-and-human-scale-in-civic-plazas',
    categoryId: 'theory',
    title: {
      en: 'Why Intimate Plazas Succeed Where Monumental Squares Feel Empty',
      fa: 'چرا میدان‌های صمیمی زنده می‌مانند و میدان‌های عظیم خالی می‌افتند',
      ar: 'لماذا تنجح الساحات الحميمة بينما تبدو الميادين الضخمة خاوية',
    },
    excerpt: {
      en: 'Measuring sightlines, enclosure ratios, and seated edge conditions that invite strangers to linger comfortably.',
      fa: 'سنجش خطوط دید، نسبت‌های محصوریت و لبه‌های نشستنی که شهروندان را بی‌تکلف به مکث و حضور دعوت می‌کنند.',
      ar: 'قياس خطوط الرؤية ونسب الاحتواء وحواف الجلوس التي تدعو العابرين للتمهل والبقاء بألفة.',
    },
    monthLabel: { en: 'Mar', fa: 'اسفند', ar: 'مارس' },
    dayNumber: '03',
    fullDate: {
      en: 'March 3, 2026',
      fa: '۱۲ اسفند ۱۴۰۴',
      ar: '٣ مارس ٢٠٢٦',
    },
    isoDate: '2026-03-03',
    readMinutes: 6,
    author: AUTHORS.mina,
    coverImage: '/images/projects/laleh-hero.jpg',
    coverAlt: {
      en: 'Human-scaled shaded stone plaza bordered by low seating ledges and mature trees',
      fa: 'میدانچه سنگی با مقیاس انسانی، لبه‌های نشستن کوتاه و درختان تنومند سایه‌ساز',
      ar: 'ساحة حجرية بمقياس إنساني محاطة بمصاطب جلوس منخفضة وأشجار وارفة',
    },
    coverCaption: {
      en: 'Enclosure ratio of 1:2.5 calibrated to preserve facial recognition across the court.',
      fa: 'نسبت محصوریت یک به دو و نیم تنظیم‌شده برای حفظ خوانایی چهره‌ها در عرض میدانچه.',
      ar: 'نسبة احتواء مضبوطة تحفظ القدرة على تمييز الوجوه عبر الفضاء العام.',
    },
    sections: [
      {
        heading: {
          en: 'The Twenty-Five-Meter Facial Recognition Horizon',
          fa: 'افق بیست‌وپنج‌متری شناخت چهره انسان',
          ar: 'أفق الخمسة والعشرين متراً لتمييز الوجوه',
        },
        paragraph: {
          en: 'Urban psychologists have long observed that human beings recognize expressions and gestures comfortably up to twenty-five meters. Vast hundred-meter stone aprons dissolve social warmth into exposed wind tunnels, whereas twenty-to-thirty-meter rooms feel immediately legible and welcoming.',
          fa: 'روان‌شناسان شهری سال‌هاست نشان داده‌اند که انسان تا فاصله بیست‌وپنج متر حالت چهره و ایماهای دیگران را به‌راحتی درک می‌کند. پهنه‌های سنگی صد‌متری صمیمیت اجتماعی را به تونل باد بدل می‌کنند، در حالی که میدانچه‌های بیست تا سی‌متری فوراً خوانا و دعوت‌کننده‌اند.',
          ar: 'يميز الإنسان تعابير الوجوه بارتياح حتى مسافة خمسة وعشرين متراً؛ لذا تمنح الساحات الحميمة دفئاً اجتماعياً فورياً عكس الساحات العملاقة المكشوفة.',
        },
      },
      {
        heading: {
          en: 'The Power of Secondary Seating Edges',
          fa: 'قدرت لبه‌های نشستن ثانویه',
          ar: 'قوة حواف الجلوس الثانوية',
        },
        paragraph: {
          en: 'Formal park benches sit stiffly like waiting-room chairs, yet forty-five-centimeter planter walls, broad stair risers, and low limestone plinths invite spontaneous gatherings of two or ten people alike without dictating posture.',
          fa: 'نیمکت‌های رسمی پارک گاه همچون صندلی اتاق انتظار خشک به نظر می‌رسند، اما لبه‌های چهل‌وپنج‌سانتی‌متری باغچه‌ها، پله‌های پهن و سکوهای سنگی کوتاه بدون تحمیل حالت نشستن، پذیرای جمع‌های دونفره یا ده‌نفره می‌شوند.',
          ar: 'تتفوق جدران الأحواض المنخفضة والدرجات العريضة على المقاعد التقليدية لأنها تستوعب الجلوس العفوي للأفراد والمجموعات دون تكلف.',
        },
      },
      {
        heading: {
          en: 'Active Ground-Floor Transparency',
          fa: 'شفافیت فعال طبقه همکف',
          ar: 'شفافية الطابق الأرضي النشط',
        },
        paragraph: {
          en: 'A plaza is only as alive as the edges enclosing it. Replacing blank parking grilles with bookshops, tea counters, and craft windows casts warm interior light outward after dusk, ensuring effortless natural safety.',
          fa: 'یک میدان به اندازه لبه‌های پیرامونی‌اش زنده است. جایگزینی نرده‌های کور پارکینگ با کتاب‌فروشی، چای‌خانه و ویترین کارگاه‌های هنری، پس از غروب نوری گرم به بیرون می‌تاباند و امنیت طبیعی و بی‌تکلفی می‌آفریند.',
          ar: 'تنبض الساحة بحيوية حوافها؛ فاستبدال الجدران الصماء بالمكتبات والمقاهي الصغيرة يبث نوراً دافئاً مساءً ويصنع أماناً اجتماعياً طبيعياً.',
        },
      },
      {
        heading: {
          en: 'Choreographing Sun Pockets Across Seasons',
          fa: 'چیدمان جیب‌های آفتاب و سایه در فصل‌های سال',
          ar: 'توزيع جيوب الشمس والظل عبر الفصول',
        },
        paragraph: {
          en: 'By pairing evergreen shade colonnades on the western side with deciduous plane trees on the south, the plaza offers crisp morning warmth in February and deep canopy shelter throughout August afternoons.',
          fa: 'با ترکیب رواق سایه‌ساز در ضلع غربی و درختان چنار برگ‌ریز در جنوب، میدانچه در صبح‌های سرد بهمن آفتابی دلپذیر و در بعدازظهرهای داغ مرداد سایه‌ای عمیق فراهم می‌آورد.',
          ar: 'بالمزاوجة بين الأروقة المظللة غرباً والأشجار المتساقطة جنوباً، تمنح الساحة دفئاً شتوياً صباحاً وظلاً عميقاً في ظهيرة الصيف.',
        },
      },
    ],
  },
  {
    slug: 'charred-cedar-and-weathered-timber-facades',
    categoryId: 'materials',
    title: {
      en: 'Fire-Tempered Timber: Weathering Behaviour of Charred Cedar Cladding',
      fa: 'چوب آبدیده با آتش: رفتار اقلیمی نماهای سدر سوزانده‌شده',
      ar: 'خشب مقسّى بالنار: سلوك التجوية في واجهات الأرز المتفحم',
    },
    excerpt: {
      en: 'Testing traditional surface charring against ultraviolet radiation, alpine snow loads, and dry plateau winds over five years.',
      fa: 'آزمون پنج‌ساله روش سنتی سوزاندن سطحی چوب در برابر پرتو فرابنفش، برف کوهستانی و بادهای خشک فلات.',
      ar: 'اختبار تقنية التفحيم السطحي التقليدية على مدى خمس سنوات ضد الأشعة فوق البنفسجية وثلوج الجبال والرياح الجافة.',
    },
    monthLabel: { en: 'Feb', fa: 'بهمن', ar: 'فبراير' },
    dayNumber: '17',
    fullDate: {
      en: 'February 17, 2026',
      fa: '۲۸ بهمن ۱۴۰۴',
      ar: '١٧ فبراير ٢٠٢٦',
    },
    isoDate: '2026-02-17',
    readMinutes: 6,
    author: AUTHORS.navid,
    coverImage: '/images/projects/lavasan-detail-1.jpg',
    coverAlt: {
      en: 'Close architectural detail of brushed charred timber slats beside rough mountain limestone',
      fa: 'جزئیات معماری از لمبه‌های چوب سوزانده‌شده برس‌خورده در کنار سنگ آهک کوهستانی',
      ar: 'تفصيل معماري لألواح الخشب المتفحم المصقول بجوار الحجر الجيري الجبلي',
    },
    coverCaption: {
      en: 'Brushed carbonized larch louvers paired with concealed stainless clips.',
      fa: 'لوورهای چوب کاج کربنیزه‌شده و برس‌خورده با بست‌های مخفی استیل.',
      ar: 'شرائح خشب متفحم ومصقول بالفرشاة مثبتة بمشابك فولاذية مخفية.',
    },
    sections: [
      {
        heading: {
          en: 'Carbon Layer as Natural Armor',
          fa: 'لایه کربنی به‌عنوان زره طبیعی',
          ar: 'طبقة الكربون كدرع طبيعي',
        },
        paragraph: {
          en: 'Controlled surface charring seals timber tracheids in a dense carbon skin that resists fungal decay, boring insects, and UV graying without synthetic petro-varnishes. When wire-brushed and sealed with cold-pressed tung oil, the grain reveals deep velvety charcoal striations.',
          fa: 'سوزاندن کنترل‌شده سطح چوب، منافذ آن را با پوسته‌ای متراکم از کربن می‌بندد که بدون نیاز به لاک‌های پتروشیمیایی در برابر پوسیدگی قارچی، حشرات و خاکستری‌شدن فرابنفش مقاوم است. پس از برس‌زدن و پوشش با روغن تانگ سرد، رگه‌های چوب بافتی مخملی و ذغالی می‌یابند.',
          ar: 'يغلق التفحيم السطحي المنضبط مسام الخشب بدرع كربوني مقاوم للفطريات والأشعة دون ورنيشات صناعية، ويكشف بعد التنظيف بالفرشاة عن تعريقات فحمية مخملية.',
        },
      },
      {
        heading: {
          en: 'Ventilated Rainscreen Cavities Behind Every Board',
          fa: 'حفره تهویه باران‌گیر در پشت تمام تخته‌ها',
          ar: 'فراغ تهوية خلفي خلف كل لوح خشبي',
        },
        paragraph: {
          en: 'Timber durability depends as much on detailing as species selection. Mounting charred boards over thirty-millimeter ventilated battens with beveled drip edges ensures air circulates behind every plank so moisture dries within minutes after rain.',
          fa: 'دوام چوب به همان اندازه که به گونه درخت وابسته است به جزئیات اجرایی نیز بستگی دارد. نصب تخته‌ها روی زیرسازی سی‌میلی‌متری دارای جریان هوا و لبه‌های آبچکان پخ‌خورده باعث می‌شود رطوبت دقایقی پس از باران خشک شود.',
          ar: 'يضمن تثبيت الألواح فوق عوارض تهوية بعمق ثلاثين مليمتراً مع حواف تقطير مائلة جفاف الرطوبة خلال دقائق بعد المطر.',
        },
      },
      {
        heading: {
          en: 'Visual Dialogue With Pale Mineral Stone',
          fa: 'گفت‌وگوی بصری با سنگ‌های معدنی روشن',
          ar: 'حوار بصري مع الحجر المعدني الفاتح',
        },
        paragraph: {
          en: 'Set alongside warm travertine or pale buff limestone, brushed charred cedar recedes quietly into mountain shadow, preventing upper stories from towering aggressively over wooded valleys.',
          fa: 'در همنشینی با تراورتن گرم یا سنگ آهک روشن، سدر سوزانده‌شده به آرامی در سایه کوهستان فرو می‌نشیند و مانع می‌شود طبقات بالایی بر دره‌های پردرخت سنگینی کنند.',
          ar: 'بجوار الترافرتين الدافئ والحجر الفاتح، ينسحب الأرز المتفحم بهدوء في ظلال الجبل ليخفف الحضور الكتلي للطوابق العليا.',
        },
      },
      {
        heading: {
          en: 'Silver Patina Across Five-Year Field Exposure',
          fa: 'پتینه نقره‌ای در گذر پنج سال آزمون میدانی',
          ar: 'تعتيق فضي جميل بعد خمس سنوات من التعرض المناخي',
        },
        paragraph: {
          en: 'South-facing test panels slowly soften from jet black to graphite silver while shaded soffits retain deep ink tones—turning the building envelope into an honest seasonal clock of sun exposure.',
          fa: 'پنل‌های آزمایشی رو به جنوب به آرامی از سیاه پرکلاغی به نقره‌ای گرافیتی نرم می‌شوند در حالی که زیرسقف‌های سایه‌دار لحن جوهری عمیق خود را حفظ می‌کنند و نما به ساعتی صادق از تابش خورشید بدل می‌شود.',
          ar: 'تتحول الألواح المواجهة للجنوب تدريجياً إلى رمادي جرافيتي ناعم بينما تحفظ الأجزاء المظللة سوادها العميق لتسجّل الواجهة أثر الشمس بصدق.',
        },
      },
    ],
  },
  {
    slug: 'daylight-calibration-in-art-galleries',
    categoryId: 'theory',
    title: {
      en: 'Sculpting North Light: Daylight Louvers for Contemporary Art Spaces',
      fa: 'تراشیدن نور شمال: لوورهای نور روز برای فضاهای هنر معاصر',
      ar: 'نحت ضوء الشمال: كاسرات النور الطبيعي لصالات الفن المعاصر',
    },
    excerpt: {
      en: 'How angled plaster light-scoops filter harsh solar beams into museum-grade shadowless illumination without artificial fixtures.',
      fa: 'چگونه نورگیرهای گچی زاویه‌دار پرتوهای تند خورشید را بی‌نیاز از چراغ مصنوعی به روشنایی بی‌سایه و موزه‌ای تبدیل می‌کنند.',
      ar: 'كيف تحوّل الملاقف الضوئية الجصية أشعة الشمس القوية إلى إضاءة متحفية ناعمة خالية من الظلال دون إنارة صناعية.',
    },
    monthLabel: { en: 'Feb', fa: 'بهمن', ar: 'فبراير' },
    dayNumber: '02',
    fullDate: {
      en: 'February 2, 2026',
      fa: '۱۳ بهمن ۱۴۰۴',
      ar: '٢ فبراير ٢٠٢٦',
    },
    isoDate: '2026-02-02',
    readMinutes: 7,
    author: AUTHORS.dariush,
    coverImage: '/images/projects/fereshteh-hero.jpg',
    coverAlt: {
      en: 'Minimalist gallery wall washed evenly in diffused overhead north daylight',
      fa: 'دیوار گالری مینیمال شسته‌شده با نور یکنواخت و ملایم شمالی از سقف',
      ar: 'جدار صالة فنية بسيطة يغمره ضوء الشمال المنتشر بنعومة من الأعلى',
    },
    coverCaption: {
      en: 'Curved lime-plaster light baffles washing gallery walls at 220 lux.',
      fa: 'موانع نوری منحنی با اندود آهک برای شست‌وشوی یکنواخت دیوار گالری در ۲۲۰ لوکس.',
      ar: 'حواجز ضوئية منحنية من الجص تغمر جدران الصالة بإضاءة متوازنة تبلغ ٢٢٠ لوكس.',
    },
    sections: [
      {
        heading: {
          en: 'Why White-Cube Spotlights Exhaust the Eye',
          fa: 'چرا نورافکن‌های مکعب سفید چشم را خسته می‌کنند',
          ar: 'لماذا ترهق الكشافات الصناعية العين في المعارض',
        },
        paragraph: {
          en: 'Windowless galleries lit solely by track LEDs sever viewers from the passing day, producing visual fatigue within twenty minutes. Subtle fluctuations in natural sky luminance keep the eye fresh and make pigments, oil brushstrokes, and stone grain appear genuinely alive.',
          fa: 'گالری‌های بی‌روزن که صرفاً با چراغ‌های ریلی روشن می‌شوند، مخاطب را از گذر روز جدا کرده و ظرف بیست دقیقه خستگی بصری می‌آورند. نوسان‌های ظریف نور طبیعی آسمان چشم را تازه نگه می‌دارد و رنگدانه‌ها و بافت سنگ را زنده جلوه می‌دهد.',
          ar: 'تفصل الصالات المغلقة المعتمدة على الإضاءة الصناعية الزائر عن إيقاع النهار وتُجهد البصر، بينما يُبقي التدرج الطبيعي للضوء الألوان والخامات حية.',
        },
      },
      {
        heading: {
          en: 'Double-Bounce Plaster Baffles',
          fa: 'بازتاب دوگانه بر تیغه‌های گچی',
          ar: 'الارتداد المزدوج عبر الحواجز الجصية',
        },
        paragraph: {
          en: 'Direct sun beams never touch artwork. Instead, roof monitors direct zenith light onto matte lime-plaster reflectors that bounce illumination twice before washing exhibition walls evenly from cornice to baseboard.',
          fa: 'پرتو مستقیم آفتاب هرگز به اثر هنری نمی‌تابد؛ بلکه نورگیرهای سقفی نور را بر بازتابنده‌های گچی مات می‌تابانند تا پس از دو بازتاب نرم، دیوار نمایشگاه از سقف تا قرنیز یکنواخت روشن شود.',
          ar: 'لا يلامس الضوء المباشر الأعمال الفنية مطلقاً، بل يرتد مرتين عبر أسطح جصية مطفية ليغمر الجدران بتجانس تام من الأعلى إلى الأسفل.',
        },
      },
      {
        heading: {
          en: 'Calibrating Ultraviolet Filtration Invisibly',
          fa: 'فیلتراسیون نامرئی پرتو فرابنفش',
          ar: 'الترشيح غير المرئي للأشعة فوق البنفسجية',
        },
        paragraph: {
          en: 'Laminated low-iron museum glass removes 99.6 percent of ultraviolet wavelengths while maintaining a color rendering index of 99—preserving fragile works on paper without green-tinted glazing distortion.',
          fa: 'شیشه‌های لمینت کم‌آهن موزه‌ای ۹۹.۶ درصد پرتوهای فرابنفش را حذف می‌کنند و شاخص نمود رنگ ۹۹ را حفظ می‌نمایند تا آثار حساس روی کاغذ بدون تغییر رنگ سبز شیشه ایمن بمانند.',
          ar: 'يزيل الزجاج المتحفي منخفض الحديد تقريباً كامل الأشعة فوق البنفسجية مع الحفاظ على دقة ألوان كاملة تحمي الأعمال الورقية الحساسة.',
        },
      },
      {
        heading: {
          en: 'Seamless Dusk Dimming',
          fa: 'تلفیق نامحسوس در گرگ‌ومیش عصر',
          ar: 'تدرّج سلس للإضاءة عند الغسق',
        },
        paragraph: {
          en: 'Tunable warm linear grazing fixtures concealed inside the same plaster scoop awaken gradually as twilight deepens, matching the sky’s shifting Kelvin temperature so visitors barely notice when electricity takes over from sunlight.',
          fa: 'چراغ‌های خطی مخفی درون همان شیارهای گچی با فرارسیدن غروب به آرامی روشن می‌شوند و دمای رنگ خود را با آسمان عصر هماهنگ می‌کنند تا مخاطب لحظه گذار از نور خورشید به نور مصنوعی را حس نکند.',
          ar: 'تستيقظ وحدات الإضاءة الخطية المخفية داخل نفس التجويف الجصي تدريجياً مع الغسق متوافقة مع درجة حرارة السماء دون انتقال مفاجئ.',
        },
      },
    ],
  },
  {
    slug: 'terrazzo-and-recycled-quarry-offcuts',
    categoryId: 'materials',
    title: {
      en: 'Quarry Alchemy: Casting Monolithic Terrazzo From Stone Offcuts',
      fa: 'کیمیای معدن: ریخته‌گری ترازوی یکپارچه با ضایعات سنگ‌بری',
      ar: 'كيمياء المحاجر: صبّ الترازو المتجانس من بقايا قطع الحجر',
    },
    excerpt: {
      en: 'Turning discarded local travertine, basalt, and green marble chips into seamless hand-honed gallery floors.',
      fa: 'تبدیل خرده‌سنگ‌های دورریز تراورتن، بازالت و مرمر سبز محلی به کف‌سازی‌های یکپارچه و دست‌ساب گالری‌ها.',
      ar: 'تحويل شظايا الترافرتين والبازلت والرخام الأخضر المهدرة إلى أرضيات صالات متجانسة ومصقولة يدوياً.',
    },
    monthLabel: { en: 'Jan', fa: 'دی', ar: 'يناير' },
    dayNumber: '19',
    fullDate: {
      en: 'January 19, 2026',
      fa: '۲۹ دی ۱۴۰۴',
      ar: '١٩ يناير ٢٠٢٦',
    },
    isoDate: '2026-01-19',
    readMinutes: 6,
    author: AUTHORS.sara,
    coverImage: '/images/projects/kashan-detail-1.jpg',
    coverAlt: {
      en: 'Honed mineral terrazzo floor embedded with warm travertine and olive marble fragments',
      fa: 'کف ترازوی معدنی مات با دانه‌های تراورتن گرم و مرمر زیتونی',
      ar: 'أرضية ترازو معدنية مصقولة تتناثر فيها شظايا الترافرتين الدافئ والرخام الزيتوني',
    },
    coverCaption: {
      en: 'In-situ lime-pozzolan terrazzo seeded with 65% reclaimed quarry offcuts.',
      fa: 'ترازوی درجا با چسباننده آهک-پوزولان و ۶۵ درصد سنگ‌دانه بازیافتی از معادن محلی.',
      ar: 'ترازو مصبوب في الموقع بنسبة ٦٥٪ من بقايا المحاجر المحلية المعاد تدويرها.',
    },
    sections: [
      {
        heading: {
          en: 'Rescuing Thirty Percent of Quarry Waste',
          fa: 'نجات سی درصد ضایعات کارخانه‌های سنگ‌بری',
          ar: 'إنقاذ ثلاثين في المائة من هدر المحاجر',
        },
        paragraph: {
          en: 'Nearly a third of quarried stone ends up shattered into scrap heaps behind cutting yards. Crushing and sieving those luminous marble and limestone remnants into graded aggregates transforms industrial waste into bespoke geological tapestries underfoot.',
          fa: 'نزدیک به یک‌سوم سنگ‌های استخراج‌شده در پشت کارخانه‌های سنگ‌بری به تل ضایعات تبدیل می‌شود. خردایش و دانه‌بندی همین باقی‌مانده‌های مرمر و سنگ آهک، پسماند صنعتی را به فرشی زمین‌شناختی و یگانه زیر پا تبدیل می‌کند.',
          ar: 'يتحول نحو ثلث إنتاج المحاجر إلى بقايا مكسرة، وبغربلتها وصبّها كمجاميع متدرجة تتحول النفايات الصناعية إلى سجاد حجري متفرد تحت الأقدام.',
        },
      },
      {
        heading: {
          en: 'Brass Divider Strips as Expansion Poetry',
          fa: 'نوارهای برنجی به‌مثابه شعر درز انبساط',
          ar: 'شرائط النحاس كشعرية لفواصل التمدد',
        },
        paragraph: {
          en: 'Two-millimeter unlacquered brass strips divide large floor pours into calm structural bays aligned with wall mullions and door jambs. Rather than hiding movement joints, the brass grid turns thermal control into quiet architectural drawing.',
          fa: 'نوارهای برنجی دومیل‌متری بدون لاک، سطوح گسترده کف را هم‌راستا با قاب درها و ستون‌ها تقسیم‌بندی می‌کنند و درز انبساط را از یک ضرورت فنی به ترسیمی آرام و معماری بدل می‌سازند.',
          ar: 'تقسم شرائط النحاس الرفيعة المساحات المصبوبة بمحاذاة الأعمدة والأبواب، محوّلة فواصل التمدد الحراري إلى رسم معماري هادئ.',
        },
      },
      {
        heading: {
          en: 'Matte Honing Over Mirror Polish',
          fa: 'ساب مات به‌جای جلای آینه‌ای',
          ar: 'الصقل المطفي بدلاً من اللمعان المفرط',
        },
        paragraph: {
          en: 'We stop diamond grinding at 400 grit rather than buffing to a glossy sheen. Matte terrazzo diffuses daylight softly, provides safe wet slip-resistance, and reveals crisp mineral textures without reflecting ceiling fixtures distractingly.',
          fa: 'ساب الماسه را در درجه ۴۰۰ متوقف می‌کنیم تا سطح به‌جای درخشش آینه‌ای، حالتی مات و ابریشمی بیابد. ترازوی مات نور را نرم پخش می‌کند، در رطوبت لغزنده نیست و بافت سنگ را بی‌مزاحمت بازتاب چراغ‌ها آشکار می‌سازد.',
          ar: 'يمنح الصقل المطفي توزيعاً ناعماً للضوء ومقاومة آمنة للانزلاق ويكشف تفاصيل الحجر دون انعكاسات مزعجة لمصابيح السقف.',
        },
      },
      {
        heading: {
          en: 'Centuries of Repairable Service Life',
          fa: 'قرن‌ها عمر مفید و قابلیت نوسازی',
          ar: 'قرون من العمر الافتراضي القابل للتجديد',
        },
        paragraph: {
          en: 'Unlike laminated vinyl or thin porcelain tiles that end in landfills after one renovation, a three-centimeter mineral terrazzo floor can be lightly re-honed every thirty years to emerge spotless for a century or more.',
          fa: 'برخلاف کف‌پوش‌های لمینت یا سرامیک‌های نازک که در نخستین بازسازی به نخاله تبدیل می‌شوند، یک کف ترازوی معدنی سه‌سانتی‌متری را می‌توان هر سی سال با یک ساب سطحی برای بیش از یک قرن نو و درخشان نگه داشت.',
          ar: 'بخلاف الأرضيات الصناعية التي تُرمى عند أول تجديد، يمكن إعادة صقل الترازو المعدني كل ثلاثين عاماً ليدوم أكثر من قرن.',
        },
      },
    ],
  },
  {
    slug: 'transit-oriented-mixed-use-spines',
    categoryId: 'urban',
    title: {
      en: 'Fifteen-Minute Corridors: Designing Walkable Mixed-Use Spines',
      fa: 'کریدورهای پانزده‌دقیقه‌ای: طراحی محورهای مختلط پیاده‌محور',
      ar: 'ممرات الخمس عشرة دقيقة: تصميم محاور حضرية مختلطة للمشاة',
    },
    excerpt: {
      en: 'Weaving neighborhood clinics, co-working libraries, and mid-rise apartments along shaded transit boulevards.',
      fa: 'بافتن درمانگاه‌های محلی، کتابخانه‌های کار اشتراکی و آپارتمان‌های میان‌مرتبه در امتداد بلوارهای سایه‌دار حمل‌ونقل عمومی.',
      ar: 'نسج العيادات المحلية ومكتبات العمل المشترك والشقق متوسطة الارتفاع على طول محاور النقل العام المظللة.',
    },
    monthLabel: { en: 'Jan', fa: 'دی', ar: 'يناير' },
    dayNumber: '06',
    fullDate: {
      en: 'January 6, 2026',
      fa: '۱۶ دی ۱۴۰۴',
      ar: '٦ يناير ٢٠٢٦',
    },
    isoDate: '2026-01-06',
    readMinutes: 7,
    author: AUTHORS.mina,
    coverImage: '/images/projects/arcade-detail-1.jpg',
    coverAlt: {
      en: 'Shaded mixed-use urban colonnade connecting ground-floor studios with upper terraced apartments',
      fa: 'رواق مختلط شهری سایه‌دار متصل‌کننده کارگاه‌های همکف به آپارتمان‌های تراس‌دار بالا',
      ar: 'رواق حضري مختلط مظلل يربط استوديوهات الطابق الأرضي بالشقق ذات التراسات العليا',
    },
    coverCaption: {
      en: 'Continuous 4.2-meter arcade unifying retail fronts and metro entrances.',
      fa: 'رواق پیوسته با عرض چهار متر و بیست‌سانتی‌متر پیونددهنده واحدهای تجاری و ورودی مترو.',
      ar: 'رواق متواصل بعرض أربعة أمتار وعشرين سنتيمتراً يوحّد الواجهات التجارية ومداخل المترو.',
    },
    sections: [
      {
        heading: {
          en: 'Ending Single-Use Bedroom Suburbs',
          fa: 'پایان دادن به خوابگاه‌های تک‌عملکردی حاشیه شهر',
          ar: 'إنهاء الضواحي السكنية أحادية الاستخدام',
        },
        paragraph: {
          en: 'Rigid zoning that separates housing from workshops and grocers forces millions of daily automobile trips. Layering quiet residential tiers above active civic ground floors restores the spontaneous convenience of historic bazaar quarters.',
          fa: 'پهنه‌بندی خشک که مسکن را از کارگاه‌ها و فروشگاه‌های روزمره جدا می‌کند، میلیون‌ها سفر خودرویی تحمیلی می‌سازد. لایه‌بندی طبقات مسکونی آرام بر فراز همکف‌های زنده شهری، آسایش بی‌تکلف بافت‌های تاریخی بازار را احیا می‌کند.',
          ar: 'يعيد تراكب الطوابق السكنية الهادئة فوق طوابق أرضية نشطة للمدينة سهولة الوصول اليومي التي عرفتها الأحياء التاريخية.',
        },
      },
      {
        heading: {
          en: 'Acoustic Separation Between Street and Residence',
          fa: 'جداسازی آکوستیک میان خیابان و مسکن',
          ar: 'الفصل الصوتي بين الشارع والمسكن',
        },
        paragraph: {
          en: 'Inserting a double-height studio mezzanine between ground-level cafés and third-floor apartments absorbs street vibrancy while providing flexible ateliers for architects, tailors, and neighborhood educators.',
          fa: 'قرار دادن یک طبقه میانی کارگاهی میان کافه‌های همکف و آپارتمان‌های طبقه سوم، هیاهوی خیابان را جذب می‌کند و همزمان فضاهایی منعطف برای معماران، خیاطان و مربیان محلی فراهم می‌سازد.',
          ar: 'يعمل طابق الميزانين الحرفي كحاجز صوتي بين مقاهي الأرضي والشقق العليا، مع توفير مساحات مرنة للاستوديوهات المحلية.',
        },
      },
      {
        heading: {
          en: 'Direct Canopy Links to Metro Thresholds',
          fa: 'اتصال مستقیم سایه‌بان به آستانه مترو',
          ar: 'روابط مظللة مباشرة بمداخل المترو',
        },
        paragraph: {
          en: 'Public transit adoption rises dramatically when the final three hundred meters feel shaded, safe, and dignified. Continuous stone arcades turn daily commutes from endurance tests into pleasant rituals.',
          fa: 'استقبال از حمل‌ونقل عمومی زمانی جهش می‌یابد که سیصد متر پایانی مسیر سایه‌دار، ایمن و باوقار باشد. رواق‌های پیوسته سنگی رفت‌وآمد روزانه را از آزمون طاقت‌فرسا به عادتی دلپذیر تبدیل می‌کنند.',
          ar: 'يرتفع الإقبال على النقل العام حين تكون الأمتار الأخيرة مظللة وآمنة وممتعة للمشي عبر أروقة حجرية متواصلة.',
        },
      },
      {
        heading: {
          en: 'Micro-Logistics Hidden Behind Service Courts',
          fa: 'ساماندهی تدارکات خرد در حیاط‌های خدماتی',
          ar: 'تنظيم الخدمات اللوجستية داخل أفنية خلفية',
        },
        paragraph: {
          en: 'Consolidating delivery bays and waste sorting inside recessed rear courts keeps sidewalks completely clear for strollers, bicycles, and older residents strolling after dinner.',
          fa: 'متمرکزکردن بارگیری و تفکیک پسماند در حیاط‌های خدماتی پشتی، پیاده‌روها را کاملاً برای کالسکه‌ها، دوچرخه‌ها و قدم‌زدن سالمندان پس از شام آزاد و ایمن نگه می‌دارد.',
          ar: 'يبقي تجميع مناطق التحميل والخدمات في أفنية خلفية الأرصفة حرة وآمنة لعربات الأطفال والدراجات والمشاة.',
        },
      },
    ],
  },
  {
    slug: 'solar-geometry-and-deep-window-reveals',
    categoryId: 'sustainable',
    title: {
      en: 'Thick Walls Return: Deep Window Reveals as Passive Sun Breakers',
      fa: 'بازگشت دیوارهای ضخیم: قاب‌های عمیق پنجره به‌عنوان سایه‌بان غیرفعال',
      ar: 'عودة الجدران السميكة: فتحات النوافذ العميقة ككاسرات شمس سلبية',
    },
    excerpt: {
      en: 'Why thirty-five-centimeter insulated masonry reveals outperform flush curtain-wall glazing in every continental season.',
      fa: 'چرا قاب‌های بنایی عایق با عمق سی‌وپنج سانتی‌متر در تمام فصول اقلیم قاره‌ای از نماهای شیشه‌ای تخت کارآمدترند.',
      ar: 'لماذا تتفوق فتحات الجدران المعزولة بعمق خمسة وثلاثين سنتيمتراً على الواجهات الزجاجية المسطحة في جميع الفصول.',
    },
    monthLabel: { en: 'Dec', fa: 'آذر', ar: 'ديسمبر' },
    dayNumber: '18',
    fullDate: {
      en: 'December 18, 2025',
      fa: '۲۷ آذر ۱۴۰۴',
      ar: '١٨ ديسمبر ٢٠٢٥',
    },
    isoDate: '2025-12-18',
    readMinutes: 6,
    author: AUTHORS.dariush,
    coverImage: '/images/projects/yazd-detail-1.jpg',
    coverAlt: {
      en: 'Deeply recessed stone window reveal casting crisp diagonal afternoon shadow across plaster',
      fa: 'قاب پنجره سنگی عمیق با سایه مورب و تیز بعدازظهر روی دیوار گچی',
      ar: 'تجويف نافذة حجري عميق يلقي بظل مائل حاد على الجدار الجصي',
    },
    coverCaption: {
      en: '42cm splayed reveal softening luminance contrast between sky and interior wall.',
      fa: 'قاب پخ‌خورده به عمق ۴۲ سانتی‌متر برای تعدیل کنتراست نوری میان آسمان و دیوار داخل.',
      ar: 'تجويف مائل بعمق ٤٢ سنتيمتراً يخفف التباين الضوئي بين السماء والجدار الداخلي.',
    },
    sections: [
      {
        heading: {
          en: 'The Glare Penalty of Paper-Thin Facades',
          fa: 'جریمه خیرگی در نماهای کاغذی‌ضخامت',
          ar: 'ثمن الوهج في الواجهات الرقيقة المسطحة',
        },
        paragraph: {
          en: 'Flush glass curtain walls expose glazing to punishing high-angle summer radiation while forcing inhabitants to pull blackout blinds shut by ten in the morning. Recessed masonry reveals shield glass naturally with zero moving motors.',
          fa: 'نماهای شیشه‌ای تخت، شیشه را بی‌دفاع در برابر تابش تند تابستان رها می‌کنند و ساکنان را ناچار به کشیدن پرده‌های ضخیم از ساعت ده صبح می‌سازند. قاب‌های عمیق بنایی بدون هیچ موتور متحرکی به‌طور طبیعی بر شیشه سایه می‌اندازند.',
          ar: 'تُعرض الواجهات الزجاجية المسطحة الداخل لإشعاع الصيف الحاد، بينما تحجب الفتحات العميقة الشمس العالية طبيعياً دون أنظمة ميكانيكية.',
        },
      },
      {
        heading: {
          en: 'Splayed Jambs for Graduated Luminance',
          fa: 'پخ‌کردن لبه‌های قاب برای گرادیان نوری نرم',
          ar: 'تدرج الإضاءة عبر الحواف الداخلية المائلة',
        },
        paragraph: {
          en: 'Angling the inner plaster reveal at thirty degrees creates a luminous halo bridging bright exterior sky and quieter room walls. Rooms feel noticeably brighter even with smaller, more energy-efficient glass apertures.',
          fa: 'شیب‌دادن سی‌درجه‌ای به لبه داخلی قاب گچی، هاله‌ای روشن میان آسمان پرنور بیرون و دیوار آرام اتاق می‌سازد؛ به‌طوری که اتاق حتی با پنجره‌های کوچک‌تر و کم‌اتلاف‌تر، روشن‌تر و دل‌بازتر احساس می‌شود.',
          ar: 'يخلق ميلان الجدار الداخلي للنافذة هالة ضوئية متدرجة تجعل الغرفة أكثر إشراقاً حتى مع فتحات زجاجية أصغر وأكثر كفاءة في الطاقة.',
        },
      },
      {
        heading: {
          en: 'Inhabitable Window Sills as Micro-Rooms',
          fa: 'تاقچه‌های عمیق پنجره به‌مثابه خُردفضاهای زیست‌پذیر',
          ar: 'عتبات النوافذ العميقة كفراغات صغيرة للجلوس',
        },
        paragraph: {
          en: 'A forty-centimeter oak sill transforms a flat wall opening into a reading bench, tea ledge, and botanical perch. Thickness gives architecture both climatic stamina and poetic utility.',
          fa: 'یک تاقچه بلوط چهل‌سانتی‌متری، بازشویی تخت را به نیمکت مطالعه، لبه چای و جایگاه گلدان تبدیل می‌کند. ضخامت همزمان به معماری تاب‌آوری اقلیمی و کاربری شاعرانه می‌بخشد.',
          ar: 'تحوّل عتبة البلوط العريضة الفتحة الجدارية إلى مقعد قراءة وحافة شاعرية تجمع بين الكفاءة المناخية والألفة اليومية.',
        },
      },
      {
        heading: {
          en: 'Sculptural Depth Across the City Streetscape',
          fa: 'عمق مجسمه‌وار در سیمای خیابان شهر',
          ar: 'عمق نحتي حيّ في المشهد الحضري للشارع',
        },
        paragraph: {
          en: 'Deeply punched elevations register every hour of the day through shifting geometric shadows, replacing flat reflective monotony with authentic architectural permanence.',
          fa: 'نماهای عمیق و حفرشده هر ساعت روز را با سایه‌های هندسی متغیر ثبت می‌کنند و به‌جای یکنواختی آینه‌ای و تخت، ماندگاری اصیل معماری را به شهر بازمی‌گردانند.',
          ar: 'تسجّل الواجهات العميقة ساعات النهار بظلال هندسية متغيرة، فتستبدل رتابة الزجاج المسطح بحضور معماري راسخ.',
        },
      },
    ],
  },
  {
    slug: 'acoustic-timber-slats-and-felt-liners',
    categoryId: 'materials',
    title: {
      en: 'Quiet Timber Ceilings: Acoustic Detailing for Open Living Volumes',
      fa: 'سقف‌های چوبی آرام: جزئیات آکوستیک در فضاهای نشیمن یکپارچه',
      ar: 'أسقف خشبية هادئة: تفاصيل العزل الصوتي في المساحات المفتوحة',
    },
    excerpt: {
      en: 'Tuning slat spacing, wool-felt backing, and shadow reveals to absorb reverberation in double-height minimalist rooms.',
      fa: 'تنظیم فاصله لمبه‌ها، لایه نمد پشمی پشت و شیارهای سایه برای جذب پژواک در فضاهای مینیمال دوبلکس.',
      ar: 'ضبط تباعد الشرائح الخشبية وبطانة اللباد الصوفي لامتصاص الصدى في الصالات البسيطة مزدوجة الارتفاع.',
    },
    monthLabel: { en: 'Dec', fa: 'آذر', ar: 'ديسمبر' },
    dayNumber: '04',
    fullDate: {
      en: 'December 4, 2025',
      fa: '۱۳ آذر ۱۴۰۴',
      ar: '٤ ديسمبر ٢٠٢٥',
    },
    isoDate: '2025-12-04',
    readMinutes: 6,
    author: AUTHORS.navid,
    coverImage: '/images/projects/shiraz-courtyard-1.jpg',
    coverAlt: {
      en: 'Precision spaced oak ceiling slats over a serene minimalist double-height lounge',
      fa: 'لمبه‌های چوب بلوط با فواصل دقیق بر سقف نشیمن دوبلکس آرام و مینیمال',
      ar: 'شرائح سقف من خشب البلوط بتباعد دقيق فوق صالة هادئة مزدوجة الارتفاع',
    },
    coverCaption: {
      en: 'Solid ash battens over 24mm recycled sheep-wool acoustic blanket.',
      fa: 'لمبه‌های چوب زبان‌گنجشک روی لایه ۲۴ میلی‌متری نمد پشم طبیعی.',
      ar: 'شرائح خشب الدردار فوق بطانة صوتية من صوف الأغنام الطبيعي.',
    },
    sections: [
      {
        heading: {
          en: 'The Hidden Acoustic Flaw of Minimalist Lofts',
          fa: 'نقص آکوستیک پنهان در فضاهای مینیمال بلند',
          ar: 'العيب الصوتي الخفي في الفراغات المفتوحة البسيطة',
        },
        paragraph: {
          en: 'Stone floors, crisp plaster walls, and floor-to-ceiling windows photograph serenely yet often sound like railway concourses during dinner conversation. Treating the ceiling plane as an invisible acoustic sponge preserves visual purity while cutting reverberation time from 1.9 seconds down to a soothing 0.55 seconds.',
          fa: 'کف‌های سنگی، دیوارهای گچی صاف و پنجره‌های قدی در عکس بسیار آرام به نظر می‌رسند اما هنگام گفت‌وگو گاه مانند سالن ایستگاه قطار پژواک دارند. تبدیل صفحه سقف به یک اسفنج آکوستیک نامرئی، خلوص بصری را حفظ و زمان واخنش را از ۱.۹ ثانیه به ۰.۵۵ ثانیه آرامش‌بخش کاهش می‌دهد.',
          ar: 'تبدو الأرضيات الحجرية والجدران الملساء هادئة بصرياً لكنها تضخم الصدى، وبجعل السقف إسفنجة صوتية خفية ينخفض زمن الارتداد إلى مستوى مريح للحوار.',
        },
      },
      {
        heading: {
          en: 'Open-Area Ratios and Helmholtz Tuning',
          fa: 'نسبت سطح باز و کوک فرکانس گفتار',
          ar: 'نسب الفتحات وضبط ترددات الحديث البشري',
        },
        paragraph: {
          en: 'Leaving eighteen-millimeter shadow gaps between thirty-two-millimeter ash slats creates a thirty-six percent open area tuned precisely to human vocal frequencies between 500 Hz and 2 kHz, where dinner-table clatter and speech overlap.',
          fa: 'درنظرگرفتن شکاف هجده‌میلی‌متری میان لمبه‌های سی‌ودومیلی‌متری چوب، سطح باز سی‌وشش‌درصدی می‌آفریند که دقیقاً روی فرکانس گفتار انسان میان ۵۰۰ تا ۲۰۰۰ هرتز تنظیم شده است.',
          ar: 'يوفر ترك فواصل دقيقة بين الشرائح الخشبية نسبة انفتاح مضبوطة لامتصاص ترددات الصوت البشري وضجيج المائدة.',
        },
      },
      {
        heading: {
          en: 'Natural Sheep-Wool Backing Without Synthetic Off-Gassing',
          fa: 'لایه پشتی پشم طبیعی بدون گازهای شیمیایی',
          ar: 'بطانة صوف طبيعي خالية من الانبعاثات الكيميائية',
        },
        paragraph: {
          en: 'Instead of mineral rockwool or petroleum foam, we line ceiling plenums with dark felted regional sheep wool. It absorbs mid-frequency sound effortlessly, regulates indoor humidity passively, and remains completely biodegradable.',
          fa: 'به‌جای پشم سنگ یا فوم‌های نفتی، پشت سقف را با نمد پشم طبیعی تیره پوشش می‌دهیم که ضمن جذب عالی فرکانس‌های میانی، رطوبت داخلی را تعدیل می‌کند و کاملاً زیست‌تخریب‌پذیر است.',
          ar: 'نستخدم اللباد الصوفي الطبيعي بدلاً من الرغوات البترولية لامتصاص الصوت وتنظيم الرطوبة الداخلية بمادة قابلة للتحلل تماماً.',
        },
      },
      {
        heading: {
          en: 'Concealing Air Diffusers Inside Continuous Shadow Lines',
          fa: 'پنهان‌کردن دریچه‌های هوا در امتداد خطوط سایه',
          ar: 'إخفاء مخارج الهواء داخل خطوط الظل المستمرة',
        },
        paragraph: {
          en: 'Linear ventilation slots, micro-pinhole downlights, and smoke sensors align seamlessly within the eighteen-millimeter slat channels—banishing visual ceiling clutter for good.',
          fa: 'دریچه‌های خطی تهویه، چراغ‌های ریز نقطه‌ای و سنسورها همگی دقیقاً در امتداد همان شکاف‌های هجده‌میلی‌متری پنهان می‌شوند تا سقف برای همیشه از شلوغی بصری پاک بماند.',
          ar: 'تندمج فتحات التكييف الخطية ووحدات الإنارة الدقيقة داخل قنوات الشرائح نفسها، فيبقى السقف نقياً خالياً من التشويش البصري.',
        },
      },
    ],
  },
  {
    slug: 'memory-and-patina-in-architectural-time',
    categoryId: 'theory',
    title: {
      en: 'Architecture That Welcomes Age: Designing for Twenty-Year Patina',
      fa: 'معماری‌ای که به زمان خوشامد می‌گوید: طراحی برای پتینه بیست‌ساله',
      ar: 'عمارة ترحّب بالزمن: التصميم لتعتيق جميل بعد عشرين عاماً',
    },
    excerpt: {
      en: 'Choosing materials that deepen in warmth through touch, weather, and footsteps rather than looking ruined after the first scratch.',
      fa: 'انتخاب مصالحی که با لمس دست، باران و گذر قدم‌ها عمیق‌تر و گرم‌تر می‌شوند به‌جای آنکه با نخستین خط‌وخش کهنه به نظر برسند.',
      ar: 'اختيار خامات تزداد دفئاً وعمقاً باللمس والطقس والخطوات بدلاً من أن تبدو تالفة عند أول خدش.',
    },
    monthLabel: { en: 'Nov', fa: 'آبان', ar: 'نوفمبر' },
    dayNumber: '22',
    fullDate: {
      en: 'November 22, 2025',
      fa: '۱ آذر ۱۴۰۴',
      ar: '٢٢ نوفمبر ٢٠٢٥',
    },
    isoDate: '2025-11-22',
    readMinutes: 6,
    author: AUTHORS.dariush,
    coverImage: '/images/projects/isfahan-detail-1.jpg',
    coverAlt: {
      en: 'Weathered bronze door pull and honed limestone threshold showing gentle patina',
      fa: 'دستگیره برنزی و آستانه سنگ آهک مات با پتینه لطیف گذر زمان',
      ar: 'مقبض باب برونزي معتّق وعتبة من الحجر الجيري المصقول تحمل أثر الزمن بلطف',
    },
    coverCaption: {
      en: 'Unlacquered cast-bronze lever brightening naturally along daily touch points.',
      fa: 'دستگیره برنز ریخته‌گری بدون لاک که در نقاط لمس روزانه درخشش طلایی لطیفی می‌گیرد.',
      ar: 'مقبض برونزي غير مطلي يكتسب بريقاً دافئاً طبيعياً عند مواضع اللمس اليومي.',
    },
    sections: [
      {
        heading: {
          en: 'The Fragility of Rendering-Perfect Surfaces',
          fa: 'شکنندگی سطوح رندرگونه و بی‌روح',
          ar: 'هشاشة الأسطح المصطنعة الشبيهة بالصور الرقمية',
        },
        paragraph: {
          en: 'High-gloss acrylic panels, bright white polyurethane lacquers, and faux-stone veneers peak on handover day and deteriorate every week thereafter. True architectural materials invert that curve: oiled oak, raw bronze, and mineral lime grow richer with every passing year.',
          fa: 'پنل‌های آکریلیک براق، رنگ‌های پلی‌اورتان سفید و روکش‌های شبه‌سنگ تنها در روز تحویل در اوج‌اند و از فردای آن فرسوده می‌شوند. مصالح اصیل معماری این منحنی را وارونه می‌کنند: بلوط روغن‌خورده، برنز خام و آهک معدنی با گذشت هر سال پرمايه‌تر می‌شوند.',
          ar: 'تبلغ الخامات الصناعية اللامعة ذروتها يوم التسليم ثم تتدهور، بينما تعكس الخامات الأصيلة كالبلوط والبرونز والجير المعادلة فتزداد جمالاً عاماً بعد عام.',
        },
      },
      {
        heading: {
          en: 'The Honest Geography of Human Touch',
          fa: 'جغرافیای صادق لمس دست انسان',
          ar: 'الجغرافيا الصادقة للمسة الإنسان',
        },
        paragraph: {
          en: 'Unlacquered brass handrails and solid walnut door pulls polish subtly wherever thousands of hands have rested. Those warm golden trails turn cold construction hardware into a gentle collective biography of everyone who has passed through.',
          fa: 'نرده‌های برنجی بدون لاک و دستگیره‌های گردو درست در همان جایی که هزاران دست بر آن نشسته جلا می‌یابند و یراق‌آلات سرد ساختمانی را به زندگینامه جمعی و لطیف ساکنان بدل می‌کنند.',
          ar: 'تلمع المقابض النحاسية والخشبية الخام حيث تستقر الأيدي يومياً، فتتحول التفاصيل الصغيرة إلى سيرة دافئة لكل من عبر المكان.',
        },
      },
      {
        heading: {
          en: 'Detailing Water Runoff to Prevent Staining',
          fa: 'جزئیات آبچکان برای پیری آبرومندانه نما',
          ar: 'تفاصيل تقطير المياه لشيخوخة أنيقة للواجهات',
        },
        paragraph: {
          en: 'Patina is never an excuse for neglect. Thoughtful stone drip grooves, projecting coping caps, and raised granite plinths channel dust and rain cleanly away from plaster planes so weathering reads as quiet tonal ripening rather than streaked grime.',
          fa: 'پتینه هرگز به معنای بی‌دقتی اجرایی نیست. شیارهای آبچکان سنگی، درپوش‌های بام و ازاره‌های گرانیتی باران و غبار را به‌درستی از صفحه دیوار دور می‌کنند تا گذر زمان به پختگی رنگی بدل شود نه لکه‌های نازیبا.',
          ar: 'لا تعني الشيخوخة الجميلة إهمال التفاصيل؛ إذ تحمي أخاديد التقطير والتيجان الحجرية الواجهات ليكون أثر المطر نضجاً لونياً لا اتساخاً.',
        },
      },
      {
        heading: {
          en: 'Designing Buildings Worth Caring For',
          fa: 'طراحی بناهایی که ارزش مراقبت دارند',
          ar: 'تصميم مبانٍ تستحق العناية والبقاء',
        },
        paragraph: {
          en: 'Ultimately, sustainability rests on emotional longevity. Communities rarely demolish places that feel dignified, tactile, and lovingly crafted; they maintain and adapt them across generations.',
          fa: 'در نهایت، پایداری واقعی بر ماندگاری عاطفی استوار است. جوامع به‌ندرت بناهایی را که باوقار، ملموس و با عشق ساخته شده‌اند تخریب می‌کنند؛ بلکه در گذر نسل‌ها از آن‌ها مراقبت و بازآفرینی می‌کنند.',
          ar: 'تقوم الاستدامة الحقيقية على الديمومة العاطفية؛ فالمجتمعات تحافظ عبر الأجيال على المباني المصنوعة بوقار وإتقان.',
        },
      },
    ],
  },
  {
    slug: 'bicycle-streets-and-neighborhood-thresholds',
    categoryId: 'urban',
    title: {
      en: 'Slow Streets: Reclaiming Neighborhood Alleys for Children and Cyclists',
      fa: 'خیابان‌های آرام: بازپس‌گیری کوچه‌های محلی برای کودکان و دوچرخه‌سواران',
      ar: 'الشوارع البطيئة: استعادة الأزقة المحلية للأطفال وراكبي الدراجات',
    },
    excerpt: {
      en: 'Simple tactile paving shifts, tree chicanes, and raised intersections that cut residential traffic speeds without rigid barriers.',
      fa: 'تغییرات ساده کف‌سازی، پیچ‌های درختی و تقاطع‌های هم‌سطح که سرعت خودرو را بدون موانع خشن در بافت مسکونی کاهش می‌دهند.',
      ar: 'تعديلات بسيطة في التبليط وتوزيع الأشجار والتقاطعات المرتفعة تخفض سرعة السيارات دون حواجز قاسية.',
    },
    monthLabel: { en: 'Nov', fa: 'آبان', ar: 'نوفمبر' },
    dayNumber: '09',
    fullDate: {
      en: 'November 9, 2025',
      fa: '۱۸ آبان ۱۴۰۴',
      ar: '٩ نوفمبر ٢٠٢٥',
    },
    isoDate: '2025-11-09',
    readMinutes: 6,
    author: AUTHORS.mina,
    coverImage: '/images/projects/fereshteh-detail-1.jpg',
    coverAlt: {
      en: 'Tree-lined shared residential street paved in textured basalt cobbles with shaded benches',
      fa: 'کوچه مسکونی مشترک و درخت‌کاری‌شده با سنگ‌فرش بازالت و نیمکت‌های سایه‌دار',
      ar: 'شارع سكني مشترك مظلل بالأشجار ومبلّط بأحجار البازلت مع مقاعد هادئة',
    },
    coverCaption: {
      en: 'Curbless shared-surface alley prioritizing pedestrians over through-traffic.',
      fa: 'کوچه هم‌سطح بدون جدول با اولویت مطلق عابر پیاده بر ترافیک عبوری.',
      ar: 'زقاق مشترك بلا أرصفة مرتفعة يمنح الأولوية الكاملة للمشاة.',
    },
    sections: [
      {
        heading: {
          en: 'Speed Follows Street Geometry, Not Signage',
          fa: 'سرعت پیرو هندسه خیابان است نه تابلوی راهنمایی',
          ar: 'السرعة تتبع هندسة الشارع لا اللوحات التحذيرية',
        },
        paragraph: {
          en: 'Posting a 20 km/h sign along a wide straight asphalt chute accomplishes nothing—drivers subconsciously match the width of their visual funnel. Narrowing travel lanes to 3.2 meters with staggered tree pits naturally slows vehicles to walking pace.',
          fa: 'نصب تابلوی سرعت ۲۰ در خیابانی پهن و مستقیم بی‌اثر است، زیرا رانندگان ناخودآگاه سرعت خود را با پهنای قیف بصری تنظیم می‌کنند. باریک‌کردن مسیر عبور به ۳.۲ متر با باغچه‌های درختی زیگزاگی، سرعت خودرو را به‌طور طبیعی به گام عابر کاهش می‌دهد.',
          ar: 'لا تكفي لافتات تحديد السرعة في شوارع عريضة؛ بينما يبطّئ تضييق المسار وتوزيع أحواض الأشجار حركة المركبات طبيعياً إلى سرعة المشي.',
        },
      },
      {
        heading: {
          en: 'Continuous Sidewalk Crossings at Every Corner',
          fa: 'پیوستگی پیاده‌رو در تمام تقاطع‌ها',
          ar: 'استمرارية الرصيف عبر كل تقاطع',
        },
        paragraph: {
          en: 'When the stone sidewalk continues uninterrupted across side-street mouths at full height, cars must climb gently onto pedestrian territory—reversing the unspoken hierarchy of the city block instantaneously.',
          fa: 'هنگامی که کف‌سازی سنگی پیاده‌رو بدون شکست و هم‌تراز از دهانه کوچه‌های فرعی عبور می‌کند، خودرو ناچار است به آرامی وارد قلمرو پیاده شود و سلسله‌مراتب نانوشته محله بلافاصله به سود انسان تغییر می‌کند.',
          ar: 'حين يستمر الرصيف الحجري بمستواه دون انقطاع أمام مداخل الأزقة، تصبح السيارة ضيفاً على مساحة المشاة لا مالكاً لها.',
        },
      },
      {
        heading: {
          en: 'Shaded Micro-Pockets for Spontaneous Play',
          fa: 'جیب‌های سایه‌دار برای بازی بی‌تکلف کودکان',
          ar: 'جيوب مظللة للعب العفوي الآمن',
        },
        paragraph: {
          en: 'Reclaiming just three street parking bays per block creates room for rainwater bioswales, bike racks, and timber play boulders within sight of kitchen windows—returning independent mobility to neighborhood children.',
          fa: 'بازپس‌گیری تنها سه جای پارک خیابانی در هر بلوک، فضای کافی برای باغچه‌های جذب باران، پارکینگ دوچرخه و سکوهای بازی زیر نگاه پنجره خانه‌ها می‌آفریند و آزادی حرکت کودکان محله را بازمی‌گرداند.',
          ar: 'تتيح استعادة ثلاثة مواقف سيارات فقط في كل مربع سكني إنشاء أحواض مطر ومواقف دراجات ومساحات لعب آمنة تحت أنظار البيوت.',
        },
      },
      {
        heading: {
          en: 'Quieter Nights and Cleaner Air Indoors',
          fa: 'شب‌های آرام‌تر و هوای پاک‌تر در درون خانه‌ها',
          ar: 'ليالٍ أهدأ وهواء أنقى داخل المنازل',
        },
        paragraph: {
          en: 'Cutting cut-through traffic transforms evening acoustics immediately: families open street-facing windows again after sunset, reducing summer air-conditioning loads across the entire block.',
          fa: 'حذف ترافیک عبوری مزاحم، آکوستیک شبانه محله را به‌سرعت دگرگون می‌کند و خانواده‌ها دوباره پس از غروب پنجره‌های رو به کوچه را می‌گشایند که مصرف سرمایش کل بلوک را کاهش می‌دهد.',
          ar: 'يخفض إبعاد المرور العابر الضوضاء ليلاً، فيعيد السكان فتح نوافذهم للاستمتاع بنسيم المساء وتقليل استهلاك التكييف.',
        },
      },
    ],
  },
  {
    slug: 'geothermal-earth-tubes-in-plateau-homes',
    categoryId: 'sustainable',
    title: {
      en: 'Subterranean Calm: Earth-Tube Pre-Conditioning Beneath Desert Floors',
      fa: 'آرامش زیرزمینی: پیش‌تعدیل هوا با کانال‌های خاکی در خانه‌های فلات',
      ar: 'هدوء تحت الأرض: تكييف الهواء المسبق عبر الأنابيب الأرضية',
    },
    excerpt: {
      en: 'Drawing fresh ventilation air through deep sub-grade ceramic loops that cool 42°C summer heat before it enters the house.',
      fa: 'عبور دادن هوای تازه از مسیرهای زیرسطحی عمیق که گرمای ۴۲ درجه تابستان را پیش از ورود به خانه به‌طور طبیعی خنک می‌کنند.',
      ar: 'تمرير هواء التهوية عبر مسارات خزفية عميقة تحت الأرض تبرد حرارة الصيف قبل دخولها المنزل.',
    },
    monthLabel: { en: 'Oct', fa: 'مهر', ar: 'أكتوبر' },
    dayNumber: '25',
    fullDate: {
      en: 'October 25, 2025',
      fa: '۳ آبان ۱۴۰۴',
      ar: '٢٥ أكتوبر ٢٠٢٥',
    },
    isoDate: '2025-10-25',
    readMinutes: 6,
    author: AUTHORS.navid,
    coverImage: '/images/projects/cloister-detail-1.jpg',
    coverAlt: {
      en: 'Minimalist shaded stone gallery cooled by floor-level linear intake grilles',
      fa: 'گالری سنگی سایه‌دار و مینیمال با دریچه‌های خطی هم‌سطح کف برای ورود هوای خنک',
      ar: 'رواق حجري مظلل وهادئ يُبرّد عبر مخارج هواء خطية مدمجة في الأرضية',
    },
    coverCaption: {
      en: 'Linear brass intake slot fed by 3.5-meter deep earth-coupled labyrinth.',
      fa: 'شیار خطی برنجی تغذیه‌شده از هزارتوی خاکی در عمق سه‌ونیم‌متری زمین.',
      ar: 'فتحة نحاسية خطية يغذيها متاهة هوائية مدفونة على عمق ثلاثة أمتار ونصف.',
    },
    sections: [
      {
        heading: {
          en: 'Constant Thermal Stability Three Meters Down',
          fa: 'ثبات دمایی پایدار در عمق سه‌متری خاک',
          ar: 'استقرار حراري دائم على عمق ثلاثة أمتار',
        },
        paragraph: {
          en: 'While desert air swings wildly from freezing January nights to blistering July afternoons, soil three meters beneath the courtyard hovers steadily around eighteen degrees Celsius year-round. Earth-coupled air labyrinths tap that vast silent battery directly.',
          fa: 'در حالی که هوای کویر از شب‌های یخبندان دی تا بعدازظهرهای سوزان تیر نوسان شدید دارد، خاک در عمق سه‌متری حیاط در تمام طول سال حدود هجده درجه سانتی‌گراد ثابت می‌ماند. هزارتوهای خاکی مستقیماً از همین باتری حرارتی بی‌صدا بهره می‌برند.',
          ar: 'بينما تتقلب حرارة الهواء بشدة بين الصيف والشتاء، تبقى التربة على عمق ثلاثة أمتار قريبة من ثماني عشرة درجة طوال العام، فتستثمر الأنابيب الأرضية هذا التوازن الصامت.',
        },
      },
      {
        heading: {
          en: 'Sloped Drainage and Washable Inspection Chambers',
          fa: 'شیب‌بندی زهکشی و دریچه‌های بازدید قابل شست‌وشو',
          ar: 'ميول تصريف وغرف تفتيش قابلة للتنظيف',
        },
        paragraph: {
          en: 'Hygiene is non-negotiable in buried ventilation ducts. Every ceramic-lined earth tube slopes two percent toward a dry-well sump with washable particulate filters at the garden intake hood, keeping indoor air crisp and odor-free.',
          fa: 'بهداشت در کانال‌های زیرزمینی خط قرمز طراحی است. هر لوله سرامیکی با شیب دو درصد به سمت چاهک زهکش اجرا می‌شود و با فیلترهای قابل شست‌وشو در دهانه ورودی باغ، هوایی پاک و بی‌بو تأمین می‌کند.',
          ar: 'تميل الأنابيب الخزفية بنسبة اثنين في المائة نحو نقطة تصريف مع مرشحات قابلة للغسل عند المدخل لضمان نقاء الهواء الداخلي دائماً.',
        },
      },
      {
        heading: {
          en: 'Pre-Warming Freezing Winter Ventilation',
          fa: 'پیش‌گرم‌کردن هوای تازه در زمستان سرد',
          ar: 'التدفئة المسبقة لهواء التهوية في الشتاء البارد',
        },
        paragraph: {
          en: 'In winter, the exact same subterranean loop tempers sub-zero outdoor breezes upward by twelve degrees before they reach living rooms—delivering continuous oxygen-rich fresh air without chilling occupants.',
          fa: 'در زمستان، دقیقاً همین مدار زیرزمینی نسیم زیر صفر بیرون را پیش از رسیدن به نشیمن تا دوازده درجه گرم‌تر می‌کند و هوای تازه و سرشار از اکسیژن را بدون ایجاد سوز سرما به اتاق می‌رساند.',
          ar: 'في الشتاء يقوم المسار نفسه بتدفئة الهواء الخارجي البارد اثنتي عشرة درجة قبل دخوله الغرف، موفراً تهوية نقية دون فقدان الدفء.',
        },
      },
      {
        heading: {
          en: 'Whisper-Quiet Living Without Compressor Hum',
          fa: 'زندگی در سکوت بدون وزوز کمپرسور',
          ar: 'حياة هادئة بلا ضجيج الضواغط الميكانيكية',
        },
        paragraph: {
          en: 'Because air glides through wide masonry labyrinths at under one meter per second, occupants feel gentle forest-like coolness without drafty vents or mechanical drone.',
          fa: 'از آنجا که هوا با سرعتی کمتر از یک متر بر ثانیه از میان هزارتوی بنایی عبور می‌کند، ساکنان خنکایی لطیف و شبیه نسیم باغ را بدون کوران باد و صدای موتور تجربه می‌کنند.',
          ar: 'بفضل بطء تدفق الهواء عبر الممرات العريضة، يشعر السكان ببرودة لطيفة تشبه نسيم البساتين بلا تيارات مزعجة أو ضجيج.',
        },
      },
    ],
  },
  {
    slug: 'grid-discipline-and-editorial-silence',
    categoryId: 'theory',
    title: {
      en: 'Why Restraint Amplifies Emotion: Structural Grids in Quiet Spaces',
      fa: 'چرا خویشتن‌داری احساس را تشدید می‌کند: شبکه‌های ساختاری در فضاهای آرام',
      ar: 'لماذا يعمّق الاقتصاد في التعبير الإحساس: الشبكات الإنشائية في الفراغات الهادئة',
    },
    excerpt: {
      en: 'Tracing how a consistent 60-centimeter tectonic module aligns stone joints, timber ceilings, and daylight shafts into calm unity.',
      fa: 'ردیابی چگونگی هم‌ترازکردن بندهای سنگ، سقف چوبی و نورگیرها با یک مدول ساختاری شصت‌سانتی‌متری در وحدتی آرام.',
      ar: 'تتبّع كيف توحّد وحدة قياس إنشائية ثابتة فواصل الحجر والأسقف الخشبية ومناور الضوء في انسجام هادئ.',
    },
    monthLabel: { en: 'Oct', fa: 'مهر', ar: 'أكتوبر' },
    dayNumber: '11',
    fullDate: {
      en: 'October 11, 2025',
      fa: '۱۹ مهر ۱۴۰۴',
      ar: '١١ أكتوبر ٢٠٢٥',
    },
    isoDate: '2025-10-11',
    readMinutes: 6,
    author: AUTHORS.dariush,
    coverImage: '/images/projects/valiasr-detail-1.jpg',
    coverAlt: {
      en: 'Aligned limestone floor joints meeting recessed vertical wall reveals along a clean grid',
      fa: 'هم‌راستایی دقیق بندهای سنگ کف با شیارهای عمودی دیوار بر یک شبکه منظم',
      ar: 'تطابق دقيق لفواصل البلاط الحجري مع الأخاديد الرأسية في الجدار على شبكة متناغمة',
    },
    coverCaption: {
      en: 'Continuous 600mm datum coordinating floor slabs, wall reveals, and joinery.',
      fa: 'مدول پیوسته ۶۰۰ میلی‌متری هماهنگ‌کننده اسلب‌های کف، شیارهای دیوار و نجاری.',
      ar: 'وحدة قياس متواصلة بمقاس ٦٠٠ مليمتر تنسّق الأرضيات والأبواب والنجارة.',
    },
    sections: [
      {
        heading: {
          en: 'Order as the Foundation of Freedom',
          fa: 'نظم به‌عنوان بنیان آزادی فضایی',
          ar: 'النظام كأساس للحرية المكانية',
        },
        paragraph: {
          en: 'A clear architectural grid is never rigid—it acts like musical meter in a solo cello suite. When floor joints, ceiling battens, and door reveals obey one quiet proportional rhythm, a single curved stair or solitary olive tree carries extraordinary poetic presence.',
          fa: 'یک شبکه معماری شفاف هرگز خشک نیست؛ بلکه همچون میزان موسیقی در یک قطعه ویولنسل عمل می‌کند. وقتی بندهای کف، لمبه‌های سقف و قاب درها از یک ریتم تناسبی آرام پیروی کنند، یک پله منحنی یا یک درخت زیتون تنها حضوری شاعرانه و خارق‌العاده می‌یابد.',
          ar: 'تشبه الشبكة المعمارية الإيقاع الموسيقي الهادئ؛ فحين تتسق فواصل الأرضيات والسقف والأبواب، يكتسب أي عنصر حرّ كدرج منحني أو شجرة زيتون حضوراً شاعرياً استثنائياً.',
        },
      },
      {
        heading: {
          en: 'Eliminating Awkward Sliver Cuts on Site',
          fa: 'حذف برش‌های باریک و ناهماهنگ در کارگاه',
          ar: 'إلغاء القطع الحجرية الضيقة المشوّهة في الموقع',
        },
        paragraph: {
          en: 'Designing room dimensions as exact multiples of quarried stone modules eliminates wasteful three-centimeter filler strips along baseboards. Craftspeople work faster, material waste drops, and every corner resolves cleanly with whole blocks.',
          fa: 'طراحی ابعاد اتاق‌ها بر اساس مضارب دقیق مدول سنگ، نوارهای برش‌خورده سه‌سانتی‌متری و نازیبا را در کنار دیوارها حذف می‌کند؛ اجرای کارگاه سریع‌تر می‌شود و تمام گوشه‌ها با قطعات کامل و بی‌نقص به هم می‌رسند.',
          ar: 'يلغي تصميم أبعاد الغرف كمضاعفات دقيقة لوحدة الحجر الشرائح الضيقة المهدرة، فيرتفع إتقان التنفيذ وتُحسم الزوايا بقطع كاملة نقية.',
        },
      },
      {
        heading: {
          en: 'Coordinating Services Within the Tectonic Frame',
          fa: 'هماهنگی تأسیسات در دل قاب تکتونیک',
          ar: 'تنسيق الخدمات التقنية داخل الإطار التكتوني',
        },
        paragraph: {
          en: 'Light switches, floor outlets, and thermostats sit centered inside stone bands rather than drifting arbitrarily across plaster walls. Cognitive calm comes largely from the brain not having to reconcile dozens of accidental misalignments.',
          fa: 'کلیدهای برق، پریزهای کفی و ترموستات‌ها به‌جای پراکندگی تصادفی روی دیوار، دقیقاً در مرکز نوارهای سنگی می‌نشینند. آرامش ذهنی فضا تا حد زیادی از این می‌آید که مغز ناچار به تحمل ده‌ها ناهماهنگی تصادفی نیست.',
          ar: 'تستقر المفاتيح ومنظمات الحرارة بانتظام داخل خطوط الشبكة بدلاً من التبعثر العشوائي، فيشعر الذهن بصفاء وهدوء فوري.',
        },
      },
      {
        heading: {
          en: 'Silence That Lets Inhabitants Speak',
          fa: 'سکوتی که به ساکنان اجازه سخن‌گفتن می‌دهد',
          ar: 'صمت معماري يتيح لحياة السكان أن تتألق',
        },
        paragraph: {
          en: 'When architecture stops shouting for attention through gimmicky shapes, it becomes a generous stage for human conversation, morning coffee, and shifting seasonal light.',
          fa: 'هنگامی که معماری از فریادزدن با فرم‌های نمایشی دست می‌کشد، به صحنه‌ای سخاوتمند برای گفت‌وگوی انسانی، قهوه صبحگاهی و رقص نور فصل‌ها تبدیل می‌شود.',
          ar: 'حين تكفّ العمارة عن الصراخ بالأشكال الاستعراضية، تتحول إلى مسرح كريم للحوار الإنساني وقهوة الصباح وتغيرات الضوء.',
        },
      },
    ],
  },
  {
    slug: 'restoring-historic-water-channels-in-parks',
    categoryId: 'urban',
    title: {
      en: 'Daylighting the Qanat: Weaving Historic Water Channels Into Civic Parks',
      fa: 'آشکارسازی قنات: پیوند جوی‌های تاریخی آب با پارک‌های شهری',
      ar: 'إحياء القنوات: نسج مجاري المياه التاريخية في الحدائق العامة',
    },
    excerpt: {
      en: 'Uncovering buried urban streams and traditional stone juy channels to cool neighborhood parks and restore ecological corridors.',
      fa: 'بازگشایی جوی‌های مدفون شهری و مسیرهای سنگی سنتی برای خنک‌سازی پارک‌های محلی و احیای کریدورهای اکولوژیک.',
      ar: 'كشف الجداول الحضرية المدفونة والقنوات الحجرية التقليدية لتبريد الحدائق المحلية واستعادة الممرات البيئية.',
    },
    monthLabel: { en: 'Sep', fa: 'شهریور', ar: 'سبتمبر' },
    dayNumber: '28',
    fullDate: {
      en: 'September 28, 2025',
      fa: '۶ مهر ۱۴۰۴',
      ar: '٢٨ سبتمبر ٢٠٢٥',
    },
    isoDate: '2025-09-28',
    readMinutes: 7,
    author: AUTHORS.mina,
    coverImage: '/images/projects/laleh-detail-1.jpg',
    coverAlt: {
      en: 'Carved basalt water channel winding calmly through a shaded urban grove of plane trees',
      fa: 'جوی آب تراش‌خورده بازالتی که به آرامی از میان درختان چنار سایه‌دار پارک شهری می‌گذرد',
      ar: 'قناة مياه منحوتة من البازلت تنساب بهدوء وسط بستان حضري مظلل بأشجار الدلب',
    },
    coverCaption: {
      en: 'Restored gravity-fed stone runnel irrigating century-old plane trees.',
      fa: 'جوی سنگی ثقلی بازسازی‌شده برای آبیاری درختان چنار کهنسال.',
      ar: 'قناة حجرية تعمل بالجاذبية أُعيد إحياؤها لري أشجار الدلب المعمرة.',
    },
    sections: [
      {
        heading: {
          en: 'From Buried Culverts Back to Living Streams',
          fa: 'از کانال‌های مدفون به جوی‌های زنده',
          ar: 'من الأنابيب المدفونة إلى جداول حية',
        },
        paragraph: {
          en: 'Twentieth-century road widening paved over countless spring-fed channels that once cooled Tehran and Shiraz naturally. Daylighting even a four-hundred-meter segment transforms arid concrete medians into lush amphibian-and-bird habitats.',
          fa: 'تعریض خیابان‌ها در سده گذشته بسیاری از جوی‌های چشمه‌زاد را که روزگاری تهران و شیراز را طبیعی خنک می‌کردند زیر آسفالت مدفون ساخت. آشکارسازی حتی چهارصد متر از این مسیرها، حاشیه‌های خشک بتنی را به زیستگاهی سرسبز و زنده بدل می‌کند.',
          ar: 'يعيد كشف بضع مئات من الأمتار من القنوات الطبيعية المدفونة تحت الأسفلت تحويل الممرات الجافة إلى موائل بيئية خضراء نابضة بالحياة.',
        },
      },
      {
        heading: {
          en: 'Stepped Stone Weirs for Oxygenation and Sound',
          fa: 'سرریزهای سنگی پلکانی برای اکسیژن‌رسانی و آوای آب',
          ar: 'عتبات حجرية متدرجة لتهوية الماء وإيقاعه الصوتي',
        },
        paragraph: {
          en: 'Shallow hand-chiseled stone drops every twelve meters aerate flowing water naturally while generating a gentle acoustic veil that masks distant avenue traffic.',
          fa: 'پله‌های سنگی کم‌عمق و دست‌تراش در هر دوازده متر، هم آب جاری را به‌طور طبیعی اکسیژن‌دار می‌کنند و هم پرده‌ای صوتی و دلنشین می‌سازند که همهمه خیابان‌های دورتر را می‌پوشاند.',
          ar: 'تعمل الدرجات الحجرية المنحوتة على تهوية المياه طبيعياً مع توليد همس مائي لطيف يحجب ضوضاء الطرق البعيدة.',
        },
      },
      {
        heading: {
          en: 'Gravity-Fed Root Basins Without Electric Pumps',
          fa: 'باغچه‌های ثقلی بی‌نیاز از پمپ برقی',
          ar: 'أحواض ري بالجاذبية دون مضخات كهربائية',
        },
        paragraph: {
          en: 'By following natural topographic slopes and fitting simple bronze sluice gates, park keepers water mature plane and willow groves purely by gravity—cutting municipal electricity and maintenance bills simultaneously.',
          fa: 'با پیروی از شیب طبیعی زمین و نصب دریچه‌های ساده برنزی، باغبانان پارک درختان کهنسال چنار و بید را صرفاً با نیروی گرانش آبیاری می‌کنند که همزمان مصرف برق و هزینه نگهداری شهری را کاهش می‌دهد.',
          ar: 'يتيح اتباع الميل الطبيعي للأرض مع بوابات برونزية بسيطة ري بساتين الحدائق بالجاذبية الصافية دون مضخات كهربائية.',
        },
      },
      {
        heading: {
          en: 'Civic Gathering Around Moving Water',
          fa: 'گردهمایی مدنی پیرامون آب روان',
          ar: 'التقاء المجتمع حول الماء الجاري',
        },
        paragraph: {
          en: 'Nothing gathers people across generations like clear running water beneath shade trees. Low stepping stones invite children to dip fingertips while elders read beside the cool bank—reconnecting modern citizens to an ancient Iranian landscape ethic.',
          fa: 'هیچ چیز مانند آب زلال روان زیر سایه درختان، نسل‌های مختلف را گرد هم نمی‌آورد. سنگ‌های کوتاه کنار جوی، کودکان را به لمس آب و سالمندان را به مطالعه در خنکای ساحل آن دعوت می‌کند و پیوند شهروند امروز را با اخلاق کهن منظر ایرانی زنده می‌سازد.',
          ar: 'يجمع الماء الجاري تحت الظلال مختلف الأجيال في ألفة عفوية، مجدداً صلة المدينة المعاصرة بإرثها العريق في احترام الماء والمنظر الطبيعي.',
        },
      },
    ],
  },
  {
    slug: 'raw-linen-and-mineral-textiles-in-interiors',
    categoryId: 'materials',
    title: {
      en: 'Soft Tectonics: Unbleached Linen, Wool, and Light-Filtering Drapery',
      fa: 'تکتونیک نرم: کتان خام، پشم و پرده‌های تعدیل‌کننده نور',
      ar: 'تكتونيك ناعم: الكتان الخام والصوف وستائر ترشيح الضوء',
    },
    excerpt: {
      en: 'Using breathable natural textiles to soften western glare, regulate acoustics, and bring seasonal tactility to minimalist interiors.',
      fa: 'بهره‌گیری از منسوجات طبیعی تنفس‌پذیر برای نرم‌کردن تابش غربی، تعدیل آکوستیک و بخشیدن لطافت فصلی به فضاهای مینیمال.',
      ar: 'توظيف المنسوجات الطبيعية المتنفسة لتليين شمس الغرب وضبط الصوت وإضفاء دفء موسمي على الفراغات البسيطة.',
    },
    monthLabel: { en: 'Sep', fa: 'شهریور', ar: 'سبتمبر' },
    dayNumber: '14',
    fullDate: {
      en: 'September 14, 2025',
      fa: '۲۳ شهریور ۱۴۰۴',
      ar: '١٤ سبتمبر ٢٠٢٥',
    },
    isoDate: '2025-09-14',
    readMinutes: 5,
    author: AUTHORS.sara,
    coverImage: '/images/projects/kashan-detail-2.jpg',
    coverAlt: {
      en: 'Sheer unbleached linen curtain billowing gently across a sunlit stone doorway',
      fa: 'پرده کتان خام نیمه‌شفاف در نسیم ملایم درگاه سنگی آفتاب‌گیر',
      ar: 'ستارة من الكتان الخام تتمايل بلطف أمام مدخل حجري مشمس',
    },
    coverCaption: {
      en: 'Belgian raw flax drapery recessed cleanly into 60mm ceiling shadow pockets.',
      fa: 'پرده کتان خام نصب‌شده در شیار مخفی ۶۰ میلی‌متری سقف.',
      ar: 'ستائر كتان خام مدمجة بنظافة داخل تجاويف سقفية مخفية.',
    },
    sections: [
      {
        heading: {
          en: 'Textiles as Movable Architectural Partitions',
          fa: 'منسوجات به‌مثابه دیوارهای متحرک معماری',
          ar: 'المنسوجات كفواصل معمارية متحركة',
        },
        paragraph: {
          en: 'Architecture does not stop at stone and timber. Full-height unbleached linen panels gliding along recessed ceiling tracks allow open studios to shift from luminous communal halls to intimate acoustic retreats in seconds.',
          fa: 'معماری در سنگ و چوب متوقف نمی‌شود. پنل‌های قدی کتان خام که در ریل‌های توکار سقف می‌لغزند، اجازه می‌دهند استودیوهای باز ظرف چند ثانیه از تالاری پرنور و جمعی به پناهگاهی صمیمی و آکوستیک تبدیل شوند.',
          ar: 'لا تتوقف العمارة عند الحجر والخشب؛ فستائر الكتان الممتدة من السقف إلى الأرض تتيح تحويل الفضاء المفتوح إلى خلوة هادئة في ثوانٍ.',
        },
      },
      {
        heading: {
          en: 'Filtering Late-Afternoon Western Sun',
          fa: 'پالایش آفتاب مایل غربی در عصر',
          ar: 'ترشيح شمس الغرب المائلة بعد الظهر',
        },
        paragraph: {
          en: 'Low western rays slip under exterior roof overhangs after four o’clock. Open-weave flax drapery diffuses that fierce golden beam into a glowing translucent veil without plunging the room into artificial darkness.',
          fa: 'پرتوهای مایل غربی پس از ساعت چهار عصر از زیر پیش‌آمدگی بام می‌گذرند. بافت باز کتان خام این تابش تند طلایی را بی‌آنکه اتاق را تاریک کند به پرده‌ای درخشان و لطیف تبدیل می‌سازد.',
          ar: 'يبدد النسيج المفتوح للكتان أشعة العصر الغربية الحادة ويحولها إلى حجاب مضيء ناعم دون إغراق الغرفة في الظلام.',
        },
      },
      {
        heading: {
          en: 'Celebrating Natural Slub and Undyed Tone',
          fa: 'ستایش گره‌های طبیعی بافت و رنگ بی‌سفیدکننده',
          ar: 'الاحتفاء بعقد النسيج الطبيعية واللون غير المبيّض',
        },
        paragraph: {
          en: 'Unbleached oatmeal flax and hand-loomed regional wool echo the exact mineral undertone of lime plaster and travertine—bridging hard structural planes and soft human touch harmoniously.',
          fa: 'کتان رنگ‌نشده و پشم دست‌بافت بومی دقیقاً هم‌خانواده ته‌رنگ معدنی اندود آهک و تراورتن هستند و پیوندی هماهنگ میان صفحات سخت سازه‌ای و لطافت لمس انسانی برقرار می‌کنند.',
          ar: 'ينسجم الكتان غير المبيّض والصوف اليدوي المحلي مع درجات الجص والترافرتين ليصلا بين صلابة البناء ونعومة اللمس الإنساني.',
        },
      },
      {
        heading: {
          en: 'Making Breeze Visible Inside the Room',
          fa: 'آشکارکردن حرکت نسیم در درون اتاق',
          ar: 'جعل النسيم مرئياً داخل الغرفة',
        },
        paragraph: {
          en: 'A gentle ripple across a floor-length linen drape lets occupants see quiet courtyard airflow even from across the room, anchoring interior stillness in living atmospheric rhythm.',
          fa: 'موج آرامی که در چین پرده کتان قدی می‌دود، جریان لطیف هوای حیاط را حتی از آن‌سوی اتاق دیدنی می‌کند و سکون داخلی را به ریتم زنده طبیعت پیوند می‌دهد.',
          ar: 'يجعل تموّج الستارة الكتانية اللطيف تيار نسيم الفناء مرئياً داخل الغرفة، رابطاً سكون الداخل بإيقاع الطبيعة الحي.',
        },
      },
    ],
  },
  {
    slug: 'courtyard-hospitality-and-slow-tourism',
    categoryId: 'sustainable',
    title: {
      en: 'Slow Hospitality: Designing Low-Impact Desert Retreats Around Silence',
      fa: 'مهمان‌نوازی آرام: طراحی اقامتگاه‌های کم‌اثر کویری بر محور سکوت',
      ar: 'الضيافة البطيئة: تصميم ملاذات صحراوية منخفضة الأثر حول السكون',
    },
    excerpt: {
      en: 'Replacing energy-hungry resort towers with shaded earthen suites, stargazing terraces, and locally sourced culinary gardens.',
      fa: 'جایگزینی برج‌های پرمصرف تفریحی با سوئیت‌های خاکی سایه‌دار، تراس‌های رصد ستارگان و باغچه‌های خوراکی بومی.',
      ar: 'استبدال الأبراج السياحية المستهلكة للطاقة بأجنحة ترابية مظللة وتراسات لتأمل النجوم وحدائق محلية.',
    },
    monthLabel: { en: 'Aug', fa: 'مرداد', ar: 'أغسطس' },
    dayNumber: '30',
    fullDate: {
      en: 'August 30, 2025',
      fa: '۸ شهریور ۱۴۰۴',
      ar: '٣٠ أغسطس ٢٠٢٥',
    },
    isoDate: '2025-08-30',
    readMinutes: 7,
    author: AUTHORS.dariush,
    coverImage: '/images/projects/yazd-detail-2.jpg',
    coverAlt: {
      en: 'Serene earthen hospitality terrace glowing softly at dusk beneath a vast desert sky',
      fa: 'تراس اقامتگاه خاکی آرام با نورپردازی لطیف در گرگ‌ومیش زیر آسمان گسترده کویر',
      ar: 'تراس ضيافة ترابي هادئ يتوهج بلطف عند الغسق تحت سماء الصحراء الواسعة',
    },
    coverCaption: {
      en: 'Low-glare amber path lighting preserving Bortle-2 dark desert skies.',
      fa: 'نورپردازی کهربایی کم‌خیرگی در مسیرها برای حفظ آسمان تاریک و پرستاره کویر.',
      ar: 'إضاءة مسارات كهرمانية منخفضة الوهج تحفظ نقاء سماء الصحراء المرصعة بالنجوم.',
    },
    sections: [
      {
        heading: {
          en: 'Luxury Measured in Quietness, Not Marble Excess',
          fa: 'لوکس‌بودن به معیار سکوت، نه افراط در سنگ‌های پرزرق‌وبرق',
          ar: 'الفخامة تُقاس بالسكينة لا بالمبالغة البصرية',
        },
        paragraph: {
          en: 'Contemporary travelers fleeing hyper-stimulated cities no longer seek gilded lobbies or infinity pools fighting arid horizons. True desert luxury is acoustic stillness, cool earthen walls at noon, and unpolluted starlight after midnight.',
          fa: 'مسافران امروزی که از شهرهای پرهیاهو می‌گریزند دیگر به دنبال لابی‌های پرزرق‌وبرق نیستند. لوکس‌بودن واقعی در کویر یعنی سکوت آکوستیک، دیوارهای خنک خاکی در ظهر و آسمان پرستاره بی‌آلودگی نوری پس از نیمه‌شب.',
          ar: 'لم يعد المسافر المعاصر يبحث عن البهرجة؛ بل تكمن الفخامة الصحراوية الحقيقية في السكون الصوتي وبرودة الجدران الترابية وصفاء النجوم ليلاً.',
        },
      },
      {
        heading: {
          en: 'Dark-Sky Lighting Discipline',
          fa: 'انضباط نورپردازی برای حفظ آسمان تاریک',
          ar: 'انضباط الإضاءة لحماية السماء المظلمة',
        },
        paragraph: {
          en: 'Every exterior luminaire sits below knee height, shielded fully downward in 2200K warm amber tones. Guests navigate stone paths effortlessly while the Milky Way stays vivid directly above courtyard daybeds.',
          fa: 'تمام چراغ‌های محوطه پایین‌تر از ارتفاع زانو با شیلد کامل رو به پایین و نور کهربایی ۲۲۰۰ کلوین نصب می‌شوند تا مهمانان مسیر سنگی را به‌راحتی ببینند در حالی که کهکشان راه شیری بر فراز حیاط درخشان باقی می‌ماند.',
          ar: 'تُثبّت جميع مصابيح المسارات أسفل مستوى الركبة بضوء كهرماني دافئ موجه للأسفل، فتبقى السماء مرصعة بدرب التبانة فوق الأفنية.',
        },
      },
      {
        heading: {
          en: 'Modular Clusters Respecting Fragile Desert Crust',
          fa: 'خوشه‌های مدولار با احترام به پوسته حساس خاک کویر',
          ar: 'عناقيد معيارية تحترم القشرة الصحراوية الهشة',
        },
        paragraph: {
          en: 'Grouping compact suites along narrow shaded lanes minimizes road grading and preserves native desert shrubs that take decades to regrow once disturbed.',
          fa: 'چیدمان فشرده سوئیت‌ها در امتداد گذرهای باریک سایه‌دار، جاده‌سازی را به حداقل می‌رساند و بوته‌های بومی کویر را که پس از تخریب دهه‌ها برای رویش دوباره زمان می‌خواهند، دست‌نخورده حفظ می‌کند.',
          ar: 'يقلل تجميع الأجنحة على طول ممرات ضيقة مظللة من شق الطرق ويحفظ النباتات الصحراوية المحلية النادرة.',
        },
      },
      {
        heading: {
          en: 'Closed-Loop Greywater Oasis Gardens',
          fa: 'باغ‌های واحه‌ای با بازچرخانی آب خاکستری',
          ar: 'حدائق واحية تعمل بتدوير المياه الرمادية',
        },
        paragraph: {
          en: 'Reed-bed biological filtration cleans shower and basin water naturally to irrigate shaded fig, pistachio, and herb gardens—turning guest hospitality into active ecological stewardship.',
          fa: 'تصفیه زیستی در بسترهای نیزار، آب خاکستری دوش‌ها و روشویی‌ها را به‌طور طبیعی برای آبیاری باغچه‌های انجیر، پسته و گیاهان معطر پاک‌سازی می‌کند و گردشگری را به پاسداری فعال از زیست‌بوم تبدیل می‌سازد.',
          ar: 'تنقّي أحواض القصب البيولوجية المياه الرمادية طبيعياً لري بساتين التين والفستق والأعشاب، فتتحول الضيافة إلى رعاية بيئية فاعلة.',
        },
      },
    ],
  },
  {
    slug: 'craft-of-the-stair-as-vertical-promenade',
    categoryId: 'theory',
    title: {
      en: 'Vertical Promenade: Designing Stairs as Sculptural Light Vessels',
      fa: 'گردشگاه عمودی: طراحی پلکان به‌مثابه ظرف مجسمه‌وار نور',
      ar: 'الممشى العمودي: تصميم السلالم كأوعية نحتية للضوء',
    },
    excerpt: {
      en: 'Transforming vertical circulation from an enclosed service shaft into the luminous spatial anchor of a multi-story house.',
      fa: 'دگرگون‌کردن حرکت عمودی از یک شفت خدماتی بسته به لنگر فضایی و نورانی یک خانه چندطبقه.',
      ar: 'تحويل الحركة الرأسية من بئر خدمي مغلق إلى محور مضيء ونحتي يربط طوابق المنزل.',
    },
    monthLabel: { en: 'Aug', fa: 'مرداد', ar: 'أغسطس' },
    dayNumber: '12',
    fullDate: {
      en: 'August 12, 2025',
      fa: '۲۱ مرداد ۱۴۰۴',
      ar: '١٢ أغسطس ٢٠٢٥',
    },
    isoDate: '2025-08-12',
    readMinutes: 6,
    author: AUTHORS.navid,
    coverImage: '/images/projects/lavasan-detail-2.jpg',
    coverAlt: {
      en: 'Cantilevered solid oak stair treads rising cleanly through a sky-lit plaster atrium',
      fa: 'کف‌پله‌های چوب بلوط یکپارچه در حال صعود در آتریوم گچی نورگیر از سقف',
      ar: 'درجات بلوط صلبة كابولية ترتقي بنقاء داخل بهو جصي مضاء من الأعلى',
    },
    coverCaption: {
      en: 'Open-riser solid white-oak staircase pulling zenith skylight down three floors.',
      fa: 'پلکان چوب بلوط سفید بدون پیشانی که نور سقفی را تا سه طبقه پایین می‌کشد.',
      ar: 'سلم من خشب البلوط الأبيض المفتوح يجلب ضوء السماء عبر ثلاثة طوابق.',
    },
    sections: [
      {
        heading: {
          en: 'Reclaiming the Stair From the Dark Corner',
          fa: 'آزادکردن پلکان از گوشه تاریک پلان',
          ar: 'تحرير السلم من الزوايا المظلمة في المسقط',
        },
        paragraph: {
          en: 'Too many floor plans exile staircases into windowless rear closets solely to save perimeter footage. Yet ascending a stair is the most choreographed bodily movement inside a house—each step shifts eye level, framing new diagonals across rooms and sky.',
          fa: 'بسیاری از پلان‌ها پلکان را برای صرفه‌جویی در جبهه نورگیر به کنج‌های تاریک و بی‌روزن تبعید می‌کنند؛ در حالی که بالا رفتن از پله آگاهانه‌ترین حرکت بدنی در خانه است که با هر گام تراز نگاه را تغییر می‌دهد و زوایای تازه‌ای از فضا و آسمان می‌گشاید.',
          ar: 'يُعد صعود السلم أكثر الحركات الجسدية وعياً داخل المنزل، فكل درجة ترفع مستوى البصر وتفتح منظوراً متجدداً نحو الغرف والسماء.',
        },
      },
      {
        heading: {
          en: 'Comfort Proportions: The 16.5 / 30 Golden Cadence',
          fa: 'تناسبات آسایش: ریتم طلایی ۱۶.۵ در ۳۰ سانتی‌متر',
          ar: 'نسب الراحة: الإيقاع المثالي للدرجة والنائمة',
        },
        paragraph: {
          en: 'Shaving two centimeters off steep building-code risers transforms climbing from exertion into effortless glide. Pairing a 16.5-centimeter rise with a generous 30-centimeter tread slows pace gently and accommodates every generation safely.',
          fa: 'کاستن تنها دو سانتی‌متر از ارتفاع پله‌های تند ضابطه‌ای، بالا رفتن را از تقلا به حرکتی سیال بدل می‌کند. ترکیب ارتفاع ۱۶.۵ و کف‌پله سخاوتمندانه ۳۰ سانتی‌متری ریتم گام‌ها را آرام و برای تمام نسل‌ها ایمن می‌سازد.',
          ar: 'يحوّل ضبط ارتفاع الدرجة عند ١٦٫٥ سم مع عرض ٣٠ سم الصعود من مجهود إلى انسياب مريح وآمن لجميع الأعمار.',
        },
      },
      {
        heading: {
          en: 'Open Risers as Vertical Light Chimneys',
          fa: 'پله‌های باز به‌عنوان دودکش‌های عمودی نور',
          ar: 'الدرجات المفتوحة كمداخن عمودية للضوء',
        },
        paragraph: {
          en: 'Allowing daylight from a single roof lantern to filter between cantilevered solid-oak treads illuminates basement studios and lower hallways without burning daytime electricity.',
          fa: 'عبور نور یک نورگیر سقفی از میان کف‌پله‌های کنسولی چوب بلوط، استودیوهای تراز پایین و راهروهای زیرین را در طول روز بی‌نیاز از برق روشن می‌سازد.',
          ar: 'يتسلل ضوء المنور العلوي عبر الدرجات الخشبية المفتوحة ليغمر الطوابق السفلية بالإنارة الطبيعية طوال النهار.',
        },
      },
      {
        heading: {
          en: 'The Pause Landing as a Window to the Garden',
          fa: 'پاگرد مکث به‌مثابه پنجره‌ای رو به باغ',
          ar: 'بسطة الاستراحة كنافذة مطلة على الحديقة',
        },
        paragraph: {
          en: 'Broadening the mid-level landing by half a meter with a slender vertical aperture turns a routine turn into a quiet lookout over treetops—rewarding movement with stillness.',
          fa: 'عریض‌ترکردن پاگرد میانی به اندازه نیم متر همراه با پنجره‌ای عمودی و باریک، یک چرخش ساده را به تماشاخانه‌ای آرام بر فراز تاج درختان تبدیل می‌کند و حرکت را با لحظه‌ای سکون پاداش می‌دهد.',
          ar: 'يمنح توسيع بسطة السلم مع فتحة طولية نحيفة نحو رؤوس الأشجار لحظة تأمل هادئة تكافئ الحركة اليومية.',
        },
      },
    ],
  },
  {
    slug: 'civic-libraries-as-urban-living-rooms',
    categoryId: 'urban',
    title: {
      en: 'Third Places: Designing Neighborhood Libraries as Democratic Living Rooms',
      fa: 'مکان‌های سوم: طراحی کتابخانه‌های محلی به‌مثابه نشیمن‌های دموکراتیک شهر',
      ar: 'الأماكن الثالثة: تصميم المكتبات المحلية كغرف معيشة مدنية للجميع',
    },
    excerpt: {
      en: 'How daylight reading courts, free study alcoves, and timber shelving turn municipal libraries into vital anchors of social cohesion.',
      fa: 'چگونه حیاط‌های مطالعه نورگیر، کنج‌های رایگان پژوهش و قفسه‌های چوبی کتابخانه‌های شهری را به لنگرهای همبستگی اجتماعی بدل می‌کنند.',
      ar: 'كيف تحوّل أفنية القراءة المضيئة والزوايا المجانية والرفوف الخشبية المكتبات البلدية إلى ركائز للتماسك الاجتماعي.',
    },
    monthLabel: { en: 'Jul', fa: 'تیر', ar: 'يوليو' },
    dayNumber: '27',
    fullDate: {
      en: 'July 27, 2025',
      fa: '۵ مرداد ۱۴۰۴',
      ar: '٢٧ يوليو ٢٠٢٥',
    },
    isoDate: '2025-07-27',
    readMinutes: 7,
    author: AUTHORS.mina,
    coverImage: '/images/projects/isfahan-detail-2.jpg',
    coverAlt: {
      en: 'Timber-lined civic reading hall overlooking a tranquil sunlit courtyard garden',
      fa: 'تالار مطالعه شهری با قفسه‌های چوبی مشرف به حیاط باغ آرام و آفتاب‌گیر',
      ar: 'قاعة قراءة مدنية مكسوة بالخشب تطل على حديقة فناء هادئة ومشمسة',
    },
    coverCaption: {
      en: 'Public reading nave framed in acoustic ash bookshelves and north clerestories.',
      fa: 'صحن مطالعه عمومی قاب‌گرفته‌شده با قفسه‌های چوبی آکوستیک و نورگیرهای شمالی.',
      ar: 'قاعة قراءة عامة مؤطّرة برفوف كتب خشبية ومناور إضاءة شمالية.',
    },
    sections: [
      {
        heading: {
          en: 'The Last Free Indoor Sanctuary in the City',
          fa: 'آخرین پناهگاه سرپوشیده رایگان در شهر',
          ar: 'آخر ملاذ داخلي مجاني في المدينة المعاصرة',
        },
        paragraph: {
          en: 'Almost every contemporary urban interior expects a commercial transaction at the door. Public libraries stand apart as rare civic living rooms where students, elders, remote workers, and children belong equally simply by stepping inside.',
          fa: 'تقریباً هر فضای سرپوشیده شهری امروز در آستانه در انتظار خریدی تجاری است. کتابخانه‌های عمومی به‌عنوان نشیمن‌های نادر مدنی، جایی هستند که دانشجو، سالمند، فریلنسر و کودک صرفاً با ورود، به‌طور برابر به آن تعلق دارند.',
          ar: 'في زمن تتطلب فيه معظم الفضاءات الداخلية إنفاقاً مادياً، تبقى المكتبة العامة غرفة معيشة مدنية نادرة يرحّب بها الجميع على قدم المساواة.',
        },
      },
      {
        heading: {
          en: 'Acoustic Gradients From Lively Forum to Silent Study',
          fa: 'گرادیان آکوستیک از میدانگاه پویا تا مطالعه خاموش',
          ar: 'تدرج صوتي من البهو الحيوي إلى قاعات الدراسة الصامتة',
        },
        paragraph: {
          en: 'Rather than enforcing hushed whispers at the threshold, we sequence spaces acoustically: storytelling steps and periodicals animate the ground court, while quiet individual reading carrels ascend toward sunlit upper galleries.',
          fa: 'به‌جای تحمیل سکوت خشک از همان ورودی، فضاها را با گرادیان آکوستیک می‌چینیم: پله‌های قصه‌گویی و نشریات حیاط همکف را زنده نگه می‌دارند و میزهای مطالعه انفرادی به ترازهای نورگیر و ساکت بالا می‌روند.',
          ar: 'بدلاً من فرض الصمت الصارم عند المدخل، يتدرج التصميم صوتياً من فناء أرضي حيوي للأنشطة إلى شرفات علوية هادئة للقراءة العميقة.',
        },
      },
      {
        heading: {
          en: 'Bookshelves as Thermal and Acoustic Lining',
          fa: 'قفسه‌های کتاب به‌عنوان لایه حرارتی و آکوستیک',
          ar: 'رفوف الكتب كبطانة صوتية وحرارية',
        },
        paragraph: {
          en: 'Thousands of paper volumes lining solid timber stacks form one of architecture’s finest natural sound diffusers—softening clatter while wrapping readers in unmistakable intellectual warmth.',
          fa: 'هزاران جلد کتاب چیده‌شده در قفسه‌های چوبی یکپارچه، یکی از بهترین پخش‌کننده‌های طبیعی صوت در معماری را می‌سازند و خوانندگان را در گرمایی فرهنگی و ملموس در بر می‌گیرند.',
          ar: 'تعمل آلاف المجلدات الورقية داخل الرفوف الخشبية كأفضل مشتت صوتي طبيعي يحيط القارئ بدفء معرفي ملموس.',
        },
      },
      {
        heading: {
          en: 'Opening Reading Tables Into Shaded Courtyards',
          fa: 'گشودن میزهای مطالعه به حیاط‌های سایه‌دار',
          ar: 'امتداد طاولات القراءة نحو الأفنية المظللة',
        },
        paragraph: {
          en: 'Folding timber glass doors connect indoor study tables seamlessly to pergola-shaded garden benches during spring and autumn—expanding civic capacity without building a single extra square meter of conditioned floor.',
          fa: 'درهای شیشه‌ای-چوبی تاشو، میزهای مطالعه داخلی را در بهار و پاییز به نیمکت‌های سایه‌دار باغ پیوند می‌دهند و ظرفیت مدنی کتابخانه را بی‌افزودن حتی یک مترمربع فضای تأسیساتی گسترش می‌دهند.',
          ar: 'تربط الأبواب الخشبية القابلة للطي قاعات القراءة بمقاعد الحديقة المظللة في الربيع والخريف، مما يضاعف سعة المكتبة طبيعياً.',
        },
      },
    ],
  },
] as const;

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getPreviousBlogPost(currentSlug: string): BlogPost {
  const index = BLOG_POSTS.findIndex((post) => post.slug === currentSlug);
  const prevIndex =
    index === -1
      ? BLOG_POSTS.length - 1
      : (index - 1 + BLOG_POSTS.length) % BLOG_POSTS.length;
  return BLOG_POSTS[prevIndex];
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

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

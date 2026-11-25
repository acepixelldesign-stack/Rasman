import type { Locale, NavItemId, NavSubItemId } from '@/lib/config/site';
import type {
  ProjectArchitectId,
  ProjectAreaId,
  ProjectColorId,
  ProjectLocationId,
  ProjectMaterialId,
  ProjectMode,
  ProjectStatusId,
  ProjectTypeId,
  ProjectYearId,
} from '@/lib/data/projects';

export interface Dictionary {
  readonly brand: {
    readonly logotype: string;
    readonly homeAriaLabel: string;
  };
  readonly header: {
    readonly primaryNavAriaLabel: string;
    readonly openMenuLabel: string;
    readonly closeMenuLabel: string;
    readonly languageSwitcherAriaLabel: string;
    readonly languageMenuAriaLabel: string;
    readonly themeToggleToDarkLabel: string;
    readonly themeToggleToLightLabel: string;
    readonly startProjectLabel: string;
    readonly userPanelLabel: string;
    readonly skipToContent: string;
  };
  readonly locales: Record<
    Locale,
    {
      readonly shortCode: string;
      readonly nativeName: string;
    }
  >;
  readonly navigation: {
    readonly navAriaLabel: string;
    readonly items: Record<NavItemId, string>;
    readonly subItems: Record<NavSubItemId, string>;
  };
  readonly podcast: {
    readonly regionAriaLabel: string;
    readonly sidebarAriaLabel: string;
    readonly categoryTitle: string;
    readonly openCategoriesAriaLabel: string;
    readonly closeCategoriesAriaLabel: string;
    readonly mobileEpisodesTrigger: string;
    readonly closeEpisodesDrawerAriaLabel: string;
    readonly speakersLabel: string;
    readonly totalTimeLabel: string;
    readonly listenOrSeeIn: string;
    readonly shareLabel: string;
    readonly shareCopiedLabel: string;
    readonly playEpisodeAriaLabel: string;
    readonly pauseEpisodeAriaLabel: string;
    readonly likeEpisodeAriaLabel: string;
    readonly previousEpisodeAriaLabel: string;
    readonly nextEpisodeAriaLabel: string;
    readonly playbackSpeedAriaLabel: string;
    readonly muteAriaLabel: string;
    readonly unmuteAriaLabel: string;
    readonly waveformSeekAriaLabel: string;
    readonly platformCastboxLabel: string;
    readonly platformSpotifyLabel: string;
    readonly platformYoutubeLabel: string;
    readonly emptyTitle: string;
    readonly emptyResetLabel: string;
    readonly openDetailsAriaLabel: string;
    readonly closeDetailsAriaLabel: string;
  };
  readonly blog: {
    readonly regionAriaLabel: string;
    readonly sidebarAriaLabel: string;
    readonly categoryTitle: string;
    readonly openCategoriesAriaLabel: string;
    readonly closeCategoriesAriaLabel: string;
    readonly categoriesAriaLabel: string;
    readonly byPrefix: string;
    readonly minReadSuffix: string;
    readonly backToMagazine: string;
    readonly shareStoryLabel: string;
    readonly shareCopiedLabel: string;
    readonly previousStoryLabel: string;
    readonly nextStoryLabel: string;
    readonly paginationAriaLabel: string;
    readonly previousPageLabel: string;
    readonly nextPageLabel: string;
    readonly pageAriaLabel: string;
    readonly emptyTitle: string;
    readonly emptyResetLabel: string;
    readonly notFoundTitle: string;
    readonly authorSocialsAriaLabel: string;
  };
  readonly socials: {
    readonly facebook: string;
    readonly x: string;
    readonly instagram: string;
    readonly linkedin: string;
  };
  readonly auth: {
    readonly modalTitlePhone: string;
    readonly modalSubtitlePhone: string;
    readonly phoneLabel: string;
    readonly phonePlaceholder: string;
    readonly phoneInvalidError: string;
    readonly sendOtpCta: string;
    readonly modalTitleOtp: string;
    readonly modalSubtitleOtpPrefix: string;
    readonly otpLabel: string;
    readonly otpHint: string;
    readonly otpInvalidError: string;
    readonly verifyOtpCta: string;
    readonly changePhoneLabel: string;
    readonly resendInPrefix: string;
    readonly resendSecondsSuffix: string;
    readonly resendCta: string;
    readonly successTitle: string;
    readonly successSubtitle: string;
    readonly successPhoneLabel: string;
    readonly successContinueCta: string;
    readonly closeModalAriaLabel: string;
    readonly modalTitleRegister: string;
    readonly modalSubtitleRegister: string;
    readonly firstNameLabel: string;
    readonly lastNameLabel: string;
    readonly birthDateLabel: string;
    readonly birthDatePlaceholder: string;
    readonly accountTypeLabel: string;
    readonly accountTypes: {
      readonly individual: string;
      readonly legal: string;
    };
    readonly userRoleLabel: string;
    readonly userRoles: {
      readonly designer: string;
      readonly investor: string;
      readonly landowner: string;
    };
    readonly registerSubmitCta: string;
    readonly errors: {
      readonly firstNameRequired: string;
      readonly lastNameRequired: string;
      readonly birthDateRequired: string;
    };
  };
  readonly panel: {
    readonly regionAriaLabel: string;
    readonly title: string;
    readonly emptyNotice: string;
    readonly signOutCta: string;
    readonly backHomeCta: string;
    readonly unauthenticatedTitle: string;
    readonly unauthenticatedCta: string;
    readonly accountTypeLabel: string;
    readonly userRoleLabel: string;
    readonly phoneLabel: string;
  };
  readonly about: {
    readonly regionAriaLabel: string;
    readonly sectionStudio: string;
    readonly sectionPrincipal: string;
    readonly sectionCoreTeam: string;
    readonly sectionPreviousTeam: string;
    readonly chapterNavAriaLabel: string;
    readonly memberSocialsAriaLabel: string;
  };
  readonly contact: {
    readonly regionAriaLabel: string;
    readonly title: string;
    readonly subtitleBeforeHours: string;
    readonly workingHours: string;
    readonly subtitleAfterHours: string;
    readonly callLabel: string;
    readonly mailLabel: string;
    readonly placeLabel: string;
    readonly sendMessageTitle: string;
    readonly openFormAriaLabel: string;
    readonly closeFormAriaLabel: string;
    readonly nameLabel: string;
    readonly contactFieldLabel: string;
    readonly messageLabel: string;
    readonly submitCta: string;
    readonly successTitle: string;
    readonly successSubtitle: string;
    readonly sendAnotherCta: string;
    readonly socialLabel: string;
    readonly errors: {
      readonly nameRequired: string;
      readonly contactInvalid: string;
      readonly messageRequired: string;
    };
  };
  readonly projects: {
    readonly regionAriaLabel: string;
    readonly title: string;
    readonly modeToggleAriaLabel: string;
    readonly modeTabs: Record<ProjectMode, string>;
    readonly modes: Record<ProjectMode, string>;
    readonly filterBarAriaLabel: string;
    readonly filtersTriggerAriaLabel: string;
    readonly filtersPanelTitle: string;
    readonly typeLabel: string;
    readonly statusLabel: string;
    readonly locationLabel: string;
    readonly categoriesLabel: string;
    readonly cityRegionLabel: string;
    readonly architectsLabel: string;
    readonly yearLabel: string;
    readonly materialsLabel: string;
    readonly areaLabel: string;
    readonly colorLabel: string;
    readonly applyFiltersLabel: string;
    readonly clearFiltersLabel: string;
    readonly activeFiltersLabel: string;
    readonly closeFiltersAriaLabel: string;
    readonly typeOptions: Record<ProjectTypeId, string>;
    readonly statusOptions: Record<ProjectStatusId, string>;
    readonly locationOptions: Record<ProjectLocationId, string>;
    readonly architectOptions: Record<ProjectArchitectId, string>;
    readonly yearOptions: Record<ProjectYearId, string>;
    readonly materialOptions: Record<ProjectMaterialId, string>;
    readonly areaOptions: Record<ProjectAreaId, string>;
    readonly colorOptions: Record<ProjectColorId, string>;
    readonly resetFilters: string;
    readonly emptyTitle: string;
    readonly emptyDescription: string;
    readonly detail: {
      readonly backToProjects: string;
      readonly specsHeading: string;
      readonly modeLabel: string;
      readonly typeLabel: string;
      readonly statusLabel: string;
      readonly locationLabel: string;
      readonly yearLabel: string;
      readonly areaLabel: string;
      readonly sqmUnit: string;
      readonly clientLabel: string;
      readonly leadArchitectLabel: string;
      readonly metricsHeading: string;
      readonly galleryHeading: string;
      readonly galleryPrevAriaLabel: string;
      readonly galleryNextAriaLabel: string;
      readonly shareProjectLabel: string;
      readonly shareCopiedLabel: string;
      readonly previousProjectLabel: string;
      readonly nextProjectLabel: string;
      readonly notFoundTitle: string;
      readonly lightbox: {
        readonly dialogAriaLabel: string;
        readonly closeAriaLabel: string;
        readonly prevAriaLabel: string;
        readonly nextAriaLabel: string;
        readonly tabs: {
          readonly images: string;
          readonly documents: string;
        };
      };
    };
  };
  readonly announcements: {
    readonly switchedToDark: string;
    readonly switchedToLight: string;
    readonly switchedLocale: string;
    readonly menuOpened: string;
    readonly menuClosed: string;
    readonly episodeSelected: string;
    readonly linkCopied: string;
    readonly authModalOpened: string;
    readonly authModalClosed: string;
    readonly otpSent: string;
    readonly authVerified: string;
    readonly registrationCompleted: string;
    readonly contactFormOpened: string;
    readonly contactFormClosed: string;
    readonly contactMessageSent: string;
  };
  readonly stage: {
    readonly regionAriaLabel: string;
  };
}

export const DICTIONARY: Record<Locale, Dictionary> = {
  en: {
    brand: {
      logotype: 'Rasman',
      homeAriaLabel: 'Rasman — Return to top',
    },
    header: {
      primaryNavAriaLabel: 'Primary navigation bar',
      openMenuLabel: 'Open navigation menu',
      closeMenuLabel: 'Close navigation menu',
      languageSwitcherAriaLabel: 'Select display language',
      languageMenuAriaLabel: 'Available languages',
      themeToggleToDarkLabel: 'Switch to dark mode',
      themeToggleToLightLabel: 'Switch to light mode',
      startProjectLabel: 'Start Project',
      userPanelLabel: 'Client Panel',
      skipToContent: 'Skip to main canvas',
    },
    locales: {
      en: {
        shortCode: 'EN',
        nativeName: 'English',
      },
      fa: {
        shortCode: 'FA',
        nativeName: 'فارسی',
      },
      ar: {
        shortCode: 'AR',
        nativeName: 'العربية',
      },
    },
    navigation: {
      navAriaLabel: 'Main navigation',
      items: {
        home: 'Home',
        sustainableArchitecture: 'Sustainable Architecture',
        projects: 'Projects',
        magazine: 'Magazine',
        podcast: 'Podcast',
        team: 'Rasman Team',
        contact: 'Contact Us',
      },
      subItems: {
        urbanArchitecture: 'Urban Architecture',
        sustainableProjects: 'Sustainable Architecture',
      },
    },
    podcast: {
      regionAriaLabel: 'Rasman Podcast Studio',
      sidebarAriaLabel: 'Podcast categories and episodes',
      categoryTitle: 'category',
      openCategoriesAriaLabel: 'Open categories',
      closeCategoriesAriaLabel: 'Close categories',
      mobileEpisodesTrigger: 'Categories & Podcasts',
      closeEpisodesDrawerAriaLabel: 'Close episodes list',
      speakersLabel: 'Speakers',
      totalTimeLabel: 'Duration',
      listenOrSeeIn: 'listen or see in:',
      shareLabel: 'share',
      shareCopiedLabel: 'copied',
      playEpisodeAriaLabel: 'Play episode',
      pauseEpisodeAriaLabel: 'Pause episode',
      likeEpisodeAriaLabel: 'Like episode',
      previousEpisodeAriaLabel: 'Previous episode',
      nextEpisodeAriaLabel: 'Next episode',
      playbackSpeedAriaLabel: 'Change playback speed',
      muteAriaLabel: 'Mute audio',
      unmuteAriaLabel: 'Unmute audio',
      waveformSeekAriaLabel: 'Audio timeline scrubber',
      platformCastboxLabel: 'Listen on Podcasts',
      platformSpotifyLabel: 'Listen on Audio Stream',
      platformYoutubeLabel: 'Watch on Video',
      emptyTitle: 'No episodes in this category yet.',
      emptyResetLabel: 'Show all episodes',
      openDetailsAriaLabel: 'Show episode details',
      closeDetailsAriaLabel: 'Hide episode details',
    },
    blog: {
      regionAriaLabel: 'Rasman Architectural Magazine',
      sidebarAriaLabel: 'Blog categories',
      categoryTitle: 'Category',
      openCategoriesAriaLabel: 'Open categories',
      closeCategoriesAriaLabel: 'Close categories',
      categoriesAriaLabel: 'Filter stories by category',
      byPrefix: 'by:',
      minReadSuffix: 'min read',
      backToMagazine: 'Back to Magazine',
      shareStoryLabel: 'Share this story',
      shareCopiedLabel: 'Link copied',
      previousStoryLabel: 'Previous Story',
      nextStoryLabel: 'Next Story',
      paginationAriaLabel: 'Magazine pages',
      previousPageLabel: 'Previous',
      nextPageLabel: 'Next',
      pageAriaLabel: 'Page',
      emptyTitle: 'No essays in this category yet.',
      emptyResetLabel: 'Show all essays',
      notFoundTitle: 'This story could not be found.',
      authorSocialsAriaLabel: 'Author social networks',
    },
    socials: {
      facebook: 'Facebook',
      x: 'X (Twitter)',
      instagram: 'Instagram',
      linkedin: 'LinkedIn',
    },
    auth: {
      modalTitlePhone: 'Start Your Project',
      modalSubtitlePhone:
        'Enter your mobile number to access the Rasman client studio and initiate a new architectural brief.',
      phoneLabel: 'Mobile Number',
      phonePlaceholder: '0912 345 6789',
      phoneInvalidError: 'Please enter a valid mobile number (at least 10 digits).',
      sendOtpCta: 'Send Verification Code',
      modalTitleOtp: 'Verify Mobile Number',
      modalSubtitleOtpPrefix: 'Enter the 5-digit verification code sent to',
      otpLabel: '5-Digit Verification Code',
      otpHint: 'Demo code: 11111',
      otpInvalidError: 'Invalid verification code. Please enter 11111.',
      verifyOtpCta: 'Verify & Enter Studio',
      changePhoneLabel: 'Edit number',
      resendInPrefix: 'Resend code in',
      resendSecondsSuffix: 's',
      resendCta: 'Resend code',
      successTitle: 'Welcome to Rasman Studio',
      successSubtitle:
        'Your mobile number is verified. Our architectural team is ready to review your site, program, and timeline.',
      successPhoneLabel: 'Verified number',
      successContinueCta: 'Continue Exploring',
      closeModalAriaLabel: 'Close Start Project dialog',
      modalTitleRegister: 'Complete Profile',
      modalSubtitleRegister:
        'Enter your details to open your Rasman client workspace.',
      firstNameLabel: 'First Name',
      lastNameLabel: 'Last Name',
      birthDateLabel: 'Date of Birth',
      birthDatePlaceholder: 'YYYY/MM/DD',
      accountTypeLabel: 'Account Type',
      accountTypes: {
        individual: 'Individual',
        legal: 'Corporate',
      },
      userRoleLabel: 'User Role',
      userRoles: {
        designer: 'Designer',
        investor: 'Investor',
        landowner: 'Landowner',
      },
      registerSubmitCta: 'Register & Enter Panel',
      errors: {
        firstNameRequired: 'Please enter your first name.',
        lastNameRequired: 'Please enter your last name.',
        birthDateRequired: 'Please enter a valid date of birth (YYYY/MM/DD).',
      },
    },
    panel: {
      regionAriaLabel: 'Rasman Client Panel',
      title: 'Client Panel',
      emptyNotice:
        'Your workspace is active. Project management modules will appear here in the next phase.',
      signOutCta: 'Sign Out',
      backHomeCta: 'Back to Studio',
      unauthenticatedTitle: 'Sign in to access your client panel',
      unauthenticatedCta: 'Start Project / Sign In',
      accountTypeLabel: 'Account',
      userRoleLabel: 'Role',
      phoneLabel: 'Phone',
    },
    about: {
      regionAriaLabel: 'About Rasman Studio & Team',
      sectionStudio: 'Rasman Team',
      sectionPrincipal: 'Founder',
      sectionCoreTeam: 'Current Members',
      sectionPreviousTeam: 'Previous Members',
      chapterNavAriaLabel: 'About page chapters',
      memberSocialsAriaLabel: 'Social links',
    },
    contact: {
      regionAriaLabel: 'Contact Rasman Architecture Studio',
      title: 'Contact Us',
      subtitleBeforeHours:
        'For project inquiries, spatial consultations, or studio visits, our Tehran studio is available Saturday through Wednesday,',
      workingHours: '09:00 – 18:00',
      subtitleAfterHours: '.',
      callLabel: 'Call',
      mailLabel: 'Mail',
      placeLabel: 'Place',
      sendMessageTitle: 'Send Message',
      openFormAriaLabel: 'Open send message form',
      closeFormAriaLabel: 'Close send message form',
      nameLabel: 'Full Name',
      contactFieldLabel: 'Phone or Email',
      messageLabel: 'Message',
      submitCta: 'Send Message',
      successTitle: 'Message Received',
      successSubtitle:
        'Thank you for reaching out. Our studio team will review your note and respond during working hours.',
      sendAnotherCta: 'Send Another Message',
      socialLabel: 'Social',
      errors: {
        nameRequired: 'Please enter your full name.',
        contactInvalid: 'Please enter a valid email address or mobile number.',
        messageRequired: 'Please write a brief message.',
      },
    },
    projects: {
      regionAriaLabel: 'Rasman Architectural Projects',
      title: 'Project',
      modeToggleAriaLabel: 'Select architectural mode',
      modeTabs: {
        sustainable: 'Sustainable',
        urban: 'Urban',
      },
      modes: {
        sustainable: 'Sustainable Architecture',
        urban: 'Urban Architecture',
      },
      filterBarAriaLabel: 'Filter projects by type, status, and city',
      filtersTriggerAriaLabel: 'Toggle project filters',
      filtersPanelTitle: 'Filters',
      typeLabel: 'TYPE',
      statusLabel: 'STATUS',
      locationLabel: 'LOCATION',
      categoriesLabel: 'Categories',
      cityRegionLabel: 'City / Region',
      architectsLabel: 'Architects',
      yearLabel: 'Year',
      materialsLabel: 'Materials',
      areaLabel: 'Area',
      colorLabel: 'Color',
      applyFiltersLabel: 'Apply Filters',
      clearFiltersLabel: 'Clear Filters',
      activeFiltersLabel: 'Active Filters',
      closeFiltersAriaLabel: 'Close filters panel',
      typeOptions: {
        all: 'All Types',
        residential: 'Residential',
        cultural: 'Cultural & Pavilion',
        urbanMixed: 'Urban & Mixed-Use',
        hospitality: 'Hospitality',
      },
      statusOptions: {
        all: 'All Statuses',
        concept: 'Concept',
        inProgress: 'In Progress',
        completed: 'Completed',
      },
      locationOptions: {
        all: 'All Cities',
        yazd: 'Yazd',
        shiraz: 'Shiraz',
        kashan: 'Kashan',
        lavasan: 'Lavasan',
        tehran: 'Tehran',
        isfahan: 'Isfahan',
      },
      architectOptions: {
        dariush: 'Dariush Rasman',
        sara: 'Sara Farahmand',
        navid: 'Navid Mansouri',
        kian: 'Kian Sohrabi',
        mina: 'Mina Tavakoli',
      },
      yearOptions: {
        '2026': '2026',
        '2025': '2025',
        '2024': '2024',
      },
      materialOptions: {
        rammedEarth: 'Rammed Earth',
        limestone: 'Limestone & Stone',
        timber: 'Mass Timber',
        brick: 'Brick Masonry',
        limePlaster: 'Lime Plaster',
        glassSteel: 'Glass & Steel',
      },
      areaOptions: {
        small: 'Under 1,000 m²',
        medium: '1,000 – 3,000 m²',
        large: 'Over 3,000 m²',
      },
      colorOptions: {
        ochre: 'Earth Ochre',
        limestone: 'Warm Limestone',
        terracotta: 'Terracotta Brick',
        timber: 'Oiled Oak',
        charcoal: 'Basalt Charcoal',
        olivine: 'Botanical Green',
      },
      resetFilters: 'Reset',
      emptyTitle: 'No projects match these criteria.',
      emptyDescription:
        'Try clearing one of the filters or switching architectural mode.',
      detail: {
        backToProjects: 'Back to Projects',
        specsHeading: 'Project Dossier',
        modeLabel: 'Discipline',
        typeLabel: 'Typology',
        statusLabel: 'Status',
        locationLabel: 'City',
        yearLabel: 'Year',
        areaLabel: 'Built Area',
        sqmUnit: 'm²',
        clientLabel: 'Client',
        leadArchitectLabel: 'Lead Architect',
        metricsHeading: 'Environmental Performance',
        galleryHeading: 'Gallery',
        galleryPrevAriaLabel: 'Previous gallery images',
        galleryNextAriaLabel: 'Next gallery images',
        shareProjectLabel: 'Share this project',
        shareCopiedLabel: 'Link copied',
        previousProjectLabel: 'Previous',
        nextProjectLabel: 'Next',
        notFoundTitle: 'This project could not be found.',
        lightbox: {
          dialogAriaLabel: 'Project gallery lightbox',
          closeAriaLabel: 'Close lightbox',
          prevAriaLabel: 'Previous item',
          nextAriaLabel: 'Next item',
          tabs: {
            images: 'Project Images',
            documents: 'Design Documents',
          },
        },
      },
    },
    announcements: {
      switchedToDark: 'Dark mode enabled',
      switchedToLight: 'Light mode enabled',
      switchedLocale: 'Language switched to English',
      menuOpened: 'Navigation menu opened',
      menuClosed: 'Navigation menu closed',
      episodeSelected: 'Episode loaded',
      linkCopied: 'Link copied to clipboard',
      authModalOpened: 'Start project sign-in opened',
      authModalClosed: 'Start project sign-in closed',
      otpSent: '5-digit verification code sent',
      authVerified: 'Verification succeeded',
      registrationCompleted: 'Registration completed. Opening client panel.',
      contactFormOpened: 'Send message form opened',
      contactFormClosed: 'Send message form closed',
      contactMessageSent: 'Your message has been sent',
    },
    stage: {
      regionAriaLabel: 'Architectural editorial section',
    },
  },
  fa: {
    brand: {
      logotype: 'Rasman',
      homeAriaLabel: 'رسمان — بازگشت به ابتدا',
    },
    header: {
      primaryNavAriaLabel: 'نوار ناوبری اصلی',
      openMenuLabel: 'باز کردن منوی ناوبری',
      closeMenuLabel: 'بستن منوی ناوبری',
      languageSwitcherAriaLabel: 'انتخاب زبان نمایش',
      languageMenuAriaLabel: 'زبان‌های در دسترس',
      themeToggleToDarkLabel: 'تغییر به حالت تیره',
      themeToggleToLightLabel: 'تغییر به حالت روشن',
      startProjectLabel: 'شروع پروژه',
      userPanelLabel: 'پنل کاربری',
      skipToContent: 'رفتن به بخش اصلی',
    },
    locales: {
      en: {
        shortCode: 'EN',
        nativeName: 'English',
      },
      fa: {
        shortCode: 'FA',
        nativeName: 'فارسی',
      },
      ar: {
        shortCode: 'AR',
        nativeName: 'العربية',
      },
    },
    navigation: {
      navAriaLabel: 'منوی اصلی',
      items: {
        home: 'خانه',
        sustainableArchitecture: 'معماری پایدار',
        projects: 'پروژه‌ها',
        magazine: 'مجله',
        podcast: 'پادکست',
        team: 'تیم رسمان',
        contact: 'تماس با ما',
      },
      subItems: {
        urbanArchitecture: 'معماری شهری',
        sustainableProjects: 'معماری پایدار',
      },
    },
    podcast: {
      regionAriaLabel: 'پادکست استودیو رسمان',
      sidebarAriaLabel: 'دسته‌بندی‌ها و اپیزودهای پادکست',
      categoryTitle: 'دسته‌بندی',
      openCategoriesAriaLabel: 'باز کردن دسته‌بندی‌ها',
      closeCategoriesAriaLabel: 'بستن دسته‌بندی‌ها',
      mobileEpisodesTrigger: 'دسته‌بندی و پادکست‌ها',
      closeEpisodesDrawerAriaLabel: 'بستن لیست اپیزودها',
      speakersLabel: 'گویندگان',
      totalTimeLabel: 'مدت زمان',
      listenOrSeeIn: 'شنیدن یا تماشا در:',
      shareLabel: 'اشتراک‌گذاری',
      shareCopiedLabel: 'کپی شد',
      playEpisodeAriaLabel: 'پخش اپیزود',
      pauseEpisodeAriaLabel: 'توقف اپیزود',
      likeEpisodeAriaLabel: 'پسندیدن اپیزود',
      previousEpisodeAriaLabel: 'اپیزود قبلی',
      nextEpisodeAriaLabel: 'اپیزود بعدی',
      playbackSpeedAriaLabel: 'تغییر سرعت پخش',
      muteAriaLabel: 'قطع صدا',
      unmuteAriaLabel: 'وصل صدا',
      waveformSeekAriaLabel: 'نوار پیشرفت صوتی',
      platformCastboxLabel: 'شنیدن در پادکست',
      platformSpotifyLabel: 'شنیدن در استریم صوتی',
      platformYoutubeLabel: 'تماشا در ویدیو',
      emptyTitle: 'هنوز اپیزودی در این دسته‌بندی ثبت نشده است.',
      emptyResetLabel: 'نمایش همه اپیزودها',
      openDetailsAriaLabel: 'نمایش جزئیات اپیزود',
      closeDetailsAriaLabel: 'بستن جزئیات اپیزود',
    },
    blog: {
      regionAriaLabel: 'مجله معماری رسمان',
      sidebarAriaLabel: 'دسته‌بندی‌های مجله',
      categoryTitle: 'دسته‌بندی',
      openCategoriesAriaLabel: 'باز کردن دسته‌بندی‌ها',
      closeCategoriesAriaLabel: 'بستن دسته‌بندی‌ها',
      categoriesAriaLabel: 'فیلتر مقالات بر اساس دسته‌بندی',
      byPrefix: 'نویسنده:',
      minReadSuffix: 'دقیقه مطالعه',
      backToMagazine: 'بازگشت به مجله',
      shareStoryLabel: 'اشتراک‌گذاری مقاله',
      shareCopiedLabel: 'لینک کپی شد',
      previousStoryLabel: 'مقاله قبلی',
      nextStoryLabel: 'مقاله بعدی',
      paginationAriaLabel: 'صفحه‌بندی مقالات',
      previousPageLabel: 'قبلی',
      nextPageLabel: 'بعدی',
      pageAriaLabel: 'صفحه',
      emptyTitle: 'هنوز مقاله‌ای در این دسته‌بندی ثبت نشده است.',
      emptyResetLabel: 'نمایش همه مقالات',
      notFoundTitle: 'مقاله مورد نظر یافت نشد.',
      authorSocialsAriaLabel: 'شبکه‌های اجتماعی نویسنده',
    },
    socials: {
      facebook: 'فیسبوک',
      x: 'ایکس (توییتر)',
      instagram: 'اینستاگرام',
      linkedin: 'لینکدین',
    },
    auth: {
      modalTitlePhone: 'شروع پروژه جدید',
      modalSubtitlePhone:
        'برای ورود به پنل مشتریان رسمان و ثبت درخواست طراحی، شماره تلفن همراه خود را وارد کنید.',
      phoneLabel: 'شماره تلفن همراه',
      phonePlaceholder: '0912 345 6789',
      phoneInvalidError: 'لطفاً یک شماره همراه معتبر (حداقل ۱۰ رقم) وارد کنید.',
      sendOtpCta: 'دریافت کد تایید',
      modalTitleOtp: 'تایید شماره همراه',
      modalSubtitleOtpPrefix: 'کد تایید ۵ رقمی ارسال‌شده به شماره زیر را وارد کنید:',
      otpLabel: 'کد تایید ۵ رقمی',
      otpHint: 'کد ورود آزمایشی: 11111',
      otpInvalidError: 'کد واردشده نادرست است. برای ورود پنج عدد ۱ وارد کنید.',
      verifyOtpCta: 'تایید و ورود',
      changePhoneLabel: 'ویرایش شماره',
      resendInPrefix: 'ارسال مجدد تا',
      resendSecondsSuffix: 'ثانیه دیگر',
      resendCta: 'ارسال مجدد کد',
      successTitle: 'به استودیو رسمان خوش آمدید',
      successSubtitle:
        'شماره همراه شما با موفقیت تایید شد. تیم معماری رسمان آماده بررسی سایت، برنامه فیزیکی و شروع پروژه شماست.',
      successPhoneLabel: 'شماره تاییدشده',
      successContinueCta: 'ادامه مشاهده وب‌سایت',
      closeModalAriaLabel: 'بستن پنجره شروع پروژه',
      modalTitleRegister: 'تکمیل ثبت‌نام',
      modalSubtitleRegister:
        'برای ایجاد حساب و ورود به پنل کاربری رسمان، مشخصات زیر را تکمیل کنید.',
      firstNameLabel: 'نام',
      lastNameLabel: 'نام خانوادگی',
      birthDateLabel: 'تاریخ تولد',
      birthDatePlaceholder: '1370/05/12',
      accountTypeLabel: 'نوع حساب',
      accountTypes: {
        individual: 'حقیقی',
        legal: 'حقوقی',
      },
      userRoleLabel: 'نوع کاربری',
      userRoles: {
        designer: 'طراح',
        investor: 'سرمایه‌گذار',
        landowner: 'صاحب زمین',
      },
      registerSubmitCta: 'ثبت‌نام و ورود به پنل',
      errors: {
        firstNameRequired: 'لطفاً نام خود را وارد کنید.',
        lastNameRequired: 'لطفاً نام خانوادگی خود را وارد کنید.',
        birthDateRequired: 'لطفاً تاریخ تولد را به‌درستی (مثلاً 1370/05/12) وارد کنید.',
      },
    },
    panel: {
      regionAriaLabel: 'پنل کاربری رسمان',
      title: 'پنل کاربری',
      emptyNotice:
        'حساب کاربری شما با موفقیت ثبت شد. این پنل در حال حاضر آماده است و بخش‌های تخصصی در مراحل بعدی تکمیل خواهند شد.',
      signOutCta: 'خروج از حساب',
      backHomeCta: 'بازگشت به استودیو',
      unauthenticatedTitle: 'برای دسترسی به پنل کاربری وارد شوید',
      unauthenticatedCta: 'شروع پروژه / ورود',
      accountTypeLabel: 'نوع حساب',
      userRoleLabel: 'نوع کاربری',
      phoneLabel: 'شماره همراه',
    },
    about: {
      regionAriaLabel: 'درباره استودیو و تیم رسمان',
      sectionStudio: 'تیم رسمان',
      sectionPrincipal: 'بنیان‌گذار',
      sectionCoreTeam: 'اعضای فعلی',
      sectionPreviousTeam: 'اعضای قبلی',
      chapterNavAriaLabel: 'بخش‌های صفحه درباره ما',
      memberSocialsAriaLabel: 'شبکه‌های اجتماعی',
    },
    contact: {
      regionAriaLabel: 'تماس با استودیو معماری رسمان',
      title: 'تماس با ما',
      subtitleBeforeHours:
        'برای مشاوره طراحی، آغاز همکاری یا هماهنگی بازدید حضوری، شنبه تا چهارشنبه از ساعت',
      workingHours: '09:00 – 18:00',
      subtitleAfterHours: 'در استودیو تهران پاسخگوی شما هستیم.',
      callLabel: 'تماس',
      mailLabel: 'ایمیل',
      placeLabel: 'نشانی',
      sendMessageTitle: 'ارسال پیام',
      openFormAriaLabel: 'باز کردن فرم ارسال پیام',
      closeFormAriaLabel: 'بستن فرم ارسال پیام',
      nameLabel: 'نام و نام خانوادگی',
      contactFieldLabel: 'ایمیل یا شماره همراه',
      messageLabel: 'متن پیام',
      submitCta: 'ارسال پیام',
      successTitle: 'پیام شما ثبت شد',
      successSubtitle:
        'سپاس از تماس شما. تیم استودیو پیام را بررسی کرده و در ساعات کاری با شما تماس می‌گیرد.',
      sendAnotherCta: 'ارسال پیام جدید',
      socialLabel: 'شبکه‌های اجتماعی',
      errors: {
        nameRequired: 'لطفاً نام و نام خانوادگی خود را وارد کنید.',
        contactInvalid: 'لطفاً یک ایمیل یا شماره همراه معتبر وارد کنید.',
        messageRequired: 'لطفاً متن پیام خود را بنویسید.',
      },
    },
    projects: {
      regionAriaLabel: 'پروژه‌های استودیو معماری رسمان',
      title: 'پروژه‌ها',
      modeToggleAriaLabel: 'انتخاب رویکرد معماری',
      modeTabs: {
        sustainable: 'پایدار',
        urban: 'شهری',
      },
      modes: {
        sustainable: 'معماری پایدار',
        urban: 'معماری شهری',
      },
      filterBarAriaLabel: 'فیلتر پروژه‌ها بر اساس نوع، وضعیت و شهر',
      filtersTriggerAriaLabel: 'باز و بسته کردن فیلترها',
      filtersPanelTitle: 'فیلترها',
      typeLabel: 'نوع پروژه',
      statusLabel: 'وضعیت',
      locationLabel: 'شهر',
      categoriesLabel: 'دسته‌بندی کاربری',
      cityRegionLabel: 'شهر و اقلیم',
      architectsLabel: 'معماران',
      yearLabel: 'سال اجرا',
      materialsLabel: 'مصالح',
      areaLabel: 'زیربنا',
      colorLabel: 'طیف رنگ',
      applyFiltersLabel: 'اعمال فیلتر',
      clearFiltersLabel: 'حذف فیلترها',
      activeFiltersLabel: 'فیلترهای فعال',
      closeFiltersAriaLabel: 'بستن پنل فیلترها',
      typeOptions: {
        all: 'همه کاربری‌ها',
        residential: 'مسکونی',
        cultural: 'فرهنگی و پاویون',
        urbanMixed: 'شهری و چندعملکردی',
        hospitality: 'اقامتگاه',
      },
      statusOptions: {
        all: 'همه وضعیت‌ها',
        concept: 'کانسپت',
        inProgress: 'در حال انجام',
        completed: 'انجام شده',
      },
      locationOptions: {
        all: 'همه شهرها',
        yazd: 'یزد',
        shiraz: 'شیراز',
        kashan: 'کاشان',
        lavasan: 'لواسان',
        tehran: 'تهران',
        isfahan: 'اصفهان',
      },
      architectOptions: {
        dariush: 'داریوش رسمان',
        sara: 'سارا فرهمند',
        navid: 'نوید منصوری',
        kian: 'کیان سهرابی',
        mina: 'مینا توکلی',
      },
      yearOptions: {
        '2026': '۲۰۲۶',
        '2025': '۲۰۲۵',
        '2024': '۲۰۲۴',
      },
      materialOptions: {
        rammedEarth: 'خاک کوبیده',
        limestone: 'سنگ آهک و بومی',
        timber: 'چوب مهندسی',
        brick: 'آجر بنایی',
        limePlaster: 'اندود آهکی',
        glassSteel: 'شیشه و فولاد',
      },
      areaOptions: {
        small: 'زیر ۱٬۰۰۰ مترمربع',
        medium: '۱٬۰۰۰ تا ۳٬۰۰۰ مترمربع',
        large: 'بالای ۳٬۰۰۰ مترمربع',
      },
      colorOptions: {
        ochre: 'خاکی اخرایی',
        limestone: 'آهکی گرم',
        terracotta: 'سفالی آجری',
        timber: 'بلوط طبیعی',
        charcoal: 'بازالت تیره',
        olivine: 'سبز گیاهی',
      },
      resetFilters: 'حذف فیلتر',
      emptyTitle: 'پروژه‌ای با این فیلترها یافت نشد.',
      emptyDescription:
        'فیلترها را بازنشانی کنید یا رویکرد معماری دیگری را انتخاب نمایید.',
      detail: {
        backToProjects: 'بازگشت به پروژه‌ها',
        specsHeading: 'شناسنامه پروژه',
        modeLabel: 'رویکرد',
        typeLabel: 'کاربری',
        statusLabel: 'وضعیت اجرا',
        locationLabel: 'شهر',
        yearLabel: 'سال',
        areaLabel: 'مساحت بنا',
        sqmUnit: 'مترمربع',
        clientLabel: 'کارفرما',
        leadArchitectLabel: 'معمار مسئول',
        metricsHeading: 'عملکرد اقلیمی و پایداری',
        galleryHeading: 'گالری',
        galleryPrevAriaLabel: 'تصاویر قبلی گالری',
        galleryNextAriaLabel: 'تصاویر بعدی گالری',
        shareProjectLabel: 'اشتراک‌گذاری پروژه',
        shareCopiedLabel: 'لینک کپی شد',
        previousProjectLabel: 'قبلی',
        nextProjectLabel: 'بعدی',
        notFoundTitle: 'پروژه مورد نظر یافت نشد.',
        lightbox: {
          dialogAriaLabel: 'پیش‌نمایش تمام‌صفحه پروژه',
          closeAriaLabel: 'بستن پیش‌نمایش',
          prevAriaLabel: 'مورد قبلی',
          nextAriaLabel: 'مورد بعدی',
          tabs: {
            images: 'تصاویر پروژه',
            documents: 'مدارک طراحی',
          },
        },
      },
    },
    announcements: {
      switchedToDark: 'حالت تیره فعال شد',
      switchedToLight: 'حالت روشن فعال شد',
      switchedLocale: 'زبان به فارسی تغییر یافت',
      menuOpened: 'منوی ناوبری باز شد',
      menuClosed: 'منوی ناوبری بسته شد',
      episodeSelected: 'اپیزود بارگذاری شد',
      linkCopied: 'لینک کپی شد',
      authModalOpened: 'پنجره ورود با شماره همراه باز شد',
      authModalClosed: 'پنجره ورود بسته شد',
      otpSent: 'کد تایید ۵ رقمی ارسال شد',
      authVerified: 'ورود با موفقیت انجام شد',
      registrationCompleted: 'ثبت‌نام با موفقیت انجام شد. در حال ورود به پنل کاربری.',
      contactFormOpened: 'فرم ارسال پیام باز شد',
      contactFormClosed: 'فرم ارسال پیام بسته شد',
      contactMessageSent: 'پیام شما با موفقیت ارسال شد',
    },
    stage: {
      regionAriaLabel: 'بخش مجله معماری',
    },
  },
  ar: {
    brand: {
      logotype: 'Rasman',
      homeAriaLabel: 'رسمان — العودة إلى الأعلى',
    },
    header: {
      primaryNavAriaLabel: 'شريط التنقل الرئيسي',
      openMenuLabel: 'فتح قائمة التنقل',
      closeMenuLabel: 'إغلاق قائمة التنقل',
      languageSwitcherAriaLabel: 'اختيار لغة العرض',
      languageMenuAriaLabel: 'اللغات المتاحة',
      themeToggleToDarkLabel: 'التبديل إلى الوضع الداكن',
      themeToggleToLightLabel: 'التبديل إلى الوضع الفاتح',
      startProjectLabel: 'ابدأ مشروعك',
      userPanelLabel: 'لوحة العميل',
      skipToContent: 'انتقل إلى المحتوى الرئيسي',
    },
    locales: {
      en: {
        shortCode: 'EN',
        nativeName: 'English',
      },
      fa: {
        shortCode: 'FA',
        nativeName: 'فارسی',
      },
      ar: {
        shortCode: 'AR',
        nativeName: 'العربية',
      },
    },
    navigation: {
      navAriaLabel: 'القائمة الرئيسية',
      items: {
        home: 'الرئيسية',
        sustainableArchitecture: 'العمارة المستدامة',
        projects: 'المشاريع',
        magazine: 'المجلة',
        podcast: 'البودكاست',
        team: 'فريق رسمان',
        contact: 'تواصل معنا',
      },
      subItems: {
        urbanArchitecture: 'العمارة الحضرية',
        sustainableProjects: 'العمارة المستدامة',
      },
    },
    podcast: {
      regionAriaLabel: 'بودكاست استوديو رسمان',
      sidebarAriaLabel: 'تصنيفات وحلقات البودكاست',
      categoryTitle: 'التصنيف',
      openCategoriesAriaLabel: 'فتح التصنيفات',
      closeCategoriesAriaLabel: 'إغلاق التصنيفات',
      mobileEpisodesTrigger: 'التصنيفات والبودكاست',
      closeEpisodesDrawerAriaLabel: 'إغلاق قائمة الحلقات',
      speakersLabel: 'المتحدثون',
      totalTimeLabel: 'المدة',
      listenOrSeeIn: 'استمع أو شاهد عبر:',
      shareLabel: 'مشاركة',
      shareCopiedLabel: 'تم النسخ',
      playEpisodeAriaLabel: 'تشغيل الحلقة',
      pauseEpisodeAriaLabel: 'إيقاف مؤقت',
      likeEpisodeAriaLabel: 'إعجاب بالحلقة',
      previousEpisodeAriaLabel: 'الحلقة السابقة',
      nextEpisodeAriaLabel: 'الحلقة التالية',
      playbackSpeedAriaLabel: 'تغيير سرعة التشغيل',
      muteAriaLabel: 'كتم الصوت',
      unmuteAriaLabel: 'إلغاء كتم الصوت',
      waveformSeekAriaLabel: 'شريط التمرير الصوتي',
      platformCastboxLabel: 'الاستماع على بودكاست',
      platformSpotifyLabel: 'الاستماع عبر البث الصوتي',
      platformYoutubeLabel: 'المشاهدة بالفيديو',
      emptyTitle: 'لا توجد حلقات في هذا التصنيف حالياً.',
      emptyResetLabel: 'عرض جميع الحلقات',
      openDetailsAriaLabel: 'عرض تفاصيل الحلقة',
      closeDetailsAriaLabel: 'إخفاء تفاصيل الحلقة',
    },
    blog: {
      regionAriaLabel: 'مجلة رسمان المعمارية',
      sidebarAriaLabel: 'تصنيفات المجلة',
      categoryTitle: 'التصنيف',
      openCategoriesAriaLabel: 'فتح التصنيفات',
      closeCategoriesAriaLabel: 'إغلاق التصنيفات',
      categoriesAriaLabel: 'تصفية المقالات حسب التصنيف',
      byPrefix: 'بقلم:',
      minReadSuffix: 'دقائق قراءة',
      backToMagazine: 'العودة إلى المجلة',
      shareStoryLabel: 'مشاركة المقال',
      shareCopiedLabel: 'تم نسخ الرابط',
      previousStoryLabel: 'المقال السابق',
      nextStoryLabel: 'المقال التالي',
      paginationAriaLabel: 'ترقيم صفحات المقالات',
      previousPageLabel: 'السابق',
      nextPageLabel: 'التالي',
      pageAriaLabel: 'صفحة',
      emptyTitle: 'لا توجد مقالات في هذا التصنيف حالياً.',
      emptyResetLabel: 'عرض جميع المقالات',
      notFoundTitle: 'تعذر العثور على هذا المقال.',
      authorSocialsAriaLabel: 'الشبكات الاجتماعية للكاتب',
    },
    socials: {
      facebook: 'فيسبوك',
      x: 'إكس (تويتر)',
      instagram: 'إنستغرام',
      linkedin: 'لينكدإن',
    },
    auth: {
      modalTitlePhone: 'ابدأ مشروعك الجديد',
      modalSubtitlePhone:
        'أدخل رقم هاتفك المحمول للدخول إلى لوحة عملاء رسمان وبدء موجز مشروعك المعماري.',
      phoneLabel: 'رقم الهاتف المحمول',
      phonePlaceholder: '0912 345 6789',
      phoneInvalidError: 'يرجى إدخال رقم هاتف صالح (١٠ أرقام على الأقل).',
      sendOtpCta: 'إرسال رمز التحقق',
      modalTitleOtp: 'تأكيد رقم الهاتف',
      modalSubtitleOtpPrefix: 'أدخل رمز التحقق المكوّن من ٥ أرقام المرسل إلى',
      otpLabel: 'رمز التحقق (٥ أرقام)',
      otpHint: 'الرمز التجريبي: 11111',
      otpInvalidError: 'رمز التحقق غير صحيح. يرجى إدخال 11111.',
      verifyOtpCta: 'تأكيد والدخول',
      changePhoneLabel: 'تعديل الرقم',
      resendInPrefix: 'إعادة الإرسال خلال',
      resendSecondsSuffix: 'ثانية',
      resendCta: 'إعادة إرسال الرمز',
      successTitle: 'مرحباً بك في استوديو رسمان',
      successSubtitle:
        'تم التحقق من رقم هاتفك بنجاح. فريقنا المعماري جاهز لمراجعة الموقع والبرنامج الزمني لمشروعك.',
      successPhoneLabel: 'الرقم المؤكد',
      successContinueCta: 'متابعة التصفح',
      closeModalAriaLabel: 'إغلاق نافذة بدء المشروع',
      modalTitleRegister: 'إكمال الملف الشخصي',
      modalSubtitleRegister:
        'أدخل بياناتك لفتح مساحة عملك الخاصة في استوديو رسمان.',
      firstNameLabel: 'الاسم الأول',
      lastNameLabel: 'اسم العائلة',
      birthDateLabel: 'تاريخ الميلاد',
      birthDatePlaceholder: 'YYYY/MM/DD',
      accountTypeLabel: 'نوع الحساب',
      accountTypes: {
        individual: 'فردي',
        legal: 'شركة',
      },
      userRoleLabel: 'الصفة',
      userRoles: {
        designer: 'مصمم',
        investor: 'مستثمر',
        landowner: 'مالك أرض',
      },
      registerSubmitCta: 'التسجيل والدخول إلى اللوحة',
      errors: {
        firstNameRequired: 'يرجى إدخال الاسم الأول.',
        lastNameRequired: 'يرجى إدخال اسم العائلة.',
        birthDateRequired: 'يرجى إدخال تاريخ ميلاد صالح (YYYY/MM/DD).',
      },
    },
    panel: {
      regionAriaLabel: 'لوحة عملاء رسمان',
      title: 'لوحة العميل',
      emptyNotice:
        'مساحة عملك مفعّلة حالياً. ستظهر وحدات إدارة المشاريع هنا في المرحلة القادمة.',
      signOutCta: 'تسجيل الخروج',
      backHomeCta: 'العودة إلى الاستوديو',
      unauthenticatedTitle: 'سجّل الدخول للوصول إلى لوحة العميل',
      unauthenticatedCta: 'ابدأ مشروعك / تسجيل الدخول',
      accountTypeLabel: 'الحساب',
      userRoleLabel: 'الصفة',
      phoneLabel: 'الهاتف',
    },
    about: {
      regionAriaLabel: 'عن استوديو وفريق رسمان',
      sectionStudio: 'فريق رسمان',
      sectionPrincipal: 'المؤسس',
      sectionCoreTeam: 'الأعضاء الحاليون',
      sectionPreviousTeam: 'الأعضاء السابقون',
      chapterNavAriaLabel: 'أقسام صفحة فريق رسمان',
      memberSocialsAriaLabel: 'الروابط الاجتماعية',
    },
    contact: {
      regionAriaLabel: 'التواصل مع استوديو رسمان للعمارة',
      title: 'تواصل معنا',
      subtitleBeforeHours:
        'لاستفسارات المشاريع أو الاستشارات المكانية أو زيارة الاستوديو، نرحب بكم من السبت إلى الأربعاء من الساعة',
      workingHours: '09:00 – 18:00',
      subtitleAfterHours: 'في استوديو طهران.',
      callLabel: 'اتصال',
      mailLabel: 'البريد',
      placeLabel: 'العنوان',
      sendMessageTitle: 'إرسال رسالة',
      openFormAriaLabel: 'فتح نموذج إرسال الرسالة',
      closeFormAriaLabel: 'إغلاق نموذج إرسال الرسالة',
      nameLabel: 'الاسم الكامل',
      contactFieldLabel: 'البريد الإلكتروني أو الهاتف',
      messageLabel: 'الرسالة',
      submitCta: 'إرسال الرسالة',
      successTitle: 'تم استلام رسالتك',
      successSubtitle:
        'شكراً لتواصلك معنا. سيقوم فريق الاستوديو بمراجعة رسالتك والرد خلال ساعات العمل.',
      sendAnotherCta: 'إرسال رسالة أخرى',
      socialLabel: 'الشبكات الاجتماعية',
      errors: {
        nameRequired: 'يرجى إدخال الاسم الكامل.',
        contactInvalid: 'يرجى إدخال بريد إلكتروني أو رقم هاتف صالح.',
        messageRequired: 'يرجى كتابة رسالة مختصرة.',
      },
    },
    projects: {
      regionAriaLabel: 'مشاريع استوديو رسمان المعمارية',
      title: 'المشاريع',
      modeToggleAriaLabel: 'اختيار النهج المعماري',
      modeTabs: {
        sustainable: 'مستدامة',
        urban: 'حضرية',
      },
      modes: {
        sustainable: 'العمارة المستدامة',
        urban: 'العمارة الحضرية',
      },
      filterBarAriaLabel: 'تصفية المشاريع حسب النوع والحالة والمدينة',
      filtersTriggerAriaLabel: 'إظهار أو إخفاء الفلاتر',
      filtersPanelTitle: 'الفلاتر',
      typeLabel: 'النوع',
      statusLabel: 'الحالة',
      locationLabel: 'المدينة',
      categoriesLabel: 'التصنيفات',
      cityRegionLabel: 'المدينة والإقليم',
      architectsLabel: 'المعماريون',
      yearLabel: 'السنة',
      materialsLabel: 'المواد',
      areaLabel: 'المساحة',
      colorLabel: 'اللون',
      applyFiltersLabel: 'تطبيق الفلاتر',
      clearFiltersLabel: 'مسح الفلاتر',
      activeFiltersLabel: 'الفلاتر النشطة',
      closeFiltersAriaLabel: 'إغلاق لوحة الفلاتر',
      typeOptions: {
        all: 'جميع الأنواع',
        residential: 'سكني',
        cultural: 'ثقافي وأجنحة',
        urbanMixed: 'حضري ومتعدد الاستخدامات',
        hospitality: 'ضيافة',
      },
      statusOptions: {
        all: 'جميع الحالات',
        concept: 'تصوّر أولي',
        inProgress: 'قيد التنفيذ',
        completed: 'مكتمل',
      },
      locationOptions: {
        all: 'جميع المدن',
        yazd: 'يزد',
        shiraz: 'شيراز',
        kashan: 'كاشان',
        lavasan: 'لواسان',
        tehran: 'طهران',
        isfahan: 'أصفهان',
      },
      architectOptions: {
        dariush: 'داريوش رسمان',
        sara: 'سارة فرهمند',
        navid: 'نويد منصوري',
        kian: 'كيان سهرابي',
        mina: 'مينا توكلي',
      },
      yearOptions: {
        '2026': '٢٠٢٦',
        '2025': '٢٠٢٥',
        '2024': '٢٠٢٤',
      },
      materialOptions: {
        rammedEarth: 'التربة المدكوكة',
        limestone: 'الحجر الجيري',
        timber: 'الخشب الهيكلي',
        brick: 'الطوب البنائي',
        limePlaster: 'الجص الجيري',
        glassSteel: 'الزجاج والفولاذ',
      },
      areaOptions: {
        small: 'أقل من ١٬٠٠٠ م²',
        medium: '١٬٠٠٠ – ٣٬٠٠٠ م²',
        large: 'أكثر من ٣٬٠٠٠ م²',
      },
      colorOptions: {
        ochre: 'مغرة ترابية',
        limestone: 'جيري دافئ',
        terracotta: 'طوب تراكوتا',
        timber: 'بلوط مدهون',
        charcoal: 'بازلت داكن',
        olivine: 'أخضر نباتي',
      },
      resetFilters: 'إعادة ضبط',
      emptyTitle: 'لا توجد مشاريع مطابقة لهذه المعايير.',
      emptyDescription:
        'جرّب مسح أحد الفلاتر أو التبديل إلى نهج معماري آخر.',
      detail: {
        backToProjects: 'العودة إلى المشاريع',
        specsHeading: 'ملف المشروع',
        modeLabel: 'التخصص',
        typeLabel: 'النمط',
        statusLabel: 'الحالة',
        locationLabel: 'المدينة',
        yearLabel: 'السنة',
        areaLabel: 'المساحة المبنية',
        sqmUnit: 'م²',
        clientLabel: 'العميل',
        leadArchitectLabel: 'المعماري المسؤول',
        metricsHeading: 'الأداء البيئي',
        galleryHeading: 'المعرض',
        galleryPrevAriaLabel: 'الصور السابقة',
        galleryNextAriaLabel: 'الصور التالية',
        shareProjectLabel: 'مشاركة المشروع',
        shareCopiedLabel: 'تم نسخ الرابط',
        previousProjectLabel: 'السابق',
        nextProjectLabel: 'التالي',
        notFoundTitle: 'تعذر العثور على هذا المشروع.',
        lightbox: {
          dialogAriaLabel: 'معرض صور المشروع بملء الشاشة',
          closeAriaLabel: 'إغلاق المعرض',
          prevAriaLabel: 'العنصر السابق',
          nextAriaLabel: 'العنصر التالي',
          tabs: {
            images: 'صور المشروع',
            documents: 'مستندات التصميم',
          },
        },
      },
    },
    announcements: {
      switchedToDark: 'تم تفعيل الوضع الداكن',
      switchedToLight: 'تم تفعيل الوضع الفاتح',
      switchedLocale: 'تم تغيير اللغة إلى العربية',
      menuOpened: 'تم فتح قائمة التنقل',
      menuClosed: 'تم إغلاق قائمة التنقل',
      episodeSelected: 'تم تحميل الحلقة',
      linkCopied: 'تم نسخ الرابط',
      authModalOpened: 'تم فتح نافذة بدء المشروع',
      authModalClosed: 'تم إغلاق نافذة بدء المشروع',
      otpSent: 'تم إرسال رمز التحقق المكوّن من ٥ أرقام',
      authVerified: 'تم التحقق بنجاح',
      registrationCompleted: 'اكتمل التسجيل. جارٍ فتح لوحة العميل.',
      contactFormOpened: 'تم فتح نموذج إرسال الرسالة',
      contactFormClosed: 'تم إغلاق نموذج إرسال الرسالة',
      contactMessageSent: 'تم إرسال رسالتك بنجاح',
    },
    stage: {
      regionAriaLabel: 'قسم المجلة المعمارية',
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARY[locale] ?? DICTIONARY.en;
}

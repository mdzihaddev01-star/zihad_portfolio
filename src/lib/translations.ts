import { SupportedLanguage } from '@/types/portfolio';

export interface Translations {
  nav: {
    home: string;
    about: string;
    skills: string;
    education: string;
    projects: string;
    certificates: string;
    games: string;
    contact: string;
    zeroGravity: string;
    admin: string;
  };
  hero: {
    badge: string;
    greeting: string;
    name: string;
    title: string;
    tagline: string;
    exploreBtn: string;
    bookBtn: string;
    zeroGravityBtn: string;
    statusActive: string;
    location: string;
    terminalUptime: string;
  };
  skillsEdu: {
    skillsTitle: string;
    skillsSubtitle: string;
    eduTitle: string;
    eduSubtitle: string;
    all: string;
    frontend: string;
    backend: string;
    coreCs: string;
    tools: string;
    degreeHonors: string;
  };
  projects: {
    title: string;
    subtitle: string;
    certsTitle: string;
    certsSubtitle: string;
    xrayMode: string;
    xrayNormal: string;
    liveDemo: string;
    viewCode: string;
    featuredTag: string;
    viewCertificate: string;
    closeModal: string;
    verifiedCredential: string;
  };
  certificatesSection: {
    title: string;
    subtitle: string;
    verifyAuthority: string;
    badgeCount: string;
  };
  games: {
    title: string;
    subtitle: string;
    snakeTab: string;
    runnerTab: string;
    score: string;
    highScore: string;
    startGame: string;
    pauseGame: string;
    restartGame: string;
    gameOver: string;
    soundOn: string;
    soundOff: string;
    snakeInstructions: string;
    runnerInstructions: string;
  };
  contact: {
    title: string;
    subtitle: string;
    bookTitle: string;
    selectDate: string;
    selectSlot: string;
    projectScope: string;
    scopeMvp: string;
    scopeFull: string;
    scopeEnterprise: string;
    estBudget: string;
    nameLabel: string;
    emailLabel: string;
    companyLabel: string;
    messageLabel: string;
    submitBooking: string;
    bookingSuccess: string;
    bookingSuccessMsg: string;
  };
  zorro: {
    botName: string;
    status: string;
    welcomeMsg: string;
    inputPlaceholder: string;
    sendBtn: string;
    chips: {
      skills: string;
      projects: string;
      education: string;
      hire: string;
    };
  };
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      education: 'Journey',
      projects: 'Projects',
      certificates: 'Certs',
      games: 'Arcade',
      contact: 'Book / Contact',
      zeroGravity: 'Zero-G Mode',
      admin: 'Admin CMS',
    },
    hero: {
      badge: 'ARCHITECT // FULL-STACK SPECIALIST',
      greeting: 'SYSTEM // ONLINE. I AM',
      name: 'MOHAMMAD ZIHAD',
      title: 'Creative Full-Stack & Software Developer',
      tagline: 'Crafting fluid zero-gravity digital worlds, hyper-animated web experiences, and resilient cloud architectures with obsidian precision.',
      exploreBtn: 'Explore Works',
      bookBtn: 'Book a Session',
      zeroGravityBtn: 'Zero-Gravity Mode',
      statusActive: 'Available for Global Contracts',
      location: 'Dhaka, BD • Remote Worldwide',
      terminalUptime: 'SYS_UPTIME: 99.98% • 60 FPS GL',
    },
    skillsEdu: {
      skillsTitle: 'Interactive Tech Arsenal',
      skillsSubtitle: 'Deep mastery spanning modern frontend shaders, backend microservices, and core algorithms.',
      eduTitle: 'Academic Journey & Milestones',
      eduSubtitle: 'From foundational competitive programming to high-distinction Computer Science.',
      all: 'All Arsenal',
      frontend: 'Frontend & GL',
      backend: 'Backend & Cloud',
      coreCs: 'Core CS (C/C++/Java)',
      tools: 'DevOps & Tools',
      degreeHonors: 'Dean’s Honors • Distinction',
    },
    projects: {
      title: 'Holographic Projects Showcase',
      subtitle: 'Production systems, 3D WebGL architectures, and intelligent agent engines.',
      certsTitle: 'Verified Accreditations',
      certsSubtitle: 'Industry certified credentials and algorithmic masteries.',
      xrayMode: 'X-Ray DOM Inspector',
      xrayNormal: 'Preview Mode',
      liveDemo: 'Live Experience',
      viewCode: 'Inspect Source',
      featuredTag: 'PRODUCTION GRADE',
      viewCertificate: 'Inspect Credential',
      closeModal: 'Close Inspector',
      verifiedCredential: 'Cryptographically Verified Badge',
    },
    certificatesSection: {
      title: 'Verified Accreditations & Honors',
      subtitle: 'Global certifications and algorithmic specializations recognized internationally.',
      verifyAuthority: 'Verify at Authority',
      badgeCount: '4 Verified Specializations',
    },
    games: {
      title: 'Play My Games: Retro Lab',
      subtitle: 'Interactive in-browser canvas mini-games with 8-bit Web Audio synthesizers.',
      snakeTab: 'Cyber Snake 2D',
      runnerTab: 'Neon Cyber Runner',
      score: 'SCORE',
      highScore: 'BEST',
      startGame: 'Start Game',
      pauseGame: 'Pause',
      restartGame: 'Play Again',
      gameOver: 'SYSTEM COLLISION!',
      soundOn: 'Audio Synthesizer: ON',
      soundOff: 'Audio Synthesizer: MUTED',
      snakeInstructions: 'Use Arrow Keys or on-screen D-Pad to collect energy bytes.',
      runnerInstructions: 'Press Spacebar or Tap Screen to jump over laser barricades.',
    },
    contact: {
      title: 'Let’s Build the Future Together',
      subtitle: 'Book a direct calendar slot and calculate project scope in real-time.',
      bookTitle: 'Reserve a Strategic Session',
      selectDate: '1. Select Consultation Date',
      selectSlot: '2. Pick Time Window',
      projectScope: '3. Scope & Architecture Scale',
      scopeMvp: 'Rapid MVP Prototype',
      scopeFull: 'Full-Stack Web App',
      scopeEnterprise: 'Enterprise 3D & AI Suite',
      estBudget: 'Estimated Investment',
      nameLabel: 'Your Full Name',
      emailLabel: 'Professional Email',
      companyLabel: 'Company / Project Name',
      messageLabel: 'Brief Brief / Vision',
      submitBooking: 'Confirm & Dispatch Booking',
      bookingSuccess: 'Meeting Confirmed!',
      bookingSuccessMsg: 'Your consultation slot is locked in. A calendar invite has been dispatched.',
    },
    zorro: {
      botName: 'ZORRO - Profile AI',
      status: 'Online • Profile AI',
      welcomeMsg: "Greetings! I'm ZORRO, Mohammad Zihad's autonomous profile AI. Ask me about his full-stack capabilities, featured projects, academic milestones, or contract availability!",
      inputPlaceholder: 'Ask ZORRO about Mohammad Zihad...',
      sendBtn: 'Send',
      chips: {
        skills: 'What are your core tech skills?',
        projects: 'Tell me about your best projects',
        education: 'What is your academic journey?',
        hire: 'Are you open for contracts?',
      },
    },
  },

  bn: {
    nav: {
      home: 'হোম',
      about: 'পরিচিতি',
      skills: 'দক্ষতা',
      education: 'শিক্ষাজীবন',
      projects: 'প্রজেক্টস',
      certificates: 'সনদপত্র',
      games: 'গেমস আর্কেড',
      contact: 'মিটিং / যোগাযোগ',
      zeroGravity: 'জিরো-গ্র্যাভিটি মোড',
      admin: 'অ্যাডমিন ড্যাশবোর্ড',
    },
    hero: {
      badge: 'আর্কিটেক্ট // ফুল-স্ট্যাক স্পেশালিস্ট',
      greeting: 'সিস্টেম // অনলাইন। আমি',
      name: 'মোহাম্মদ জিহাদ',
      title: 'ক্রিয়েটিভ ফুল-স্ট্যাক ও সফটওয়্যার ডেভেলপার',
      tagline: 'জিরো-গ্র্যাভিটি ডিজিটাল অভিজ্ঞতা, দৃষ্টিনন্দন মিনিমালিস্ট ডার্ক ইন্টারফেস ও স্কেলেবল ক্লাউড আর্কিটেকচার তৈরি করি।',
      exploreBtn: 'প্রজেক্ট দেখুন',
      bookBtn: 'মিটিং শিডিউল করুন',
      zeroGravityBtn: 'জিরো-গ্র্যাভিটি মোড',
      statusActive: 'গ্লোবাল রিমোট কাজের জন্য প্রস্তুত',
      location: 'ঢাকা, বাংলাদেশ • রিমোট ওয়ার্ল্ডওয়াইড',
      terminalUptime: 'সিস্টেম অ্যাক্টিভ: ৯৯.৯৮% • ৬০ FPS',
    },
    skillsEdu: {
      skillsTitle: 'ইন্টারেক্টিভ টেক আর্সেনাল',
      skillsSubtitle: 'মডার্ন ফ্রন্টএন্ড শেডার্স, ক্লাউড মাইক্রোসার্ভিসেস এবং কোর অ্যালগরিদমের গভীর দক্ষতা।',
      eduTitle: 'শিক্ষাজীবন ও উল্লেখযোগ্য অর্জন',
      eduSubtitle: 'কম্পিউটার সায়েন্স ও প্রোগ্রামিংয়ে ধারাবাহিক একাডেমিক শ্রেষ্ঠত্ব।',
      all: 'সকল দক্ষতা',
      frontend: 'ফ্রন্টএন্ড ও GL',
      backend: 'ব্যাকএন্ড ও ক্লাউড',
      coreCs: 'কোর CS (C/C++/Java)',
      tools: 'ডেভঅপস ও টুলস',
      degreeHonors: 'ডিনস অনার্স • জিপিএ ৫.০',
    },
    projects: {
      title: 'হলোগ্রাফিক প্রজেক্ট শোকেস',
      subtitle: 'প্রোডাকশন-রেডি সিস্টেম, ৩ডি ওয়েবজিএল এবং কৃত্রিম বুদ্ধিমত্তা এজেন্টস।',
      certsTitle: 'যাচাইকৃত সনদ ও সম্মাননা',
      certsSubtitle: 'আন্তর্জাতিক শীর্ষ প্রতিষ্ঠান থেকে প্রাপ্ত সম্মাননা ও সার্টিফিকেশন।',
      xrayMode: 'এক্স-রে কোড পরিদর্শক',
      xrayNormal: 'সাধারণ ভিউ',
      liveDemo: 'লাইভ ডেমো',
      viewCode: 'সোর্স কোড',
      featuredTag: 'প্রোডাকশন গ্রেড',
      viewCertificate: 'সার্টিফিকেট দেখুন',
      closeModal: 'বন্ধ করুন',
      verifiedCredential: 'ভেরিফায়েড ক্রিডেনশিয়াল',
    },
    certificatesSection: {
      title: 'ভেরিফাইড সনদপত্র ও আন্তর্জাতিক সম্মাননা',
      subtitle: 'বিশ্বমানের শীর্ষ প্রযুক্তি প্রতিষ্ঠান ও বিশ্ববিদ্যালয় থেকে অর্জিত সার্টিফিকেশন।',
      verifyAuthority: 'অথরিটি ভেরিফিকেশন',
      badgeCount: '৪টি আন্তর্জাতিক সম্মাননা',
    },
    games: {
      title: 'রেট্রো গেমস আর্কেড জোন',
      subtitle: 'ব্রাউজারে সরাসরি উপভোগ করুন ৮-বিট সিন্থেসাইজার সাউন্ডের আকর্ষণীয় গেম।',
      snakeTab: 'সাইবার স্নেক ২ডি',
      runnerTab: 'নিয়ন সাইবার রানার',
      score: 'স্কোর',
      highScore: 'সর্বোচ্চ',
      startGame: 'শুরু করুন',
      pauseGame: 'থামান',
      restartGame: 'পুনরায় খেলুন',
      gameOver: 'সিস্টেম ক্র্যাশ!',
      soundOn: 'সাউন্ড: চালু',
      soundOff: 'সাউন্ড: বন্ধ',
      snakeInstructions: 'তীর চিহ্ন বা অন-স্ক্রিন বাটন ব্যবহার করে এনার্জি সংগ্রহ করুন।',
      runnerInstructions: 'লেজার এড়াতে স্পেসবার চাপুন অথবা স্ক্রিনে ট্যাপ করুন।',
    },
    contact: {
      title: 'আসুন একসাথে অসাধারণ কিছু গড়ি',
      subtitle: 'সরাসরি মিটিং বুক করুন এবং প্রজেক্টের বাজেট হিসাব করুন।',
      bookTitle: 'ক্যালেন্ডার স্লট বুকিং',
      selectDate: '১. তারিখ নির্বাচন করুন',
      selectSlot: '২. সময় নির্ধারণ করুন',
      projectScope: '৩. কাজের পরিধি ও স্কেল',
      scopeMvp: 'দ্রুত এমভিপি প্রোটোটাইপ',
      scopeFull: 'ফুল-স্ট্যাক ওয়েব অ্যাপ্লিকেশন',
      scopeEnterprise: 'এন্টারপ্রাইজ ৩ডি ও এআই স্যুয়িট',
      estBudget: 'আনুমানিক বাজেট',
      nameLabel: 'আপনার নাম',
      emailLabel: 'ইমেইল অ্যাড্রেস',
      companyLabel: 'কোম্পানি / সংস্থা',
      messageLabel: 'প্রজেক্টের বিবরণ',
      submitBooking: 'বুকিং নিশ্চিত করুন',
      bookingSuccess: 'মিটিং বুকিং সম্পন্ন হয়েছে!',
      bookingSuccessMsg: 'আপনার মিটিং স্লট সংরক্ষিত হয়েছে। দ্রুত ইমেইলে আমন্ত্রণ পাঠানো হচ্ছে।',
    },
    zorro: {
      botName: 'ZORRO - Profile AI',
      status: 'অনলাইন • প্রোফাইল এআই',
      welcomeMsg: "নমস্কার! আমি জোরো—মোহাম্মদ জিহাদের স্বয়ংক্রিয় প্রোফাইল এআই। আপনি জিহাদের টেকনিক্যাল দক্ষতা, প্রজেক্ট, পড়াশোনা বা নতুন প্রজেক্ট বুকিং নিয়ে যেকোনো প্রশ্ন করতে পারেন!",
      inputPlaceholder: 'মোহাম্মদ জিহাদ সম্পর্কে জোরো-কে জিজ্ঞেস করুন...',
      sendBtn: 'পাঠান',
      chips: {
        skills: 'মূল টেকনিক্যাল দক্ষতা কী কী?',
        projects: 'সেরা প্রজেক্টগুলো সম্পর্কে বলো',
        education: 'শিক্ষাগত যোগ্যতা কেমন?',
        hire: 'নতুন কাজের জন্য প্রস্তুত কি?',
      },
    },
  },

  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'نبذة',
      skills: 'المهارات',
      education: 'المسار الأكاديمي',
      projects: 'المشاريع',
      certificates: 'الشهادات',
      games: 'منطقة الألعاب',
      contact: 'حجز جلسة / تواصل',
      zeroGravity: 'انعدام الجاذبية',
      admin: 'لوحة التحكم',
    },
    hero: {
      badge: 'مهندس برمجيات // خبير تطوير شامل',
      greeting: 'النظام // متصل. أنا',
      name: 'محمد جهاد (MOHAMMAD ZIHAD)',
      title: 'Creative Full-Stack & Software Developer',
      tagline: 'أصمم عوالم رقمية تفاعلية ثلاثية الأبعاد، وتجارب ويب فائقة السرعة مع بنية سحابية متقدمة وتصميم داكن هادئ ومتقن.',
      exploreBtn: 'استكشف الأعمال',
      bookBtn: 'احجز جلسة استشارية',
      zeroGravityBtn: 'وضع انعدام الجاذبية',
      statusActive: 'متاح للتعاقد والمشاريع العالمية',
      location: 'دكا، بنغلاديش • متاح عن بُعد عالمياً',
      terminalUptime: 'جاهزية النظام: 99.98% • 60 FPS',
    },
    skillsEdu: {
      skillsTitle: 'الترسانة التقنية التفاعلية',
      skillsSubtitle: 'إتقان عميق يشمل رسوميات WebGL المتقدمة، الخدمات المصغرة السحابية والخوارزميات.',
      eduTitle: 'المسار التعليمي والإنجازات',
      eduSubtitle: 'من البدايات في البرمجة التنافسية إلى مرتبة الشرف في هندسة البرمجيات.',
      all: 'جميع المهارات',
      frontend: 'الواجهة الأمامية و GL',
      backend: 'الواجهة الخلفية والسحابية',
      coreCs: 'علوم الحاسوب الأساسية (C/C++/Java)',
      tools: 'أدوات DevOps',
      degreeHonors: 'مرتبة الشرف الأكاديمية • امتياز',
    },
    projects: {
      title: 'معرض المشاريع المجسمة',
      subtitle: 'أنظمة متكاملة، عمارة WebGL ثلاثية الأبعاد ومحركات الذكاء الاصطناعي.',
      certsTitle: 'الشهادات والاعتمادات',
      certsSubtitle: 'أوراق اعتماد رسمية معترف بها في مجال هندسة البرمجيات.',
      xrayMode: 'مفتش كود الأشعة السينية',
      xrayNormal: 'الوضع الطبيعي',
      liveDemo: 'معاينة حية',
      viewCode: 'الكود المصدري',
      featuredTag: 'أنظمة إنتاجية',
      viewCertificate: 'عرض الشهادة',
      closeModal: 'إغلاق',
      verifiedCredential: 'شهادة موثقة رقمياً',
    },
    certificatesSection: {
      title: 'الشهادات والاعتمادات الرسمية',
      subtitle: 'شهادات معتمدة عالمياً في هندسة البرمجيات وبنية الحوسبة السحابية.',
      verifyAuthority: 'التحقق من الجهة المانحة',
      badgeCount: '٤ اعتمادات معترف بها',
    },
    games: {
      title: 'صالة الألعاب الكلاسيكية',
      subtitle: 'ألعاب مصغرة مباشرة في المتصفح مع مؤثرات صوتية بدقة 8-بت عبر Web Audio.',
      snakeTab: 'الثعبان السيبراني 2D',
      runnerTab: 'العداء النيوني',
      score: 'النقاط',
      highScore: 'الأعلى',
      startGame: 'ابدأ اللعبة',
      pauseGame: 'إيقاف مؤقت',
      restartGame: 'العب مجدداً',
      gameOver: 'اصطدام النظام!',
      soundOn: 'الصوت: مفعّل',
      soundOff: 'الصوت: صامت',
      snakeInstructions: 'استخدم مفاتيح الأسهم لجمع حزم الطاقة البرمجية.',
      runnerInstructions: 'اضغط زر المسافة أو انقر الشاشة للقفز فوق حواجز الليزر.',
    },
    contact: {
      title: 'لنصنع معاً تجارب رقمية استثنائية',
      subtitle: 'احجز موعداً في الجدول الزمني واحسب تكلفة المشروع في الوقت الفعلي.',
      bookTitle: 'حجز جلسة استراتيجية',
      selectDate: '١. اختر التاريخ المناسب',
      selectSlot: '٢. اختر الفترة الزمنية',
      projectScope: '٣. حجم ونطاق المشروع',
      scopeMvp: 'نموذج أولي سريع (MVP)',
      scopeFull: 'تطبيق ويب متكامل',
      scopeEnterprise: 'نظام ثلاثي الأبعاد وذكاء اصطناعي للمؤسسات',
      estBudget: 'الميزانية التقديرية',
      nameLabel: 'الاسم الكامل',
      emailLabel: 'البريد الإلكتروني المهني',
      companyLabel: 'الشركة أو اسم المشروع',
      messageLabel: 'نبذة عن فكرتك',
      submitBooking: 'تأكيد وإرسال الحجز',
      bookingSuccess: 'تم تأكيد الحجز بنجاح!',
      bookingSuccessMsg: 'تم حجز موعدك بنجاح في الجدول الزمني، وتم إرسال تفاصيل الاجتماع.',
    },
    zorro: {
      botName: 'ZORRO - Profile AI',
      status: 'متصل • الذكاء الاصطناعي للملف الشخصي',
      welcomeMsg: 'مرحباً بك! أنا زورو، المساعد الذكي المستقل للمطور محمد جهاد. اسألني عن مهاراته التقنية، مشاريعه، مسيرته الأكاديمية أو إمكانية التعاقد معه!',
      inputPlaceholder: 'اسأل زورو عن محمد جهاد...',
      sendBtn: 'إرسال',
      chips: {
        skills: 'ما هي أهم مهاراتك التقنية؟',
        projects: 'أخبرني عن أفضل مشاريعك',
        education: 'ما هو مسارك التعليمي؟',
        hire: 'هل أنت متاح للمشاريع؟',
      },
    },
  },

  fr: {
    nav: {
      home: 'Accueil',
      about: 'À propos',
      skills: 'Compétences',
      education: 'Parcours',
      projects: 'Projets',
      certificates: 'Certificats',
      games: 'Arcade',
      contact: 'Réserver / Contact',
      zeroGravity: 'Mode Zéro-G',
      admin: 'Console Admin',
    },
    hero: {
      badge: 'ARCHITECTE // SPÉCIALISTE FULL-STACK',
      greeting: 'SYSTÈME // EN LIGNE. JE SUIS',
      name: 'MOHAMMAD ZIHAD',
      title: 'Creative Full-Stack & Software Developer',
      tagline: 'Conception d’environnements digitaux zéro-gravité, expériences web hyper-animées et architectures cloud résilientes avec précision obsidienne.',
      exploreBtn: 'Explorer les Projets',
      bookBtn: 'Réserver une Session',
      zeroGravityBtn: 'Mode Zéro-Gravité',
      statusActive: 'Disponible pour contrats internationaux',
      location: 'Dhaka, BD • Disponible en remote mondial',
      terminalUptime: 'UPTIME_SYSTÈME: 99.98% • 60 FPS GL',
    },
    skillsEdu: {
      skillsTitle: 'Arsenal Technologique Interactif',
      skillsSubtitle: 'Maîtrise approfondie des shaders frontend, des microservices backend et des algorithmes fondamentaux.',
      eduTitle: 'Parcours Académique & Jalons',
      eduSubtitle: 'De la programmation compétitive au diplôme universitaire d’excellence en informatique.',
      all: 'Tout l’arsenal',
      frontend: 'Frontend & GL',
      backend: 'Backend & Cloud',
      coreCs: 'Informatique Fondamentale (C/C++/Java)',
      tools: 'DevOps & Outils',
      degreeHonors: 'Prix d’Excellence du Doyen',
    },
    projects: {
      title: 'Vitrine Holographique de Projets',
      subtitle: 'Systèmes en production, architectures 3D WebGL et moteurs d’agents IA autonomes.',
      certsTitle: 'Accréditations Vérifiées',
      certsSubtitle: 'Certifications professionnelles internationales et maîtrises algorithmiques.',
      xrayMode: 'Inspecteur de Code X-Ray',
      xrayNormal: 'Mode Normal',
      liveDemo: 'Expérience Live',
      viewCode: 'Inspecter Code',
      featuredTag: 'QUALITÉ PRODUCTION',
      viewCertificate: 'Voir Certificat',
      closeModal: 'Fermer',
      verifiedCredential: 'Badge Cryptographiquement Vérifié',
    },
    certificatesSection: {
      title: 'Accréditations & Titres Officiels',
      subtitle: 'Certifications de niveau international en architecture logicielle et cloud.',
      verifyAuthority: 'Vérifier auprès de l’Autorité',
      badgeCount: '4 Spécialisations Vérifiées',
    },
    games: {
      title: 'Zone Arcade Rétro',
      subtitle: 'Mini-jeux canvas dans le navigateur avec synthétiseurs audio 8-bit Web Audio.',
      snakeTab: 'Cyber Snake 2D',
      runnerTab: 'Cyber Runner Néon',
      score: 'SCORE',
      highScore: 'RECORD',
      startGame: 'Démarrer',
      pauseGame: 'Pause',
      restartGame: 'Rejouer',
      gameOver: 'COLLISION SYSTÈME !',
      soundOn: 'Synthétiseur Audio : ACTIVÉ',
      soundOff: 'Synthétiseur Audio : MUET',
      snakeInstructions: 'Utilisez les flèches ou les commandes tactiles pour collecter les bytes d’énergie.',
      runnerInstructions: 'Appuyez sur Espace ou touchez l’écran pour sauter par-dessus les lasers.',
    },
    contact: {
      title: 'Bâtissons l’Avenir Ensemble',
      subtitle: 'Réservez un créneau directement et estimez la portée de votre projet en direct.',
      bookTitle: 'Réserver une Session Stratégique',
      selectDate: '1. Choisissez la Date',
      selectSlot: '2. Choisissez l’Heure',
      projectScope: '3. Envergure du Projet',
      scopeMvp: 'Prototype MVP Rapide',
      scopeFull: 'Application Web Complète',
      scopeEnterprise: 'Suite Entreprise 3D & IA',
      estBudget: 'Investissement Estimé',
      nameLabel: 'Nom Complet',
      emailLabel: 'Email Professionnel',
      companyLabel: 'Entreprise / Projet',
      messageLabel: 'Vision du Projet',
      submitBooking: 'Confirmer la Réservation',
      bookingSuccess: 'Session Confirmée !',
      bookingSuccessMsg: 'Votre créneau est réservé. Une invitation calendrier vous a été envoyée.',
    },
    zorro: {
      botName: 'ZORRO - Profile AI',
      status: 'En ligne • Profile AI',
      welcomeMsg: "Bienvenue ! Je suis ZORRO, l’IA de profil autonome de Mohammad Zihad. Interrogez-moi sur ses compétences techniques, ses projets majeurs, son parcours ou sa disponibilité !",
      inputPlaceholder: 'Posez une question sur Mohammad Zihad...',
      sendBtn: 'Envoyer',
      chips: {
        skills: 'Quelles sont tes compétences clés ?',
        projects: 'Parle-moi de tes meilleurs projets',
        education: 'Quel est ton parcours académique ?',
        hire: 'Es-tu disponible pour des contrats ?',
      },
    },
  },
};

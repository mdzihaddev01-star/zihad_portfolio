import { NextRequest, NextResponse } from 'next/server';
import { fetchSiteSettings } from '@/lib/siteSettings';
import { 
  supabase, 
  isSupabaseConfigured, 
  DEFAULT_SETTINGS, 
  DEFAULT_PROJECTS, 
  DEFAULT_SKILLS, 
  DEFAULT_EDUCATION 
} from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { message, language } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const trimmedMessage = message.trim();

    // -------------------------------------------------------------------------
    // 1. DYNAMIC DEVELOPER KNOWLEDGE CONTEXT (SUPABASE WITH ZERO-FALLBACK GAPS)
    // -------------------------------------------------------------------------
    let profileData = DEFAULT_SETTINGS;
    let projectsData = DEFAULT_PROJECTS;
    let skillsData = DEFAULT_SKILLS;
    let educationData = DEFAULT_EDUCATION;

    if (isSupabaseConfigured && supabase) {
      try {
        const [settingsData, projRes, skillsRes, eduRes] = await Promise.all([
          fetchSiteSettings(),
          supabase.from('projects').select('*').order('order_index', { ascending: true }),
          supabase.from('skills').select('*').order('order_index', { ascending: true }),
          supabase.from('education').select('*').order('order_index', { ascending: true }),
        ]);

        if (settingsData) profileData = { ...DEFAULT_SETTINGS, ...settingsData };
        if (projRes.data && projRes.data.length > 0) projectsData = projRes.data;
        if (skillsRes.data && skillsRes.data.length > 0) skillsData = skillsRes.data;
        if (eduRes.data && eduRes.data.length > 0) educationData = eduRes.data;
      } catch (dbErr) {
        console.warn('Supabase profile context fetch warning (using verified defaults):', dbErr);
      }
    }

    const projectsSummary = projectsData
      .map((p) => `- ${p.title} (${p.category}): ${p.description}. Tech: ${p.tags.join(', ')}. Demo: ${p.live_url}, GitHub: ${p.github_url || 'N/A'}`)
      .join('\n');

    const skillsSummary = skillsData
      .map((s) => `- ${s.name} (${s.category}): ${s.proficiency || (s as any).level || 90}% proficiency`)
      .join('\n');

    const educationSummary = educationData
      .map((e) => `- ${e.degree} at ${e.institution} (${e.start_year} - ${e.end_year}). ${e.field_of_study || ''}. ${e.description || ''}`)
      .join('\n');

    // Canonical Developer Contact Details
    const primaryEmail = profileData.contact_email || profileData.public_email || '';
    const altEmail = profileData.public_email || primaryEmail;
    const primaryPhone = profileData.public_phone || profileData.phone || '';
    const githubUrl = profileData.social_github || 'https://github.com/mohammadzihad';
    const linkedinUrl = profileData.social_linkedin || 'https://linkedin.com/in/mohammadzihad';
    const twitterUrl = profileData.social_twitter || 'https://twitter.com/mohammadzihad';
    const location = profileData.public_address || profileData.address || profileData.city_country || profileData.location || '';

    // -------------------------------------------------------------------------
    // 2. SYSTEM INSTRUCTION (ZERO HALLUCINATION & MULTILINGUAL RULES)
    // -------------------------------------------------------------------------
    const systemInstruction = `
You are "Ask ZORRO", the autonomous AI profile assistant and technical representative of Mohammad Zihad.
Mohammad Zihad is a senior Creative Full-Stack Developer, Software Engineer, and Digital Architect based in Dhaka, Bangladesh (UTC+6).

PRIMARY CONTACT INFORMATION (CRITICAL: When asked for email, gmail, phone, github, linkedin, or socials, output these immediately and accurately):
- Gmail / Primary Email: ${primaryEmail} (Alternative: ${altEmail})
- Phone / WhatsApp: ${primaryPhone}
- Location: ${location}
- GitHub: ${githubUrl}
- LinkedIn: ${linkedinUrl}
- Twitter / X: ${twitterUrl}
- Meeting Booking: Section 7 of this portfolio (#contact) or via direct email.

DEVELOPER PROFILE & IDENTITY:
- Full Name: Mohammad Zihad
- Profession: Creative Full-Stack Developer & Software Architect
- Bio: ${profileData.bio}
- Availability: ${profileData.availability || 'Available for global contracts, remote roles, and high-impact engineering projects'}

TECHNICAL ARSENAL & SKILLS:
${skillsSummary}

FEATURED PROJECTS SHOWCASE:
${projectsSummary}

ACADEMIC CREDENTIALS & EDUCATION:
${educationSummary}

COMMUNICATION & MULTILINGUAL RULES (MANDATORY):
1. Detect the user's language automatically from their query:
   - English: Respond in clean, crisp, courteous, articulate English.
   - Bengali (বাংলা) or Banglish (e.g. "zihader email ki", "kemon achen", "skill gulo bolo"): Respond in fluent, polite, natural Bengali (বাংলা).
   - Arabic (العربية): Respond in fluent, polite Modern Standard Arabic (العربية).
   - French (Français): Respond in refined, polite French.
2. Tone: Extremely helpful, polite, concise, technologically sharp, and humble.
3. Keep answers focused (2 to 4 sentences or a clean bullet list). Do not generate overly verbose essays.
4. IDENTITY: You are strictly "Ask ZORRO". Never refer to yourself as Gemini or an LLM.
5. ZERO HALLUCINATION: Never invent credentials, past clients, or technologies outside what is listed above.
`;

    // -------------------------------------------------------------------------
    // 3. GOOGLE GEMINI REST API INTEGRATION
    // -------------------------------------------------------------------------
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (apiKey) {
      try {
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const payload = {
          system_instruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: trimmedMessage }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        };

        const geminiRes = await fetch(geminiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (reply) {
            return NextResponse.json({ reply });
          }
        } else {
          const errDetail = await geminiRes.text();
          console.warn('Gemini REST API non-OK status:', geminiRes.status, errDetail);
        }
      } catch (geminiError) {
        console.warn('Gemini fetch invocation warning, utilizing grounded NLP:', geminiError);
      }
    }

    // -------------------------------------------------------------------------
    // 4. INTELLIGENT GROUNDED MULTILINGUAL NLP FALLBACK
    // (Used when GEMINI_API_KEY is not set or network is unreachable.
    //  CRITICAL: Never repeats the static canned welcome intro message!)
    // -------------------------------------------------------------------------
    const lower = trimmedMessage.toLowerCase();
    const isBn = language === 'bn' || /[\u0980-\u09FF]/.test(trimmedMessage) || lower.includes('zihad') && (lower.includes('er ') || lower.includes('ki ') || lower.includes('dao'));
    const isAr = language === 'ar' || /[\u0600-\u06FF]/.test(trimmedMessage);
    const isFr = language === 'fr' || lower.includes('bonjour') || lower.includes('comment');

    let reply = '';

    // Contact / Gmail / Email inquiries
    const isEmailQuery = lower.includes('gmail') || lower.includes('email') || lower.includes('mail') || lower.includes('contact') || lower.includes('reach') || lower.includes('message') || lower.includes('ইমেইল') || lower.includes('জিমেইল') || lower.includes('যোগাযোগ') || lower.includes('চিঠি') || lower.includes('بريد') || lower.includes('ايميل') || lower.includes('تواصل');
    const isPhoneQuery = lower.includes('phone') || lower.includes('number') || lower.includes('call') || lower.includes('whatsapp') || lower.includes('ফোন') || lower.includes('নম্বর') || lower.includes('هاتف') || lower.includes('واتساب');
    const isGithubQuery = lower.includes('github') || lower.includes('git') || lower.includes('repo') || lower.includes('গিটহাব') || lower.includes('রিপো');
    const isLinkedinQuery = lower.includes('linkedin') || lower.includes('লিঙ্কডইন') || lower.includes('لينكد');
    const isSkillsQuery = lower.includes('skill') || lower.includes('stack') || lower.includes('tech') || lower.includes('frontend') || lower.includes('backend') || lower.includes('language') || lower.includes('দক্ষতা') || lower.includes('প্রযুক্তি') || lower.includes('مهار');
    const isProjectsQuery = lower.includes('project') || lower.includes('work') || lower.includes('portfolio') || lower.includes('aether') || lower.includes('cyberpulse') || lower.includes('nexus') || lower.includes('প্রজেক্ট') || lower.includes('কাজ') || lower.includes('مشروع');
    const isEduQuery = lower.includes('education') || lower.includes('degree') || lower.includes('university') || lower.includes('college') || lower.includes('study') || lower.includes('পড়াশোনা') || lower.includes('শিক্ষা') || lower.includes('ডিগ্রি') || lower.includes('تعليم') || lower.includes('جامع');
    const isHireQuery = lower.includes('hire') || lower.includes('available') || lower.includes('rate') || lower.includes('book') || lower.includes('meeting') || lower.includes('হায়ার') || lower.includes('বুকিং') || lower.includes('توظيف');

    if (isEmailQuery) {
      if (isBn) {
        reply = `মোহাম্মদ জিহাদের সাথে সরাসরি যোগাযোগের অফিসিয়াল জিমেইল হলো:\n📧 **${primaryEmail}**\n(বিকল্প ইমেইল: ${altEmail})\n\nএছাড়া আপনি সরাসরি লিঙ্কডইন (${linkedinUrl}) অথবা পোর্টফোলিওর মিটিং বুকিং সেকশন (#contact) থেকেও যোগাযোগ করতে পারেন।`;
      } else if (isAr) {
        reply = `يمكنك التواصل مع محمد جهاد مباشرة عبر البريد الإلكتروني:\n📧 **${primaryEmail}**\n(البريد البديل: ${altEmail})\n\nكما يمكنك مراسلته عبر لينكد إن: ${linkedinUrl}`;
      } else if (isFr) {
        reply = `Vous pouvez contacter Mohammad Zihad directement par e-mail à l'adresse :\n📧 **${primaryEmail}**\n(E-mail alternatif : ${altEmail})\n\nOu connectez-vous sur LinkedIn : ${linkedinUrl}`;
      } else {
        reply = `You can reach Mohammad Zihad directly at his primary Gmail address:\n📧 **${primaryEmail}**\n(Alternative: ${altEmail})\n\nYou can also connect via LinkedIn (${linkedinUrl}) or schedule a meeting directly in Section 7 (#contact).`;
      }
    } else if (isPhoneQuery) {
      if (isBn) {
        reply = `মোহাম্মদ জিহাদের সরাসরি ফোন ও হোয়াটসঅ্যাপ নম্বর হলো:\n📱 **${primaryPhone}**\nলোকেশন: ${location} (UTC+6)।`;
      } else if (isAr) {
        reply = `رقم هاتف وواتساب محمد جهاد هو:\n📱 **${primaryPhone}**\nالموقع: ${location}.`;
      } else {
        reply = `Mohammad Zihad's direct contact phone / WhatsApp is:\n📱 **${primaryPhone}**\nLocation: ${location} (UTC+6).`;
      }
    } else if (isGithubQuery) {
      if (isBn) {
        reply = `মোহাম্মদ জিহাদের ওপেন-সোর্স প্রজেক্ট এবং কোডবেস দেখতে ভিজিট করুন তাঁর গিটহাব প্রোফাইল:\n🔗 **${githubUrl}**`;
      } else {
        reply = `You can explore Mohammad Zihad's open-source repositories and codebases on GitHub:\n🔗 **${githubUrl}**`;
      }
    } else if (isLinkedinQuery) {
      if (isBn) {
        reply = `মোহাম্মদ জিহাদের পেশাদার লিঙ্কডইন প্রোফাইল:\n💼 **${linkedinUrl}**`;
      } else {
        reply = `Connect with Mohammad Zihad professionally on LinkedIn:\n💼 **${linkedinUrl}**`;
      }
    } else if (isSkillsQuery) {
      if (isBn) {
        reply = `মোহাম্মদ জিহাদের প্রধান প্রযুক্তিগত দক্ষতা:\n• **ফ্রন্টএন্ড:** Next.js 16, React 19, TypeScript, Tailwind CSS, GSAP, Three.js & WebGL Shaders, Matter.js Physics\n• **ব্যাকএন্ড ও ক্লাউড:** Node.js, Express, PHP & Modern Laravel, Supabase, PostgreSQL, Docker\n• **কোর সিএস:** C, C++, Java এবং অ্যাডভান্সড ডেটা স্ট্রাকচার ও অ্যালগরিদম।`;
      } else if (isAr) {
        reply = `أبرز مهارات محمد جهاد التقنية:\n• **الواجهة الأمامية:** Next.js 16, React 19, TypeScript, Tailwind CSS, Three.js, WebGL, GSAP\n• **الواجهة الخلفية:** Node.js, Laravel, Supabase, PostgreSQL, Docker\n• **أساسيات علوم الحاسوب:** C, C++, Java مع خوارزميات متقدمة.`;
      } else {
        reply = `Mohammad Zihad's technical arsenal spans:\n• **Frontend & Spatial Web:** Next.js 16, React 19, TypeScript, Tailwind CSS, GSAP 3, Three.js/WebGL Shaders, Matter.js 2D Physics\n• **Backend & Distributed Systems:** Node.js, Express APIs, PHP, Modern Laravel, Supabase, PostgreSQL with RLS, Docker\n• **Core Computer Science:** C, C++, Java with rigorous algorithmic problem-solving foundations.`;
      }
    } else if (isProjectsQuery) {
      if (isBn) {
        reply = `মোহাম্মদ জিহাদের শীর্ষ প্রজেক্টসমূহ:\n১. **AetherSphere:** 3D Zero-G WebGL অপারেটিং স্পেস (${projectsData[0]?.live_url || 'aethersphere.dev'})\n২. **CyberPulse:** রিয়েল-টাইম মাল্টি-মডেল এআই এজেন্ট প্ল্যাটফর্ম\n৩. **NexusFin:** হাইপার-পারফরম্যান্ট অ্যালগরিদমিক ফিনটেক টার্মিনাল\n৪. **NeonArcade:** ওয়েব অডিও সিন্থেসাইজার আর্কেড ল্যাব (১২টি গেম)।`;
      } else if (isAr) {
        reply = `أبرز مشاريع محمد جهاد المميزة:\n١. **AetherSphere:** بيئة تشغيل ثلاثية الأبعاد خالية من الجاذبية عبر المتصفح\n٢. **CyberPulse:** منصة عملاء ذكاء اصطناعي متعددة الوسائط بالزمن الحقيقي\n٣. **NexusFin:** بروتوكول تداول مالي عالي الكفاءة\n٤. **NeonArcade:** ألعاب كلاسيكية بمؤثرات صوتية عبر المتصفح.`;
      } else {
        reply = `Mohammad Zihad's featured showcase projects include:\n1. **AetherSphere:** Next-gen 3D spatial WebGL operating environment with zero-gravity window physics\n2. **CyberPulse:** Real-time multimodal AI agent orchestration platform\n3. **NexusFin:** High-frequency algorithmic fintech terminal with interactive charting\n4. **NeonArcade:** In-browser Web Audio synthesizer retro gaming lab featuring 12 playable games.`;
      }
    } else if (isEduQuery) {
      if (isBn) {
        reply = `মোহাম্মদ জিহাদের একাডেমিক মাইলফলক:\n🎓 **B.Sc. in Computer Science & Engineering (2022 - 2026)** — University of Engineering & Technology (Dean's Honors List)\n🎖️ **HSC (Science):** GPA 5.0 / 5.0 (Golden Scholar)\n🎖️ **SSC (Science):** GPA 5.0 / 5.0 (Government Laboratory High School)।`;
      } else {
        reply = `Mohammad Zihad's verified academic credentials:\n🎓 **B.Sc. in Computer Science & Engineering (2022 - 2026)** at University of Engineering & Technology (Dean's Honors List)\n🎖️ **Higher Secondary Certificate (HSC):** GPA 5.0 / 5.0 in Natural Sciences & Mathematics\n🎖️ **Secondary School Certificate (SSC):** GPA 5.0 / 5.0 with distinction.`;
      }
    } else if (isHireQuery) {
      if (isBn) {
        reply = `হ্যাঁ! মোহাম্মদ জিহাদ বর্তমানে বিশ্বব্যাপী ফুল-স্ট্যাক ও ক্রিয়েটিভ সফটওয়্যার ডেভেলপমেন্ট চুক্তির জন্য উন্মুক্ত।\nআপনি সরাসরি তাঁর জিমেইলে (**${primaryEmail}**) লিখতে পারেন অথবা পোর্টফোলিওর Section 7 (#contact)-এ ক্যালেন্ডার স্লট বুক করতে পারেন।`;
      } else {
        reply = `Mohammad Zihad is currently open for contract engineering, full-stack software development, and spatial web consulting roles worldwide.\nYou can reach him directly at **${primaryEmail}** or book an exploratory calendar meeting in Section 7 (#contact).`;
      }
    } else {
      // Dynamic conversational response (not the static intro!)
      if (isBn) {
        reply = `ধন্যবাদ আপনার বার্তার জন্য! আমি ZORRO—মোহাম্মদ জিহাদের সহকারী এআই। জিহাদের সফটওয়্যার ডেভেলপমেন্ট প্রজেক্ট, প্রযুক্তিগত দক্ষতা (Next.js, Three.js, Node.js), পড়াশোনা বা সরাসরি যোগাযোগ (${primaryEmail}) সংক্রান্ত যেকোনো তথ্য আমি জানাতে পারি। আপনি কী জানতে চান?`;
      } else if (isAr) {
        reply = `أهلاً بك! أنا ZORRO، المساعد الذكي لمحمد جهاد. يسعدني إفادتك بأي تفاصيل حول مهاراته البرمجية، مشاريعه الرائدة، أو تزويدك ببيانات التواصل المباشرة (${primaryEmail}). كيف يمكنني خدمتك اليوم؟`;
      } else if (isFr) {
        reply = `Merci pour votre message ! Je suis ZORRO, l'assistant IA de Mohammad Zihad. Je peux vous renseigner sur ses compétences, ses projets ou vous donner ses coordonnées directes (${primaryEmail}). En quoi puis-je vous aider ?`;
      } else {
        reply = `Thank you for reaching out! I am Ask ZORRO, Mohammad Zihad's technical representative. I can answer specific inquiries about his full-stack engineering expertise, 3D WebGL projects, academic background, or provide his direct contact details (${primaryEmail}). What would you like to know?`;
      }
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Ask ZORRO assistant route error:', error);
    return NextResponse.json(
      { reply: "Ask ZORRO is currently updating profile data. For immediate inquiries, please email Mohammad Zihad directly at mdzihaddev01@gmail.com." },
      { status: 500 }
    );
  }
}

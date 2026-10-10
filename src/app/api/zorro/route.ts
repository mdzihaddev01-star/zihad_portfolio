import { NextRequest, NextResponse } from 'next/server';
import { fetchSiteSettings } from '@/lib/siteSettings';
import { 
  supabase, 
  isSupabaseConfigured, 
  DEFAULT_SETTINGS, 
  DEFAULT_PROJECTS, 
  DEFAULT_SKILLS
} from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { message, language, history: rawHistory } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const trimmedMessage = message.trim();
    const history = Array.isArray(rawHistory)
      ? rawHistory
          .filter((item): item is { role: 'user' | 'assistant'; content: string } =>
            item &&
            (item.role === 'user' || item.role === 'assistant') &&
            typeof item.content === 'string' &&
            item.content.trim().length > 0
          )
          .slice(-16)
          .map((item) => ({ role: item.role, content: item.content.trim().slice(0, 4000) }))
      : [];

    // -------------------------------------------------------------------------
    // 1. DYNAMIC DEVELOPER KNOWLEDGE CONTEXT (SUPABASE WITH ZERO-FALLBACK GAPS)
    // -------------------------------------------------------------------------
    let profileData = DEFAULT_SETTINGS;
    let projectsData: typeof DEFAULT_PROJECTS = [];
    let skillsData: typeof DEFAULT_SKILLS = [];
    if (isSupabaseConfigured && supabase) {
      try {
        const [settingsData, projRes, skillsRes] = await Promise.all([
          fetchSiteSettings(),
          supabase.from('projects').select('*').order('order_index', { ascending: true }),
          supabase.from('skills').select('*').order('order_index', { ascending: true }),
        ]);

        if (settingsData) profileData = { ...DEFAULT_SETTINGS, ...settingsData };
        if (projRes.data && projRes.data.length > 0) projectsData = projRes.data;
        if (skillsRes.data && skillsRes.data.length > 0) skillsData = skillsRes.data;
      } catch (dbErr) {
        console.warn('Supabase profile context fetch warning (using verified defaults):', dbErr);
      }
    }

    const projectsSummary = projectsData
      .map((p) => `- ${p.title} (${p.category}): ${p.description}. Tech: ${p.tags.join(', ')}. Demo: ${p.live_url}, GitHub: ${p.github_url || 'N/A'}`)
      .join('\n') || 'No additional project records are currently available.';

    const skillsSummary = skillsData
      .map((s) => `- ${s.name} (${s.category}): ${s.proficiency || (s as any).level || 90}% proficiency`)
      .join('\n') || 'No additional skills records are currently available.';

    const primaryEmail = 'mdzihaddev01@gmail.com';
    const altEmail = primaryEmail;
    const primaryPhone = '+880 1410057535';
    const githubUrl = profileData.social_github || 'https://github.com/mohammadzihad';
    const linkedinUrl = profileData.social_linkedin || 'https://linkedin.com/in/mohammadzihad';
    const twitterUrl = profileData.social_twitter || 'https://twitter.com/mohammadzihad';
    const location = 'Uttara, Dhaka, Bangladesh';

    // -------------------------------------------------------------------------
    // 2. SYSTEM INSTRUCTION (ZERO HALLUCINATION & MULTILINGUAL RULES)
    // -------------------------------------------------------------------------
    const systemInstruction = `
You are ZORRO, the intelligent, friendly, and precise AI representative for Mohammad Zihad.
Always respond in the exact language the user talks to you (Bengali, Banglish, or English).
Be direct, natural, and helpful. Do not repeat greeting introductions if the conversation is ongoing.

Knowledge Base about Mohammad Zihad:
- Full Name: Mohammad Zihad
- Role: Full-Stack Developer & Software Architect
- Education / School: Student at Uttara High School & College (UHSC), SSC candidate (SSC '27).
- Major Projects:
  1. UHSC Debate Club Web Ecosystem (Full-Stack Next.js, Supabase, Tailwind platform).
  2. SPRA Enterprise Rice Milling ERP & POS (Automated inventory & accounting software for মেসার্স শাহ পরান রাইস এজেন্সি).
  3. Shah Poran Agency Organic Agro E-Commerce platform.
  4. Bengal Merchants Global Logistics & Sourcing system.
- Core Skills: Next.js, React, TypeScript, Tailwind CSS, Supabase, PostgreSQL, Node.js, WebGL/Three.js, Python.
- Contact Email: ${primaryEmail}
- Phone: ${primaryPhone}
- Location: ${location}
- GitHub: ${githubUrl}
- LinkedIn: ${linkedinUrl}
- Twitter / X: ${twitterUrl}

Additional live portfolio data, when relevant:
- Profile bio: ${profileData.bio}
- Availability: ${profileData.availability || 'Not specified'}
- Projects: ${projectsSummary}
- Skills: ${skillsSummary}

Rules:
- Answer the user's actual question first. Do not give a canned introduction or generic welcome in response to a specific question.
- For "জিহাদ কোন স্কুলে পড়ে?", answer directly: "মোহাম্মদ জিহাদ উত্তরা হাই স্কুল অ্যান্ড কলেজ (Uttara High School & College)-এ পড়াশোনা করছেন।"
- Keep answers concise. Never invent credentials, clients, or facts beyond this knowledge base and relevant live data.
- Never refer to yourself as Gemini, OpenAI, or an LLM.
`;

    // -------------------------------------------------------------------------
    // 3. GOOGLE GEMINI REST API INTEGRATION
    // -------------------------------------------------------------------------
    const apiKey = process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_API_KEY?.trim();
    const openAiApiKey = process.env.OPENAI_API_KEY?.trim();

    if (apiKey) {
      try {
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const payload = {
          system_instruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            ...history.map((item) => ({
              role: item.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: item.content }],
            })),
            { role: 'user', parts: [{ text: trimmedMessage }] },
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
    } else if (openAiApiKey) {
      try {
        const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openAiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemInstruction },
              ...history,
              { role: 'user', content: trimmedMessage },
            ],
            temperature: 0.7,
            max_tokens: 800,
          }),
        });

        if (openAiRes.ok) {
          const data = await openAiRes.json();
          const reply = data?.choices?.[0]?.message?.content?.trim();
          if (reply) return NextResponse.json({ reply });
        } else {
          console.warn('OpenAI chat API non-OK status:', openAiRes.status, await openAiRes.text());
        }
      } catch (openAiError) {
        console.warn('OpenAI chat invocation warning, utilizing grounded NLP:', openAiError);
      }
    } else {
      console.error('Ask ZORRO API key missing: set GEMINI_API_KEY, GOOGLE_API_KEY, or OPENAI_API_KEY. Using grounded fallback.');
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
    const isSchoolQuery = lower.includes('school') || lower.includes('স্কুল') || lower.includes('কোন স্কুল') || lower.includes('school e') || lower.includes('school-e') || lower.includes('uhsc');

    let reply = '';

    // Contact / Gmail / Email inquiries
    const isEmailQuery = lower.includes('gmail') || lower.includes('email') || lower.includes('mail') || lower.includes('contact') || lower.includes('reach') || lower.includes('message') || lower.includes('ইমেইল') || lower.includes('জিমেইল') || lower.includes('যোগাযোগ') || lower.includes('চিঠি') || lower.includes('بريد') || lower.includes('ايميل') || lower.includes('تواصل');
    const isPhoneQuery = lower.includes('phone') || lower.includes('number') || lower.includes('call') || lower.includes('whatsapp') || lower.includes('ফোন') || lower.includes('নম্বর') || lower.includes('هاتف') || lower.includes('واتساب');
    const isGithubQuery = lower.includes('github') || lower.includes('git') || lower.includes('repo') || lower.includes('গিটহাব') || lower.includes('রিপো');
    const isLinkedinQuery = lower.includes('linkedin') || lower.includes('লিঙ্কডইন') || lower.includes('لينكد');
    const isSkillsQuery = lower.includes('skill') || lower.includes('stack') || lower.includes('tech') || lower.includes('frontend') || lower.includes('backend') || lower.includes('python') || lower.includes('language') || lower.includes('দক্ষতা') || lower.includes('প্রযুক্তি') || lower.includes('مهار');
    const isProjectsQuery = lower.includes('project') || lower.includes('work') || lower.includes('portfolio') || lower.includes('uhsc') || lower.includes('spra') || lower.includes('debate') || lower.includes('shah poran') || lower.includes('bengal merchants') || lower.includes('rice milling') || lower.includes('logistics') || lower.includes('প্রজেক্ট') || lower.includes('কাজ') || lower.includes('مشروع');
    const isEduQuery = lower.includes('education') || lower.includes('degree') || lower.includes('university') || lower.includes('college') || lower.includes('study') || lower.includes('পড়াশোনা') || lower.includes('শিক্ষা') || lower.includes('ডিগ্রি') || lower.includes('تعليم') || lower.includes('جامع');
    const isHireQuery = lower.includes('hire') || lower.includes('available') || lower.includes('rate') || lower.includes('book') || lower.includes('meeting') || lower.includes('হায়ার') || lower.includes('বুকিং') || lower.includes('توظيف');

    if (isSchoolQuery) {
      if (isBn) {
        reply = 'মোহাম্মদ জিহাদ উত্তরা হাই স্কুল অ্যান্ড কলেজ (Uttara High School & College)-এ পড়াশোনা করছেন।';
      } else {
        reply = 'Mohammad Zihad studies at Uttara High School & College (UHSC) and is an SSC candidate for 2027.';
      }
    } else if (isEmailQuery) {
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
        reply = 'মোহাম্মদ জিহাদের প্রধান প্রকল্পগুলোর মধ্যে রয়েছে UHSC Debate Club Web Ecosystem, SPRA Enterprise Rice Milling ERP & POS, Shah Poran Agency Organic Agro E-Commerce platform, এবং Bengal Merchants Global Logistics & Sourcing system।';
      } else {
        reply = "Mohammad Zihad's major projects include the UHSC Debate Club Web Ecosystem, SPRA Enterprise Rice Milling ERP & POS, Shah Poran Agency Organic Agro E-Commerce platform, and Bengal Merchants Global Logistics & Sourcing system.";
      }
    } else if (isEduQuery) {
      if (isBn) {
        reply = 'মোহাম্মদ জিহাদ উত্তরা হাই স্কুল অ্যান্ড কলেজের (UHSC) শিক্ষার্থী এবং ২০২৭ সালের SSC পরীক্ষার্থী।';
      } else {
        reply = 'Mohammad Zihad is a student at Uttara High School & College (UHSC) and an SSC candidate for 2027.';
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
        reply = 'এই বিষয়ে আমার কাছে নির্দিষ্ট তথ্য নেই। চাইলে জিহাদের পড়াশোনা, প্রকল্প, দক্ষতা বা যোগাযোগ সম্পর্কে নির্দিষ্ট করে জিজ্ঞেস করুন।';
      } else if (isAr) {
        reply = 'لا تتوفر لدي معلومة مؤكدة عن ذلك. يمكنني المساعدة بمعلومات محددة عن دراسة جهاد أو مشاريعه أو مهاراته أو بيانات التواصل.';
      } else if (isFr) {
        reply = 'Je ne dispose pas d’une information vérifiée à ce sujet. Vous pouvez poser une question précise sur ses études, ses projets, ses compétences ou ses coordonnées.';
      } else {
        reply = 'I do not have a verified detail about that. You can ask about Mohammad’s education, projects, skills, or contact information.';
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

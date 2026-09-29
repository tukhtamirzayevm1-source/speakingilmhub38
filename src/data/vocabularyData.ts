import { VocabularyWord } from '../types';

export const VOCABULARY_DATABASE: VocabularyWord[] = [
  // Common words
  {
    id: 'w-1',
    word: 'Accomplish',
    ipa: '/əˈkʌm.plɪʃ/',
    partOfSpeech: 'verb',
    uzbekMeaning: 'Bajarmoq, erishmoq, uddalamoq',
    englishDefinition: 'To succeed in doing or completing something difficult or valuable.',
    exampleSentence: 'With dedicated practice, you can accomplish your English fluency goals.',
    uzbekExample: 'Muntazam mashq bilan siz ingliz tilida ravon gapirish maqsadlaringizga erisha olasiz.',
    level: 'B1',
    category: 'common',
    synonyms: ['Achieve', 'Fulfill', 'Complete'],
    antonyms: ['Fail', 'Abandon']
  },
  {
    id: 'w-2',
    word: 'Opportunity',
    ipa: '/ˌɒp.əˈtjuː.nə.ti/',
    partOfSpeech: 'noun',
    uzbekMeaning: 'Imkoniyat, qulay vaziyat',
    englishDefinition: 'A time or set of circumstances that makes it possible to do something.',
    exampleSentence: 'Speaking fluent English opens the door to global career opportunities.',
    uzbekExample: 'Ingliz tilida ravon gapirish xalqaro martaba imkoniyatlari eshigini ochadi.',
    level: 'A2',
    category: 'common',
    synonyms: ['Chance', 'Opening'],
    antonyms: ['Disadvantage', 'Obstacle']
  },

  // Advanced words
  {
    id: 'w-3',
    word: 'Articulate',
    ipa: '/ɑːˈtɪk.jə.lət/',
    partOfSpeech: 'adjective / verb',
    uzbekMeaning: 'Fikrni aniq va ravon ifodalay oladigan; aniq aytmoq',
    englishDefinition: 'Able to express thoughts and ideas clearly and effectively in speech.',
    exampleSentence: 'She was praised for giving an articulate presentation to executive leadership.',
    uzbekExample: 'U rahbarlar oldida fikrini juda aniq va ravon taqdim etgani uchun olqishlandi.',
    level: 'C1',
    category: 'advanced',
    synonyms: ['Eloquent', 'Fluent', 'Expressive'],
    antonyms: ['Inarticulate', 'Hesitant']
  },
  {
    id: 'w-4',
    word: 'Meticulous',
    ipa: '/məˈtɪk.jə.ləs/',
    partOfSpeech: 'adjective',
    uzbekMeaning: 'Mayda-chuydasigacha e\'tiborli, nihoyatda puxta',
    englishDefinition: 'Showing great attention to detail; very careful and precise.',
    exampleSentence: 'He conducted meticulous research before publishing the findings.',
    uzbekExample: 'U natijalarni e\'lon qilishdan oldin nihoyatda puxta tadqiqot olib bordi.',
    level: 'C1',
    category: 'advanced',
    synonyms: ['Thorough', 'Painstaking', 'Scrupulous'],
    antonyms: ['Careless', 'Sloppy']
  },

  // Phrasal Verbs
  {
    id: 'w-5',
    word: 'Bring up',
    ipa: '/brɪŋ ʌp/',
    partOfSpeech: 'phrasal verb',
    uzbekMeaning: 'Mavzuni qo\'zg\'amoq / Tarbiyalamoq',
    englishDefinition: 'To introduce a subject into discussion; also, to raise a child.',
    exampleSentence: 'Don\'t hesitate to bring up any questions during our meeting.',
    uzbekExample: 'Yig\'ilishimiz davomida istalgan savolingizni bemalol o\'rtaga tashlang.',
    level: 'B1',
    category: 'phrasal_verbs',
    synonyms: ['Mention', 'Introduce', 'Raise']
  },
  {
    id: 'w-6',
    word: 'Figure out',
    ipa: '/ˈfɪɡ.ər aʊt/',
    partOfSpeech: 'phrasal verb',
    uzbekMeaning: 'Tushunib yetmoq, yechimini topmoq',
    englishDefinition: 'To understand or solve something after thinking about it.',
    exampleSentence: 'It took me a few days to figure out the new software workflow.',
    uzbekExample: 'Yangi dastur qanday ishlashini tushunib olishimga bir necha kun ketdi.',
    level: 'A2',
    category: 'phrasal_verbs',
    synonyms: ['Understand', 'Decipher', 'Resolve']
  },
  {
    id: 'w-7',
    word: 'Look forward to',
    ipa: '/lʊk ˈfɔː.wəd tuː/',
    partOfSpeech: 'phrasal verb',
    uzbekMeaning: 'Intiqlik bilan kutmoq',
    englishDefinition: 'To feel happy and excited about something that is going to happen.',
    exampleSentence: 'I look forward to hearing your feedback on my speaking.',
    uzbekExample: 'Nutqim bo\'yicha sizning fikrlaringizni intiqlik bilan kutaman.',
    level: 'B1',
    category: 'phrasal_verbs',
    synonyms: ['Anticipate eagerly']
  },

  // Idioms
  {
    id: 'w-8',
    word: 'Break the ice',
    ipa: '/breɪk ðiː aɪs/',
    partOfSpeech: 'idiom',
    uzbekMeaning: 'Noqulaylikni yo\'qotmoq, ilk suhbatni erkin boshlamoq',
    englishDefinition: 'To do or say something that makes people who do not know each other feel more relaxed.',
    exampleSentence: 'The teacher shared a funny story to break the ice with new students.',
    uzbekExample: 'O\'qituvchi yangi o\'quvchilar bilan noqulaylikni yo\'qotish uchun qiziqarli voqea aytib berdi.',
    level: 'B1',
    category: 'idioms',
    synonyms: ['Ease tension', 'Warm up']
  },
  {
    id: 'w-9',
    word: 'Hit the nail on the head',
    ipa: '/hɪt ðə neɪl ɒn ðə hed/',
    partOfSpeech: 'idiom',
    uzbekMeaning: 'Nishonga to\'g\'ri urmoq, ayni haqiqatni aytmoq',
    englishDefinition: 'To describe exactly what is causing a situation or problem.',
    exampleSentence: 'You hit the nail on the head when you identified the bottleneck in our team.',
    uzbekExample: 'Jamoamizdagi to\'siqni aniqlaganingizda ayni haqiqatni aytdingiz.',
    level: 'B2',
    category: 'idioms',
    synonyms: ['Be spot on', 'Be exact']
  },

  // Collocations
  {
    id: 'w-10',
    word: 'Make a decision',
    ipa: '/meɪk ə dɪˈsɪʒ.ən/',
    partOfSpeech: 'collocation',
    uzbekMeaning: 'Qaror qabul qilmoq ("do decision" emas, balki "make")',
    englishDefinition: 'To reach a conclusion or resolve on a course of action.',
    exampleSentence: 'Take your time before you make an important career decision.',
    uzbekExample: 'Muhim martaba qarorini qabul qilishdan oldin yaxshilab o\'ylab ko\'ring.',
    level: 'A2',
    category: 'collocations'
  },
  {
    id: 'w-11',
    word: 'Pay attention',
    ipa: '/peɪ əˈten.ʃən/',
    partOfSpeech: 'collocation',
    uzbekMeaning: 'Diqqat qaratmoq, e\'tibor bermoq',
    englishDefinition: 'To watch, listen to, or think about something carefully.',
    exampleSentence: 'Pay close attention to syllable stress when learning new words.',
    uzbekExample: 'Yangi so\'zlarni o\'rganayotganda bo\'g\'in urg\'usiga katta e\'tibor bering.',
    level: 'A2',
    category: 'collocations'
  },

  // Academic
  {
    id: 'w-12',
    word: 'Empirical',
    ipa: '/ɪmˈpɪr.ɪ.kəl/',
    partOfSpeech: 'adjective',
    uzbekMeaning: 'Tajriba va amaliy kuzatishga asoslangan (empirik)',
    englishDefinition: 'Based on, concerned with, or verifiable by observation or experience rather than theory.',
    exampleSentence: 'The scientific paper presented empirical evidence supporting the hypothesis.',
    uzbekExample: 'Ilmiy maqolada farazni tasdiqlovchi amaliy tajribaviy dalillar keltirildi.',
    level: 'C1',
    category: 'academic',
    synonyms: ['Observational', 'Factual', 'Experimental'],
    antonyms: ['Theoretical', 'Speculative']
  },
  {
    id: 'w-13',
    word: 'Subsequently',
    ipa: '/ˈsʌb.sɪ.kwənt.li/',
    partOfSpeech: 'adverb',
    uzbekMeaning: 'Undan so\'ng, keyinchalik, oqibatda',
    englishDefinition: 'After a particular thing has happened; afterwards.',
    exampleSentence: 'The study was published and subsequently translated into five languages.',
    uzbekExample: 'Tadqiqot nashr etildi va keyinchalik besh tilga tarjima qilindi.',
    level: 'B2',
    category: 'academic',
    synonyms: ['Afterwards', 'Later', 'Consequently']
  },

  // Business
  {
    id: 'w-14',
    word: 'Leverage',
    ipa: '/ˈliː.vər.ɪdʒ/',
    partOfSpeech: 'verb / noun',
    uzbekMeaning: 'Samarali foydalanmoq, ustunlikdan foydalanib yutuqqa erishmoq',
    englishDefinition: 'To use something to maximum advantage.',
    exampleSentence: 'We can leverage AI voice technology to dramatically cut learning time.',
    uzbekExample: 'O\'rganish vaqtini sezilarli qisqartirish uchun AI ovozli texnologiyasidan samarali foydalanishimiz mumkin.',
    level: 'B2',
    category: 'business',
    synonyms: ['Utilize', 'Capitalize on', 'Exploit']
  },
  {
    id: 'w-15',
    word: 'Stakeholder',
    ipa: '/ˈsteɪkˌhəʊl.dər/',
    partOfSpeech: 'noun',
    uzbekMeaning: 'Manfaatdor tomon, loyihada ulushi yoki manfaati bor shaxs',
    englishDefinition: 'A person or group that has an interest or concern in an organization.',
    exampleSentence: 'All key stakeholders agreed to the quarterly budget expansion.',
    uzbekExample: 'Barcha asosiy manfaatdor tomonlar choraklik byudjetni oshirishga rozi bo\'ldilar.',
    level: 'B2',
    category: 'business'
  },

  // IELTS
  {
    id: 'w-16',
    word: 'Detrimental',
    ipa: '/ˌdet.rɪˈmen.təl/',
    partOfSpeech: 'adjective',
    uzbekMeaning: 'Zararli, salbiy ta\'sir ko\'rsatuvchi',
    englishDefinition: 'Tending to cause harm or damage.',
    exampleSentence: 'Excessive screen time before sleep has a detrimental impact on rest quality.',
    uzbekExample: 'Uxlashdan oldin ekranga ko\'p qarash uyqu sifatiga zararli ta\'sir ko\'rsatadi.',
    level: 'C1',
    category: 'ielts',
    synonyms: ['Harmful', 'Damaging', 'Adverse'],
    antonyms: ['Beneficial', 'Advantageous']
  },
  {
    id: 'w-17',
    word: 'Invaluable',
    ipa: '/ɪnˈvæl.jə.bəl/',
    partOfSpeech: 'adjective',
    uzbekMeaning: 'Bebaho, nihoyatda qimmatli',
    englishDefinition: 'Extremely useful; having value too high to be measured.',
    exampleSentence: 'Constructive feedback from an experienced teacher is invaluable.',
    uzbekExample: 'Tajribali o\'qituvchining to\'g\'ri yo\'naltiruvchi fikri bebaho qimmatga egadir.',
    level: 'B2',
    category: 'ielts',
    synonyms: ['Priceless', 'Crucial', 'Indispensable']
  },

  // Daily
  {
    id: 'w-18',
    word: 'Grab a bite',
    ipa: '/ɡræb ə baɪt/',
    partOfSpeech: 'phrase',
    uzbekMeaning: 'Tezda biror narsa yeb olmoq',
    englishDefinition: 'To quickly get something to eat.',
    exampleSentence: 'Do you want to grab a bite to eat before the movie starts?',
    uzbekExample: 'Film boshlanishidan oldin biror narsa yeb olishni xohlaysizmi?',
    level: 'A2',
    category: 'daily'
  },
  {
    id: 'w-19',
    word: 'Run out of',
    ipa: '/rʌn aʊt əv/',
    partOfSpeech: 'phrasal verb',
    uzbekMeaning: 'Tugab qolmoq (masalan, vaqt, pul, sut)',
    englishDefinition: 'To have no more of something left.',
    exampleSentence: 'We have run out of coffee; could you pick some up from the supermarket?',
    uzbekExample: 'Qahvamiz tugab qolibdi; supermarkatdan olib kela olasizmi?',
    level: 'A2',
    category: 'daily'
  },

  // Synonyms & Antonyms
  {
    id: 'w-20',
    word: 'Substantial',
    ipa: '/səbˈstæn.ʃəl/',
    partOfSpeech: 'adjective',
    uzbekMeaning: 'Sezilarli, salmoqli, katta hajmdagi',
    englishDefinition: 'Of considerable importance, size, or worth.',
    exampleSentence: 'He made a substantial improvement in his IELTS speaking band score.',
    uzbekExample: 'U IELTS speaking ballida sezilarli darajada salmoqli o\'sishga erishdi.',
    level: 'B2',
    category: 'synonyms_antonyms',
    synonyms: ['Significant', 'Considerable', 'Noticeable'],
    antonyms: ['Insignificant', 'Negligible', 'Minor']
  }
];

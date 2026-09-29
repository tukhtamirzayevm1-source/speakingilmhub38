import { Lesson } from '../types';

export const LESSONS_DATA: Lesson[] = [
  // A1 Beginner
  {
    id: 'lesson-a1-1',
    title: 'Greetings & Introducing Yourself',
    uzbekTitle: 'Salomlashish va O\'zini Tanishtirish',
    level: 'A1',
    category: 'Daily Life',
    description: 'Learn how to state your name, profession, country of origin, and greet others politely.',
    uzbekDescription: 'Ism, kasb, qayerdan ekanlikni aytish va xushmuomalalik bilan salomlashishni o\'rganing.',
    estimatedMinutes: 8,
    iconName: 'UserCheck',
    vocabList: [
      {
        id: 'v-a1-1',
        word: 'Pleased to meet you',
        ipa: '/pliːzd tuː miːt juː/',
        partOfSpeech: 'phrase',
        uzbekMeaning: 'Siz bilan tanishganimdan xursandman',
        englishDefinition: 'A polite expression used when meeting someone for the first time.',
        exampleSentence: 'Hello, my name is Jasur. Pleased to meet you!',
        uzbekExample: 'Salom, mening ismim Jasur. Siz bilan tanishganimdan xursandman!',
        level: 'A1',
        category: 'daily'
      },
      {
        id: 'v-a1-2',
        word: 'Originally from',
        ipa: '/əˈrɪdʒɪnəli frʌm/',
        partOfSpeech: 'phrase',
        uzbekMeaning: 'Asli ...dan bo\'lmoq',
        englishDefinition: 'Used to state your birthplace or hometown.',
        exampleSentence: 'I live in Tashkent, but I am originally from Samarkand.',
        uzbekExample: 'Men Toshkentda yashayman, lekin aslim Samarqanddan.',
        level: 'A1',
        category: 'daily'
      },
      {
        id: 'v-a1-3',
        word: 'Occupation',
        ipa: '/ˌɒkjʊˈpeɪʃn/',
        partOfSpeech: 'noun',
        uzbekMeaning: 'Kasb, mashg\'ulot',
        englishDefinition: 'A job or profession.',
        exampleSentence: 'What is your current occupation?',
        uzbekExample: 'Hozirgi kasbingiz nima?',
        level: 'A1',
        category: 'common'
      }
    ],
    warmUpQuestions: [
      'What is your name and where do you live?',
      'What do you like to do in your free time?'
    ],
    speakingPrompts: [
      'Say hello and introduce yourself to the AI tutor with your name, job/studies, and hometown.',
      'Ask the tutor a question about their day.'
    ],
    roleplayScenario: {
      userRole: 'New English Student',
      aiRole: 'Friendly English Teacher',
      setting: 'Online Classroom Welcome Meeting',
      objective: 'Introduce yourself comfortably and state two goals for learning English.'
    }
  },
  {
    id: 'lesson-a1-2',
    title: 'Ordering Food in a Café',
    uzbekTitle: 'Qahvaxonada Buyurtma Berish',
    level: 'A1',
    category: 'Travel & Dining',
    description: 'Master polite requests like "I would like...", asking for the bill, and specifying drinks.',
    uzbekDescription: '"I would like..." bilan buyurtma berish, hisobni so\'rash va ichimliklarni tanlash.',
    estimatedMinutes: 10,
    iconName: 'Coffee',
    vocabList: [
      {
        id: 'v-a1-4',
        word: 'Could I have...',
        ipa: '/kʊd aɪ hæv/',
        partOfSpeech: 'phrase',
        uzbekMeaning: 'Menga ... bersangiz / mumkinmi?',
        englishDefinition: 'Polite way to request food or items in a restaurant.',
        exampleSentence: 'Could I have a black coffee and a croissant, please?',
        uzbekExample: 'Menga qora qahva va kruassan bera olasizmi, iltimos?',
        level: 'A1',
        category: 'daily'
      },
      {
        id: 'v-a1-5',
        word: 'Takeaway / To go',
        ipa: '/ˈteɪkəweɪ / tuː ɡoʊ/',
        partOfSpeech: 'adjective',
        uzbekMeaning: 'Olib ketish uchun',
        englishDefinition: 'Food bought from a restaurant to be eaten elsewhere.',
        exampleSentence: 'Is this for here or to go?',
        uzbekExample: 'Shu yerda yeysizmi yoki olib ketishgami?',
        level: 'A1',
        category: 'common'
      }
    ],
    warmUpQuestions: [
      'Do you prefer coffee or green tea?',
      'What is your favorite breakfast meal?'
    ],
    speakingPrompts: [
      'Order your favorite hot beverage and a pastry politely.',
      'Ask the barista for the WiFi password and the check.'
    ],
    roleplayScenario: {
      userRole: 'Customer at Central Perk Cafe',
      aiRole: 'Barista',
      setting: 'Busy coffee shop counter in London',
      objective: 'Order a beverage, clarify size and milk options, and ask for the total price.'
    }
  },

  // A2 Elementary
  {
    id: 'lesson-a2-1',
    title: 'Describing Your Weekend & Past Events',
    uzbekTitle: 'Dam Olish Kunlarini Tasvirlash (Past Simple)',
    level: 'A2',
    category: 'Daily Life',
    description: 'Practice Past Simple verbs, sequencing words (first, then, afterwards), and expressing emotions.',
    uzbekDescription: 'O\'tgan zamon fe\'llari (Past Simple) va ketma-ketlik so\'zlari orqali dam olish kunlarini hikoya qiling.',
    estimatedMinutes: 10,
    iconName: 'Calendar',
    vocabList: [
      {
        id: 'v-a2-1',
        word: 'Unwind',
        ipa: '/ʌnˈwaɪnd/',
        partOfSpeech: 'verb',
        uzbekMeaning: 'Dam olmoq, charchoqni chiqarmoq',
        englishDefinition: 'To relax after a period of work or tension.',
        exampleSentence: 'Listening to music helps me unwind after a hectic week.',
        uzbekExample: 'Musiqa tinglash og\'ir haftadan keyin dam olishimga yordam beradi.',
        level: 'A2',
        category: 'common'
      },
      {
        id: 'v-a2-2',
        word: 'Catch up with',
        ipa: '/kætʃ ʌp wɪð/',
        partOfSpeech: 'phrasal verb',
        uzbekMeaning: 'Ko\'rishib dildan suhbatlashmoq',
        englishDefinition: 'To talk with someone you have not seen for a while to hear their news.',
        exampleSentence: 'I caught up with an old school friend yesterday.',
        uzbekExample: 'Kecha eski maktabdosh do\'stim bilan ko\'rishib yangiliklarni surishtirdim.',
        level: 'A2',
        category: 'phrasal_verbs'
      }
    ],
    warmUpQuestions: [
      'Did you do anything exciting last weekend?',
      'Do you usually stay home or go outdoors on Sunday?'
    ],
    speakingPrompts: [
      'Describe three things you did last Saturday from morning until evening.',
      'Tell the tutor about an enjoyable meal you ate recently.'
    ]
  },
  {
    id: 'lesson-a2-2',
    title: 'Asking for Directions in a New City',
    uzbekTitle: 'Notanish Shaharda Yo\'l So\'rash',
    level: 'A2',
    category: 'Travel & Navigation',
    description: 'Learn prepositions of place, turning left/right, and estimating distance.',
    uzbekDescription: 'Burilishlar, masofalar va mo\'ljal so\'rash bo\'yicha muhim iboralar.',
    estimatedMinutes: 9,
    iconName: 'Compass',
    vocabList: [
      {
        id: 'v-a2-3',
        word: 'Across the street',
        ipa: '/əˈkrɒs ðə striːt/',
        partOfSpeech: 'phrase',
        uzbekMeaning: 'Ko\'chaning narigi tomonida',
        englishDefinition: 'On the opposite side of the road.',
        exampleSentence: 'The subway entrance is right across the street.',
        uzbekExample: 'Metroga kirish joyi roppa-rosa ko\'chaning narigi tomonida.',
        level: 'A2',
        category: 'daily'
      }
    ],
    warmUpQuestions: [
      'Do you usually use a smartphone map or ask people for directions?',
      'Have you ever gotten lost in a large city?'
    ],
    speakingPrompts: [
      'Ask the tutor how to get to the nearest train station from the hotel.',
      'Confirm the walking distance in minutes.'
    ]
  },

  // B1 Intermediate
  {
    id: 'lesson-b1-1',
    title: 'Job Interview: "Tell Me About Yourself"',
    uzbekTitle: 'Ish Suhbatida O\'zini Professional Taqdim Qilish',
    level: 'B1',
    category: 'Career & Work',
    description: 'Learn the Present-Past-Future framework to introduce your professional background with impact.',
    uzbekDescription: 'O\'z tajribangiz, yutuqlaringiz va maqsadlaringizni xalqaro intervyuda ishonch bilan ayting.',
    estimatedMinutes: 12,
    iconName: 'Briefcase',
    vocabList: [
      {
        id: 'v-b1-1',
        word: 'Track record',
        ipa: '/træk ˈrek.ɔːd/',
        partOfSpeech: 'noun',
        uzbekMeaning: 'Muvaffaqiyatli ish tajribasi / natijalar tarixi',
        englishDefinition: 'All the achievements or failures that someone has done in the past.',
        exampleSentence: 'I have a proven track record in software customer support.',
        uzbekExample: 'Menda mijozlar bilan ishlashda isbotlangan muvaffaqiyatli tajriba bor.',
        level: 'B1',
        category: 'business'
      },
      {
        id: 'v-b1-2',
        word: 'Problem-solving',
        ipa: '/ˈprɒb.ləm ˌsɒl.vɪŋ/',
        partOfSpeech: 'noun',
        uzbekMeaning: 'Muammolarni hal qilish qobiliyati',
        englishDefinition: 'The process of finding solutions to difficult or complex issues.',
        exampleSentence: 'My key strength is creative problem-solving under pressure.',
        uzbekExample: 'Mening asosiy kuchli tomonim — bosim ostida muammolarni ijodiy hal qilishdir.',
        level: 'B1',
        category: 'business'
      }
    ],
    warmUpQuestions: [
      'What field or industry do you work in or want to work in?',
      'What is your greatest professional achievement so far?'
    ],
    speakingPrompts: [
      'Give a 60-second summary answering "Tell me about yourself" covering your experience and motivation.',
      'Explain why you are passionate about this role.'
    ],
    roleplayScenario: {
      userRole: 'Job Applicant',
      aiRole: 'Senior Hiring Manager',
      setting: 'Video Job Interview',
      objective: 'Present your background and explain what value you bring to the team.'
    }
  },
  {
    id: 'lesson-b1-2',
    title: 'IELTS Speaking Part 1: Hometown & Leisure',
    uzbekTitle: 'IELTS Part 1: Shahar va Qiziqishlar',
    level: 'B1',
    category: 'IELTS Prep',
    description: 'Practice answering 3-4 typical Part 1 questions with expanded compound sentences without pauses.',
    uzbekDescription: 'IELTS Part 1 savollariga qisqa "ha/yo\'q" demasdan, 2-3 jumlali mukammal javob berishni mashq qiling.',
    estimatedMinutes: 12,
    iconName: 'Award',
    vocabList: [
      {
        id: 'v-b1-3',
        word: 'Bustling',
        ipa: '/ˈbʌs.lɪŋ/',
        partOfSpeech: 'adjective',
        uzbekMeaning: 'Gavjum, qaynagan, harakatchan',
        englishDefinition: 'Full of lively activity and people.',
        exampleSentence: 'Samarkand has bustling open-air bazaars filled with fresh spices.',
        uzbekExample: 'Samarqandda yangi ziravorlarga to\'la gavjum ochiq bozorlar bor.',
        level: 'B1',
        category: 'ielts'
      }
    ],
    warmUpQuestions: [
      'What do you like most about your hometown?',
      'How has your city changed in the last five years?'
    ],
    speakingPrompts: [
      'Answer: "Do you prefer living in a house or an apartment, and why?"',
      'Answer: "What kinds of outdoor activities are popular in your country?"'
    ]
  },

  // B2 Upper Intermediate
  {
    id: 'lesson-b2-1',
    title: 'Debate: Artificial Intelligence in Everyday Life',
    uzbekTitle: 'Bahs: Sun\'iy Intellektning Jamiyatga Ta\'siri',
    level: 'B2',
    category: 'Debate & Opinion',
    description: 'Express nuanced opinions, use conditional structures, and disagree respectfully.',
    uzbekDescription: 'O\'z fikringizni dalillash, ehtimollarni baholash va hurmat bilan qarshi dalil keltirish.',
    estimatedMinutes: 15,
    iconName: 'MessageSquare',
    vocabList: [
      {
        id: 'v-b2-1',
        word: 'Double-edged sword',
        ipa: '/ˌdʌb.əl.edʒd ˈsɔːd/',
        partOfSpeech: 'idiom',
        uzbekMeaning: 'Ikki tomonlama tig\' (ham foydali, ham xavfli narsa)',
        englishDefinition: 'Something that has both positive and negative consequences.',
        exampleSentence: 'Generative AI is a double-edged sword: it boosts speed but requires critical scrutiny.',
        uzbekExample: 'Sun\'iy intellekt ikki tomonlama tig\'dir: u tezlikni oshiradi, lekin tanqidiy tekshirishni talab qiladi.',
        level: 'B2',
        category: 'idioms'
      },
      {
        id: 'v-b2-2',
        word: 'In the grand scheme of things',
        ipa: '/ɪn ðə ɡrænd skiːm əv θɪŋz/',
        partOfSpeech: 'phrase',
        uzbekMeaning: 'Umumiy nuqtai nazardan qaraganda',
        englishDefinition: 'Considering the whole situation or the big picture.',
        exampleSentence: 'In the grand scheme of things, technological adoption is accelerating humanity.',
        uzbekExample: 'Umumiy nuqtai nazardan qaraganda, texnologiyalarning ommalashishi insoniyatni oldinga surmoqda.',
        level: 'B2',
        category: 'advanced'
      }
    ],
    warmUpQuestions: [
      'Do you believe AI will replace or empower knowledge workers?',
      'What is one task you currently delegate to AI apps?'
    ],
    speakingPrompts: [
      'State your stance on whether schools should embrace or restrict AI tools.',
      'Counter the tutor\'s opposing argument using "While I see your point, one must consider..."'
    ]
  },
  {
    id: 'lesson-b2-2',
    title: 'IELTS Speaking Part 2: A Memorable Journey',
    uzbekTitle: 'IELTS Part 2: Unutilmas Sayohat (Cue Card)',
    level: 'B2',
    category: 'IELTS Prep',
    description: 'Deliver a structured 2-minute monologue based on a prompt card with rich descriptive adjectives.',
    uzbekDescription: 'Cue card asosida to\'xtalishlarsiz, boy tasviriy so\'zlar bilan 2 daqiqalik nutq so\'zlang.',
    estimatedMinutes: 14,
    iconName: 'Globe',
    vocabList: [
      {
        id: 'v-b2-3',
        word: 'Breathtaking',
        ipa: '/ˈbreθˌteɪ.kɪŋ/',
        partOfSpeech: 'adjective',
        uzbekMeaning: 'Aql bovar qilmas darajada go\'zal, lol qoldiradigan',
        englishDefinition: 'Extremely exciting, beautiful, or surprising.',
        exampleSentence: 'The mountain view at sunrise was truly breathtaking.',
        uzbekExample: 'Quyosh chiqishidagi tog\' manzarasi chinakamiga lol qoldiradigan darajada go\'zal edi.',
        level: 'B2',
        category: 'ielts'
      }
    ],
    warmUpQuestions: [
      'What was the farthest place you have ever traveled to?',
      'Do you prefer spontaneous trips or carefully scheduled itineraries?'
    ],
    speakingPrompts: [
      'Speak for 1.5 - 2 minutes describing where you went, whom you went with, what you did, and why it was unforgettable.'
    ]
  },

  // C1 Advanced
  {
    id: 'lesson-c1-1',
    title: 'High-Stakes Contract Negotiation',
    uzbekTitle: 'Katta Shartnoma Bo\'yicha Muzokaralar Olib Borish',
    level: 'C1',
    category: 'Business English',
    description: 'Learn diplomatic language, concessions, hypothetical framing ("What if we were to..."), and closing deals.',
    uzbekDescription: 'Diplomatik til, yon bosish, shartli takliflar va shartnoma shartlarini kelishish.',
    estimatedMinutes: 16,
    iconName: 'ShieldCheck',
    vocabList: [
      {
        id: 'v-c1-1',
        word: 'Concession',
        ipa: '/kənˈseʃ.ən/',
        partOfSpeech: 'noun',
        uzbekMeaning: 'Yon bosish, kelishuv uchun berilgan chegirma',
        englishDefinition: 'Something that is allowed or given up, often in order to end a disagreement.',
        exampleSentence: 'We can make a concession on delivery timelines if you commit to an annual volume.',
        uzbekExample: 'Agar siz yillik hajmga kafolat bersangiz, biz yetkazib berish muddatlarida yon bosishimiz mumkin.',
        level: 'C1',
        category: 'business'
      },
      {
        id: 'v-c1-2',
        word: 'Feasible',
        ipa: '/ˈfiː.zə.bəl/',
        partOfSpeech: 'adjective',
        uzbekMeaning: 'Amalga oshirib bo\'ladigan, maqbul',
        englishDefinition: 'Able to be made, done, or achieved easily or conveniently.',
        exampleSentence: 'Is this production schedule technically feasible within the proposed budget?',
        uzbekExample: 'Ushbu ishlab chiqarish jadvali taklif qilingan byudjet doirasida texnik jihatdan amalga oshadimi?',
        level: 'C1',
        category: 'business'
      }
    ],
    warmUpQuestions: [
      'How do you handle disagreement in high-pressure business discussions?',
      'What matters more in negotiations: price or long-term partnership?'
    ],
    speakingPrompts: [
      'Negotiate terms with the client AI who wants a 20% discount that you cannot immediately accept.',
      'Propose an alternative value bundle instead of dropping unit price.'
    ]
  },

  // C2 Proficiency
  {
    id: 'lesson-c2-1',
    title: 'Rhetorical Persuasion & Complex Philosophical Discourse',
    uzbekTitle: 'Notiqlik Mahorati va Falsafiy Munozara',
    level: 'C2',
    category: 'Mastery',
    description: 'Demonstrate effortless fluency, sophisticated metaphors, subtle irony, and conceptual depth.',
    uzbekDescription: 'Mukammal darajadagi ravonlik, metaforalar, nozik ma\'nolar va falsafiy tahlil.',
    estimatedMinutes: 18,
    iconName: 'Sparkles',
    vocabList: [
      {
        id: 'v-c2-1',
        word: 'Ubiquitous',
        ipa: '/juːˈbɪk.wɪ.təs/',
        partOfSpeech: 'adjective',
        uzbekMeaning: 'Hamma yerda hoziru nozir, har qadamda uchraydigan',
        englishDefinition: 'Seeming to be everywhere at the same time.',
        exampleSentence: 'Smartphones have become so ubiquitous that unplugging feels almost rebellious.',
        uzbekExample: 'Smartfonlar shu qadar har qadamda uchraydigan bo\'lib qoldiki, ulardan uzilish deyarli isyonga o\'xshaydi.',
        level: 'C2',
        category: 'academic'
      },
      {
        id: 'v-c2-2',
        word: 'Paradigm shift',
        ipa: '/ˈpær.ə.daɪm ʃɪft/',
        partOfSpeech: 'noun',
        uzbekMeaning: 'Tafakkur yoki tizimning tubdan o\'zgarishi',
        englishDefinition: 'A fundamental change in approach or underlying assumptions.',
        exampleSentence: 'Remote work caused an irreversible paradigm shift in global organizational culture.',
        uzbekExample: 'Masofaviy ish global tashkiliy madaniyatda ortga qaytmas tub burilish yasadi.',
        level: 'C2',
        category: 'advanced'
      }
    ],
    warmUpQuestions: [
      'How does linguistic diversity shape philosophical worldviews?',
      'Can language constrain or expand human imagination?'
    ],
    speakingPrompts: [
      'Deliver an eloquent 2-minute perspective on whether technological efficiency diminishes artistic patience.'
    ]
  }
];

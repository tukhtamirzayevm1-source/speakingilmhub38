export interface MinimalPair {
  id: string;
  soundA: string;
  soundB: string;
  description: string;
  uzbekTip: string;
  pairs: {
    wordA: string;
    ipaA: string;
    wordB: string;
    ipaB: string;
    exampleA: string;
    exampleB: string;
  }[];
}

export interface TongueTwister {
  id: string;
  title: string;
  targetSound: string;
  text: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  uzbekTip: string;
}

export const MINIMAL_PAIRS: MinimalPair[] = [
  {
    id: 'mp-1',
    soundA: '/ɪ/ (Short i)',
    soundB: '/iː/ (Long ee)',
    description: 'Contrast between short relaxed /ɪ/ and tense elongated /iː/.',
    uzbekTip: 'Qisqa /ɪ/ tovushida til bo\'sh, /iː/ da esa tabassum qilib biroz cho\'zib talaffuz qilinadi.',
    pairs: [
      {
        wordA: 'Ship',
        ipaA: '/ʃɪp/',
        wordB: 'Sheep',
        ipaB: '/ʃiːp/',
        exampleA: 'The ship sailed into the harbor.',
        exampleB: 'The sheep were grazing on the hill.'
      },
      {
        wordA: 'Sit',
        ipaA: '/sɪt/',
        wordB: 'Seat',
        ipaB: '/siːt/',
        exampleA: 'Please sit down right here.',
        exampleB: 'Is this seat occupied?'
      },
      {
        wordA: 'Fit',
        ipaA: '/fɪt/',
        wordB: 'Feet',
        ipaB: '/fiːt/',
        exampleA: 'These running shoes fit comfortably.',
        exampleB: 'My feet are tired after the walk.'
      }
    ]
  },
  {
    id: 'mp-2',
    soundA: '/θ/ (Voiceless TH)',
    soundB: '/s/ (S sound)',
    description: 'Tongue between teeth for /θ/ versus tongue behind front teeth for /s/.',
    uzbekTip: 'O\'zbek tilida /θ/ tovushi yo\'q. Til uchini yuqori va pastki tishlar orasiga qo\'yib puflagandek aytiladi.',
    pairs: [
      {
        wordA: 'Think',
        ipaA: '/θɪŋk/',
        wordB: 'Sink',
        ipaB: '/sɪŋk/',
        exampleA: 'I think we should practice more.',
        exampleB: 'Wash the dishes in the kitchen sink.'
      },
      {
        wordA: 'Thick',
        ipaA: '/θɪk/',
        wordB: 'Sick',
        ipaB: '/sɪk/',
        exampleA: 'He wore a thick winter jacket.',
        exampleB: 'Stay home if you feel sick.'
      }
    ]
  },
  {
    id: 'mp-3',
    soundA: '/w/ (W sound)',
    soundB: '/v/ (V sound)',
    description: 'Round lips without teeth touching for /w/; top teeth touching bottom lip for /v/.',
    uzbekTip: '/w/ tovushida lablar cho\'chchayadi va tishlar labga tegmaydi; /v/ da yuqori tish pastki labga tegadi.',
    pairs: [
      {
        wordA: 'West',
        ipaA: '/west/',
        wordB: 'Vest',
        ipaB: '/vest/',
        exampleA: 'The sun sets in the west.',
        exampleB: 'He put on a warm knitted vest.'
      },
      {
        wordA: 'Wet',
        ipaA: '/wet/',
        wordB: 'Vet',
        ipaB: '/vet/',
        exampleA: 'My umbrella kept me from getting wet.',
        exampleB: 'We took our dog to the local vet.'
      }
    ]
  }
];

export const TONGUE_TWISTERS: TongueTwister[] = [
  {
    id: 'tt-1',
    title: 'She Sells Seashells',
    targetSound: '/ʃ/ and /s/',
    text: 'She sells seashells by the seashore, and the shells she sells are seashells, I\'m sure.',
    difficulty: 'Medium',
    uzbekTip: '/ʃ/ (sh) va /s/ (s) tovushlari orasidagi almashinishga e\'tibor bering.'
  },
  {
    id: 'tt-2',
    title: 'Thirty-Three Thousand Feathers',
    targetSound: '/θ/ and /ð/',
    text: 'Thirty-three thousand feathers on a thrush\'s throat.',
    difficulty: 'Hard',
    uzbekTip: 'Til uchini tishlar orasiga qo\'yib /θ/ tovushini to\'g\'ri chiqarishga e\'tibor qarating.'
  },
  {
    id: 'tt-3',
    title: 'Red Lorry, Yellow Lorry',
    targetSound: '/r/ and /l/',
    text: 'Red lorry, yellow lorry, red lorry, yellow lorry.',
    difficulty: 'Easy',
    uzbekTip: '/r/ da til orqaga tortiladi, /l/ da esa tish orqasidagi qattiq tanglayga tegadi.'
  }
];

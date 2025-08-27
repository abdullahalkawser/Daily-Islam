


export const modulesData = [
  {
    id: 'basics',
    title: 'Basics',
    description: 'Learn Arabic letters, pronunciation, and basic symbols',
    icon: '📚',
    color: '#3b82f6',
    lessons: [
      {
        id: 'letters',
        title: 'Arabic Letters',
        type: 'content',
        description: 'Learn the 28 Arabic letters and their pronunciation',
        content: {
          text: 'The Arabic alphabet consists of 28 letters, written from right to left. Each letter has different forms depending on its position in the word.',
          examples: [
            { letter: 'ا', name: 'Alif', sound: '/a/' },
            { letter: 'ب', name: 'Baa', sound: '/b/' },
            { letter: 'ت', name: 'Taa', sound: '/t/' },
            { letter: 'ث', name: 'Thaa', sound: '/θ/' },
            { letter: 'ج', name: 'Jeem', sound: '/dʒ/' },
            { letter: 'ح', name: 'Haa', sound: '/ħ/' },
          ],
        },
        audioUrl: 'letters_audio.mp3',
      },
      {
        id: 'makhraj',
        title: 'Makhraj (Pronunciation Points)',
        type: 'content',
        description: 'Learn the correct pronunciation points for Arabic letters',
        content: {
          text: 'Makhraj refers to the points of articulation in the mouth and throat where Arabic letters are pronounced.',
          categories: [
            { name: 'Throat Letters', letters: ['ء', 'ه', 'ع', 'ح', 'غ', 'خ'] },
            { name: 'Tongue Letters', letters: ['ق', 'ك', 'জ', 'শ', 'য়'] },
            { name: 'Lip Letters', letters: ['ব', 'ফ', 'ম', 'ও'] },
          ],
        },
        audioUrl: 'makhraj_audio.mp3',
      },
    ],
  },
  {
    id: 'word_formation',
    title: 'Word Formation',
    description: 'Learn to form and read Arabic words',
    icon: '🔤',
    color: '#10b981',
    lessons: [
      {
        id: 'small_words',
        title: 'Small Words',
        type: 'content',
        description: 'Practice reading simple 2-3 letter words',
        content: {
          text: 'Start with simple words to practice connecting letters and applying vowel marks.',
          words: [
            { arabic: 'কَتَبَ', transliteration: 'kataba', meaning: 'he wrote' },
            { arabic: 'বَيْتٌ', transliteration: 'baytun', meaning: 'a house' },
            { arabic: 'কিতাَبٌ', transliteration: 'kitaabun', meaning: 'a book' },
          ],
        },
        audioUrl: 'small_words_audio.mp3',
      },
    ],
  },
];




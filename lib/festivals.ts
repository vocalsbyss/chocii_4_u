/**
 * Comprehensive Indian Festival Calendar & Festive Greetings Engine.
 * Covers all major Indian festivals celebrated across all states, religions, and traditions.
 */

export interface IndianFestival {
  id: string;
  name: string;
  regionalNames?: string[];
  emoji: string;
  category: "HINDU" | "ISLAMIC" | "CHRISTIAN" | "SIKH" | "JAIN" | "BUDDHIST" | "NATIONAL" | "CULTURAL";
  approxMonthDay: string; // MM-DD for recurring estimation
  datesByYear: Record<number, string>; // YYYY-MM-DD
  headline: string;
  wish: string;
  significance: string;
  sweetTradition: string;
  suggestedOfferCode: string;
}

export const INDIAN_FESTIVALS: IndianFestival[] = [
  // JANUARY
  {
    id: "new_year",
    name: "New Year's Day",
    emoji: "🎆",
    category: "CULTURAL",
    approxMonthDay: "01-01",
    datesByYear: { 2025: "2025-01-01", 2026: "2026-01-01", 2027: "2027-01-01" },
    headline: "Happy New Year! Wishing You Sweet Beginnings",
    wish: "Wishing you and your family a radiant, joyous, and sweet New Year! May every day bring fresh reasons to smile, celebrate, and create delightful memories.",
    significance: "Celebration of new beginnings, hope, and fresh aspirations.",
    sweetTradition: "Artisanal celebration cakes & rich chocolate hampers.",
    suggestedOfferCode: "NEWYEAR",
  },
  {
    id: "lohri",
    name: "Lohri",
    regionalNames: ["Lohri"],
    emoji: "🔥",
    category: "CULTURAL",
    approxMonthDay: "01-13",
    datesByYear: { 2025: "2025-01-13", 2026: "2026-01-13", 2027: "2027-01-13" },
    headline: "Happy Lohri! Warm Wishes & Sweet Celebrations",
    wish: "May the bonfire of Lohri burn all worries away and usher in warmth, happiness, and sweet blessings for you and your cherished ones!",
    significance: "Harvest festival of North India marking the passing of the winter solstice.",
    sweetTradition: "Rewri, gajak, molten caramel brownies, and festive treats.",
    suggestedOfferCode: "LOHRI",
  },
  {
    id: "makar_sankranti",
    name: "Makar Sankranti & Pongal",
    regionalNames: ["Pongal", "Uttarayan", "Maghi", "Pedda Panduga"],
    emoji: "🪁",
    category: "HINDU",
    approxMonthDay: "01-14",
    datesByYear: { 2025: "2025-01-14", 2026: "2026-01-14", 2027: "2027-01-14" },
    headline: "Happy Makar Sankranti & Pongal! Soar High in Sweetness",
    wish: "Wishing you a bountiful, joyful Makar Sankranti & Pongal! May your life be filled with sweet happiness, good health, and soaring achievements like kites in the clear sky.",
    significance: "Auspicious solar transition into Makara rashi and pan-Indian harvest thanksgiving.",
    sweetTradition: "Til-gud delicacies, sweet pongal, and artisanal chocolate bites.",
    suggestedOfferCode: "SANKRANTI",
  },
  {
    id: "republic_day",
    name: "Republic Day",
    emoji: "🇮🇳",
    category: "NATIONAL",
    approxMonthDay: "01-26",
    datesByYear: { 2025: "2025-01-26", 2026: "2026-01-26", 2027: "2027-01-26" },
    headline: "Happy Republic Day! Celebrating the Spirit of India",
    wish: "Warm Republic Day greetings from chocii 4 u! Let us take pride in our heritage, unity, and shared sweet moments of joy across our beautiful nation.",
    significance: "Commemoration of the Constitution of India taking effect in 1950.",
    sweetTradition: "Tricolor celebration dessert hampers & gourmet boxes.",
    suggestedOfferCode: "REPUBLIC",
  },

  // FEBRUARY
  {
    id: "maha_shivratri",
    name: "Maha Shivratri",
    emoji: "🔱",
    category: "HINDU",
    approxMonthDay: "02-17",
    datesByYear: { 2025: "2025-02-26", 2026: "2026-02-15", 2027: "2027-03-06" },
    headline: "Har Har Mahadev! Blessed Maha Shivratri",
    wish: "May the divine blessings of Lord Shiva bring peace, strength, and enlightenment to your home on this sacred night of Maha Shivratri.",
    significance: "The great cosmic night honoring Lord Shiva and the union of Shiva and Shakti.",
    sweetTradition: "Fasting sweets, fresh fruit bowls, and milk-based chocolate delicacies.",
    suggestedOfferCode: "SHIVRATRI",
  },

  // MARCH
  {
    id: "holi",
    name: "Holi — Festival of Colours",
    regionalNames: ["Dol Jatra", "Phagwah", "Lathmar Holi"],
    emoji: "🎨",
    category: "HINDU",
    approxMonthDay: "03-25",
    datesByYear: { 2025: "2025-03-14", 2026: "2026-03-04", 2027: "2027-03-22" },
    headline: "Happy Holi! Splash into Sweetness and Colours of Joy",
    wish: "Wishing you a vibrant, delightful, and joyful Holi! May your celebrations be painted with colors of love, laughter, and sweet gourmet treats shared with family and friends.",
    significance: "Celebration of spring, love, and the victory of good over evil.",
    sweetTradition: "Gujiya, chilled Fruizy bowls, and molten chocolate platters.",
    suggestedOfferCode: "HOLISWEETS",
  },
  {
    id: "eid_ul_fitr",
    name: "Eid-ul-Fitr",
    regionalNames: ["Ramzan Eid", "Meethi Eid"],
    emoji: "🌙",
    category: "ISLAMIC",
    approxMonthDay: "03-31",
    datesByYear: { 2025: "2025-03-31", 2026: "2026-03-20", 2027: "2027-03-10" },
    headline: "Eid Mubarak! May Peace and Sweet Blessings Fill Your Home",
    wish: "Eid Mubarak to you and your loved ones! May the divine blessings of Eid bring peace, good health, and abundant joy. Celebrate this sweet day of togetherness with our artisanal kitchen creations.",
    significance: "Sacred festival marking the end of the holy month of Ramadan.",
    sweetTradition: "Sheer khurma, date delights, and layered chocolate Dream Cakes.",
    suggestedOfferCode: "EIDMUBARAK",
  },

  // APRIL
  {
    id: "ugadi_gudi_padwa",
    name: "Ugadi & Gudi Padwa",
    regionalNames: ["Ugadi", "Gudi Padwa", "Yugadi", "Cheti Chand"],
    emoji: "🌸",
    category: "HINDU",
    approxMonthDay: "04-09",
    datesByYear: { 2025: "2025-03-30", 2026: "2026-03-19", 2027: "2027-04-07" },
    headline: "Happy Ugadi & Gudi Padwa! Sweet New Beginnings",
    wish: "Wishing you a prosperous, joyous, and sweet Ugadi & Gudi Padwa! May the New Year usher in happiness, harmonious flavors, and endless success in all your endeavors.",
    significance: "Traditional New Year celebrations for Andhra Pradesh, Telangana, Karnataka, and Maharashtra.",
    sweetTradition: "Ugadi pachadi, puran poli, and handcrafted chocolate fudge tubs.",
    suggestedOfferCode: "UGADI",
  },
  {
    id: "ram_navami",
    name: "Ram Navami",
    emoji: "🏹",
    category: "HINDU",
    approxMonthDay: "04-17",
    datesByYear: { 2025: "2025-04-06", 2026: "2026-03-27", 2027: "2027-04-15" },
    headline: "Shubha Ram Navami! May Righteousness & Peace Prevail",
    wish: "Warm greetings on Ram Navami! May the divine virtues of truth, courage, and compassion bring harmony and sweet blessings to your household.",
    significance: "Celebration of the birth of Lord Rama, the embodiment of dharma.",
    sweetTradition: "Panakam, kosambari, and gourmet celebration boxes.",
    suggestedOfferCode: "RAMNAVAMI",
  },
  {
    id: "baisakhi_vishu",
    name: "Baisakhi & Vishu",
    regionalNames: ["Vishu", "Bihu", "Poila Boishakh", "Puthandu"],
    emoji: "🌾",
    category: "CULTURAL",
    approxMonthDay: "04-14",
    datesByYear: { 2025: "2025-04-14", 2026: "2026-04-14", 2027: "2027-04-14" },
    headline: "Happy Baisakhi, Vishu & Regional New Years!",
    wish: "Wishing you a happy, prosperous harvest season and regional New Year! May nature’s bounty fill your home with golden smiles and sweet delights.",
    significance: "Harvest thanksgiving and traditional New Year across Punjab, Kerala, Tamil Nadu, Bengal, and Assam.",
    sweetTradition: "Payasam, jalebis, and chilled dessert bowls.",
    suggestedOfferCode: "HARVEST",
  },
  {
    id: "easter",
    name: "Easter Sunday",
    emoji: "🐣",
    category: "CHRISTIAN",
    approxMonthDay: "04-20",
    datesByYear: { 2025: "2025-04-20", 2026: "2026-04-05", 2027: "2027-03-28" },
    headline: "Happy Easter! Celebrating Renewal & Hope",
    wish: "Wishing you a blessed Easter filled with joy, peace, and sweet renewal. May your celebrations with family be filled with warm smiles and sweet surprises!",
    significance: "Celebration of the resurrection of Jesus Christ and triumph of life.",
    sweetTradition: "Chocolate eggs, hot cross buns, and chocolate truffle nests.",
    suggestedOfferCode: "EASTER",
  },

  // MAY
  {
    id: "buddha_purnima",
    name: "Buddha Purnima",
    emoji: "☸️",
    category: "BUDDHIST",
    approxMonthDay: "05-12",
    datesByYear: { 2025: "2025-05-12", 2026: "2026-05-01", 2027: "2027-05-20" },
    headline: "Blessed Buddha Purnima! Peace, Compassion & Wisdom",
    wish: "May the serene teachings of Lord Buddha inspire peace, harmony, and compassion in your life and bring tranquil sweetness to your days.",
    significance: "Commemoration of the birth, enlightenment, and parinirvana of Gautama Buddha.",
    sweetTradition: "Kheer, milk sweets, and pure chocolate bowls.",
    suggestedOfferCode: "PEACE",
  },

  // JUNE
  {
    id: "eid_ul_adha",
    name: "Eid-ul-Adha (Bakrid)",
    emoji: "🕋",
    category: "ISLAMIC",
    approxMonthDay: "06-07",
    datesByYear: { 2025: "2025-06-07", 2026: "2026-05-27", 2027: "2027-05-16" },
    headline: "Eid-ul-Adha Mubarak! Blessings of Sacrifice & Unity",
    wish: "Wishing you a joyous and blessed Eid-ul-Adha! May the spirit of devotion, faith, and generosity illuminate your path and sweeten every celebration with your family.",
    significance: "Festival commemorating the willingness of Ibrahim to sacrifice in devotion to God.",
    sweetTradition: "Rich confectionery hampers, sewaiyan, and decadent layered cakes.",
    suggestedOfferCode: "BAKRID",
  },

  // AUGUST
  {
    id: "independence_day",
    name: "Independence Day",
    emoji: "🇮🇳",
    category: "NATIONAL",
    approxMonthDay: "08-15",
    datesByYear: { 2025: "2025-08-15", 2026: "2026-08-15", 2027: "2027-08-15" },
    headline: "Happy Independence Day! Celebrating Freedom & Glory",
    wish: "Proud greetings on Independence Day! Celebrating the freedom, unity, and sweet vibrancy of India. Enjoy sweet moments of togetherness with friends and family.",
    significance: "National celebration of India’s freedom in 1947.",
    sweetTradition: "Tricolor chocolate boxes & patriotic celebration platters.",
    suggestedOfferCode: "FREEDOM",
  },
  {
    id: "raksha_bandhan",
    name: "Raksha Bandhan",
    regionalNames: ["Rakhi"],
    emoji: "🪢",
    category: "HINDU",
    approxMonthDay: "08-28",
    datesByYear: { 2025: "2025-08-09", 2026: "2026-08-28", 2027: "2027-08-17" },
    headline: "Happy Raksha Bandhan! Sweet Sibling Bonds",
    wish: "Happy Raksha Bandhan! Celebrating the sacred, sweet, and timeless bond between brothers and sisters. Sweeten your Rakhi moments with our handcrafted chocolate gift boxes.",
    significance: "Celebration of sibling protection, unconditional love, and shared laughter.",
    sweetTradition: "Artisan Rakhi chocolate hampers, molten brownie boxes, and Dream Cakes.",
    suggestedOfferCode: "RAKHI",
  },

  // SEPTEMBER
  {
    id: "janmashtami",
    name: "Krishna Janmashtami",
    regionalNames: ["Gokulashtami", "Dahi Handi"],
    emoji: "🪈",
    category: "HINDU",
    approxMonthDay: "09-04",
    datesByYear: { 2025: "2025-08-16", 2026: "2026-09-04", 2027: "2027-08-25" },
    headline: "Shri Krishna Janmashtami! Divine Sweetness & Joy",
    wish: "May the divine playfulness, wisdom, and sweetness of Lord Krishna fill your life with eternal happiness and harmony. Happy Janmashtami from chocii 4 u!",
    significance: "Celebration of the birth of Lord Krishna.",
    sweetTradition: "Makhan-mishri, panjiri, and artisanal molten chocolate tubs.",
    suggestedOfferCode: "KRISHNA",
  },
  {
    id: "ganesh_chaturthi",
    name: "Ganesh Chaturthi",
    regionalNames: ["Vinayaka Chavithi"],
    emoji: "🐘",
    category: "HINDU",
    approxMonthDay: "09-14",
    datesByYear: { 2025: "2025-08-27", 2026: "2026-09-14", 2027: "2027-09-04" },
    headline: "Ganpati Bappa Morya! Happy Ganesh Chaturthi",
    wish: "Wishing you an auspicious, joyful, and blessed Ganesh Chaturthi! May Lord Ganesha remove all obstacles and shower his sweet grace upon your home and loved ones.",
    significance: "Welcoming Lord Ganesha, the remover of hurdles and lord of beginnings.",
    sweetTradition: "Modak delights, chocolate modak fusion bowls, and sweet prasadam.",
    suggestedOfferCode: "GANESHA",
  },
  {
    id: "onam",
    name: "Onam — Thiruvonam",
    emoji: "🌼",
    category: "CULTURAL",
    approxMonthDay: "09-05",
    datesByYear: { 2025: "2025-09-05", 2026: "2026-08-26", 2027: "2027-09-12" },
    headline: "Happy Onam! Prosperity, Joy & Festive Feasts",
    wish: "Wishing you a very Happy Onam! May King Mahabali bless your home with prosperity, harmony, and sweet memories alongside a sumptuous Onasadya feast.",
    significance: "Harvest festival of Kerala honoring the return of King Mahabali.",
    sweetTradition: "Ada pradhaman, payasam, and artisanal chocolate hampers.",
    suggestedOfferCode: "ONAM",
  },

  // OCTOBER
  {
    id: "gandhi_jayanti",
    name: "Gandhi Jayanti",
    emoji: "🕊️",
    category: "NATIONAL",
    approxMonthDay: "10-02",
    datesByYear: { 2025: "2025-10-02", 2026: "2026-10-02", 2027: "2027-10-02" },
    headline: "Remembering Mahatma Gandhi — Truth & Peace",
    wish: "On Gandhi Jayanti, let us celebrate peace, non-violence, and selfless service. Wishing you a serene and harmonious day with your loved ones.",
    significance: "Honoring the father of the nation on his birth anniversary.",
    sweetTradition: "Pure, wholesome chocolate sweets and artisan hampers.",
    suggestedOfferCode: "PEACE",
  },
  {
    id: "navratri_durga_puja",
    name: "Navratri & Durga Puja",
    regionalNames: ["Sharad Navratri", "Durgaotsav", "Dussehra"],
    emoji: "🔱",
    category: "HINDU",
    approxMonthDay: "10-15",
    datesByYear: { 2025: "2025-10-02", 2026: "2026-10-11", 2027: "2027-10-01" },
    headline: "Shubho Durga Puja & Happy Navratri!",
    wish: "May Maa Durga bless you with strength, wisdom, and infinite happiness! Celebrate the divine festive days with sweet devotion and rich culinary delights.",
    significance: "Nine nights honoring divine feminine Shakti and the victory over Mahishasura.",
    sweetTradition: "Sandesh, mishti, and layered chocolate Dream Cakes.",
    suggestedOfferCode: "NAVRATRI",
  },
  {
    id: "dussehra",
    name: "Dussehra / Vijayadashami",
    emoji: "🏹",
    category: "HINDU",
    approxMonthDay: "10-20",
    datesByYear: { 2025: "2025-10-12", 2026: "2026-10-20", 2027: "2027-10-10" },
    headline: "Happy Dussehra! Victory of Truth & Goodness",
    wish: "Wishing you and your family a triumphant, blessed Dussehra! May all obstacles vanish and your life shine with victory, peace, and sweet success.",
    significance: "Celebration of Lord Rama’s victory over Ravana and Durga’s victory over Mahishasura.",
    sweetTradition: "Jalebi, fafda, and gourmet chocolate truffle hampers.",
    suggestedOfferCode: "VIJAY",
  },
  {
    id: "dhanteras",
    name: "Dhanteras — Auspicious Beginnings",
    emoji: "🪙",
    category: "HINDU",
    approxMonthDay: "10-28",
    datesByYear: { 2025: "2025-10-18", 2026: "2026-11-06", 2027: "2027-10-27" },
    headline: "Shubh Dhanteras! Prosperity & Sweet Beginnings",
    wish: "May Goddess Lakshmi and Lord Dhanvantari bestow abundant wealth, vibrant health, and sweet blessings upon you on this auspicious day of Dhanteras!",
    significance: "The auspicious first day of the Diwali festival celebrating wealth and health.",
    sweetTradition: "Golden chocolate coins, luxury fudge boxes, and festive brownies.",
    suggestedOfferCode: "DHANTERAS",
  },
  {
    id: "diwali",
    name: "Diwali — Festival of Lights",
    regionalNames: ["Deepavali", "Bandi Chhor Divas"],
    emoji: "🪔",
    category: "HINDU",
    approxMonthDay: "11-08",
    datesByYear: { 2025: "2025-10-20", 2026: "2026-11-08", 2027: "2027-10-29" },
    headline: "Happy Diwali! May Lights & Sweet Moments Brighten Your Home",
    wish: "Wishing you and your cherished family a sparkling, luminous, and blissful Diwali! May the divine lights bring endless peace, prosperity, and sweet happiness to your doorstep.",
    significance: "The supreme festival of lights celebrating the return of Lord Rama and triumph of light over darkness.",
    sweetTradition: "Artisanal Dream Cakes, luxury chocolate gift boxes, and molten brownie bowls.",
    suggestedOfferCode: "DIWALI",
  },
  {
    id: "bhai_dooj",
    name: "Bhai Dooj",
    regionalNames: ["Bhai Tika", "Bhau Beej", "Bhratri Dwitiya"],
    emoji: "🎁",
    category: "HINDU",
    approxMonthDay: "11-10",
    datesByYear: { 2025: "2025-10-23", 2026: "2026-11-10", 2027: "2027-10-31" },
    headline: "Happy Bhai Dooj! Celebrating Brother-Sister Sweetness",
    wish: "Wishing all brothers and sisters a very sweet and joyful Bhai Dooj! May your bond grow stronger with each passing day and be filled with sweet treats.",
    significance: "Post-Diwali celebration honoring the pure bond between siblings.",
    sweetTradition: "Custom dessert hampers and chocolate tubs.",
    suggestedOfferCode: "BHAIDOOJ",
  },
  {
    id: "chhath_puja",
    name: "Chhath Puja",
    emoji: "☀️",
    category: "HINDU",
    approxMonthDay: "11-15",
    datesByYear: { 2025: "2025-10-27", 2026: "2026-11-15", 2027: "2027-11-04" },
    headline: "Jai Chhathi Maiya! Blessed Chhath Puja",
    wish: "Warm wishes on the sacred occasion of Chhath Puja! May the Sun God and Chhathi Maiya bless you with vitality, peace, and sweet prosperity.",
    significance: "Ancient solar thanksgiving ritual dedicated to Surya and Usha.",
    sweetTradition: "Thekua, fresh seasonal fruits, and chocolate platters.",
    suggestedOfferCode: "CHHATH",
  },
  {
    id: "guru_nanak_jayanti",
    name: "Guru Nanak Jayanti (Gurpurab)",
    emoji: "🕯️",
    category: "SIKH",
    approxMonthDay: "11-24",
    datesByYear: { 2025: "2025-11-05", 2026: "2026-11-24", 2027: "2027-11-14" },
    headline: "Happy Gurpurab! May Divine Wisdom & Grace Be with You",
    wish: "Warmest wishes on Guru Nanak Dev Ji’s Gurpurab. May his divine teachings of oneness, truth, and compassion illuminate your life with peace and sweet harmony.",
    significance: "Celebration of the birth of Guru Nanak Dev Ji, founder of Sikhism.",
    sweetTradition: "Kada prashad, pinnis, and celebration dessert boxes.",
    suggestedOfferCode: "GURPURAB",
  },

  // DECEMBER
  {
    id: "christmas",
    name: "Christmas — Season of Joy",
    regionalNames: ["Bada Din", "Xmas"],
    emoji: "🎄",
    category: "CHRISTIAN",
    approxMonthDay: "12-25",
    datesByYear: { 2025: "2025-12-25", 2026: "2026-12-25", 2027: "2027-12-25" },
    headline: "Merry Christmas! Joy, Warmth & Holiday Treats",
    wish: "Merry Christmas from chocii 4 u! Wishing you and your loved ones a season filled with warmth, laughter, and sweet comfort by the hearth.",
    significance: "Celebration of the birth of Jesus Christ, spreading peace and goodwill to all.",
    sweetTradition: "Plum cake, holiday brownie bowls, crispy churros, and hot chocolate tubs.",
    suggestedOfferCode: "CHRISTMAS",
  },
];

/**
 * Returns festival matching today or upcoming within the next 3 days
 */
export function getTodayOrUpcomingFestival(currentDate = new Date()): {
  festival: IndianFestival | null;
  isToday: boolean;
  daysUntil: number;
  celebrationDateStr: string;
} {
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const currentDay = String(currentDate.getDate()).padStart(2, "0");
  const todayStr = `${currentYear}-${currentMonth}-${currentDay}`;

  // 1. Exact match for today
  for (const f of INDIAN_FESTIVALS) {
    const yearDate = f.datesByYear[currentYear] || `${currentYear}-${f.approxMonthDay}`;
    if (yearDate === todayStr) {
      return {
        festival: f,
        isToday: true,
        daysUntil: 0,
        celebrationDateStr: yearDate,
      };
    }
  }

  // 2. Check within the next 3 days
  const todayMs = new Date(todayStr).getTime();
  let closestUpcoming: { festival: IndianFestival; daysUntil: number; dateStr: string } | null = null;

  for (const f of INDIAN_FESTIVALS) {
    const yearDate = f.datesByYear[currentYear] || `${currentYear}-${f.approxMonthDay}`;
    const festivalMs = new Date(yearDate).getTime();
    const diffDays = Math.round((festivalMs - todayMs) / (1000 * 60 * 60 * 24));

    if (diffDays > 0 && diffDays <= 4) {
      if (!closestUpcoming || diffDays < closestUpcoming.daysUntil) {
        closestUpcoming = { festival: f, daysUntil: diffDays, dateStr: yearDate };
      }
    }
  }

  if (closestUpcoming) {
    return {
      festival: closestUpcoming.festival,
      isToday: false,
      daysUntil: closestUpcoming.daysUntil,
      celebrationDateStr: closestUpcoming.dateStr,
    };
  }

  return {
    festival: null,
    isToday: false,
    daysUntil: -1,
    celebrationDateStr: "",
  };
}

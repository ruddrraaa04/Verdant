export type CategoryId =
  | 'fresh-fruits'
  | 'vegetables'
  | 'dairy-eggs'
  | 'bakery'
  | 'snacks'
  | 'beverages'
  | 'pantry'
  | 'household';

export type DiscoveryTab =
  | 'all'
  | 'best-sellers'
  | 'fresh-arrivals'
  | 'todays-deals'
  | 'recommended';

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  tagline: string;
  description: string;
  bgHex: string;
  surfaceHex: string;
  accentHex: string;
  textHex: string;
  mutedTextHex: string;
  image: string;
  itemCountLabel: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  categoryLabel: string;
  weight: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  image: string;
  description: string;
  origin: string;
  storageTip: string;
  collections: Exclude<DiscoveryTab, 'all'>[];
  featuredDeal?: boolean;
  dealWindowNote?: string;
}

export interface PromoCode {
  code: string;
  label: string;
  type: 'percent' | 'flat';
  value: number;
  minOrder: number;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'fresh-fruits',
    name: 'Fresh Fruits',
    tagline: 'Tree-ripened & hand-picked at peak sweetness',
    description:
      'Ratnagiri Alphonso mangoes, Mahabaleshwar berries, and crisp orchard citrus harvested before dawn.',
    bgHex: '#FFF0E3',
    surfaceHex: '#FFE2C7',
    accentHex: '#E85D04',
    textHex: '#2D1606',
    mutedTextHex: '#7A431D',
    image: '/assets/aistudio/MANGO_678ef818.jpg',
    itemCountLabel: 'Orchard Harvest',
  },
  {
    id: 'vegetables',
    name: 'Vegetables',
    tagline: 'Morning-cut greens & heirloom vine produce',
    description:
      'Triple-washed leafy spinach, sweet vine-ripened tomatoes, and pesticide-free seasonal harvests.',
    bgHex: '#E9F5E8',
    surfaceHex: '#D5ECD3',
    accentHex: '#1F6F3D',
    textHex: '#0F2A1B',
    mutedTextHex: '#3B654C',
    image: '/assets/aistudio/SPINACH_359dd13e.jpg',
    itemCountLabel: 'Hydro & Farm Greens',
  },
  {
    id: 'dairy-eggs',
    name: 'Dairy & Eggs',
    tagline: 'Pasture-raised & small-batch cultured daily',
    description:
      'A2 whole milk, slow-churned cultured butter, free-range country eggs, and cave-aged farmhouse cheeses.',
    bgHex: '#F9F6EA',
    surfaceHex: '#EFEAD4',
    accentHex: '#B6822A',
    textHex: '#262114',
    mutedTextHex: '#685C40',
    image: '/assets/aistudio/COUNTRY_EGGS_6f6e3a6f.jpg',
    itemCountLabel: 'Morning Chilled',
  },
  {
    id: 'bakery',
    name: 'Bakery',
    tagline: 'Stone-deck baked with wild fermentation',
    description:
      '36-hour fermented country sourdough, hearty whole-wheat loaves, and crisp golden crusts warm from the oven.',
    bgHex: '#FBF1DF',
    surfaceHex: '#F4E1BF',
    accentHex: '#A65D1B',
    textHex: '#2B1B0D',
    mutedTextHex: '#6F4E2E',
    image: '/assets/aistudio/SOURDOUGH_fb5ebba7.jpg',
    itemCountLabel: 'Wild Fermented',
  },
  {
    id: 'snacks',
    name: 'Snacks',
    tagline: 'Whole-nut crunch & clean-label pantry bites',
    description:
      'Nonpareil California almonds, lightly roasted nut medleys, and unrefined savoury nibbles.',
    bgHex: '#F6ECE4',
    surfaceHex: '#EAD8CA',
    accentHex: '#9C4221',
    textHex: '#2A1810',
    mutedTextHex: '#6E4B3A',
    image: '/assets/aistudio/CALIFORNIA_ALMONDS_7085d534.jpg',
    itemCountLabel: 'Raw & Roasted',
  },
  {
    id: 'beverages',
    name: 'Beverages',
    tagline: 'Cold-pressed juices & botanical infusions',
    description:
      '100% single-origin Valencia orange juice pressed without heat, paired with whole-spice herbal tisanes.',
    bgHex: '#EAF6F9',
    surfaceHex: '#D4ECF2',
    accentHex: '#0369A1',
    textHex: '#0D2533',
    mutedTextHex: '#3B6278',
    image: '/assets/aistudio/ORANGE_JUICE_c19c7825.jpg',
    itemCountLabel: 'Zero Added Sugar',
  },
  {
    id: 'pantry',
    name: 'Pantry Essentials',
    tagline: 'Single-estate ghee, whole spices & staples',
    description:
      'Traditional bilona A2 cow ghee, heirloom whole green cardamom, and foundational kitchen ingredients.',
    bgHex: '#EFF3E6',
    surfaceHex: '#DFE8CD',
    accentHex: '#4D7C0F',
    textHex: '#1A260D',
    mutedTextHex: '#4D5E38',
    image: '/assets/aistudio/COW_BUTTER_30ab599c.jpg',
    itemCountLabel: 'Estate Reserves',
  },
  {
    id: 'household',
    name: 'Household',
    tagline: 'Plant-derived care for kitchen & home',
    description:
      'Biodegradable citrus-peel surface mists and botanical dish elixirs crafted with cold-pressed essential oils.',
    bgHex: '#ECF4F1',
    surfaceHex: '#D6E8E2',
    accentHex: '#0F766E',
    textHex: '#0E2926',
    mutedTextHex: '#3A635E',
    image: '/assets/aistudio/ORANGE_ad855ce0.jpg',
    itemCountLabel: 'Botanical Home',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'alphonso-mangoes',
    name: 'Fresh Alphonso Mangoes',
    category: 'fresh-fruits',
    categoryLabel: 'Fresh Fruits',
    weight: '1 kg (4–5 pcs)',
    price: 480,
    originalPrice: 600,
    discountPercent: 20,
    image: '/assets/aistudio/MANGO_678ef818.jpg',
    description:
      'GI-tagged Ratnagiri Alphonso mangoes ripened naturally in hay without carbide. Deep saffron flesh with floral aroma and honeyed sweetness.',
    origin: 'Ratnagiri, Maharashtra',
    storageTip: 'Store at room temperature until fragrant, then chill 2 hours before slicing.',
    collections: ['best-sellers', 'todays-deals', 'recommended'],
    featuredDeal: true,
    dealWindowNote: 'First-pick orchard batch',
  },
  {
    id: 'mahabaleshwar-strawberries',
    name: 'Fresh Strawberries',
    category: 'fresh-fruits',
    categoryLabel: 'Fresh Fruits',
    weight: '250 g punnet',
    price: 220,
    originalPrice: 280,
    discountPercent: 21,
    image: '/assets/aistudio/STRAWBERRY_1423f983.jpg',
    description:
      'Hand-harvested ruby strawberries packed in ventilated pulp punnets within 4 hours of picking. Bright acidity balanced with berry jam sweetness.',
    origin: 'Mahabaleshwar, Sahyadris',
    storageTip: 'Keep unwashed in the crisper drawer; rinse gently right before serving.',
    collections: ['fresh-arrivals', 'todays-deals', 'best-sellers'],
    featuredDeal: true,
    dealWindowNote: 'Morning hill-station airlift',
  },
  {
    id: 'organic-bananas',
    name: 'Organic Bananas',
    category: 'fresh-fruits',
    categoryLabel: 'Fresh Fruits',
    weight: '500 g (6–8 pcs)',
    price: 75,
    image: '/assets/aistudio/BANANA_ff8357a1.jpg',
    description:
      'Naturally sweet Yelakki bananas grown without synthetic sprays. Thin-skinned, creamy, and ideal for morning bowls or snacking.',
    origin: 'Erode, Tamil Nadu',
    storageTip: 'Hang on a counter hook away from direct sunlight for even ripening.',
    collections: ['best-sellers', 'recommended'],
  },
  {
    id: 'citrus-harvest-box',
    name: 'Citrus & Berry Medley Box',
    category: 'fresh-fruits',
    categoryLabel: 'Fresh Fruits',
    weight: '850 g curated box',
    price: 295,
    originalPrice: 350,
    discountPercent: 16,
    image: '/assets/aistudio/ORANGE_ad855ce0.jpg',
    description:
      'Ruby blood grapefruit, Meyer lemons, golden kiwis, and antioxidant blueberries curated for bright breakfasts and fresh juicing.',
    origin: 'Himachal & Nilgiris',
    storageTip: 'Refrigerate berries; keep whole citrus cool and dry for up to 7 days.',
    collections: ['fresh-arrivals', 'recommended'],
  },
  {
    id: 'vine-tomatoes',
    name: 'Farm Fresh Tomatoes',
    category: 'vegetables',
    categoryLabel: 'Vegetables',
    weight: '500 g',
    price: 65,
    originalPrice: 85,
    discountPercent: 24,
    image: '/assets/aistudio/TOMATOES_e3765e75.jpg',
    description:
      'Plump, vine-ripened heirloom tomatoes harvested red on the branch for rich umami depth in salads, sauces, and everyday curries.',
    origin: 'Nashik Valley Farms',
    storageTip: 'Store stem-side down at cool room temperature to preserve natural aroma.',
    collections: ['best-sellers', 'todays-deals'],
    featuredDeal: true,
    dealWindowNote: 'Same-morning greenhouse pick',
  },
  {
    id: 'fresh-spinach',
    name: 'Fresh Spinach',
    category: 'vegetables',
    categoryLabel: 'Vegetables',
    weight: '250 g bunch',
    price: 55,
    image: '/assets/aistudio/SPINACH_359dd13e.jpg',
    description:
      'Crisp, tender baby palak leaves grown in mineral-rich soil and mist-chilled immediately after harvest for snap-fresh texture.',
    origin: 'Pune Hydro-Organics',
    storageTip: 'Wrap loosely in a damp linen cloth inside a breathable refrigerator bag.',
    collections: ['best-sellers', 'fresh-arrivals', 'recommended'],
  },
  {
    id: 'free-range-eggs',
    name: 'Free-Range Eggs',
    category: 'dairy-eggs',
    categoryLabel: 'Dairy & Eggs',
    weight: 'Pack of 6',
    price: 160,
    originalPrice: 190,
    discountPercent: 16,
    image: '/assets/aistudio/COUNTRY_EGGS_6f6e3a6f.jpg',
    description:
      'Pasture-foraged country hens fed natural grains and greens, yielding sturdy speckled shells and deep amber-gold yolks.',
    origin: 'Nilgiri Pasture Co-op',
    storageTip: 'Keep refrigerated pointy-end down to retain yolk freshness for 14 days.',
    collections: ['best-sellers', 'todays-deals', 'recommended'],
    featuredDeal: true,
    dealWindowNote: '48-hour laid guarantee',
  },
  {
    id: 'whole-milk',
    name: 'Whole Milk',
    category: 'dairy-eggs',
    categoryLabel: 'Dairy & Eggs',
    weight: '1 Litre glass bottle',
    price: 98,
    image: '/assets/aistudio/COW_BUTTER_30ab599c.jpg',
    description:
      'Single-herd A2 Gir cow whole milk, gently pasteurised and bottled in chilled glass within hours of morning milking. Naturally rich cream top.',
    origin: 'Kaira Meadow Dairy',
    storageTip: 'Store at 2–4°C in the coldest shelf of your fridge; consume within 48 hours of opening.',
    collections: ['best-sellers', 'recommended'],
  },
  {
    id: 'smoked-farmhouse-cheese',
    name: 'Aged Smoked Farmhouse Cheese',
    category: 'dairy-eggs',
    categoryLabel: 'Dairy & Eggs',
    weight: '200 g wedge',
    price: 360,
    originalPrice: 410,
    discountPercent: 12,
    image: '/assets/aistudio/SMOKED_CHEESE_f4b53bea.jpg',
    description:
      'Small-batch semi-hard cheese aged 90 days over cool applewood smoke. Supple paste with nutty caramel notes and a clean smoky finish.',
    origin: 'Kodaikanal Creamery',
    storageTip: 'Wrap in parchment paper after unsealing and bring to room temperature 20 mins before slicing.',
    collections: ['fresh-arrivals', 'recommended'],
  },
  {
    id: 'brown-bread',
    name: 'Brown Bread',
    category: 'bakery',
    categoryLabel: 'Bakery',
    weight: '450 g stone-baked loaf',
    price: 145,
    image: '/assets/aistudio/SOURDOUGH_fb5ebba7.jpg',
    description:
      '100% stone-milled whole wheat brown bread leavened slowly with wild starter. Hearty crumb, blistered golden crust, zero dough conditioners.',
    origin: 'Verdant Bakehouse',
    storageTip: 'Keep in a linen bread bag for 3 days or slice and freeze up to 3 weeks.',
    collections: ['best-sellers', 'fresh-arrivals'],
  },
  {
    id: 'california-almonds',
    name: 'Premium Almonds',
    category: 'snacks',
    categoryLabel: 'Snacks',
    weight: '250 g vacuum pouch',
    price: 495,
    originalPrice: 580,
    discountPercent: 15,
    image: '/assets/aistudio/CALIFORNIA_ALMONDS_7085d534.jpg',
    description:
      'Extra-bold Nonpareil California almonds selected for sweet, milky crunch and uniform golden skin. Raw, unsalted, and nutrient-dense.',
    origin: 'Central Valley Orchards',
    storageTip: 'Store in an airtight glass jar in a cool pantry or refrigerate for peak crispness.',
    collections: ['best-sellers', 'todays-deals', 'recommended'],
  },
  {
    id: 'orange-juice',
    name: 'Orange Juice',
    category: 'beverages',
    categoryLabel: 'Beverages',
    weight: '500 ml chilled bottle',
    price: 145,
    originalPrice: 170,
    discountPercent: 15,
    image: '/assets/aistudio/ORANGE_JUICE_c19c7825.jpg',
    description:
      'Cold-pressed whole Valencia oranges bottled raw with zero added sugar, zero water dilution, and zero preservatives.',
    origin: 'Nagpur & Valencia Blend',
    storageTip: 'Keep refrigerated at all times; shake gently before pouring to blend natural pulp.',
    collections: ['best-sellers', 'fresh-arrivals', 'todays-deals'],
  },
  {
    id: 'botanical-tisane',
    name: 'Spiced Citrus & Ginger Tisane',
    category: 'beverages',
    categoryLabel: 'Beverages',
    weight: '100 g loose botanicals',
    price: 265,
    originalPrice: 310,
    discountPercent: 15,
    image: '/assets/aistudio/TISANE_da2598cd.jpg',
    description:
      'Sun-dried blood orange wheels, Malabar green cardamom pods, heirloom ginger root, Ceylon cinnamon, and sweet basil leaves.',
    origin: 'Idukki Spice Collective',
    storageTip: 'Steep 1 heaped spoon in 92°C water for 4 minutes; store tin sealed away from moisture.',
    collections: ['fresh-arrivals', 'recommended'],
  },
  {
    id: 'bilona-cow-ghee',
    name: 'Cultured A2 Cow Butter & Ghee',
    category: 'pantry',
    categoryLabel: 'Pantry Essentials',
    weight: '300 ml glass jar',
    price: 540,
    originalPrice: 635,
    discountPercent: 15,
    image: '/assets/aistudio/COW_BUTTER_30ab599c.jpg',
    description:
      'Hand-churned bilona butter simmered gently in brass vessels for rich granular texture, toasted hazelnut aroma, and clean digestibility.',
    origin: 'Saurashtra Grasslands',
    storageTip: 'Keep sealed with a dry spoon at room temperature away from stove steam.',
    collections: ['best-sellers', 'recommended'],
  },
  {
    id: 'citrus-surface-mist',
    name: 'Citrus Peel Kitchen Mist',
    category: 'household',
    categoryLabel: 'Household',
    weight: '500 ml refillable spray',
    price: 240,
    originalPrice: 285,
    discountPercent: 16,
    image: '/assets/aistudio/ORANGE_ad855ce0.jpg',
    description:
      'Plant-derived countertop cleanser infused with cold-pressed sweet orange peel and organic lemon oils. Food-safe and streak-free.',
    origin: 'Verdant Home Lab',
    storageTip: 'Mist onto stone, wood, or steel surfaces and wipe with a dry cotton cloth.',
    collections: ['fresh-arrivals', 'todays-deals'],
  },
];

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'FRESH15',
    label: '15% off fresh harvest orders',
    type: 'percent',
    value: 15,
    minOrder: 299,
  },
  {
    code: 'VERDANT100',
    label: '₹100 instant basket credit',
    type: 'flat',
    value: 100,
    minOrder: 699,
  },
];

export const FREE_DELIVERY_THRESHOLD = 499;
export const STANDARD_DELIVERY_FEE = 39;

export const FAQS = [
  {
    q: 'How quickly are fresh produce and dairy items delivered?',
    a: 'All orders placed before 7:00 PM arrive via temperature-controlled vans the same day in 90–120 minutes, or in your chosen morning harvest slot.',
  },
  {
    q: 'Are your fruits and greens packed without single-use plastic?',
    a: 'Yes. We pack fruits in breathable moulded pulp punnets and leafy greens in returnable insulated crates or compostable paper wraps.',
  },
  {
    q: 'What happens if an item is damaged or not up to freshness standards?',
    a: 'Every basket carries our no-questions freshness guarantee. Flag any item within 24 hours from your order receipt for an instant replacement or full refund.',
  },
  {
    q: 'Which payment methods and discount codes are supported?',
    a: 'You can pay via UPI, cards, or Cash on Delivery. Try code FRESH15 for 15% off baskets above ₹299 or VERDANT100 for ₹100 off orders above ₹699.',
  },
];

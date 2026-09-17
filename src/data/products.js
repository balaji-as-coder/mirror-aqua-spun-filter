/**
 * MASTER PRODUCT DATA CATALOG — MODERN INDIAN HERITAGE DISCOVERY
 * Note: Server-side commercial fields (like costPrice) are strictly omitted from client distribution.
 */

export const PRODUCTS = [
  {
    id: 'prod-001',
    sku: 'KC-TER-001',
    slug: 'handmade-terracotta-oil-lamp',
    name: 'Kutch Hand-Burnished Terracotta Lamp',
    shortDescription: 'Slow-turned earthen table lamp with natural river clay and hand-perforated light motifs.',
    description: 'Sculpted by master potters in the arid plains of Kutch, this table lamp is crafted using wild alluvial clay sourced from local riverbeds. Each piece is hand-burnished with a smooth river pebble before kiln firing, yielding a velvety, warm tactile finish. As light passes through the delicate hand-pierced geometry, it casts warm, ambient shadow patterns across your space.',
    
    // Categorization & Merchandising
    category: 'Home & Living',
    subcategory: 'Lighting',
    collection: 'Earth & Embers',
    isEditorsPick: true,
    
    // Pricing & Inventory
    price: 3499,
    salePrice: null,
    taxClass: 'standard_18',
    stock: 14,
    stockStatus: 'instock',
    
    // Authenticity & Verification
    verificationStatus: 'verified',
    sourceVerified: true,
    originVerified: true,
    handmadeVerified: true,
    qualityVerified: true,
    
    // Media (Curated high-res editorial photography)
    images: [
      {
        url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
        altText: 'Kutch Hand-Burnished Terracotta Lamp illuminating warm light',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
        altText: 'Close-up texture of burnished terracotta earthenware',
        isLifestyle: true
      },
      {
        url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
        altText: 'Artisan hands shaping wild alluvial clay on a potter wheel'
      }
    ],
    
    // Specs
    materials: ['Riverbed Clay', 'Brass Hardware', 'Twisted Linen Cord'],
    dimensions: '28 cm (H) × 18 cm (Dia)',
    weight: '1.85 kg',
    
    // Flags
    handmade: true,
    artisanCrafted: true,
    natural: true,
    limitedEdition: false,
    
    // Provenance (Future-Ready)
    placeOfOrigin: 'Bhuj, Kutch',
    region: 'Gujarat',
    craft: 'Terracotta Pottery',
    artisan: 'Ismail & Family, Master Potter Guild',
    makerStory: 'Ismail represents the 4th generation of potters preserving ancient Harappan-era terracotta techniques in rural Kutch.',
    
    makingProcess: [
      {
        step: 1,
        title: 'Clay Sourcing & Slaking',
        description: 'Wild alluvial clay is hand-harvested from dried riverbanks and soaked for 72 hours to remove impurities.'
      },
      {
        step: 2,
        title: 'Wheel Throwing & Perforation',
        description: 'The body is thrown on a stone wheel, then carefully hand-perforated using brass needles while leather-hard.'
      },
      {
        step: 3,
        title: 'Pebble Burnishing',
        description: 'Smooth agate pebbles from local streams are rubbed across the damp clay to create a subtle natural sheen.'
      },
      {
        step: 4,
        title: 'Open Hearth Wood Firing',
        description: 'Slow-fired in wood-and-husk kilns at 850°C, infusing earthy red and ochre mineral gradients into each lamp.'
      }
    ],
    
    // Signature Discovery Features
    whyItsSpecial: 'Unlike mass-produced ceramic slip-castings, every single lamp bears the fingerprint traces of the potter and the unique smoky patina of wood-fired kilns.',
    whyWePickedIt: [
      'Authentic hand-burnished finish with no synthetic glazes',
      'Pierced geometry creates calming ambient shadow-play',
      'Solid brass socket with premium braided linen cord',
      'Direct provenance supporting 4th-generation Kutch artisan families'
    ],
    
    qualityInformation: 'Every piece is individually inspected for structural integrity, electrical safety compliance, and smooth tactile finish.',
    careInstructions: 'Dust gently with a soft dry cloth. Avoid exposure to water or chemical abrasives. Uses standard E27 warm LED bulbs (included).',
    packagingInformation: 'Shipped in custom honeycomb Kraft cushions with zero single-use plastics.',
    shippingInformation: 'Dispatched within 24-48 hours. Express delivery across India within 3-5 business days.',
    returnInformation: 'Complimentary 7-day doorstep return or replacement if damaged in transit.',
    
    seoTitle: 'Kutch Hand-Burnished Terracotta Lamp | Handmade Heritage Decor',
    metaDescription: 'Discover the Kutch Hand-Burnished Terracotta Lamp. Crafted from wild river clay with hand-pierced ambient light motifs.',
    focusKeyword: 'handmade terracotta lamp',
    altText: 'Kutch Hand-Burnished Terracotta Lamp',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-02-20T00:00:00Z'
  },
  {
    id: 'prod-002',
    sku: 'KC-BRS-002',
    slug: 'hand-cast-dhokra-brass-vessel',
    name: 'Bastar Lost-Wax Dhokra Brass Vessel',
    shortDescription: 'Ancient 4,000-year-old lost-wax cast brass vessel featuring ancestral rhythm motifs.',
    description: 'Cast using the non-ferrous lost-wax metal casting technique practiced in the tribal heartlands of Bastar, this sculptural brass vessel combines geometric coil details with raw metallic patina. The process requires days of intricate wax thread wrapping around a clay core, creating an irreplaceable sculptural presence.',
    
    category: 'Home & Living',
    subcategory: 'Sculptures & Accents',
    collection: 'Ancient Metals',
    isEditorsPick: true,
    
    price: 4850,
    salePrice: null,
    taxClass: 'standard_18',
    stock: 8,
    stockStatus: 'instock',
    
    verificationStatus: 'verified',
    sourceVerified: true,
    originVerified: true,
    handmadeVerified: true,
    qualityVerified: true,
    
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
        altText: 'Hand-Cast Dhokra Brass Vessel on textured stone pedestal',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=1200&q=80',
        altText: 'Detailed tribal wirework of the Dhokra brass casting',
        isLifestyle: true
      }
    ],
    
    materials: ['Recycled Brass Alloy', 'Natural Beeswax Residue'],
    dimensions: '22 cm (H) × 14 cm (Dia)',
    weight: '2.10 kg',
    
    handmade: true,
    artisanCrafted: true,
    natural: true,
    limitedEdition: true,
    
    placeOfOrigin: 'Bastar, Chhattisgarh',
    region: 'Central India',
    craft: 'Dhokra Metal Casting',
    artisan: 'Sukhram Ghadwa, Tribal Metalsmith Collective',
    makerStory: 'The Ghadwa community holds an unbroken matrilineal and patrilineal chain of lost-wax metallurgical knowledge dating back to the Indus Valley Mohenjo-daro period.',
    
    makingProcess: [
      {
        step: 1,
        title: 'Clay Core Modeling',
        description: 'An inner core is modeled from ant-hill clay and dried under shaded sunlight.'
      },
      {
        step: 2,
        title: 'Pure Beeswax Thread Wrapping',
        description: 'Natural bee resin and mustard oil are hand-pulled into fine wire threads and wound around the clay form.'
      },
      {
        step: 3,
        title: 'Molten Brass Pouring',
        description: 'Melted brass is poured into the sealed mold, vaporizing the wax and capturing every minute thread texture.'
      }
    ],
    
    whyItsSpecial: 'Because the original wax mold melts away during casting, every single Dhokra piece in the world is genuinely a one-of-a-kind original.',
    whyWePickedIt: [
      'Unbroken 4,000-year-old metallurgical lineage',
      'Complex tactile ribbing shaped entirely by hand-drawn wax threads',
      'Naturally oxidized heritage brass that gains beauty with age',
      'Direct fair-wage tribal collective collaboration'
    ],
    
    qualityInformation: 'Hand-evaluated for density, balance, and authentic raw alloy patina.',
    careInstructions: 'Wipe with a dry flannel cloth. Can be polished with lemon and salt if a brighter golden luster is preferred.',
    packagingInformation: 'Encased in hand-stitched jute pouches and reinforced recycled board.',
    shippingInformation: 'Dispatched within 24 hours via premium insured courier.',
    returnInformation: '7-day seamless return guarantee.',
    
    seoTitle: 'Bastar Dhokra Lost-Wax Brass Vessel | Tribal Heritage Collectible',
    metaDescription: 'Hand-cast Bastar Dhokra Brass Vessel made with ancient lost-wax techniques in Chhattisgarh. One-of-a-kind art piece.',
    focusKeyword: 'dhokra brass vessel',
    altText: 'Bastar Dhokra Brass Vessel',
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-02-18T00:00:00Z'
  },
  {
    id: 'prod-003',
    sku: 'KC-TEX-003',
    slug: 'kutch-kala-cotton-throw-blanket',
    name: 'Kutch Kala Cotton Handwoven Throw',
    shortDescription: 'Organic, rain-fed indigenous Kala cotton throw with natural madder and indigo checks.',
    description: 'Kala Cotton is genetically pure, indigenous rain-fed cotton native to the semi-arid lands of Gujarat. Free from pesticides and synthetic irrigation, it is hand-spun on traditional charkhas and handwoven on pit looms by Vankar weavers. Soft yet textured, it breathes effortlessly in summer and holds gentle warmth in cool evenings.',
    
    category: 'Textiles & Rugs',
    subcategory: 'Throws & Blankets',
    collection: 'Wild Weaves',
    isEditorsPick: false,
    
    price: 3890,
    salePrice: 3490,
    taxClass: 'standard_12',
    stock: 19,
    stockStatus: 'instock',
    
    verificationStatus: 'verified',
    sourceVerified: true,
    originVerified: true,
    handmadeVerified: true,
    qualityVerified: true,
    
    images: [
      {
        url: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=1200&q=80',
        altText: 'Kala Cotton Handwoven Throw folded on wooden bench',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
        altText: 'Texture detail of organic handspun Kala cotton weave',
        isLifestyle: true
      }
    ],
    
    materials: ['100% Rain-Fed Kala Cotton', 'Natural Plant Dyes'],
    dimensions: '180 cm × 130 cm',
    weight: '780 g',
    
    handmade: true,
    artisanCrafted: true,
    natural: true,
    limitedEdition: false,
    
    placeOfOrigin: 'Bhujodi, Kutch',
    region: 'Gujarat',
    craft: 'Pit Loom Weaving',
    artisan: 'Vankar Chamanbhai Weavers',
    makerStory: 'Vankar weavers work in rhythm with seasonal rains, preserving indigenous non-GMO cotton seeds that require zero chemical fertilizers.',
    
    makingProcess: [
      {
        step: 1,
        title: 'Rain-Fed Harvest',
        description: 'Indigenous Kala cotton bolls are hand-picked after monsoon maturity in the salt plains.'
      },
      {
        step: 2,
        title: 'Charkha Hand-Spinning',
        description: 'The raw fibers are carded and spun into textured yarn by village women.'
      },
      {
        step: 3,
        title: 'Natural Botanical Dyeing',
        description: 'Dyed in vats of fermented indigo leaves, wild madder roots, and pomegranate rinds.'
      },
      {
        step: 4,
        title: 'Pit Loom Weaving',
        description: 'Woven over 18 hours on a traditional wooden pit-loom with subtle fringed selvedges.'
      }
    ],
    
    whyItsSpecial: 'Kala cotton is one of the few completely carbon-neutral, organic fibers in the world, getting softer and more characterful with every wash.',
    whyWePickedIt: [
      '100% rain-fed, pesticide-free indigenous Indian cotton',
      'Dyed with pure botanicals (Indigo & Madder)',
      'Rich tactile texture that drapes elegantly on sofas or beds',
      'Directly sustains regenerative farming and handloom communities'
    ],
    
    qualityInformation: 'Pre-washed in softened water to prevent shrinkage and ensure colorfast stability.',
    careInstructions: 'Gentle hand wash or cold cycle with mild plant-based detergent. Dry in shade.',
    packagingInformation: 'Wrapped in organic unbleached cotton ribbon in a reusable fabric tote.',
    shippingInformation: 'Ships in 24 hours. Free standard delivery across India.',
    returnInformation: '10-day return policy for unused items with original tags.',
    
    seoTitle: 'Organic Kala Cotton Handwoven Throw | Sustainable Heritage Textile',
    metaDescription: 'Wrap yourself in pure organic rain-fed Kala Cotton handwoven in Bhujodi. Naturally dyed and exceptionally soft.',
    focusKeyword: 'kala cotton throw',
    altText: 'Kala Cotton Throw Blanket',
    createdAt: '2026-01-25T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z'
  },
  {
    id: 'prod-004',
    sku: 'KC-POT-004',
    slug: 'jaipur-handpainted-blue-pottery-vase',
    name: 'Jaipur Botanical Blue Pottery Vase',
    shortDescription: 'Traditional quartz-based turquoise blue pottery vase with Mughal lotus brushwork.',
    description: 'Unlike ordinary clay ceramics, Jaipur Blue Pottery is made from an ancient dough of powdered quartz stone, Fuller’s earth, and natural gum. Fired only once at low temperatures, each vase is hand-painted with fine squirrel-hair brushes depicting delicate Mughal botanicals in cobalt blue, turquoise, and copper green.',
    
    category: 'Home & Living',
    subcategory: 'Ceramics & Vases',
    collection: 'Royal Courts',
    isEditorsPick: true,
    
    price: 2650,
    salePrice: null,
    taxClass: 'standard_18',
    stock: 12,
    stockStatus: 'instock',
    
    verificationStatus: 'verified',
    sourceVerified: true,
    originVerified: true,
    handmadeVerified: true,
    qualityVerified: true,
    
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
        altText: 'Jaipur Botanical Blue Pottery Vase standing in sunlit corner',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
        altText: 'Handpainted turquoise and cobalt floral details on vase',
        isLifestyle: true
      }
    ],
    
    materials: ['Powered Quartz', 'Glass Powder', 'Natural Gum', 'Cobalt Oxide'],
    dimensions: '26 cm (H) × 12 cm (Dia)',
    weight: '1.20 kg',
    
    handmade: true,
    artisanCrafted: true,
    natural: true,
    limitedEdition: false,
    
    placeOfOrigin: 'Jaipur',
    region: 'Rajasthan',
    craft: 'Blue Pottery',
    artisan: 'Gopal Saini & Apprentices',
    makerStory: 'Master Gopal Saini has preserved traditional Turko-Persian blue pottery formulas for over 40 years in his Sanganer studio.',
    
    makingProcess: [
      {
        step: 1,
        title: 'Quartz Dough Preparation',
        description: 'Powdered quartz and Sajji (natural soda) are kneaded into a non-clay dough.'
      },
      {
        step: 2,
        title: 'Open Mold Pressing',
        description: 'The dough is pressed into plaster open molds and filled with burnt wood ash for shape support.'
      },
      {
        step: 3,
        title: 'Freehand Mineral Painting',
        description: 'Cobalt and copper oxide pigments are painted freehand without stencils or tracing.'
      },
      {
        step: 4,
        title: 'Single Glass Glaze Firing',
        description: 'Glazed with borax and glass frit, then slow-fired in a traditional wood kiln.'
      }
    ],
    
    whyItsSpecial: 'No clay is used in the entire creation. The signature turquoise tone comes from crushed glass and natural copper minerals reacting under kiln heat.',
    whyWePickedIt: [
      'Clay-free historic quartz ceramic technique',
      'Freehand Mughal lotus motifs painted by master artisans',
      'Vivid turquoise and cobalt minerals that never fade',
      'Supports traditional Sanganer craft guilds'
    ],
    
    qualityInformation: 'Carefully examined for smooth glaze gloss, balanced base, and crisp brush details.',
    careInstructions: 'Decorative use or dry flower arrangements recommended. Wipe with damp cloth. Do not soak in boiling water.',
    packagingInformation: 'Double-walled impact foam casing with reinforced cardboard.',
    shippingInformation: 'Dispatched within 24 hours. Delivered in 3-4 days.',
    returnInformation: '7-day replacement guarantee.',
    
    seoTitle: 'Jaipur Handpainted Blue Pottery Vase | Rajasthani Decor Accent',
    metaDescription: 'Authentic clay-free Jaipur Blue Pottery vase handpainted with Mughal botanical motifs in cobalt and turquoise.',
    focusKeyword: 'jaipur blue pottery vase',
    altText: 'Jaipur Blue Pottery Vase',
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-02-25T00:00:00Z'
  },
  {
    id: 'prod-005',
    sku: 'KC-WD-005',
    slug: 'saharanpur-carved-sheesham-box',
    name: 'Saharanpur Hand-Carved Sheesham Keepsake Box',
    shortDescription: 'Solid seasoned rosewood box with brass wire inlay and intricate jali carving.',
    description: 'Crafted from sustainable, kiln-seasoned Indian Rosewood (Sheesham), this keepsake box features delicate hand-chiseled floral filigree (Jali work) on the lid. Skilled woodworkers embed pure brass wire ribbons into pre-cut grooves, creating a shimmering heirloom piece designed to hold jewelry, watches, or treasured memories.',
    
    category: 'Home & Living',
    subcategory: 'Storage & Boxes',
    collection: 'Heirloom Woods',
    isEditorsPick: false,
    
    price: 1950,
    salePrice: null,
    taxClass: 'standard_18',
    stock: 22,
    stockStatus: 'instock',
    
    verificationStatus: 'verified',
    sourceVerified: true,
    originVerified: true,
    handmadeVerified: true,
    qualityVerified: true,
    
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
        altText: 'Saharanpur Hand-Carved Sheesham Box on wooden shelf',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
        altText: 'Close up of brass wire inlay on dark sheesham wood grain',
        isLifestyle: true
      }
    ],
    
    materials: ['Seasoned Sheesham Wood', 'Pure Brass Inlay Wire', 'Natural Beeswax Polish'],
    dimensions: '20 cm (L) × 12 cm (W) × 7 cm (H)',
    weight: '750 g',
    
    handmade: true,
    artisanCrafted: true,
    natural: true,
    limitedEdition: false,
    
    placeOfOrigin: 'Saharanpur',
    region: 'Uttar Pradesh',
    craft: 'Tarkashi & Wood Carving',
    artisan: 'Ansari Woodcraft Guild',
    makerStory: 'Saharanpur woodcarvers inherit generational skills tracing back to imperial Mughal palace furnishings.',
    
    makingProcess: [
      {
        step: 1,
        title: 'Timber Seasoning',
        description: 'Hardwood logs are naturally dried for 6 months and kiln-seasoned to eliminate warping.'
      },
      {
        step: 2,
        title: 'Fine Chisel Jali Work',
        description: 'Master carvers pierce geometric openwork using miniature hand gouges.'
      },
      {
        step: 3,
        title: 'Tarkashi Brass Embedding',
        description: 'Brass wires are gently tapped into carved channels with a light brass hammer.'
      }
    ],
    
    whyItsSpecial: 'Every lid is carved from a single piece of dense timber without veneer or synthetic fillers.',
    whyWePickedIt: [
      'Genuine seasoned Sheesham grain with natural organic oil finish',
      'Precision Tarkashi brass wire inlay work',
      'Smooth velvet-lined interior for delicate items',
      'Solid tactile heft built to last decades'
    ],
    
    qualityInformation: 'Fitted with concealed brass hinges and magnetic catch.',
    careInstructions: 'Buff occasionally with mineral oil or natural beeswax to nourish the wood.',
    packagingInformation: 'Presented in a signature linen box.',
    shippingInformation: 'Ships within 24 hours across India.',
    returnInformation: '7-day doorstep return.',
    
    seoTitle: 'Saharanpur Hand-Carved Sheesham Box | Brass Inlay Keepsake',
    metaDescription: 'Solid Sheesham wood keepsake box with delicate hand-carved jali work and pure brass wire Tarkashi inlay.',
    focusKeyword: 'sheesham wood box',
    altText: 'Saharanpur Carved Wood Box',
    createdAt: '2026-02-05T00:00:00Z',
    updatedAt: '2026-02-22T00:00:00Z'
  },
  {
    id: 'prod-006',
    sku: 'KC-BRW-006',
    slug: 'moradabad-hand-hammered-brass-katori-bowl-set',
    name: 'Moradabad Hand-Hammered Brass Bowl Set (Pair)',
    shortDescription: 'Heavy-gauge solid brass serving bowls with artisanal dimpled hammer texture.',
    description: 'Shaped by the metal-smiths of Moradabad (the Brass City), this pair of nesting bowls is raised by hand from thick virgin brass sheets. The dimpled surface is created through thousands of rhythmic hammer strokes, catching ambient candlelight to create a warm, golden dining experience.',
    
    category: 'Kitchen & Dining',
    subcategory: 'Serveware & Bowls',
    collection: 'Ancient Metals',
    isEditorsPick: true,
    
    price: 2490,
    salePrice: null,
    taxClass: 'standard_18',
    stock: 16,
    stockStatus: 'instock',
    
    verificationStatus: 'verified',
    sourceVerified: true,
    originVerified: true,
    handmadeVerified: true,
    qualityVerified: true,
    
    images: [
      {
        url: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=1200&q=80',
        altText: 'Moradabad Hand-Hammered Brass Bowls arranged on stone counter',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=1200&q=80',
        altText: 'Hammered texture reflection on solid brass metal surface',
        isLifestyle: true
      }
    ],
    
    materials: ['100% Food-Grade Virgin Brass', 'Pure Tin Lining (Kalai)'],
    dimensions: '14 cm (Dia) × 6 cm (H) each',
    weight: '680 g (Set of 2)',
    
    handmade: true,
    artisanCrafted: true,
    natural: true,
    limitedEdition: false,
    
    placeOfOrigin: 'Moradabad',
    region: 'Uttar Pradesh',
    craft: 'Hand-Hammered Metalware',
    artisan: 'Rameshwar Thathera Collective',
    makerStory: 'The Thathera metalsmiths hammer heavy brass ingots into ergonomic domestic vessels using ancestral wooden stumps.',
    
    makingProcess: [
      {
        step: 1,
        title: 'Sheet Annealing',
        description: 'Brass discs are heated over open embers to soften the molecular structure.'
      },
      {
        step: 2,
        title: 'Rhythmic Raising & Hammering',
        description: 'Beaten over steel anvils to raise high walls with thousands of micro-facets.'
      },
      {
        step: 3,
        title: 'Traditional Tin Lining (Kalai)',
        description: 'Tinned on the inside using pure virgin tin to make it 100% food-safe for acidic foods.'
      }
    ],
    
    whyItsSpecial: 'Traditional Kalai (pure tin lining) makes these authentic brass bowls safe for warm curries, dips, and desserts while bringing royal dining elegance to the table.',
    whyWePickedIt: [
      'Heavy-gauge virgin brass with substantial heft',
      'Over 2,000 hand-hammered facets per bowl',
      'Food-safe traditional Kalai tin coating',
      'Timeless Indian table ritual aesthetic'
    ],
    
    qualityInformation: 'Certified food-safe non-leaching tin coating. No clear lacquers used on food contact surfaces.',
    careInstructions: 'Hand wash with mild soap. Clean brass exterior with pitambari or tamarind paste to restore mirror glow.',
    packagingInformation: 'Packed in eco-friendly Kraft gift box with cotton dust bag.',
    shippingInformation: 'Dispatched in 24 hours. Arrives in 3 business days.',
    returnInformation: '7-day replacement guarantee.',
    
    seoTitle: 'Moradabad Hand-Hammered Brass Bowl Set | Artisanal Indian Dining',
    metaDescription: 'Pair of heavy-gauge solid brass bowls hand-hammered in Moradabad. Food-safe tin-lined interior for authentic dining.',
    focusKeyword: 'hammered brass bowls',
    altText: 'Hand-Hammered Brass Bowls',
    createdAt: '2026-02-10T00:00:00Z',
    updatedAt: '2026-02-28T00:00:00Z'
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Finds', slug: 'all' },
  { id: 'home-living', name: 'Home & Living', slug: 'home-living' },
  { id: 'textiles-rugs', name: 'Textiles & Rugs', slug: 'textiles-rugs' },
  { id: 'kitchen-dining', name: 'Kitchen & Dining', slug: 'kitchen-dining' }
];

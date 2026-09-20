/**
 * MIRROR AQUA PRODUCT CATALOGUE & SCHEMA (DEVELOPMENT FALLBACK)
 * Authoritative production data is fetched dynamically from WooCommerce / Database via /api/products.
 * This file serves as the fallback/schema contract.
 */

export const PRODUCTS = [
  {
    id: 'ma-prod-001',
    sku: 'MA-PP-10-05M',
    slug: '10-inch-5-micron-pp-spun-filter',
    name: 'Mirror Aqua 10-Inch 5-Micron PP Spun Filter',
    shortDescription: 'Precision-engineered 5-micron depth sediment filter for domestic and commercial RO water purifier housings. 100% pure melt-blown polypropylene.',
    description: 'The Mirror Aqua 10-Inch 5-Micron PP Spun Sediment Filter is precision-engineered using 100% pure thermal-bonded polypropylene microfibers. Designed as the vital first stage of pre-filtration in standard 10-inch filter housings, it effectively traps suspended physical particles including sand, silt, rust, and visible debris before water reaches sensitive downstream components such as carbon blocks and RO membranes.',
    
    // Categorization
    category: 'Sediment Filter',
    productType: 'PP Spun Sediment Filter',
    brand: 'Mirror Aqua',
    countryOfOrigin: 'India',
    
    // Commercial Data
    price: 199,
    mrp: 399,
    taxClass: 'gst_18',
    stock: 250,
    stockStatus: 'instock',
    whatsappEnabled: true,
    bulkEnabled: true,
    
    // Configured Commercial Pack Tiers
    packTiers: [
      {
        quantity: 1,
        label: '1 Piece',
        unitPrice: 199,
        totalPrice: 199,
        mrpTotal: 399,
        savingsPercent: 50,
        badge: 'Standard'
      },
      {
        quantity: 10,
        label: '10 Pieces (Value Pack)',
        unitPrice: 180,
        totalPrice: 1800,
        mrpTotal: 3990,
        savingsPercent: 55,
        badge: 'Best Value • Save ₹2,190',
        isPopular: true
      }
    ],

    // Technical Specifications
    specifications: {
      filterType: 'PP Spun Sediment Filter',
      micronRating: '5 Micron (µm)',
      nominalLength: '10 Inch (approx. 254 mm)',
      outerDiameter: 'Approx. 60 - 63 mm',
      innerCoreDiameter: 'Approx. 28 - 30 mm',
      material: '100% Pure Melt-Blown Polypropylene',
      application: 'Pre-filtration for compatible 10-inch RO housings',
      recommendedOperatingTemp: '4°C to 45°C',
      maximumPressure: '125 PSI (Housing Dependent)',
      brand: 'Mirror Aqua',
      countryOfOrigin: 'India'
    },

    // 6 Factual Technical Benefits
    benefits: [
      {
        id: 'b1',
        title: '5-Micron Sediment Filtration',
        description: 'Calibrated pore matrix traps abrasive physical suspended particles down to 5 microns (sand, silt, mud, and pipe rust).',
        icon: 'Filter'
      },
      {
        id: 'b2',
        title: '100% Pure Polypropylene',
        description: 'Virgin thermal-bonded microfiber construction with zero chemical binders, adhesives, or surface surfactants.',
        icon: 'Layers'
      },
      {
        id: 'b3',
        title: 'Gradient Depth Density',
        description: 'True multi-layer depth filtration: looser outer fibers capture coarse grit, progressive dense core traps micro-particulates.',
        icon: 'Zap'
      },
      {
        id: 'b4',
        title: 'Universal 10-Inch Fit',
        description: 'Precision dimensioning engineered for universal drop-in fit across all standard 10-inch domestic and light-commercial housings.',
        icon: 'CheckCircle'
      },
      {
        id: 'b5',
        title: 'Easy Maintenance Swap',
        description: 'Standard cylindrical design allows quick, tool-free replacement during routine scheduled maintenance.',
        icon: 'RefreshCw'
      },
      {
        id: 'b6',
        title: 'Downstream RO Protection',
        description: 'Safeguards activated carbon block pores and thin-film composite RO membranes from premature clogging and abrasion.',
        icon: 'ShieldCheck'
      }
    ],

    // Product Images (Authentic Mirror Aqua Factory Photography)
    images: [
      {
        url: '/images/product/008.jpeg',
        altText: 'Mirror Aqua 10-Inch 5-Micron PP Spun Sediment Filter Packaged & Cartridge',
        isPrimary: true,
        caption: 'Genuine Mirror Aqua 10-Inch 5-Micron Melt-Blown PP Cartridges'
      },
      {
        url: '/images/product/0014.jpeg',
        altText: 'Mirror Aqua Embossed Brand Logo on 100% Virgin Polypropylene Media',
        caption: 'Embossed Mirror Aqua Genuine Brand Stamp'
      },
      {
        url: '/images/product/004.jpeg',
        altText: '5-Micron Depth Filtration Core and Dense Polypropylene Cross Section',
        caption: 'Calibrated 5-Micron Microfiber Pore Matrix'
      },
      {
        url: '/images/product/001.jpeg',
        altText: 'Before & After Pre-Filtration Comparison (Pure White vs Trapped Sediment)',
        caption: 'Real Filtration: Traps Rust, Sand, Mud & Suspended Silt'
      },
      {
        url: '/images/product/WhatsApp Image 2026-09-20 at 12.05.30 PM.jpeg',
        altText: 'Top-down Core & Depth Density Gradient Cross-Section',
        caption: 'Multi-Layer Depth Density Core Structure'
      }
    ],

    // Technical FAQs
    faqs: [
      {
        q: 'What is a PP spun filter?',
        a: 'A Polypropylene (PP) spun filter is a depth sediment filter made from thermal-bonded polypropylene microfibers. It is designed to capture physical suspended particles such as silt, sand, rust, and dirt from incoming tap or borewell water.'
      },
      {
        q: 'What does 5 micron mean?',
        a: 'A micron rating of 5 means the filter media is engineered to trap suspended particulate matter down to approximately 5 micrometers (0.005 mm) in size.'
      },
      {
        q: 'Is this compatible with RO purifiers?',
        a: 'Yes, this filter is compatible with standard 10-inch pre-filter bowls/housings commonly installed before RO, UV, and UF water purifiers.'
      },
      {
        q: 'Does this filter reduce TDS?',
        a: 'No. PP spun sediment filters are intended exclusively for physical suspended-particle filtration. Total Dissolved Solids (TDS) reduction is performed by Reverse Osmosis (RO) membranes.'
      },
      {
        q: 'Does this filter remove bacteria or viruses?',
        a: 'No. A sediment filter is not a disinfection stage and should not be relied upon for microbiological purification. Disinfection is handled by technologies like UV lamps, UF membranes, or RO purification stages.'
      },
      {
        q: 'How often should I replace it?',
        a: 'Replacement frequency depends on your local water quality, daily usage volume, and sediment load. Typical indicators for replacement include visible dark discoloration, noticeable pressure drop, or your purifier manufacturer’s maintenance schedule.'
      },
      {
        q: 'Is this a 10-inch filter?',
        a: 'Yes, this is a standard 10-inch (nominal length ~254 mm) cartridge designed for standard 10-inch pre-filter housings.'
      },
      {
        q: 'Can I buy in bulk for service centers or dealerships?',
        a: 'Yes. Mirror Aqua supplies service technicians, dealers, and distributors. You can use the "Bulk Enquiry" or "Dealer Enquiry" section to request wholesale pricing.'
      },
      {
        q: 'How do I know whether it fits my water purifier?',
        a: 'Check your existing pre-filter bowl or housing. If it uses a standard 10-inch drop-in cartridge, this filter will fit. If unsure, use our "Ask Mirror Aqua on WhatsApp" button with your purifier model name.'
      }
    ],

    // SEO Meta
    seo: {
      title: '5 Micron PP Spun Filter (10-Inch) | Genuine RO Spares | Mirror Aqua',
      description: 'Buy Mirror Aqua 10-inch 5-micron PP spun sediment filter made from 100% pure polypropylene. ₹199 for single piece, ₹1,800 for 10-pack. Pan-India fast dispatch.',
      keywords: [
        '5 micron PP spun filter',
        '10 inch PP spun filter',
        'PP spun sediment filter',
        'RO sediment filter',
        '5 micron sediment filter',
        'RO PP filter',
        'water purifier sediment filter',
        '10 inch sediment filter'
      ],
      canonicalUrl: 'https://mirroraqua.in/product/10-inch-5-micron-pp-spun-filter/'
    }
  },
  {
    id: 'ma-prod-002',
    sku: 'MA-ROM-75G',
    slug: '75-gpd-ro-membrane',
    name: 'Mirror Aqua 75 GPD Thin-Film RO Membrane',
    shortDescription: 'High-rejection Thin-Film Composite (TFC) membrane for domestic RO purification systems.',
    description: 'Precision-wound 75 GPD RO membrane designed for standard domestic RO membrane housings. Removes dissolved solids, heavy metal ions, and salts.',
    category: 'RO Membrane',
    productType: 'RO Membrane Cartridge',
    brand: 'Mirror Aqua',
    countryOfOrigin: 'India',
    price: 899,
    mrp: 1499,
    taxClass: 'gst_18',
    stock: 120,
    stockStatus: 'instock',
    packTiers: [
      { quantity: 1, label: '1 Piece', unitPrice: 899, totalPrice: 899, mrpTotal: 1499, savingsPercent: 40 }
    ],
    specifications: {
      capacity: '75 GPD (Gallons Per Day)',
      membraneType: 'Polyamide Thin-Film Composite',
      standardSize: '1812 Residential Housing Fit'
    },
    images: [
      {
        url: '/images/pp_filter_closeup.jpg',
        altText: 'Mirror Aqua 75 GPD RO Membrane'
      }
    ]
  },
  {
    id: 'ma-prod-003',
    sku: 'MA-CTO-10',
    slug: '10-inch-cto-carbon-block-filter',
    name: 'Mirror Aqua 10-Inch CTO Carbon Block Filter',
    shortDescription: 'Activated carbon block cartridge for chlorine, odor, and volatile organic compound reduction.',
    description: 'Extruded activated carbon block filter designed to fit standard 10-inch housings. Protects RO membranes from chlorine degradation.',
    category: 'Carbon Filter',
    productType: 'Carbon Block (CTO)',
    brand: 'Mirror Aqua',
    countryOfOrigin: 'India',
    price: 249,
    mrp: 450,
    taxClass: 'gst_18',
    stock: 180,
    stockStatus: 'instock',
    packTiers: [
      { quantity: 1, label: '1 Piece', unitPrice: 249, totalPrice: 249, mrpTotal: 450, savingsPercent: 45 }
    ],
    specifications: {
      filterType: 'Extruded Carbon Block (CTO)',
      size: '10 Inch Standard',
      media: 'High-Iodine Activated Coconut Shell Carbon'
    },
    images: [
      {
        url: '/images/pp_filter_closeup.jpg',
        altText: 'Mirror Aqua 10-Inch CTO Carbon Block'
      }
    ]
  },
  {
    id: 'ma-prod-004',
    sku: 'MA-HSG-10',
    slug: '10-inch-pre-filter-housing',
    name: 'Mirror Aqua 10-Inch Heavy-Duty Pre-Filter Housing Bowl',
    shortDescription: 'Reinforced transparent pre-filter housing bowl with brass threaded ports for 10-inch cartridges.',
    description: 'Durable food-grade virgin polypropylene pre-filter housing with double O-ring seal to prevent leaks under municipal water pressure.',
    category: 'Spare Parts',
    productType: 'Filter Housing Bowl',
    brand: 'Mirror Aqua',
    countryOfOrigin: 'India',
    price: 399,
    mrp: 750,
    taxClass: 'gst_18',
    stock: 90,
    stockStatus: 'instock',
    packTiers: [
      { quantity: 1, label: '1 Housing with Spanner', unitPrice: 399, totalPrice: 399, mrpTotal: 750, savingsPercent: 47 }
    ],
    specifications: {
      material: 'Food-Grade Virgin Polypropylene',
      portSize: '1/4 Inch or 3/8 Inch Threaded',
      maximumPressure: '125 PSI'
    },
    images: [
      {
        url: '/images/pp_filter_housing.jpg',
        altText: 'Mirror Aqua 10-Inch Housing Bowl'
      }
    ]
  }
];

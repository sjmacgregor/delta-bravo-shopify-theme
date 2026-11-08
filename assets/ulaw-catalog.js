/* ==========================================================================
   ULAW™ AUTHORITATIVE TOOL & HOLSTER CATALOG + v2.22.52 SIZING ENGINE
   Source of Truth: ULAW Clamp & Modular Channel Generator Spec (v2.22.52)
   ========================================================================== */

window.ULAW_CATALOG = (function () {
  function __dbAsset(file) {
    return (window.ULAW_ASSET_URLS && window.ULAW_ASSET_URLS[file]) ? window.ULAW_ASSET_URLS[file] : ('assets/images/' + file);
  }
  // Mag Pouch & Carry Configurations (from §3.2, §3.3, §14, §15 of ULAW Spec)
  const MAG_POUCH_OPTIONS = [
    {
      id: 'auto',
      name: 'Auto (Recommended Pouch)',
      shortCode: 'AUTO-FIT',
      desc: 'Automatically selects the optimal 30mm, 60mm, or MOLLE channel for this tool',
      priceDelta: 0,
      nominalWidth: null,
      slots: 1,
      dividerMm: 0,
      isMolle: false,
      isClampOnly: false
    },
    {
      id: 'single_30',
      name: '30 mm Single Pistol Mag Pouch',
      shortCode: '24×30 STD',
      desc: 'Standard 30 mm single pistol mag pouch drop-in channel + wave clamp',
      priceDelta: 0,
      nominalWidth: 30,
      actualClampWidth: 30.0,
      outerChannelWidth: 34.0,
      slots: 1,
      dividerMm: 0,
      isMolle: false,
      isClampOnly: false
    },
    {
      id: 'div_30_15_15',
      name: '30 mm Divided (15/15 Dual Narrow)',
      shortCode: '30 (15/15)',
      desc: 'Holds two 15 mm (14.4 mm) clamps in one 30 mm pouch with 1.0 mm bullnose divider',
      priceDelta: 6,
      nominalWidth: 30,
      actualClampWidth: 14.4,
      outerChannelWidth: 35.0,
      slots: 2,
      slotLayout: [14.4, 14.4],
      dividerMm: 1.0,
      isMolle: false,
      isClampOnly: false
    },
    {
      id: 'single_60',
      name: '60 mm Double Rifle Mag Pouch',
      shortCode: '24×60 STD',
      desc: 'Standard 60 mm AR/rifle mag pouch channel (fits wide tools or multi-lane clamps)',
      priceDelta: 6,
      nominalWidth: 60,
      actualClampWidth: 60.0,
      outerChannelWidth: 64.0,
      slots: 1,
      dividerMm: 0,
      isMolle: false,
      isClampOnly: false
    },
    {
      id: 'div_60_30_30',
      name: '60 mm Divided (30/30 Dual Standard)',
      shortCode: '60 (30/30)',
      desc: 'Holds two standard 30.0 mm clamps side-by-side with 1.0 mm bullnose divider (66.2 mm outer)',
      priceDelta: 10,
      nominalWidth: 60,
      actualClampWidth: 30.0,
      outerChannelWidth: 66.2,
      slots: 2,
      slotLayout: [30.0, 30.0],
      dividerMm: 1.0,
      isMolle: false,
      isClampOnly: false
    },
    {
      id: 'div_60_45_15',
      name: '60 mm Divided (45/15 Combo)',
      shortCode: '60 (45/15)',
      desc: 'Holds one 45 mm (44.4 mm) clamp + one 15 mm (14.4 mm) narrow clamp (65.0 mm outer)',
      priceDelta: 10,
      nominalWidth: 60,
      actualClampWidth: 44.4,
      outerChannelWidth: 65.0,
      slots: 2,
      slotLayout: [44.4, 14.4],
      dividerMm: 1.0,
      isMolle: false,
      isClampOnly: false
    },
    {
      id: 'div_60_3x20',
      name: '60 mm Divided (3×20 Triple Tool)',
      shortCode: '60 (3×20)',
      desc: 'Holds three 20 mm (19.4 mm) clamps separated by two 1.0 mm bullnose dividers (66.0 mm outer)',
      priceDelta: 12,
      nominalWidth: 60,
      actualClampWidth: 19.4,
      outerChannelWidth: 66.0,
      slots: 3,
      slotLayout: [19.4, 19.4, 19.4],
      dividerMm: 1.0,
      isMolle: false,
      isClampOnly: false
    },
    {
      id: 'div_60_4x15',
      name: '60 mm Divided (4×15 Quad Narrow)',
      shortCode: '60 (4×15)',
      desc: 'Holds four 15 mm (14.4 mm) clamps separated by three 1.0 mm bullnose dividers (67.0 mm outer)',
      priceDelta: 14,
      nominalWidth: 60,
      actualClampWidth: 14.4,
      outerChannelWidth: 67.0,
      slots: 4,
      slotLayout: [14.4, 14.4, 14.4, 14.4],
      dividerMm: 1.0,
      isMolle: false,
      isClampOnly: false
    },
    {
      id: 'molle_direct',
      name: 'Direct MOLLE / Belt Mount (No Pouch)',
      shortCode: 'MOLLE WEAVE',
      desc: 'Integrated 60° HSGI clip weave / PALS cable-tie back wall for direct vest or battle-belt mounting',
      priceDelta: 8,
      nominalWidth: null,
      slots: 1,
      dividerMm: 0,
      isMolle: true,
      isClampOnly: false
    },
    {
      id: 'clamp_only',
      name: 'Clamp Insert Only (Swap Into Channel)',
      shortCode: 'CLAMP ONLY',
      desc: 'Universal y = -6.50 mm mid-base snap arc swaps into any ULAW channel of matching height',
      priceDelta: -12,
      nominalWidth: null,
      slots: 1,
      dividerMm: 0,
      isMolle: false,
      isClampOnly: true
    }
  ];

  // Floating Transparent Stream Items (The 2 ULAW Holster Tools from Studio Photo)
  const STREAM_ITEMS = [
    {
      id: 'screwdrivers-100x30',
      toolId: 'wera-kraftform-ph2-125',
      name: 'Wera / Witte Screwdrivers in 100×30 ULAW Holster',
      src: __dbAsset('stream-screwdrivers-100x30.png'),
      alt: 'Screwdrivers in 100X30 ULAW Holster'
    },
    {
      id: 'pliers-100x60',
      toolId: 'knipex-cobra-180',
      name: 'Knipex Pliers in 100×60 ULAW Holster',
      src: __dbAsset('stream-pliers-100x60.png'),
      alt: 'Knipex Pliers in 100X60 ULAW Holster'
    }
  ];

  // Real ULAW Product Photo Gallery (Uploaded Photos)
  const PRODUCT_GALLERY = [
    {
      id: 'screwdrivers-100x30',
      src: __dbAsset('stream-screwdrivers-100x30.png'),
      alt: 'Screwdrivers in 100X30 ULAW Holster'
    },
    {
      id: 'pliers-100x60',
      src: __dbAsset('stream-pliers-100x60.png'),
      alt: 'Knipex Pliers in 100X60 ULAW Holster'
    },
    {
      id: 'milwaukee-pliers',
      src: __dbAsset('milwaukee-pliers-ulaw.jpg'),
      alt: 'Milwaukee Pliers in ULAW Holster'
    },
    {
      id: 'pica-dry',
      src: __dbAsset('pica-dry-ulaw.jpg'),
      alt: 'Pica-Dry Pencil in 30mm ULAW Holster'
    },
    {
      id: 'scissors-125x30',
      src: __dbAsset('scissors-125x30-ulaw.jpg'),
      alt: 'Shears in 125X30 ULAW Holster'
    }
  ];

  // Authoritative 20 ULAW Workshop Presets + Expanded Brand/Model/MPN Catalog
  const TOOLS = [
    // --- FEATURED TOOLS FROM PHOTOS ---
    {
      id: 'milwaukee-wire-stripper-3079',
      brand: 'Milwaukee',
      model: '7.75" 6-in-1 Combination Wire Strippers / Pliers',
      mpn: '48-22-3079',
      aliases: ['Wire Stripper', 'Milwaukee Pliers', '48-22-6109', 'Combination Pliers', 'Electrician Pliers'],
      category: 'Pliers & Wrenches',
      presetName: '8" Heavy-Duty Linesman Pliers',
      image: __dbAsset('milwaukee-pliers-ulaw.jpg'),
      basePrice: 36.00,
      toolWidth: 50.0,
      toolTopDepth: 14.5,
      toolBotDepth: 11.5,
      toolHeight: 195.0,
      toolGrab: 45.0,
      toolBladeLength: 0,
      defaultChannelWidth: 60,
      defaultChannelHeight: 150,
      defaultClampDepth: 24,
      defaultTopGap: 14,
      defaultBotGap: 10,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'single_60',
      description: 'Precision wave-spring clamp inside a 150×60 mm ULAW modular channel built for Milwaukee combination wire strippers and pliers.'
    },
    {
      id: 'jobsite-utility-scissors-shears',
      brand: 'Milwaukee',
      model: 'Jobsite Offset Utility Scissors / Shop Shears',
      mpn: '48-22-4040',
      aliases: ['Scissors', 'Shears', 'Shop Shears', 'Crescent Wiss', 'Klein Scissors', '125X30'],
      category: 'Utility & Folding Knives',
      presetName: 'Fixed Utility Knife (Stanley 99E)',
      image: __dbAsset('scissors-125x30-ulaw.jpg'),
      basePrice: 34.00,
      toolWidth: 26.0,
      toolTopDepth: 13.0,
      toolBotDepth: 8.0,
      toolHeight: 210.0,
      toolGrab: 75.0,
      toolBladeLength: 95.0,
      defaultChannelWidth: 30,
      defaultChannelHeight: 125,
      defaultClampDepth: 24,
      defaultTopGap: 12,
      defaultBotGap: 6,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'single_30',
      description: '125×30 mm single pistol mag-pouch ULAW channel with tapered wave-spring retention for utility scissors and shop shears.'
    },

    // --- UTILITY & FOLDING KNIVES ---
    {
      id: 'milwaukee-fastback-1505',
      brand: 'Milwaukee',
      model: 'FASTBACK™ 6-in-1 Folding Utility Knife',
      mpn: '48-22-1505',
      aliases: ['48-22-1502', '48-22-1501', 'Fastback', 'Razor Knife', 'Folding Utility Knife', 'Box Cutter'],
      category: 'Utility & Folding Knives',
      presetName: 'Folding Razor Knife (Milwaukee Fastback)',
      image: __dbAsset('scissors-125x30-ulaw.jpg'),
      basePrice: 34.00,
      toolWidth: 26.0,
      toolTopDepth: 14.0,
      toolBotDepth: 14.0,
      toolHeight: 140.0,
      toolGrab: 30.0,
      toolBladeLength: 0,
      defaultChannelWidth: 30,
      defaultChannelHeight: 125,
      defaultClampDepth: 24,
      defaultTopGap: 12,
      defaultBotGap: 12,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'single_30',
      description: 'Precision-tuned 12/12 mm uniform wave-spring clamp with a 15° 7-point zero-jamming V-channel centering rib inside a 125×30 mm single pistol mag-pouch channel. Holds the Milwaukee Fastback securely while leaving 30+ mm of top handle grab and clearing the blade-release button.'
    },
    {
      id: 'milwaukee-fastback-compact-1500',
      brand: 'Milwaukee',
      model: 'FASTBACK™ Compact Folding Utility Knife',
      mpn: '48-22-1500',
      aliases: ['Compact Fastback', '48-22-1503', 'Folding Knife'],
      category: 'Utility & Folding Knives',
      presetName: 'Folding Razor Knife (Milwaukee Fastback)',
      image: __dbAsset('scissors-125x30-ulaw.jpg'),
      basePrice: 32.00,
      toolWidth: 24.5,
      toolTopDepth: 12.5,
      toolBotDepth: 12.5,
      toolHeight: 125.0,
      toolGrab: 32.0,
      toolBladeLength: 0,
      defaultChannelWidth: 30,
      defaultChannelHeight: 100,
      defaultClampDepth: 24,
      defaultTopGap: 10,
      defaultBotGap: 10,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'single_30',
      description: 'Compact H100 single mag-pouch holster with 10/10 mm wave gaps and raised U-base floor for effortless one-handed Fastback Compact draw.'
    },
    {
      id: 'stanley-99e-utility',
      brand: 'Stanley',
      model: '99E Classic Retractable Utility Knife',
      mpn: '10-099',
      aliases: ['Stanley 99E', 'FatMax Utility Knife', '10-778', 'Fixed Utility Knife'],
      category: 'Utility & Folding Knives',
      presetName: 'Fixed Utility Knife (Stanley 99E)',
      image: __dbAsset('scissors-125x30-ulaw.jpg'),
      basePrice: 36.00,
      toolWidth: 34.0,
      toolTopDepth: 17.0,
      toolBotDepth: 15.0,
      toolHeight: 155.0,
      toolGrab: 35.0,
      toolBladeLength: 0,
      defaultChannelWidth: 60,
      defaultChannelHeight: 125,
      defaultClampDepth: 24,
      defaultTopGap: 14,
      defaultBotGap: 14,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'single_60',
      description: 'Engineered for the iconic Stanley 99E cast-zinc body (14/14 H125 clamp in a 125×60 mm channel, or 45/15 divided channel alongside a marker or precision driver).'
    },

    // --- MULTI-TOOLS ---
    {
      id: 'leatherman-wave-plus',
      brand: 'Leatherman',
      model: 'Wave+ Multi-Tool (18-Tool Folding)',
      mpn: '832524',
      aliases: ['Leatherman Wave', 'Wave Plus', '832531', 'Charge+ TTi', 'Multi-Tool', 'Multitool'],
      category: 'Multi-Tools',
      presetName: 'Folding Multi-Tool (Leatherman Wave+)',
      image: __dbAsset('scissors-125x30-ulaw.jpg'),
      basePrice: 36.00,
      toolWidth: 33.5,
      toolTopDepth: 17.2,
      toolBotDepth: 17.2,
      toolHeight: 102.0,
      toolGrab: 30.0,
      toolBladeLength: 0,
      defaultChannelWidth: 60,
      defaultChannelHeight: 100,
      defaultClampDepth: 24,
      defaultTopGap: 14,
      defaultBotGap: 14,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'single_60',
      description: 'Official ULAWPreset #11: 14/14 mm wave-spring retention (3.2 mm preload) with concentric 6.0 mm compact bottom fillets so rectangular multi-tool frames seat flush on the U-base floor with 30+ mm top finger purchase.'
    },
    {
      id: 'leatherman-arc-free-p4',
      brand: 'Leatherman',
      model: 'ARC® / FREE® P4 Magnetic Multi-Tool',
      mpn: '833074',
      aliases: ['Leatherman ARC', 'Free P4', 'Free P2', '832640', 'Surge'],
      category: 'Multi-Tools',
      presetName: 'Folding Multi-Tool (Leatherman Wave+)',
      image: __dbAsset('scissors-125x30-ulaw.jpg'),
      basePrice: 36.00,
      toolWidth: 34.0,
      toolTopDepth: 17.2,
      toolBotDepth: 17.2,
      toolHeight: 108.0,
      toolGrab: 32.0,
      toolBladeLength: 0,
      defaultChannelWidth: 60,
      defaultChannelHeight: 100,
      defaultClampDepth: 24,
      defaultTopGap: 14,
      defaultBotGap: 14,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'div_60_45_15',
      description: 'Tailored for the Leatherman ARC and FREE P4. Fits a 100×60 standard channel or the 60 mm (45/15) Divided Channel so you can carry your ARC alongside a bit driver or Pica marker in one pouch.'
    },
    {
      id: 'leatherman-skeletool-cx',
      brand: 'Leatherman',
      model: 'Skeletool® CX Lightweight Multi-Tool',
      mpn: '830950',
      aliases: ['Skeletool', 'Rebar', 'Wingman', 'Sidekick'],
      category: 'Multi-Tools',
      presetName: 'Folding Multi-Tool (Leatherman Wave+)',
      image: __dbAsset('scissors-125x30-ulaw.jpg'),
      basePrice: 34.00,
      toolWidth: 28.0,
      toolTopDepth: 13.5,
      toolBotDepth: 13.5,
      toolHeight: 100.0,
      toolGrab: 30.0,
      toolBladeLength: 0,
      defaultChannelWidth: 30,
      defaultChannelHeight: 100,
      defaultClampDepth: 24,
      defaultTopGap: 12,
      defaultBotGap: 12,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'single_30',
      description: 'Slim 28 mm Skeletool CX profile drops directly into a 100×30 mm single pistol mag-pouch channel with 12/12 mm wave-spring retention.'
    },
    {
      id: 'victorinox-swisstool-spirit',
      brand: 'Victorinox',
      model: 'SwissTool Spirit X Multi-Tool',
      mpn: '3.0224.L',
      aliases: ['SwissTool', 'Victorinox Spirit', 'Gerber MP600', 'Multi-Tool'],
      category: 'Multi-Tools',
      presetName: 'Folding Multi-Tool (Leatherman Wave+)',
      image: __dbAsset('scissors-125x30-ulaw.jpg'),
      basePrice: 36.00,
      toolWidth: 32.0,
      toolTopDepth: 16.5,
      toolBotDepth: 16.0,
      toolHeight: 105.0,
      toolGrab: 30.0,
      toolBladeLength: 0,
      defaultChannelWidth: 60,
      defaultChannelHeight: 100,
      defaultClampDepth: 24,
      defaultTopGap: 14,
      defaultBotGap: 14,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'single_60',
      description: 'Configured for the curved ergonomic handles of the Victorinox SwissTool Spirit X inside a 100×60 mm ULAW channel.'
    },

    // --- MARKERS & CARPENTER PENCILS ---
    {
      id: 'pica-dry-3030',
      brand: 'Pica',
      model: 'Pica-Dry® Longlife Automatic Pencil',
      mpn: '3030',
      aliases: ['Pica Dry', 'Deep Hole Marker', 'Construction Pencil', '3030/SB'],
      category: 'Markers & Pencils',
      presetName: 'Pica Dry Longlife Pencil (Tapered)',
      image: __dbAsset('pica-dry-ulaw.jpg'),
      basePrice: 32.00,
      toolWidth: 13.0,
      toolTopDepth: 12.5,
      toolBotDepth: 5.5,
      toolHeight: 160.0,
      toolGrab: 35.0,
      toolBladeLength: 0,
      defaultChannelWidth: 30,
      defaultChannelHeight: 125,
      defaultClampDepth: 24,
      defaultTopGap: 10,
      defaultBotGap: 4,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: true,
      useTipSocket: false,
      recommendedPouch: 'div_30_15_15',
      description: 'Official ULAW Preset #1: Tapered 10/4 mm Kepler-skewed wave spring (WaveSkew = 0.45) with C³ baseline envelope eliminates lower-peak tip jamming at 25°–32° off-vertical insertion. Packs singly in a 15 mm slot or dual in a 30 mm (15/15) divided channel.'
    },
    {
      id: 'pica-big-ink-170',
      brand: 'Pica',
      model: 'Pica BIG Ink® Smart-Use Marker XL (w/ Nib Seal)',
      mpn: '170/46',
      aliases: ['Pica Big Ink', '170/40', '170/52', 'Deep Hole Ink Marker', 'Capless Marker'],
      category: 'Markers & Pencils',
      presetName: 'Pica BIG Ink Smart-Use Marker XL (Nib Seal)',
      image: __dbAsset('pica-dry-ulaw.jpg'),
      basePrice: 36.00,
      toolWidth: 15.0,
      toolTopDepth: 18.5,
      toolBotDepth: 5.1,
      toolHeight: 165.0,
      toolGrab: 35.0,
      toolBladeLength: 0,
      defaultChannelWidth: 30,
      defaultChannelHeight: 125,
      defaultClampDepth: 24,
      defaultTopGap: 16,
      defaultBotGap: 4,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: true,
      nibSealDia: 5.1,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'single_30',
      description: 'Features ULAW’s patented 100% single-piece PETG print-in-place Spring-Loaded Conical Nib Seal Cup (Ø5.40 mm CAD valve seat + hairpin leaf-spring flexure + 0.127 mL blind felt well) so your uncapped Pica BIG Ink never dries out in the holster!'
    },
    {
      id: 'sharpie-pro-marker',
      brand: 'Sharpie',
      model: 'PRO™ Permanent Marker (Chisel / Bullet Tip)',
      mpn: '2018324',
      aliases: ['Sharpie Pro', 'Jobsite Marker', 'Milwaukee Inkzall', '48-22-3100'],
      category: 'Markers & Pencils',
      presetName: 'Sharpie Pro Permanent Marker (Tapered)',
      image: __dbAsset('pica-dry-ulaw.jpg'),
      basePrice: 32.00,
      toolWidth: 14.0,
      toolTopDepth: 13.5,
      toolBotDepth: 9.0,
      toolHeight: 145.0,
      toolGrab: 30.0,
      toolBladeLength: 0,
      defaultChannelWidth: 30,
      defaultChannelHeight: 125,
      defaultClampDepth: 24,
      defaultTopGap: 12,
      defaultBotGap: 8,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'div_30_15_15',
      description: 'Official ULAW Preset #3 (12/8 H125): Tapered barrel retention for Sharpie PRO and Milwaukee Inkzall jobsite markers. Supports single 30 mm, divided 30 mm (15/15), or 60 mm (4×15) quad-tool layouts.'
    },
    {
      id: 'carpenter-pencil-octagonal',
      brand: 'Swanson / Dixon',
      model: 'Flat Octagonal Carpenter Pencil',
      mpn: 'CP216',
      aliases: ['Carpenter Pencil', 'Flat Pencil', 'Home Depot Pencil', 'Dixon Reach'],
      category: 'Markers & Pencils',
      presetName: 'Carpenter Pencil (Flat Octagonal)',
      image: __dbAsset('pica-dry-ulaw.jpg'),
      basePrice: 30.00,
      toolWidth: 13.5,
      toolTopDepth: 7.0,
      toolBotDepth: 7.0,
      toolHeight: 175.0,
      toolGrab: 35.0,
      toolBladeLength: 0,
      defaultChannelWidth: 30,
      defaultChannelHeight: 150,
      defaultClampDepth: 24,
      defaultTopGap: 6,
      defaultBotGap: 6,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: true,
      useTipSocket: false,
      recommendedPouch: 'div_30_15_15',
      description: 'Official ULAW Preset #2 (6/6 H150): 6/6 mm narrow-gap wave spring with staged S2 rear left-wall backstop boss holds flat 7 mm octagonal carpenter pencils tightly without snapping lead tips.'
    },

    // --- SCREWDRIVERS (LONG-BLADE LATERAL STABILITY PACKAGE N1+S1+S2) ---
    {
      id: 'klein-phillips-2-603-4',
      brand: 'Klein Tools',
      model: '#2 Phillips Cushion-Grip Screwdriver (4" Shank)',
      mpn: '603-4',
      aliases: ['Phillips #2', '#2 Screwdriver', 'Klein 603-4', '32500', '11-in-1 Screwdriver'],
      category: 'Screwdrivers',
      presetName: '#2 Phillips Screwdriver (Collar -> Shank)',
      image: __dbAsset('pica-dry-ulaw.jpg'),
      basePrice: 34.00,
      toolWidth: 9.0,
      toolTopDepth: 9.0,
      toolBotDepth: 5.8,
      toolHeight: 210.0,
      toolGrab: 85.0,
      toolBladeLength: 100.0,
      defaultChannelWidth: 30,
      defaultChannelHeight: 125,
      defaultClampDepth: 24,
      defaultTopGap: 4,
      defaultBotGap: 4,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: true,
      useTipSocket: true,
      recommendedPouch: 'div_60_3x20',
      description: 'Includes ULAW v2.22.52 Long-Blade Lateral Stability Package (N1+S1+S2): S1 blade-aware 4/4 mm shank sizing, S2 staged 1.40 mm rear left-wall backstop boss (6.5× stiffer upper grip), and N1 45° U-base tip-centering socket. Zero off-center insertion jamming!'
    },
    {
      id: 'wera-kraftform-ph2-125',
      brand: 'Wera',
      model: 'Kraftform Plus 350 PH #2 × 125 mm Lasertip',
      mpn: '05008720001',
      aliases: ['Wera Screwdriver', 'Kraftform', 'PH2x125', 'Chiseldriver', '#2x125'],
      category: 'Screwdrivers',
      presetName: '#2 Phillips Screwdriver (Collar -> Shank)',
      image: __dbAsset('stream-screwdrivers-100x30.png'),
      basePrice: 35.00,
      toolWidth: 9.0,
      toolTopDepth: 9.0,
      toolBotDepth: 5.8,
      toolHeight: 230.0,
      toolGrab: 90.0,
      toolBladeLength: 125.0,
      defaultChannelWidth: 30,
      defaultChannelHeight: 150,
      defaultClampDepth: 24,
      defaultTopGap: 4,
      defaultBotGap: 4,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: true,
      useTipSocket: true,
      recommendedPouch: 'div_60_3x20',
      description: 'Calibrated directly from ULAW v2.22.50–v2.22.52 print trials on the #2×125 screwdriver: 4/4 H150 clamp with 17-point wall-following Top Backstop Boss, 45° U-base Tip Socket, and optional 42° Upper Rim Bolster V-Saddle.'
    },
    {
      id: 'klein-cushion-grip-handle-mode',
      brand: 'Klein Tools',
      model: 'Heavy-Duty Cushion-Grip Screwdriver (Handle-In Seat)',
      mpn: '600-4',
      aliases: ['Flathead Screwdriver', 'Cabinet Tip', 'Cushion Grip Handle'],
      category: 'Screwdrivers',
      presetName: '#2 Cushion-Grip Screwdriver (Handle)',
      image: __dbAsset('pica-dry-ulaw.jpg'),
      basePrice: 35.00,
      toolWidth: 28.0,
      toolTopDepth: 17.0,
      toolBotDepth: 13.0,
      toolHeight: 215.0,
      toolGrab: 40.0,
      toolBladeLength: 0,
      defaultChannelWidth: 30,
      defaultChannelHeight: 175,
      defaultClampDepth: 24,
      defaultTopGap: 14,
      defaultBotGap: 12,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'single_30',
      description: 'Official ULAW Preset #6 (14/12 H175): Deep 175×30 mm channel with 2.94 mm height-compensated PETG wave wall (+3 perimeters) designed for deep handle-engagement screwdriver carry.'
    },
    {
      id: 'wiha-precision-screwdriver-0-1',
      brand: 'Wera / Wiha',
      model: 'Precision Screwdriver #0 / #1 / Picofinish',
      mpn: '26190',
      aliases: ['Precision Driver', 'Jewelers Screwdriver', 'PH0', 'PH00', '118022', 'Klein 32581'],
      category: 'Screwdrivers',
      presetName: 'Precision Screwdriver #0/#1 (Tapered)',
      image: __dbAsset('pica-dry-ulaw.jpg'),
      basePrice: 32.00,
      toolWidth: 13.0,
      toolTopDepth: 13.0,
      toolBotDepth: 4.0,
      toolHeight: 155.0,
      toolGrab: 35.0,
      toolBladeLength: 60.0,
      defaultChannelWidth: 30,
      defaultChannelHeight: 125,
      defaultClampDepth: 24,
      defaultTopGap: 12,
      defaultBotGap: 2,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: true,
      useTipSocket: true,
      recommendedPouch: 'div_60_4x15',
      description: 'Official ULAW Preset #4 (12/2 H125): Captures ultra-fine 3.0–4.0 mm precision shafts at the lower 2 mm peak while stabilizing the rotating cap handle. Ideal for 30 mm (15/15) or 60 mm (4×15) multi-driver sets.'
    },
    {
      id: 'milwaukee-stubby-ratcheting-driver',
      brand: 'Milwaukee',
      model: '8-in-1 Compact Ratcheting Multi-Bit Stubby Driver',
      mpn: '48-22-2913',
      aliases: ['Stubby Screwdriver', 'Klein 32593', 'Megapro Stubby', 'Wera Stubby'],
      category: 'Screwdrivers',
      presetName: 'Stubby Ratcheting Screwdriver',
      image: __dbAsset('pica-dry-ulaw.jpg'),
      basePrice: 32.00,
      toolWidth: 28.0,
      toolTopDepth: 16.0,
      toolBotDepth: 12.0,
      toolHeight: 90.0,
      toolGrab: 30.0,
      toolBladeLength: 0,
      defaultChannelWidth: 30,
      defaultChannelHeight: 100,
      defaultClampDepth: 24,
      defaultTopGap: 14,
      defaultBotGap: 10,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'single_30',
      description: 'Official ULAW Preset #7 (14/10 H100): Automatically raises the internal U-base floor inside a standard 100×30 mm mag-pouch channel so short 90 mm stubby drivers sit with a full 30 mm handle grab above the rim.'
    },

    // --- PLIERS & WRENCHES ---
    {
      id: 'knipex-cobra-180',
      brand: 'Knipex',
      model: 'Cobra® 7-1/4" High-Tech Water Pump Pliers',
      mpn: '87 01 180',
      aliases: ['Knipex Cobra', '87 01 250', 'Alligator Pliers', 'Water Pump Pliers', '88 01 180'],
      category: 'Pliers & Wrenches',
      presetName: '10" Tongue & Groove Pliers (Channellock)',
      image: __dbAsset('stream-pliers-100x60.png'),
      basePrice: 38.00,
      toolWidth: 48.0,
      toolTopDepth: 15.0,
      toolBotDepth: 13.0,
      toolHeight: 180.0,
      toolGrab: 40.0,
      toolBladeLength: 0,
      defaultChannelWidth: 60,
      defaultChannelHeight: 150,
      defaultClampDepth: 24,
      defaultTopGap: 14,
      defaultBotGap: 12,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'single_60',
      description: 'Features ULAW v2.22.22+ regular symmetric sine upper wave cycle (-43% withdrawal slope) + gradual <=16° top V-channel ramp and v2.22.27 3rd-harmonic flattened lower exit ramp so push-button adjustment mechanisms never snag on draw!'
    },
    {
      id: 'knipex-twingrip-200',
      brand: 'Knipex',
      model: 'TwinGrip® 8" Slip-Joint Screw Extraction Pliers',
      mpn: '82 01 200',
      aliases: ['TwinGrip', 'Knipex Pliers Wrench', '86 03 180', '86 01 180'],
      category: 'Pliers & Wrenches',
      presetName: '8" Heavy-Duty Linesman Pliers',
      image: __dbAsset('knipex-pliers-ulaw.jpg'),
      basePrice: 38.00,
      toolWidth: 50.0,
      toolTopDepth: 15.0,
      toolBotDepth: 13.0,
      toolHeight: 200.0,
      toolGrab: 45.0,
      toolBladeLength: 0,
      defaultChannelWidth: 60,
      defaultChannelHeight: 175,
      defaultClampDepth: 24,
      defaultTopGap: 14,
      defaultBotGap: 12,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'single_60',
      description: 'Print-verified on the Knipex TwinGrip & Pliers Wrench (v2.22.27): unskewed 3rd-harmonic flattened cosine exit ramp cuts lower withdrawal angle from 64.6° down to 34.1° for silky-smooth one-handed retrieval.'
    },
    {
      id: 'klein-linesman-d213-9ne',
      brand: 'Klein Tools',
      model: '8" / 9" Journeyman Heavy-Duty Side-Cutting Linesman Pliers',
      mpn: 'D213-9NE',
      aliases: ['Linesman Pliers', 'Lineman Pliers', 'D2000-9NE', 'Knipex 09 02 240'],
      category: 'Pliers & Wrenches',
      presetName: '8" Heavy-Duty Linesman Pliers',
      image: __dbAsset('knipex-pliers-ulaw.jpg'),
      basePrice: 38.00,
      toolWidth: 54.0,
      toolTopDepth: 15.0,
      toolBotDepth: 13.0,
      toolHeight: 225.0,
      toolGrab: 50.0,
      toolBladeLength: 0,
      defaultChannelWidth: 60,
      defaultChannelHeight: 175,
      defaultClampDepth: 24,
      defaultTopGap: 14,
      defaultBotGap: 12,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'single_60',
      description: 'Official ULAW Preset #14 (14/12 H175): 175×60 mm double mag-pouch channel with 2.10 mm height-compensated PETG wave wall and 8.02 mm deep 15° V-channel rib.'
    },
    {
      id: 'klein-diagonal-cutters-d248-8',
      brand: 'Klein Tools',
      model: '7" / 8" High-Leverage Diagonal Cutting Pliers (Dykes)',
      mpn: 'D248-8',
      aliases: ['Diagonal Cutters', 'Dykes', 'Side Cutters', 'Knipex 74 01 180', 'D228-7'],
      category: 'Pliers & Wrenches',
      presetName: '7" Diagonal Cutting Pliers (Dykes)',
      image: __dbAsset('knipex-pliers-ulaw.jpg'),
      basePrice: 36.00,
      toolWidth: 50.0,
      toolTopDepth: 14.0,
      toolBotDepth: 11.0,
      toolHeight: 190.0,
      toolGrab: 40.0,
      toolBladeLength: 0,
      defaultChannelWidth: 60,
      defaultChannelHeight: 150,
      defaultClampDepth: 24,
      defaultTopGap: 12,
      defaultBotGap: 10,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'single_60',
      description: 'Official ULAW Preset #13 (12/10 H150): Tapered 12/10 mm wave spring grips the angled head of 7" and 8" diagonal cutting pliers inside a 150×60 mm channel.'
    },
    {
      id: 'klein-needle-nose-d203-6',
      brand: 'Klein Tools',
      model: '6" / 8" Long Needle-Nose Pliers (Tapered Jaws)',
      mpn: 'D203-6',
      aliases: ['Needle Nose Pliers', 'Long Nose Pliers', 'D203-8', 'Knipex 26 11 200'],
      category: 'Pliers & Wrenches',
      presetName: '6" Needle-Nose Pliers (Tapered Jaws)',
      image: __dbAsset('knipex-pliers-ulaw.jpg'),
      basePrice: 36.00,
      toolWidth: 48.0,
      toolTopDepth: 13.0,
      toolBotDepth: 7.0,
      toolHeight: 175.0,
      toolGrab: 35.0,
      toolBladeLength: 0,
      defaultChannelWidth: 60,
      defaultChannelHeight: 150,
      defaultClampDepth: 24,
      defaultTopGap: 12,
      defaultBotGap: 6,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'single_60',
      description: 'Official ULAW Preset #12 (12/6 H150): 50/50 steep-taper split angles the left V-channel wall inward toward the bottom so slender 7 mm needle-nose tips are gripped dead-center at x = 12.0 mm.'
    },
    {
      id: 'channellock-420-pliers',
      brand: 'Channellock',
      model: '420® 9.5" / 10" Tongue & Groove Straight Jaw Pliers',
      mpn: '420',
      aliases: ['Channellock 430', '420X', 'Tongue and Groove Pliers', 'Slip Joint Pliers'],
      category: 'Pliers & Wrenches',
      presetName: '10" Tongue & Groove Pliers (Channellock)',
      image: __dbAsset('knipex-pliers-ulaw.jpg'),
      basePrice: 38.00,
      toolWidth: 55.0,
      toolTopDepth: 15.5,
      toolBotDepth: 13.5,
      toolHeight: 240.0,
      toolGrab: 55.0,
      toolBladeLength: 0,
      defaultChannelWidth: 60,
      defaultChannelHeight: 175,
      defaultClampDepth: 24,
      defaultTopGap: 14,
      defaultBotGap: 12,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'single_60',
      description: 'Official ULAW Preset #15 (14/12 H175): Full-depth 175×60 mm modular channel with 2.10 mm height-compensated PETG wave spring and universal y = -6.50 mm bilateral snap-rail lock.'
    },
    {
      id: 'crescent-ac28vs-wrench',
      brand: 'Crescent',
      model: '8" Adjustable Wrench (Chrome / Cushion Grip)',
      mpn: 'AC28VS',
      aliases: ['Adjustable Wrench', 'Crescent Wrench', 'Spanner', ' Bahco 9072', 'Milwaukee 48-22-7408'],
      category: 'Pliers & Wrenches',
      presetName: '8" Adjustable Wrench (Crescent)',
      image: __dbAsset('knipex-pliers-ulaw.jpg'),
      basePrice: 38.00,
      toolWidth: 56.0,
      toolTopDepth: 14.5,
      toolBotDepth: 11.0,
      toolHeight: 205.0,
      toolGrab: 40.0,
      toolBladeLength: 0,
      defaultChannelWidth: 60,
      defaultChannelHeight: 175,
      defaultClampDepth: 24,
      defaultTopGap: 12,
      defaultBotGap: 10,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'single_60',
      description: 'Official ULAW Preset #16 (12/10 H175): Holds 8" adjustable wrenches head-up or handle-up in a 175×60 mm channel without jaw rattle.'
    },

    // --- TAPE MEASURES, LEVELS & WOODWORKING ---
    {
      id: 'stabila-bm300-25ft',
      brand: 'Stabila',
      model: 'BM 300 25 ft / 8 m Imperial/Metric Tape Measure',
      mpn: '30326',
      aliases: ['Stabila BM 300', 'BM300', '25260', 'Stabila Tape Measure'],
      category: 'Tape Measures & Levels',
      presetName: 'Stabila BM 300 Tape Measure (44.2 mm depth)',
      image: __dbAsset('ulaw-side-profile.jpg'),
      basePrice: 44.00,
      toolWidth: 91.5,
      toolTopDepth: 44.2,
      toolBotDepth: 44.2,
      toolHeight: 84.0,
      toolGrab: 30.0,
      toolBladeLength: 0,
      defaultChannelWidth: 95,
      defaultChannelHeight: 69,
      defaultClampDepth: 50,
      defaultTopGap: 42,
      defaultBotGap: 42,
      useVChannel: false,
      vChannelAngle: 0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'molle_direct',
      description: 'Official ULAW Preset #20 (42/42 H69 · 69X95X50): Custom low-profile MOLLE channel with 3.0 mm front wall, 6.0 mm rounded outer vertical corners, and a 1.26 mm symmetric dual-sided sine wave clamp (UseVChannel = 0) for effortless 1-hand draw.'
    },
    {
      id: 'milwaukee-stud-25ft-tape',
      brand: 'Milwaukee',
      model: 'STUD™ / Wide Blade 25 ft Framing Tape Measure',
      mpn: '48-22-9925',
      aliases: ['25 ft Tape Measure', 'DeWalt ToughSeries 25ft', 'Stanley FatMax 25ft', '33-725', '48-22-0225'],
      category: 'Tape Measures & Levels',
      presetName: '25 ft Framing Tape Measure',
      image: __dbAsset('ulaw-side-profile.jpg'),
      basePrice: 44.00,
      toolWidth: 82.0,
      toolTopDepth: 46.0,
      toolBotDepth: 46.0,
      toolHeight: 85.0,
      toolGrab: 30.0,
      toolBladeLength: 0,
      defaultChannelWidth: 85,
      defaultChannelHeight: 70,
      defaultClampDepth: 52,
      defaultTopGap: 44,
      defaultBotGap: 44,
      useVChannel: false,
      vChannelAngle: 0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'molle_direct',
      description: 'Official ULAW Preset #19 (44/44 H70 · 70X85X52): Symmetric dual-wave 1.26 mm PETG retention arch (1.52 mm amplitude per wall) inside a 2-column PALS/MOLLE channel.'
    },
    {
      id: 'stanley-powerlock-16ft-tape',
      brand: 'Stanley / DeWalt',
      model: '16 ft / 5 m Compact Tape Measure (FatMax / PowerLock)',
      mpn: '33-116',
      aliases: ['16 ft Tape Measure', 'Compact Tape Measure', '33-716', 'Milwaukee 16ft 48-22-6616', 'Tajima 16ft'],
      category: 'Tape Measures & Levels',
      presetName: '16 ft Compact Tape Measure',
      image: __dbAsset('ulaw-side-profile.jpg'),
      basePrice: 42.00,
      toolWidth: 68.0,
      toolTopDepth: 36.0,
      toolBotDepth: 36.0,
      toolHeight: 75.0,
      toolGrab: 30.0,
      toolBladeLength: 0,
      defaultChannelWidth: 71,
      defaultChannelHeight: 60,
      defaultClampDepth: 42,
      defaultTopGap: 34,
      defaultBotGap: 34,
      useVChannel: false,
      vChannelAngle: 0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'molle_direct',
      description: 'Official ULAW Preset #18 (34/34 H60 · 60X71X42): Compact 60 mm tall external MOLLE / belt holster with symmetric dual-wave clamp and support-free 45° bottom chamfer-fillet.'
    },
    {
      id: 'stabila-torpedo-level-81sm',
      brand: 'Stabila / Empire',
      model: '8" / 9" Magnetic Torpedo Spirit Level',
      mpn: '25100',
      aliases: ['Torpedo Level', 'Spirit Level', 'Empire em81.9', 'Milwaukee Billet Level 48-22-5107', 'Klein 935RB'],
      category: 'Tape Measures & Levels',
      presetName: '8" Torpedo Spirit Level (Uniform)',
      image: __dbAsset('knipex-pliers-ulaw.jpg'),
      basePrice: 38.00,
      toolWidth: 46.0,
      toolTopDepth: 17.0,
      toolBotDepth: 17.0,
      toolHeight: 205.0,
      toolGrab: 40.0,
      toolBladeLength: 0,
      defaultChannelWidth: 60,
      defaultChannelHeight: 175,
      defaultClampDepth: 24,
      defaultTopGap: 14,
      defaultBotGap: 14,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: false,
      useTipSocket: false,
      recommendedPouch: 'single_60',
      description: 'Official ULAW Preset #17 (14/14 H175 · 175X60): Keeps your magnetic billet or die-cast torpedo level protected and rattle-free inside a standard 60 mm double mag pouch.'
    },
    {
      id: 'buck-bros-wood-chisel-3-4',
      brand: 'Buck Bros. / Narex',
      model: '3/4" (19 mm) Bevel-Edge Wood Chisel',
      mpn: '40603',
      aliases: ['Wood Chisel', 'Bevel Edge Chisel', 'Stanley Sweetheart 16-791', 'Marples Chisel', 'DeWalt DWHT16063'],
      category: 'Woodworking & Chisels',
      presetName: '3/4" Bevel-Edge Wood Chisel (Tapered)',
      image: __dbAsset('pica-dry-ulaw.jpg'),
      basePrice: 35.00,
      toolWidth: 19.5,
      toolTopDepth: 13.0,
      toolBotDepth: 7.0,
      toolHeight: 220.0,
      toolGrab: 45.0,
      toolBladeLength: 115.0,
      defaultChannelWidth: 30,
      defaultChannelHeight: 175,
      defaultClampDepth: 24,
      defaultTopGap: 12,
      defaultBotGap: 6,
      useVChannel: true,
      vChannelAngle: 15.0,
      useNibSeal: false,
      useTopBackstop: true,
      useTipSocket: false,
      recommendedPouch: 'single_30',
      description: 'Official ULAW Preset #8 (12/6 H175 · 175X30): Protects honed bevel-edge chisel blades while gripping the tapered tang and bolster securely without dulling the cutting edge.'
    }
  ];

  // Extract unique brands and categories
  const BRANDS = Array.from(new Set(TOOLS.map(t => t.brand))).sort();
  const CATEGORIES = Array.from(new Set(TOOLS.map(t => t.category)));

  /**
   * ULAW v2.22.52 Real-Time Sizing & Part Marking Engine
   * Computes exact Clamp Mark, Channel Mark, WaveThickness, Lanes, and Price
   */
  function computeUlawConfiguration(tool, pouchOptionId, heightOverrideMm, markStyle) {
    const pouch = MAG_POUCH_OPTIONS.find(p => p.id === pouchOptionId) || MAG_POUCH_OPTIONS[0];
    const isCustomTape = tool.defaultClampDepth > 24;

    // Resolve effective channel height (Y)
    let channelHeight = heightOverrideMm && heightOverrideMm !== 'auto'
      ? parseInt(heightOverrideMm, 10)
      : tool.defaultChannelHeight;

    // Resolve effective channel width (Z) and slots
    let channelWidth = tool.defaultChannelWidth;
    let outerWidth = tool.defaultChannelWidth + 4.0;
    let clampActualWidth = tool.defaultChannelWidth;
    let slots = 1;
    let slotLayout = [tool.defaultChannelWidth];
    let clampLanes = 1;
    let isMolle = isCustomTape || pouch.isMolle;

    if (pouch.id === 'auto') {
      const recPouch = MAG_POUCH_OPTIONS.find(p => p.id === tool.recommendedPouch) || MAG_POUCH_OPTIONS[1];
      if (!isCustomTape && recPouch && recPouch.nominalWidth) {
        channelWidth = recPouch.nominalWidth;
        outerWidth = recPouch.outerChannelWidth || (channelWidth + 4.0);
        clampActualWidth = recPouch.actualClampWidth || channelWidth;
        slots = recPouch.slots || 1;
        slotLayout = recPouch.slotLayout || [clampActualWidth];
      } else if (isCustomTape) {
        channelWidth = tool.defaultChannelWidth;
        outerWidth = tool.defaultChannelWidth + 6.0;
        clampActualWidth = tool.defaultChannelWidth;
      }
    } else if (pouch.nominalWidth) {
      channelWidth = pouch.nominalWidth;
      outerWidth = pouch.outerChannelWidth || (channelWidth + 4.0);
      clampActualWidth = pouch.actualClampWidth || channelWidth;
      slots = pouch.slots || 1;
      slotLayout = pouch.slotLayout || [clampActualWidth];
    }

    // Multi-lane packing inside undivided 30mm / 60mm for narrow tools (§12.2)
    if (slots === 1 && !isCustomTape && tool.toolWidth <= 13.5) {
      clampLanes = Math.max(1, Math.min(4, Math.floor((clampActualWidth + 0.6) / (Math.max(8.0, tool.toolWidth + 1.5)))));
    }

    // Height-compensated PETG WaveThickness (§3.2 / §18.35 v2.22.38)
    let baseWallMm = (isCustomTape || tool.defaultTopGap >= 16 || tool.defaultBotGap >= 14) ? 1.26 : 1.68;
    let extraPerimeters = 0;
    if (!isCustomTape && channelHeight > 100 && baseWallMm === 1.68) {
      extraPerimeters = Math.min(3, Math.floor((channelHeight - 100) / 25));
    }
    const waveThicknessMm = +(baseWallMm + extraPerimeters * 0.42).toFixed(2);

    // Clamp & Channel 3D-Printed Markings (§7.2)
    const topGap = tool.defaultTopGap;
    const botGap = tool.defaultBotGap;
    const clampMark = `${topGap}/${botGap} H${channelHeight}`;
    const channelMark = isCustomTape
      ? `${channelHeight}X${channelWidth}X${tool.defaultClampDepth}`
      : `${channelHeight}X${channelWidth}`;

    // Dynamic Price
    const effectivePouchForPrice = pouch.id === 'auto'
      ? (MAG_POUCH_OPTIONS.find(p => p.id === tool.recommendedPouch) || pouch)
      : pouch;
    const unitPrice = +(tool.basePrice + (effectivePouchForPrice.priceDelta || 0) + (markStyle === 'inlay' ? 0 : -2)).toFixed(2);

    // Active stability & special features summary
    const features = [];
    if (tool.useVChannel) {
      features.push(`${tool.vChannelAngle}° 7-Pt Zero-Jam V-Channel`);
    } else {
      features.push('Symmetric Dual-Sided Sine Wave');
    }
    if (tool.useNibSeal) {
      features.push(`Print-in-Place Ø${tool.nibSealDia} mm Nib Seal Cup`);
    }
    if (tool.useTopBackstop) {
      features.push('S2 Staged 1.40 mm Top Backstop Boss');
    }
    if (tool.useTipSocket) {
      features.push('N1 45° U-Base Tip-Centering Socket');
    }
    if (slots > 1) {
      features.push(`${slots - 1}× 1.0 mm Semicircular Bullnose Divider`);
    }
    if (isMolle) {
      features.push('60° HSGI Clip Weave / PALS Back Mount');
    }

    const sku = `ULAW-${channelMark}-${topGap}-${botGap}-${tool.mpn.replace(/[^A-Z0-9]/gi, '').toUpperCase()}`;

    return {
      tool,
      pouch: effectivePouchForPrice,
      selectedPouchId: pouchOptionId,
      channelHeight,
      channelWidth,
      outerWidth,
      clampActualWidth,
      clampDepth: tool.defaultClampDepth,
      slots,
      slotLayout,
      clampLanes,
      topGap,
      botGap,
      waveThicknessMm,
      clampMark,
      channelMark,
      markStyle: markStyle || 'inlay',
      isMolle,
      isCustomTape,
      unitPrice,
      sku,
      features
    };
  }

  /**
   * Search & Autocomplete Matcher across Brand, Model, MPN, Category, and Aliases
   */
  function searchTools(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) {
      return TOOLS.slice(0, 8);
    }
    const tokens = q.split(/\s+/).filter(Boolean);

    const scored = TOOLS.map(tool => {
      const hayBrand = tool.brand.toLowerCase();
      const hayModel = tool.model.toLowerCase();
      const hayMpn = tool.mpn.toLowerCase();
      const hayCat = tool.category.toLowerCase();
      const hayPreset = tool.presetName.toLowerCase();
      const hayAliases = (tool.aliases || []).join(' ').toLowerCase();
      const fullHay = `${hayBrand} ${hayModel} ${hayMpn} ${hayCat} ${hayPreset} ${hayAliases}`;

      let score = 0;
      // Direct phrase matches
      if (hayMpn === q) score += 120;
      else if (hayMpn.includes(q)) score += 85;
      if (hayBrand.startsWith(q)) score += 65;
      if (hayModel.includes(q)) score += 60;
      if (hayAliases.includes(q)) score += 50;
      if (hayCat.includes(q)) score += 40;

      // Token matches
      let matchedTokens = 0;
      for (const tk of tokens) {
        if (hayMpn.includes(tk)) { score += 35; matchedTokens++; }
        else if (hayBrand.includes(tk)) { score += 28; matchedTokens++; }
        else if (hayModel.includes(tk)) { score += 25; matchedTokens++; }
        else if (hayAliases.includes(tk)) { score += 20; matchedTokens++; }
        else if (hayCat.includes(tk) || hayPreset.includes(tk)) { score += 15; matchedTokens++; }
        else if (fullHay.includes(tk)) { score += 8; matchedTokens++; }
      }

      if (matchedTokens < tokens.length) {
        score = Math.floor(score * 0.25);
      }
      return { tool, score };
    })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.map(s => s.tool);
  }

  return {
    TOOLS,
    BRANDS,
    CATEGORIES,
    MAG_POUCH_OPTIONS,
    STREAM_ITEMS,
    PRODUCT_GALLERY,
    computeUlawConfiguration,
    searchTools
  };
})();

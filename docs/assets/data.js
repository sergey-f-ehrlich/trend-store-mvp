(function () {
  const brand = {
    name: 'Northstar Goods',
    mark: '✦',
    tagline: 'Modern essentials with a trend-led eye',
    supportEmail: 'hello@northstargoods.co'
  };

  const categories = [
    {
      id: 'workspace',
      name: 'Workspace Boosters',
      blurb: 'Desk-friendly products that make remote setups feel better and work harder.'
    },
    {
      id: 'recovery',
      name: 'Recovery Essentials',
      blurb: 'Low-friction wellness items with strong repeat-use potential.'
    },
    {
      id: 'kitchen',
      name: 'Smart Kitchen',
      blurb: 'Compact kitchen upgrades that solve visible daily annoyances.'
    },
    {
      id: 'pets',
      name: 'Pet Lifestyle',
      blurb: 'Functional pet products that pair emotional appeal with practical utility.'
    }
  ];

  const products = [
    {
      id: 'glow-desk-pad',
      name: 'Glow Desk Pad',
      category: 'workspace',
      price: 39,
      compareAt: 54,
      rating: 4.7,
      reviews: 412,
      badge: 'Rising fast',
      image: '💡',
      imageStyle: 'linear-gradient(135deg, #6aa4ff 0%, #2d3f85 100%)',
      photo: 'assets/products/glow-desk-pad.svg',
      shortDescription: 'A premium desk mat with soft edge lighting and cable routing slots.',
      description: 'The Glow Desk Pad turns a plain workstation into a cleaner, more premium setup. It combines visual appeal with practical features like cable channels, spill-resistant coating, and enough surface area for a keyboard, mouse, and notebook.',
      highlights: ['RGB edge glow with warm-to-cool presets', 'Water-resistant vegan leather surface', 'Integrated cable routing channels'],
      metrics: { demand: 83, margin: 78, competition: 64, risk: 71, repeat: 46, social: 80 },
      audience: 'Remote workers, students, gaming desk setups',
      shippingProfile: 'Ships flat, low breakage risk, easy to bundle with accessories.'
    },
    {
      id: 'pulse-posture-band',
      name: 'Pulse Posture Band',
      category: 'recovery',
      price: 29,
      compareAt: 45,
      rating: 4.5,
      reviews: 286,
      badge: 'High margin',
      image: '🧘',
      imageStyle: 'linear-gradient(135deg, #6fe7cc 0%, #1f7b6d 100%)',
      photo: 'assets/products/pulse-posture-band.svg',
      shortDescription: 'A lightweight posture cue band designed for short daily correction sessions.',
      description: 'Pulse Posture Band is positioned as a habit-forming recovery accessory. The product is easy to understand, visually demonstrable, and ideal for short-form content that shows before/after posture improvement and desk fatigue relief.',
      highlights: ['Adjustable for all-day comfort', 'Simple 10-minute routine positioning', 'Compact packaging and easy returns handling'],
      metrics: { demand: 74, margin: 87, competition: 59, risk: 76, repeat: 52, social: 68 },
      audience: 'Desk workers, creators, fitness-curious shoppers',
      shippingProfile: 'Very lightweight, low dimensional cost, ideal for impulse buys.'
    },
    {
      id: 'steam-prep-bowl',
      name: 'Steam Prep Bowl',
      category: 'kitchen',
      price: 24,
      compareAt: 34,
      rating: 4.8,
      reviews: 501,
      badge: 'Viral utility',
      image: '🥗',
      imageStyle: 'linear-gradient(135deg, #ffb86b 0%, #a24e1c 100%)',
      photo: 'assets/products/steam-prep-bowl.svg',
      shortDescription: 'A microwave-safe prep bowl with steam venting and built-in draining lid.',
      description: 'Steam Prep Bowl solves a very visible kitchen problem: quick meal prep without extra dishes. The built-in strainer lid and portion-friendly shape make it easy to demo, especially for busy professionals and small households.',
      highlights: ['Microwave-safe with steam-release vent', 'Snap-on strainer lid for easy draining', 'Compact stackable form for bundles'],
      metrics: { demand: 88, margin: 70, competition: 67, risk: 82, repeat: 39, social: 84 },
      audience: 'Busy professionals, apartment kitchens, meal-prep shoppers',
      shippingProfile: 'Durable molded design, modest breakage risk, good giftability.'
    },
    {
      id: 'calm-pet-bed',
      name: 'Calm Pet Bed',
      category: 'pets',
      price: 49,
      compareAt: 69,
      rating: 4.6,
      reviews: 367,
      badge: 'Evergreen',
      image: '🐾',
      imageStyle: 'linear-gradient(135deg, #ff9fd0 0%, #8147c2 100%)',
      photo: 'assets/products/calm-pet-bed.svg',
      shortDescription: 'A plush calming donut bed built for anxious pets and cozy interiors.',
      description: 'Calm Pet Bed benefits from emotional merchandising and highly relatable product visuals. It is especially strong for content showing pet comfort, home aesthetic fit, and seasonal lifestyle positioning.',
      highlights: ['Soft raised rim for nesting comfort', 'Machine-washable removable cover', 'Neutral color palette for home-friendly styling'],
      metrics: { demand: 79, margin: 73, competition: 62, risk: 68, repeat: 44, social: 77 },
      audience: 'Cat and dog owners, apartment pet households',
      shippingProfile: 'Compressed shipping possible; sizing variants expand AOV.'
    },
    {
      id: 'sip-track-bottle',
      name: 'SipTrack Bottle',
      category: 'recovery',
      price: 27,
      compareAt: 39,
      rating: 4.4,
      reviews: 198,
      badge: 'Repeat-friendly',
      image: '💧',
      imageStyle: 'linear-gradient(135deg, #7dc8ff 0%, #2d6cb3 100%)',
      photo: 'assets/products/sip-track-bottle.svg',
      shortDescription: 'A hydration bottle with time markers, removable infuser, and carry loop.',
      description: 'SipTrack Bottle is a low-explainer product with broad audience appeal. It performs well in habit-building creative and benefits from add-on sales like sleeves, caps, or flavor infusers.',
      highlights: ['Time markers for all-day hydration goals', 'Fruit infuser insert included', 'Accessory upsell potential'],
      metrics: { demand: 72, margin: 76, competition: 57, risk: 80, repeat: 65, social: 63 },
      audience: 'Health-conscious shoppers, office workers, gym bags',
      shippingProfile: 'Durable and practical, with easy accessory expansion.'
    },
    {
      id: 'snap-organizer-set',
      name: 'Snap Organizer Set',
      category: 'workspace',
      price: 31,
      compareAt: 44,
      rating: 4.5,
      reviews: 254,
      badge: 'Bundle winner',
      image: '🗂️',
      imageStyle: 'linear-gradient(135deg, #9a92ff 0%, #4048a8 100%)',
      photo: 'assets/products/snap-organizer-set.svg',
      shortDescription: 'A modular cable, pen, and accessory tray system for tidier desks.',
      description: 'Snap Organizer Set wins on transformation-style visuals and practical gifting. It is easy to bundle, easy to understand, and sits nicely beside other productivity accessories in the same niche.',
      highlights: ['Magnetic modular tray layout', 'Fits cables, pens, adapters, and earbuds', 'Strong gifting and bundle positioning'],
      metrics: { demand: 69, margin: 81, competition: 61, risk: 84, repeat: 41, social: 66 },
      audience: 'Minimalist desk setups, home office buyers, students',
      shippingProfile: 'Compact footprint, low damage risk, bundle-friendly.'
    }
  ];

  const weights = { demand: 0.25, margin: 0.22, competition: 0.16, risk: 0.14, repeat: 0.11, social: 0.12 };

  function scoreProduct(product) {
    const m = product.metrics;
    const score = Math.round(
      m.demand * weights.demand +
      m.margin * weights.margin +
      m.competition * weights.competition +
      m.risk * weights.risk +
      m.repeat * weights.repeat +
      m.social * weights.social
    );
    return score;
  }

  function enrichProduct(product) {
    const opportunityScore = scoreProduct(product);
    const monthlyRevenue = Math.round((product.price * (180 + opportunityScore * 5)) / 10) * 10;
    const grossMargin = Math.round((product.metrics.margin * 0.48 + 18));
    const conversionLift = Math.round((product.metrics.social * 0.06 + product.metrics.demand * 0.04) * 10) / 10;
    return {
      ...product,
      opportunityScore,
      monthlyRevenue,
      grossMargin,
      conversionLift
    };
  }

  const enrichedProducts = products.map(enrichProduct);

  function getCategory(categoryId) {
    return categories.find((category) => category.id === categoryId);
  }

  function getProduct(productId) {
    return enrichedProducts.find((product) => product.id === productId);
  }

  function getTopProducts(limit) {
    return [...enrichedProducts].sort((a, b) => b.opportunityScore - a.opportunityScore).slice(0, limit);
  }

  window.TrendStoreData = {
    brand,
    categories,
    products: enrichedProducts,
    weights,
    getCategory,
    getProduct,
    getTopProducts
  };
})();
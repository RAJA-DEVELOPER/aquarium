/* ============================================================
   AquaVista — Blog post data store
   Each post renders dynamically on blog-details.html via ?id=slug
   ============================================================ */
(function () {
  'use strict';

  var AUTHORS = {
    'Dr. Elena Yeo': {
      role: 'Founder & Marine Biologist',
      img: 'https://images.unsplash.com/photo-1494790108755-2616b612b9cd?w=200&q=80&auto=format&fit=crop&facepad=3',
      bio: 'PhD in Marine Sciences from NUS. 16 years of professional aquarium experience spanning freshwater, planted tanks, and reef systems. Coral Foundation restoration ambassador and IAPLC judge.'
    },
    'Marcus Tan': {
      role: 'Head Aquarist',
      img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&auto=format&fit=crop&facepad=3',
      bio: 'Former public-aquarium curator with a decade of hands-on experience across marine, cichlid, and planted systems. Specialist in species behaviour and system stability.'
    },
    'Priya Sharma': {
      role: 'Plant Specialist',
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80&auto=format&fit=crop&facepad=3',
      bio: 'Dedicated planted-tank aquascaper and IAPLC finalist. Focuses on low-tech and high-tech aquascaping, carpeting plants, and shrimp-friendly ecosystems.'
    },
    'Dr. James Okafor': {
      role: 'Health Specialist',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&auto=format&fit=crop&facepad=3',
      bio: 'Aquatic veterinarian specialising in fish pathology, quarantine protocols, and parasite control across freshwater and marine collections.'
    }
  };

  var POSTS = {
    /* ---------------- FEATURED ---------------- */
    'planted-aquarium': {
      title: 'The Ultimate Guide to Your First Planted Aquarium',
      hero: 'https://images.unsplash.com/photo-1514907283155-ea5f4094c70c?w=1920&q=85&auto=format&fit=crop',
      heroAlt: 'Lush planted aquarium with tropical fish',
      author: 'Dr. Elena Yeo',
      date: 'August 15, 2026',
      readTime: '18 min read',
      views: '12,840 views',
      category: [{ t: 'Planted Tank', v: 'aqua' }, { t: 'Beginner Guide', v: 'coral' }],
      lead: 'A planted aquarium isn’t just a fish tank — it’s a living, breathing ecosystem where light, CO₂, nutrients, and biology interact in perfect harmony. This guide will take you from bare glass to a lush, thriving underwater garden.',
      body:
        '<h2 id="why-planted">1. Why Set Up a Planted Aquarium?</h2>' +
        '<p>Planted aquariums offer something no artificial decoration can match: a constantly evolving, living aesthetic that improves with age. But the benefits go far beyond appearance.</p>' +
        '<p>Live plants absorb ammonia, nitrite, and nitrate — the toxic byproducts of fish waste — creating a genuinely healthier environment. They produce oxygen during the day, reduce algae by competing for nutrients, and provide natural shelter and breeding sites that stress fish genuinely thrive in.</p>' +
        '<img src="https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=1200&q=85&auto=format&fit=crop" alt="Beautiful planted aquarium" loading="lazy" data-zoom>' +
        '<h2 id="choosing-tank">2. Choosing the Right Tank Size</h2>' +
        '<p>Contrary to intuition, beginners often find larger tanks easier to maintain. A 120L tank has more stable water chemistry than a 30L — tiny tanks swing wildly in temperature, pH, and parameters.</p>' +
        '<div class="callout"><strong><i class="fa-solid fa-lightbulb"></i> AquaVista Recommendation:</strong> Start with a minimum 60–90 litre tank for your first planted setup. It gives you room to experiment and forgives early mistakes.</div>' +
        '<h2 id="substrate">3. The Foundation: Choosing Your Substrate</h2>' +
        '<p>Substrate is the single most important decision in planted tank setup. It provides root anchorage, nutrient storage, and influences water chemistry.</p>' +
        '<h3>Aquasoil (Recommended)</h3>' +
        '<p>Brands like ADA Amazonia, Tropica Soil, and UP Aqua are porous clay-based substrates packed with nutrients. They lower pH slightly (ideal for most tropical plants), buffer water naturally, and last 3–5 years before replacement.</p>' +
        '<h3>Inert Substrate with Root Tabs</h3>' +
        '<p>Plain gravel or sand with root fertilizer tablets is a budget option. Less convenient but effective for low-tech setups.</p>' +
        '<blockquote>"The substrate is the soul of your planted tank. Invest here before anywhere else — a great substrate will carry your plants through years of growth." — Marcus Tan, Head Aquarist</blockquote>' +
        '<h2 id="lighting">4. Lighting: The Engine of Plant Growth</h2>' +
        '<p>Plants photosynthesize light into energy. Without adequate PAR (Photosynthetically Active Radiation), even the hardiest plants will slowly melt away. For a planted tank, you need a quality LED unit specifically designed for plant growth — not a generic aquarium light.</p>' +
        '<p><strong>Recommended lighting duration:</strong> 6–8 hours per day. Use a timer to maintain consistency. More than 10 hours per day encourages algae without benefiting plants.</p>' +
        '<img src="https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1200&q=85&auto=format&fit=crop" alt="Premium LED aquarium lighting" loading="lazy" data-zoom>' +
        '<h2 id="co2">5. CO₂ Injection: From Good to Spectacular</h2>' +
        '<p>Carbon dioxide is plant food. While low-tech setups can work without it (using low-light plants), CO₂ injection transforms a decent planted tank into a spectacular one. Plants grow faster, display more vibrant colours, and out-compete algae for resources.</p>' +
        '<div class="callout"><strong><i class="fa-solid fa-microscope"></i> Target CO₂:</strong> Aim for 20–30 mg/L of dissolved CO₂, measured via a drop checker (should turn lime green). Inject during the light period and stop at night via a solenoid timer.</div>' +
        '<h2 id="plants">6. Choosing Your Plants: Easy to Advanced</h2>' +
        '<ul><li><strong>Beginner (no CO₂ needed):</strong> Java Fern, Anubias, Java Moss, Cryptocoryne, Vallisneria</li>' +
        '<li><strong>Intermediate (CO₂ helpful):</strong> Amazon Sword, Rotala, Hygrophila, Ludwigia</li>' +
        '<li><strong>Advanced (CO₂ required):</strong> Hemianthus callitrichoides (HC), Glossostigma, Riccardia moss</li></ul>' +
        '<h2 id="fish">7. Fish Selection for Planted Tanks</h2>' +
        '<p>Not all fish are planted tank-friendly. Goldfish uproot everything. Large cichlids will rearrange your hardscape overnight. The ideal planted tank fish are small, peaceful schooling species that complement — not destroy — your aquascape.</p>' +
        '<p><strong>Top choices:</strong> Cardinal Tetras, Rummy Nose Tetras, Otocinclus, Corydoras, Endlers, Cherry Barbs, Celestial Pearl Danio, and Ember Tetras.</p>'
    },

    /* ---------------- TRENDING ---------------- */
    'emperor-angelfish': {
      title: 'Caring for the Emperor Angelfish',
      hero: 'https://images.unsplash.com/photo-1579967327980-2a4117da0e4a?w=1920&q=85&auto=format&fit=crop',
      heroAlt: 'Emperor Angelfish in a reef tank',
      author: 'Marcus Tan',
      date: 'August 2, 2026',
      readTime: '12 min read',
      views: '9,210 views',
      category: [{ t: 'Marine Fish', v: 'aqua' }, { t: 'Advanced', v: 'coral' }],
      lead: 'The Emperor Angelfish (Pomacanthus imperator) is one of the ocean’s most striking inhabitants — but its adult size, dietary needs, and territorial nature make it a commitment, not an impulse buy.',
      body:
        '<h2 id="overview">1. Species Overview</h2>' +
        '<p>Juvenile Emperors display concentric blue and white rings; adults develop bold yellow and blue horizontal stripes with a dark mask through the eye. They reach up to 40cm in the wild and need a correspondingly large tank.</p>' +
        '<h2 id="tank">2. Tank Requirements</h2>' +
        '<p>Adults require a minimum of 600 litres with ample live rock for grazing and retreat. Strong, mature biological filtration is essential, as angels are sensitive to nitrates.</p>' +
        '<div class="tank-specs-grid">' +
          '<div class="tank-spec-card"><i class="fa-solid fa-water tank-spec-icon"></i><span class="tank-spec-label">Min Tank Size</span><span class="tank-spec-value">600 Litres</span></div>' +
          '<div class="tank-spec-card"><i class="fa-solid fa-triangle-exclamation tank-spec-icon"></i><span class="tank-spec-label">Reef Safe</span><span class="tank-spec-value">With Caution</span></div>' +
          '<div class="tank-spec-card"><i class="fa-solid fa-shield-halved tank-spec-icon"></i><span class="tank-spec-label">Care Level</span><span class="tank-spec-value">Advanced</span></div>' +
          '<div class="tank-spec-card"><i class="fa-solid fa-ruler-horizontal tank-spec-icon"></i><span class="tank-spec-label">Max Length</span><span class="tank-spec-value">38–40 cm</span></div>' +
        '</div>' +
        '<div class="callout"><strong><i class="fa-solid fa-lightbulb"></i> Note:</strong> Emperors will nibble at fleshy LPS corals, zoanthids, and clam mantles. They are best kept in a Fish-Only-With-Live-Rock (FOWLR) system or SPS-dominant tanks.</div>' +
        '<h2 id="diet">3. Diet & Feeding</h2>' +
        '<p>Offer a varied diet of frozen mysis and brine shrimp, spirulina, marine algae sheets, and high-quality sponge-based angelfish preparations. Feed small amounts 2–3 times daily to support their active metabolism.</p>' +
        '<h2 id="compatibility">4. Temperament & Tank Mates</h2>' +
        '<p>Emperors are dominant and territorial toward other large angelfish and similarly shaped fish. Choose robust, peaceful to semi-aggressive tank mates.</p>' +
        '<div class="compatibility-grid">' +
          '<div class="compatibility-card compatible">' +
            '<div class="compatibility-header"><i class="fa-solid fa-circle-check"></i> Ideal Tank Mates</div>' +
            '<ul class="compatibility-list">' +
              '<li><i class="fa-solid fa-check" style="color:var(--aquamarine);"></i> Tangs (Zebrasoma &amp; Acanthurus)</li>' +
              '<li><i class="fa-solid fa-check" style="color:var(--aquamarine);"></i> Large Wrasses &amp; Harlequin Tusk</li>' +
              '<li><i class="fa-solid fa-check" style="color:var(--aquamarine);"></i> Foxface &amp; Rabbitfish</li>' +
              '<li><i class="fa-solid fa-check" style="color:var(--aquamarine);"></i> Clownfish &amp; Hawkfish</li>' +
            '</ul>' +
          '</div>' +
          '<div class="compatibility-card incompatible">' +
            '<div class="compatibility-header"><i class="fa-solid fa-circle-xmark"></i> Incompatible Species</div>' +
            '<ul class="compatibility-list">' +
              '<li><i class="fa-solid fa-xmark" style="color:var(--coral);"></i> Conspecifics (Other Emperor Angels)</li>' +
              '<li><i class="fa-solid fa-xmark" style="color:var(--coral);"></i> Small Nano Fish (May be bullied)</li>' +
              '<li><i class="fa-solid fa-xmark" style="color:var(--coral);"></i> Tridacna Clams (Mantle nipping)</li>' +
              '<li><i class="fa-solid fa-xmark" style="color:var(--coral);"></i> Slow delicate feeders (Seahorses)</li>' +
            '</ul>' +
          '</div>' +
        '</div>'
    },

    'reef-tank-2026': {
      title: 'Building a Thriving Reef Tank in 2026',
      hero: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=1920&q=85&auto=format&fit=crop',
      heroAlt: 'Coral reef tank with live corals',
      author: 'Dr. James Okafor',
      date: 'July 30, 2026',
      readTime: '22 min read',
      views: '15,330 views',
      category: [{ t: 'Reef Systems', v: 'aqua' }, { t: 'Comprehensive', v: 'coral' }],
      lead: 'Modern reef keeping has never been more achievable. With stabilised dosers, intelligent lighting, and better husbandry knowledge, a vibrant coral garden at home is within reach of any committed aquarist.',
      body:
        '<h2 id="planning">1. Planning Your System</h2>' +
        '<p>Decide early between a fish-only, soft coral, or full SPS reef. Your choice drives lighting, flow, and dosing needs. A 200–400 litre all-in-one reef tank is a sensible starting point.</p>' +
        '<h2 id="equipment">2. Core Equipment</h2>' +
        '<ul><li><strong>Lighting:</strong> Programmable LED with adjustable spectrum (e.g. 2-channel or multi-channel).</li>' +
        '<li><strong>Flow:</strong> Wavemakers delivering 10–40× tank volume per hour depending on coral type.</li>' +
        '<li><strong>Filtration:</strong> Protein skimmer, refugium with macroalgae, and mechanical media.</li>' +
        '<li><strong>Stability:</strong> Auto top-off (ATO) and a doser for calcium, alkalinity, magnesium.</li></ul>' +
        '<h2 id="cycling">3. Cycling & Maturation</h2>' +
        '<p>Establish the nitrogen cycle over 4–8 weeks using live rock or bottled bacteria. Test ammonia, nitrite, and nitrate to zero before adding livestock. A mature system resists the swings that crash corals.</p>' +
        '<div class="callout"><strong><i class="fa-solid fa-microscope"></i> Stability first:</strong> Corals care far more about consistent parameters than about hitting a specific number. Chase stability, not extremes.</div>' +
        '<h2 id="livestock">4. Adding Livestock</h2>' +
        '<p>Stock slowly — one small addition every 1–2 weeks. Begin with hardy soft corals and quarantine all fish for 4 weeks before introduction.</p>' +
        '<h2 id="maintenance">5. Routine Maintenance</h2>' +
        '<p>Weekly: 5–10% water change, algae removal, and parameter testing. Monthly: inspect equipment, clean skimmer cup, and calibrate dosers. Consistency is the secret to a thriving reef.</p>'
    },

    'cardinal-tetra-breeding': {
      title: 'How to Successfully Breed Cardinal Tetras',
      hero: 'https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=1920&q=85&auto=format&fit=crop',
      heroAlt: 'Cardinal tetras in a planted tank',
      author: 'Priya Sharma',
      date: 'July 18, 2026',
      readTime: '16 min read',
      views: '7,940 views',
      category: [{ t: 'Breeding', v: 'aqua' }],
      lead: 'Cardinal Tetras (Paracheirodon axelrodi) are among the most popular schooling fish in the hobby — and with soft, acidic water and a little patience, they will breed in your own tank.',
      body:
        '<h2 id="conditioning">1. Conditioning the Pair</h2>' +
        '<p>Select mature, well-coloured adults and condition them on live foods (microworms, newly hatched brine shrimp, daphnia) for two weeks. Peak condition is visible in the rounded belly of the female.</p>' +
        '<h2 id="spawning">2. The Spawning Tank</h2>' +
        '<p>Use a small, dimly lit tank with very soft, acidic water (pH 5.5–6.0, GH &lt; 2). A spawning mop or fine-leaved plant gives a surface to scatter eggs. Remove adults immediately after spawning to protect the eggs.</p>' +
        '<div class="callout"><strong><i class="fa-solid fa-lightbulb"></i> Light sensitivity:</strong> Cardinal eggs and fry are extremely light-sensitive. Keep the spawning tank dark and cover the sides.</div>' +
        '<h2 id="fry">3. Raising the Fry</h2>' +
        '<p>Eggs hatch in ~24 hours; fry become free-swimming after 4–5 days. Feed infusoria, then freshly hatched brine shrimp. Maintain pristine, warm (26–28°C) water and tiny, frequent water changes.</p>'
    },

    'white-spot-ich': {
      title: 'Diagnosing & Treating White Spot (Ich)',
      hero: 'https://images.unsplash.com/photo-1573350926865-cf0d512fd504?w=1920&q=85&auto=format&fit=crop',
      heroAlt: 'Freshwater fish health examination',
      author: 'Dr. Elena Yeo',
      date: 'July 12, 2026',
      readTime: '10 min read',
      views: '18,560 views',
      category: [{ t: 'Fish Health', v: 'coral' }],
      lead: 'White Spot Disease (Ichthyophthirius multifiliis) is the most common parasitic infection in freshwater aquariums. Caught early, it is very treatable — ignored, it is often fatal.',
      body:
        '<h2 id="symptoms">1. Recognising the Symptoms</h2>' +
        '<p>Look for tiny white grains of salt scattered on the body and fins, flashing (rubbing against decor), clamped fins, and rapid gill movement. Isolation of one fish is often the first visible sign.</p>' +
        '<h2 id="lifecycle">2. Understanding the Lifecycle</h2>' +
        '<p>Ich parasites are only vulnerable in their free-swimming stage. They burrow into the fish, encyst, drop off, and multiply in the substrate before re-emerging. Treatment must therefore run long enough to catch each generation.</p>' +
        '<div class="callout"><strong><i class="fa-solid fa-microscope"></i> Key point:</strong> Treat for the full lifecycle — typically 10–14 days — not just until spots disappear.</div>' +
        '<h2 id="treatment">3. Treatment Options</h2>' +
        '<ul><li><strong>Heat method:</strong> Raise temperature gradually to 30°C to speed the parasite lifecycle (use only with tolerant species).</li>' +
        '<li><strong>Medication:</strong> Formalin, malachite green, or aquarium salt per label instructions.</li>' +
        '<li><strong>Invertebrate-safe:</strong> Many ich meds harm shrimp and snails — use a hospital tank.</li></ul>' +
        '<h2 id="prevention">4. Prevention</h2>' +
        '<p>Quarantine every new arrival for 4 weeks, avoid sudden temperature swings, and keep fish unstressed. A healthy immune system is the best defence against outbreaks.</p>'
    },

    /* ---------------- GRID ---------------- */
    'iwagumi-style': {
      title: 'Mastering the Iwagumi Style: Stone Placement & Carpet Plants',
      hero: 'https://plus.unsplash.com/premium_photo-1682091918487-033a8ea72ce7?w=1920&q=85&auto=format&fit=crop',
      heroAlt: 'Iwagumi planted aquascape',
      author: 'Priya Sharma',
      date: 'August 15, 2026',
      readTime: '14 min read',
      views: '8,120 views',
      category: [{ t: 'Planted Tank', v: 'aqua' }, { t: 'Aquascape', v: 'coral' }],
      lead: 'The Iwagumi layout is aquascaping at its most minimalist and disciplined — a composition of stones and a flowing carpet that evokes a misty mountain landscape beneath the water.',
      body:
        '<h2 id="principles">1. The Underlying Principles</h2>' +
        '<p>A true Iwagumi uses an odd number of stones with one dominant "Oyama" stone, arranged along the "rule of thirds." Negative space and balance matter more than the number of elements.</p>' +
        '<h2 id="stones">2. Selecting & Placing Stones</h2>' +
        '<p>Choose inert, aquarium-safe stone (Seiryu, lava, slate) of similar colour and texture. Bury the base of each stone into the substrate so it appears to grow from the ground rather than resting on top.</p>' +
        '<div class="callout"><strong><i class="fa-solid fa-lightbulb"></i> AquaVista tip:</strong> Photograph your layout from the front viewer height before planting — adjust until the eye flows naturally to the main stone.</div>' +
        '<h2 id="carpet">3. Carpet Plants</h2>' +
        '<p>Micranthemum monte carlo, dwarf hairgrass, and Hemianthus callitrichoides form dense foreground carpets under CO₂ and strong light. Plant in small clumps spaced 2–3cm apart and trim frequently to encourage lateral spread.</p>' +
        '<h2 id="maintenance">4. Keeping It Clean</h2>' +
        '<p>Trim the carpet weekly, control algae with consistent CO₂ and limited light, and siphon detritus from the substrate. A mature Iwagumi is maintained, not rebuilt.</p>'
    },

    'sps-coral-care': {
      title: 'SPS Coral Care: Parameters, Lighting & Flow Requirements',
      hero: 'https://images.unsplash.com/photo-1512391806023-e43a4e65899f?w=1920&q=85&auto=format&fit=crop',
      heroAlt: 'Coral reef tank with live corals',
      author: 'Marcus Tan',
      date: 'August 10, 2026',
      readTime: '20 min read',
      views: '11,470 views',
      category: [{ t: 'Marine', v: 'aqua' }, { t: 'SPS Coral', v: 'coral' }],
      lead: 'Small Polyp Stony corals are the pinnacle of reef keeping — brilliant, architectural, and demanding. Master the chemistry and they reward you with explosive growth and colour.',
      body:
        '<h2 id="parameters">1. Water Parameters</h2>' +
        '<p>Target stable alkalinity (7–9 dKH), calcium (400–450 ppm), magnesium (1250–1350 ppm), and low nitrate/phosphate. Stability beats chasing exact numbers — automate dosing where possible.</p>' +
        '<h2 id="lighting">2. Lighting</h2>' +
        '<p>SPS thrive under intense, full-spectrum LED at 250–350 PAR at the coral. Acclimate new colonies slowly over weeks to avoid bleaching. Use a natural dawn-to-dusk ramp.</p>' +
        '<div class="callout"><strong><i class="fa-solid fa-microscope"></i> Acclimation:</strong> New SPS should start in lower light and flow, then be moved gradually upward as they colour and grow.</div>' +
        '<h2 id="flow">3. Water Flow</h2>' +
        '<p>Strong, turbulent flow (20–40× turnover) keeps coral surfaces free of detritus and delivers nutrients. Aim for random, not laminar, currents using oppositional wavemakers.</p>' +
        '<h2 id="feeding">4. Feeding & Stability</h2>' +
        '<p>While photosynthetic, SPS benefit from amino-acid and phytoplankton supplements. Above all, protect stability: temperature swings and parameter drift are the leading causes of STN/RTN tissue loss.</p>'
    },

    'discus-care': {
      title: 'Discus Fish: The King of the Aquarium — Complete Care Guide',
      hero: 'https://images.unsplash.com/photo-1722590216145-e3c6c4d82b58?w=1920&q=85&auto=format&fit=crop',
      heroAlt: 'Discus fish in planted tank',
      author: 'Dr. Elena Yeo',
      date: 'August 5, 2026',
      readTime: '16 min read',
      views: '13,880 views',
      category: [{ t: 'Freshwater', v: 'aqua' }],
      lead: 'Discus are renowned for their stunning colours and demanding water requirements. Get the environment right and these majestic cichlids become the centrepiece of any aquarium.',
      body:
        '<h2 id="water">1. Water Quality & Parameters</h2>' +
        '<p>Discus demand warm (28–30°C), soft, acidic water with undetectable ammonia and nitrite. Frequent small water changes (daily or every other day) keep them at their peak health and coloration.</p>' +
        '<div class="tank-specs-grid">' +
          '<div class="tank-spec-card"><i class="fa-solid fa-temperature-arrow-up tank-spec-icon"></i><span class="tank-spec-label">Ideal Temp</span><span class="tank-spec-value">28–30°C</span></div>' +
          '<div class="tank-spec-card"><i class="fa-solid fa-droplet tank-spec-icon"></i><span class="tank-spec-label">pH Range</span><span class="tank-spec-value">6.0–6.8</span></div>' +
          '<div class="tank-spec-card"><i class="fa-solid fa-water tank-spec-icon"></i><span class="tank-spec-label">Hardness (GH)</span><span class="tank-spec-value">1–4 dGH</span></div>' +
          '<div class="tank-spec-card"><i class="fa-solid fa-users tank-spec-icon"></i><span class="tank-spec-label">Group Size</span><span class="tank-spec-value">6+ Fish</span></div>' +
        '</div>' +
        '<h2 id="tank">2. Tank Setup & Tank Mates</h2>' +
        '<p>A tall, spacious aquarium of 200+ litres is recommended for a small school of Discus. Provide gentle filtration, soft ambient lighting, and warm water-tolerant companions.</p>' +
        '<div class="compatibility-grid">' +
          '<div class="compatibility-card compatible">' +
            '<div class="compatibility-header"><i class="fa-solid fa-circle-check"></i> Ideal Companions</div>' +
            '<ul class="compatibility-list">' +
              '<li><i class="fa-solid fa-check" style="color:var(--aquamarine);"></i> Cardinal &amp; Rummy-Nose Tetras</li>' +
              '<li><i class="fa-solid fa-check" style="color:var(--aquamarine);"></i> Sterbai Corydoras (Warmth tolerant)</li>' +
              '<li><i class="fa-solid fa-check" style="color:var(--aquamarine);"></i> German Blue Rams &amp; Apistogramma</li>' +
              '<li><i class="fa-solid fa-check" style="color:var(--aquamarine);"></i> Bristlenose Plecos (Bushynose)</li>' +
            '</ul>' +
          '</div>' +
          '<div class="compatibility-card incompatible">' +
            '<div class="compatibility-header"><i class="fa-solid fa-circle-xmark"></i> Avoid / Incompatible</div>' +
            '<ul class="compatibility-list">' +
              '<li><i class="fa-solid fa-xmark" style="color:var(--coral);"></i> Hyperactive Feeders (Danios/Barbs)</li>' +
              '<li><i class="fa-solid fa-xmark" style="color:var(--coral);"></i> Aggressive Cichlids (Oscars/Jack Dempsey)</li>' +
              '<li><i class="fa-solid fa-xmark" style="color:var(--coral);"></i> Coldwater species (Goldfish/White Clouds)</li>' +
              '<li><i class="fa-solid fa-xmark" style="color:var(--coral);"></i> Fin-nippers (Serpae/Tiger Barbs)</li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="callout"><strong><i class="fa-solid fa-lightbulb"></i> AquaVista Tip:</strong> Always keep Discus in schools of 6 or more to prevent individual bullying and establish a natural social hierarchy.</div>' +
        '<h2 id="diet">3. Diet & Nutrition</h2>' +
        '<p>Feed high-protein discus granules, frozen bloodworms, spirulina flakes, and specialized beefheart blends. Feed 2–3 times daily in small amounts that are consumed in 3 minutes.</p>'
    },

    'quarantine-tank': {
      title: 'Quarantine Tank Setup: Protecting Your Existing Fish',
      hero: 'https://images.unsplash.com/photo-1533713692156-f70938dc0d54?w=1920&q=85&auto=format&fit=crop',
      heroAlt: 'Fish disease treatment and quarantine',
      author: 'Dr. James Okafor',
      date: 'July 28, 2026',
      readTime: '11 min read',
      views: '10,260 views',
      category: [{ t: 'Fish Health', v: 'coral' }],
      lead: 'A quarantine tank is the single most important tool to prevent disease outbreaks. Set one up properly and use it every time you add new fish.',
      body:
        '<h2 id="why">1. Why Quarantine?</h2>' +
        '<p>New fish can carry parasites, bacteria, and internal worms invisible at purchase. A quarantine period protects your established display tank from devastation and lets you treat individuals cheaply.</p>' +
        '<h2 id="setup">2. The Setup</h2>' +
        '<p>A simple 40–80 litre tank with sponge filter, heater, and PVC hiding spots is enough. Bare-bottom makes cleaning easy. Keep it cycling with mature media from your main tank.</p>' +
        '<div class="callout"><strong><i class="fa-solid fa-microscope"></i> Duration:</strong> A 4-week quarantine covers the lifecycle of most common parasites, including ich.</div>' +
        '<h2 id="protocol">3. Observation Protocol</h2>' +
        '<p>Watch daily for flashing, spots, bloating, or appetite loss. Treat proactively only if symptoms appear. A prophylactic salt or praziquantel bath can preempt internal worms.</p>'
    },

    'corydoras-breeding': {
      title: 'Breeding Corydoras Catfish: A Step-by-Step Guide',
      hero: 'https://images.unsplash.com/photo-1516683037151-9a17603a8dc7?w=1920&q=85&auto=format&fit=crop',
      heroAlt: 'Breeding nano fish aquarium',
      author: 'Priya Sharma',
      date: 'July 20, 2026',
      readTime: '18 min read',
      views: '6,310 views',
      category: [{ t: 'Breeding', v: 'aqua' }],
      lead: 'Corydoras are among the most rewarding fish to breed at home. With the right conditioning, a cool-water trigger, and spawning mops, success is very achievable.',
      body:
        '<h2 id="species">1. Choosing a Species</h2>' +
        '<p>Beginner-friendly choices include Corydoras paleatus, aeneus, and panda. Keep a small group with slightly more males than females to encourage spawning activity.</p>' +
        '<h2 id="conditioning">2. Conditioning</h2>' +
        '<p>Feed live and frozen foods heavily for two weeks. Pristine, well-oxygenated water and stable warmth prepare the fish for spawning.</p>' +
        '<div class="callout"><strong><i class="fa-solid fa-lightbulb"></i> Trigger:</strong> A large, cool water change (2–3°C drop) often sparks a spawning frenzy the next morning.</div>' +
        '<h2 id="spawn">3. Spawning & Eggs</h2>' +
        '<p>Females lay sticky eggs on glass, plants, or spawning mops. Remove eggs to a separate container with an air stone and a fungicide (methylene blue) to protect them.</p>' +
        '<h2 id="fry">4. Raising Fry</h2>' +
        '<p>Eggs hatch in 3–5 days; feed microworms and infusoria, then crushed flakes. Keep water clean with gentle flow and small, frequent changes.</p>'
    },

    'mandarin-dragonet': {
      title: 'Mandarin Dragonet: The Most Beautiful — And Demanding — Reef Fish',
      hero: 'https://images.unsplash.com/photo-1513040260736-63dd0617fb66?w=1920&q=85&auto=format&fit=crop',
      heroAlt: 'Mandarin dragonet reef fish',
      author: 'Marcus Tan',
      date: 'July 15, 2026',
      readTime: '15 min read',
      views: '9,870 views',
      category: [{ t: 'Marine', v: 'aqua' }, { t: 'Advanced', v: 'coral' }],
      lead: 'The Mandarin Dragonet is arguably the most stunning marine fish you can keep — and one of the trickiest. Success comes down to one thing: a reliable live food supply.',
      body:
        '<h2 id="diet">1. The Diet Challenge</h2>' +
        '<p>Mandarins eat constantly and prefer live copepods and amphipods. A new tank rarely has enough. The single biggest cause of loss is starvation disguised as "picky eating".</p>' +
        '<h2 id="copepods">2. Building a Copepod Culture</h2>' +
        '<p>Establish a refugium with macroalgae to breed copepods continuously. Seed the display well before adding the fish, and aim for a mature, pod-rich system of 200L+.</p>' +
        '<div class="callout"><strong><i class="fa-solid fa-microscope"></i> Weaning:</strong> Some individuals learn to take frozen mysis and pellets — train gradually with a feeding station, but never assume they will.</div>' +
        '<h2 id="tank">3. Tank & Tank Mates</h2>' +
        '<p>Peaceful, mature reef tanks with plenty of established live rock are ideal for Mandarin Dragonets. Because they are slow, deliberate bottom grazers, their environment and tank mates must be carefully selected to avoid food competition and stress.</p>' +
        '<div class="tank-specs-grid">' +
          '<div class="tank-spec-card"><i class="fa-solid fa-water tank-spec-icon"></i><span class="tank-spec-label">Min Tank Size</span><span class="tank-spec-value">200+ Litres</span></div>' +
          '<div class="tank-spec-card"><i class="fa-solid fa-gem tank-spec-icon"></i><span class="tank-spec-label">Reef Safe</span><span class="tank-spec-value">100% Safe</span></div>' +
          '<div class="tank-spec-card"><i class="fa-solid fa-heart tank-spec-icon"></i><span class="tank-spec-label">Temperament</span><span class="tank-spec-value">Peaceful</span></div>' +
          '<div class="tank-spec-card"><i class="fa-solid fa-temperature-half tank-spec-icon"></i><span class="tank-spec-label">Temperature</span><span class="tank-spec-value">24–26°C</span></div>' +
        '</div>' +
        '<div class="compatibility-grid">' +
          '<div class="compatibility-card compatible">' +
            '<div class="compatibility-header"><i class="fa-solid fa-circle-check"></i> Ideal Tank Mates</div>' +
            '<ul class="compatibility-list">' +
              '<li><i class="fa-solid fa-check" style="color:var(--aquamarine);"></i> Clowns &amp; Cardinalfish</li>' +
              '<li><i class="fa-solid fa-check" style="color:var(--aquamarine);"></i> Firefish &amp; Royal Gramma</li>' +
              '<li><i class="fa-solid fa-check" style="color:var(--aquamarine);"></i> Cleaner Shrimp &amp; Snails</li>' +
              '<li><i class="fa-solid fa-check" style="color:var(--aquamarine);"></i> All Soft &amp; Stony Corals</li>' +
            '</ul>' +
          '</div>' +
          '<div class="compatibility-card incompatible">' +
            '<div class="compatibility-header"><i class="fa-solid fa-circle-xmark"></i> Avoid / Incompatible</div>' +
            '<ul class="compatibility-list">' +
              '<li><i class="fa-solid fa-xmark" style="color:var(--coral);"></i> Sixline Wrasses (Food Competitors)</li>' +
              '<li><i class="fa-solid fa-xmark" style="color:var(--coral);"></i> Dottybacks &amp; Damsels (Aggressive)</li>' +
              '<li><i class="fa-solid fa-xmark" style="color:var(--coral);"></i> Other Dragonets (Territorial Males)</li>' +
              '<li><i class="fa-solid fa-xmark" style="color:var(--coral);"></i> Large Predatory Triggers &amp; Pufferfish</li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<p>Always ensure your system has been running with mature live rock for at least 6–9 months before introducing a Mandarin Dragonet. Their peaceful demeanor makes them a crown jewel of any gentle reef community.</p>'
    },

    /* ---------------- GUIDES ---------------- */
    'water-chemistry': {
      title: 'Aquarium Water Chemistry',
      hero: 'https://images.unsplash.com/photo-1667679815544-b35d58ab5545?w=1920&q=85&auto=format&fit=crop',
      heroAlt: 'Aquarium water testing and chemistry',
      author: 'Dr. James Okafor',
      date: 'July 8, 2026',
      readTime: '13 min read',
      views: '14,020 views',
      category: [{ t: 'In-Depth Guide', v: 'aqua' }],
      lead: 'Master pH, ammonia, nitrite, nitrate, hardness, and salinity. Know your numbers, and you keep your fish thriving instead of merely surviving.',
      body:
        '<h2 id="cycle">1. The Nitrogen Cycle</h2>' +
        '<p>Beneficial bacteria convert toxic ammonia → nitrite → nitrate. A cycled tank reads ammonia 0, nitrite 0, and manageable nitrate. This is the foundation of all aquarium health.</p>' +
        '<h2 id="ph">2. pH & Hardness</h2>' +
        '<p>pH measures acidity; KH (carbonate hardness) buffers it; GH measures mineral content. Most tropical fish tolerate a stable pH over a "perfect" one. Stability wins.</p>' +
        '<div class="callout"><strong><i class="fa-solid fa-microscope"></i> Test routinely:</strong> A liquid test kit is far more reliable than paper strips for ammonia, nitrite, and nitrate.</div>' +
        '<h2 id="salinity">3. Salinity (Marine)</h2>' +
        '<p>Reef tanks target 1.024–1.026 specific gravity. Use a calibrated refractometer, not a swing-arm hydrometer, for accuracy. Top off only with RO/DI water.</p>'
    },

    'co2-planted-tanks': {
      title: 'CO₂ & Planted Tanks',
      hero: 'https://plus.unsplash.com/premium_photo-1765174942796-0d4a7e0fc4ba?w=1920&q=85&auto=format&fit=crop',
      heroAlt: 'Planted aquarium with CO2 injection',
      author: 'Priya Sharma',
      date: 'July 3, 2026',
      readTime: '12 min read',
      views: '10,760 views',
      category: [{ t: 'In-Depth Guide', v: 'aqua' }, { t: 'Planted', v: 'coral' }],
      lead: 'Everything about pressurised CO₂, DIY yeast systems, drop checkers, and optimising plant growth — the difference between a decent tank and a spectacular one.',
      body:
        '<h2 id="systems">1. CO₂ Systems</h2>' +
        '<p>Pressurised cylinders with a regulator and solenoid are the gold standard. DIY yeast bottles are a budget start but deliver inconsistent output. Match the system to your tank size.</p>' +
        '<h2 id="diffusion">2. Diffusion & Distribution</h2>' +
        '<p>Use an inline diffuser or reactor to dissolve CO₂ efficiently. Strong flow spreads it through the water column so every leaf receives carbon.</p>' +
        '<div class="callout"><strong><i class="fa-solid fa-lightbulb"></i> Drop checker:</strong> A lime-green drop checker means ~30 mg/L CO₂ — the sweet spot for most plants.</div>' +
        '<h2 id="sync">3. Syncing Light & CO₂</h2>' +
        '<p>Start CO₂ one hour before lights and stop one hour before lights off. This prevents dangerous pH swings overnight and maximises daytime photosynthesis.</p>'
    },

    'freshwater-shrimp': {
      title: 'Freshwater Shrimp Keeping',
      hero: 'https://images.unsplash.com/photo-1533713692156-e3c6c4d82b58?w=1920&q=85&auto=format&fit=crop',
      heroAlt: 'Freshwater shrimp aquarium',
      author: 'Priya Sharma',
      date: 'June 26, 2026',
      readTime: '11 min read',
      views: '8,640 views',
      category: [{ t: 'In-Depth Guide', v: 'aqua' }],
      lead: 'Crystal Red, Neocaridina, and Sulawesi shrimp — water parameters, tank mates, breeding, and moulting. A peaceful, colourful addition to any planted tank.',
      body:
        '<h2 id="species">1. Choosing Species</h2>' +
        '<p>Neocaridina (cherry shrimp) are hardy and ideal for beginners; Caridina (Crystal Red) need softer, more stable water. Match the species to your tap parameters.</p>' +
        '<h2 id="params">2. Water Parameters</h2>' +
        '<p>Most dwarf shrimp want stable, dechlorinated water with gentle filtration. Sponge filters prevent fry from being sucked in. Avoid copper — it is toxic to shrimp.</p>' +
        '<div class="callout"><strong><i class="fa-solid fa-lightbulb"></i> Moulting:</strong> Shrimp shed regularly; a discarded molt is normal. Ensure calcium-rich food to support healthy shells.</div>' +
        '<h2 id="breeding">3. Breeding & Tank Mates</h2>' +
        '<p>Berried females carry eggs for weeks. Keep shrimp-only or with peaceful nano fish that won’t prey on fry. Dense moss offers vital cover for juveniles.</p>'
    }
  };

  window.BLOG_POSTS = POSTS;
  window.BLOG_AUTHORS = AUTHORS;
})();

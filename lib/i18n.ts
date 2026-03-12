import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      brand: "BIOLUMA",
      projects: "Resources",
      capabilities: "About",
      hero_title: "Biology Interactive",
      hero_sub: "Educational demonstration of cellular structures and systems",
      cta_start: "Explore Model",
      cta_metamorphosis: "Metamorphosis",
      cta_demo: "View Gallery",
      est: "EDUCATIONAL RESOURCE / BIO-LAB",
      initiate: "Launch Simulation",

      nav_back_home: "Back to Home",
      landing_featured_resources: "FEATURED RESOURCES",
      landing_card_model_title: "Cellular Dynamics",
      landing_card_model_desc:
        "Interactive eukaryote model with real-time organelle data",
      landing_card_micro_city_title: "Micro-City Monitor",
      landing_card_micro_city_desc:
        "Isometric microbiome city view with live defense/threat UI",
      landing_card_metamorphosis_title: "Metamorphosis",
      landing_card_metamorphosis_desc:
        "Interactive study + mini game: arrange the life-cycle sequence",
      landing_card_architecture_title: "Bio Lab Atlas",
      landing_card_architecture_desc:
        "Visual map of systems, modules, and data flows across the platform",

      // Biology Model
      bm_observation_paradigm: "OBSERVATION PARADIGM",
      bm_sub_cellular: "Sub-cellular Geometric Focus",
      bm_spectrum_mapping: "SPECTRUM MAPPING",
      bm_organelle_index: "ORGANELLE INDEX",
      bm_magnification_scale: "MAGNIFICATION SCALE",
      bm_zoom_factor_label: "10,000X ZOOM FACTOR",
      bm_zoom_factor: "ZOOM FACTOR",
      bm_magnification: "MAGNIFICATION",
      bm_render_mode: "RENDER MODE",
      bm_mode_additive: "ADDITIVE",
      bm_mode_thermal: "THERMAL",
      bm_mode_wireframe: "WIREFRAME",
      bm_focus_depth: "FOCUS DEPTH",
      bm_cell_vitals: "CELL VITALS",
      bm_export_svg: "EXPORT SVG",
      bm_reset_view: "RESET VIEW",
      bm_data_source: "DATA: SIEMENS NANO-SCAN // V.4.2",
      bm_render_mode_active: "RENDER MODE: {{mode}} ACTIVE",
      bm_export_initiated: "EXPORT INITIATED: COMPOSITING SVG...",
      bm_view_reset: "VIEW RESET: COORDINATES RE-ALIGNED",
      bm_classification: "CLASSIFICATION",
      bm_size_range: "SIZE RANGE",
      bm_membrane: "MEMBRANE",
      bm_copies_cell: "COPIES / CELL",
      bm_rendering_complete: "RENDERING COMPLETE",
      bm_coordinates: "COORDINATES",
      bm_atp_output: "ATP OUTPUT",
      bm_ph_level: "PH LEVEL",
      bm_none: "None",
      bm_variable: "Variable",
      bm_continuous: "Continuous",
      bm_one_per_cell: "1 per cell",
      bm_magenta_label: "GENETIC CORE",
      bm_cyan_label: "METABOLIC UNITS",
      bm_green_label: "DIGESTIVE VECTORS",
      bm_white_label: "RIBOSOMAL STATIONS",
      bm_label_nucleoid: "NUCLEOID",
      bm_label_nucleoid_seq: "SEQ. GEN-001",

      bm_mobile_not_supported_title: "MOBILE VIEW NOT SUPPORTED",
      bm_mobile_not_supported_desc:
        "The biological simulation requires a high-resolution display and precise pointer interaction. Please visit us on a desktop device for the full experience.",

      bm_organelle_nucleus_name: "NUCLEOID",
      bm_organelle_nucleus_sub: "SEQ. 01 // GENOME REGION",
      bm_organelle_nucleus_class: "Non-membrane genetic region",
      bm_organelle_nucleus_func: "Storage and replication of DNA",
      bm_organelle_nucleus_desc:
        "A dense region of DNA in bacteria (no nuclear membrane). Contains the main chromosome and coordinates replication and gene expression.",

      bm_organelle_mito_name: "MITOCHONDRIA",
      bm_organelle_mito_sub: "SEQ. 02 // ATP SYNTHESIS",
      bm_organelle_mito_class: "Double-membrane metabolic unit",
      bm_organelle_mito_func: "Energy production via oxidative phosphorylation",
      bm_organelle_mito_desc:
        "The 'powerhouse' of the cell. Generates adenosine triphosphate (ATP) by utilizing the electrochemical gradient across its inner membrane.",

      bm_organelle_lysosome_name: "LYSOSOME",
      bm_organelle_lysosome_sub: "SEQ. 03 // WASTE MGMT",
      bm_organelle_lysosome_class: "Spherical acidic organelle",
      bm_organelle_lysosome_func: "Digestion of macromolecules and debris",
      bm_organelle_lysosome_desc:
        "Contains hydrolytic enzymes. Breaks down cellular waste, damaged organelles, and foreign substances via controlled intracellular digestion.",

      bm_organelle_nucleolus_name: "NUCLEOLUS",
      bm_organelle_nucleolus_sub: "SEQ. 04 // RIBOSOMAL BIOGENESIS",
      bm_organelle_nucleolus_class: "Dense non-membrane region",
      bm_organelle_nucleolus_func: "rRNA synthesis and ribosome assembly",
      bm_organelle_nucleolus_desc:
        "The site of intense transcriptional activity. Where ribosomal RNA is produced and combined with proteins to form ribosomal subunits.",

      bm_organelle_membrane_name: "PLASMA MEMBRANE",
      bm_organelle_membrane_sub: "SEQ. 05 // BARRIER CONTROL",
      bm_organelle_membrane_class: "Phospholipid bilayer",
      bm_organelle_membrane_func: "Semi-permeable boundary and signaling",
      bm_organelle_membrane_desc:
        "Protects the cell's integrity. Regulates the transport of molecules in and out and facilitates communication with the external environment.",

      bm_organelle_er_name: "RETICULUM",
      bm_organelle_er_sub: "SEQ. 06 // PROTEIN TRANSPORT",
      bm_organelle_er_class: "Folded membrane network",
      bm_organelle_er_func: "Synthesis of proteins and lipids",
      bm_organelle_er_desc:
        "A sprawling network of tubules and sacs. Rough ER (with ribosomes) synthesizes proteins, while Smooth ER focuses on lipid metabolism and detoxification.",

      // Micro City
      mc_defense_active: "ACTIVE",
      mc_defense_weak: "WEAK",
      mc_threat: "THREAT",
      mc_system_hud: "SYSTEM HUD",
      mc_integrity: "Integrity",
      mc_defense: "Defense",
      mc_score: "Score",
      mc_credits: "Credits",
      mc_streak: "Streak",
      mc_resolved: "Resolved",
      mc_missed: "Missed",
      mc_start: "START",
      mc_pause: "PAUSE",
      mc_resume: "RESUME",
      mc_restart: "RESTART",
      mc_next: "NEXT",
      mc_mission: "MISSION",
      mc_status: "STATUS",
      mc_complete: "COMPLETE",
      mc_in_progress: "IN PROGRESS",
      mc_operator_message: "OPERATOR MESSAGE",
      mc_ok: "OK",
      mc_legend_macrophage: "Macrophage",
      mc_legend_flora: "Flora (Benign)",
      mc_legend_pathogen: "Pathogen",
      mc_online: "ONLINE",
      mc_idle: "IDLE",

      // Metamorphosis
      meta_hdr_egg: "EGG STAGE",
      meta_hdr_larva: "LARVA STAGE",
      meta_hdr_pupa: "PUPA STAGE",
      meta_hdr_adult: "ADULT STAGE",
      meta_stage_egg_name: "STAGE 01: THE EGG",
      meta_stage_larva_name: "STAGE 02: THE LARVA",
      meta_stage_pupa_name: "STAGE 03: THE PUPA",
      meta_stage_adult_name: "STAGE 04: THE ADULT",
      meta_stage_egg_meta: "NUCLEATION PHASE // OVR-RIDE",
      meta_stage_larva_meta: "GROWTH PHASE // CONSUMPTION",
      meta_stage_pupa_meta: "TRANSFORMATION PHASE // RE-CODE",
      meta_stage_adult_meta: "IMAGO PHASE // TERMINAL",
      meta_egg_p1:
        "Small, oval, or round, butterfly eggs are usually laid on a leaf. They contain the developing embryo.",
      meta_larva_p1:
        "The larva (caterpillar) hatches and begins feeding on the host plant, growing rapidly.",
      meta_pupa_p1:
        "Within the chrysalis, the larval tissues dissolve and reorganize into the adult structure.",
      meta_adult_p1:
        "The butterfly emerges, dries its wings, and prepares for its final stage: reproduction.",
      meta_observation: "OBSERVATION",
      meta_egg_obs: "Hard outer shell with micropyle.",
      meta_larva_obs: "High metabolic rate, multiple instars.",
      meta_pupa_obs: "Internal tissue liquification.",
      meta_adult_obs: "Complex wing patterns, sensory feed.",

      meta_fact_egg_1_label: "⚡ DURATION",
      meta_fact_egg_1_text:
        "Eggs hatch in just 3–7 days depending on temperature and species.",
      meta_fact_egg_2_label: "🔬 MICRO-DETAIL",
      meta_fact_egg_2_text:
        "Egg surfaces have microscopic ridges (chorion) that allow gas exchange for the embryo.",
      meta_fact_egg_3_label: "🌿 HOST PLANT",
      meta_fact_egg_3_text:
        "Females chemically analyse leaves with their feet before laying to ensure suitable larval nutrition.",

      meta_fact_larva_1_label: "⚡ GROWTH RATE",
      meta_fact_larva_1_text:
        "A caterpillar can increase its body mass by up to 100× in just a few weeks.",
      meta_fact_larva_2_label: "🦟 PREDATORS",
      meta_fact_larva_2_text:
        "Over 90% of butterfly eggs and larvae are eaten before reaching the pupal stage.",
      meta_fact_larva_3_label: "🧬 MOLTING",
      meta_fact_larva_3_text:
        "Molting occurs 4–5 times. Each phase is an 'instar'—briefly vulnerable with a soft new skin.",

      meta_fact_pupa_1_label: "⚡ DURATION",
      meta_fact_pupa_1_text:
        "The pupal stage lasts 10–14 days in summer, but some species overwinter in chrysalis for months.",
      meta_fact_pupa_2_label: "🔬 INSIDE",
      meta_fact_pupa_2_text:
        "The caterpillar body dissolves into a liquid—only imaginal disc cells survive to build the adult.",
      meta_fact_pupa_3_label: "🛡 DEFENCE",
      meta_fact_pupa_3_text:
        "Some chrysalises vibrate and click to repel predators; others mimic leaves, bark, or droppings.",

      meta_fact_adult_1_label: "⚡ LIFESPAN",
      meta_fact_adult_1_text:
        "Most adult butterflies live 2–4 weeks. Monarchs can live up to 8 months to complete migration.",
      meta_fact_adult_2_label: "🌍 MIGRATION",
      meta_fact_adult_2_text:
        "Monarchs migrate up to 4,500 km, navigating with a time-compensated sun compass.",
      meta_fact_adult_3_label: "👁 VISION",
      meta_fact_adult_3_text:
        "Butterflies see ultraviolet light, revealing hidden wing patterns used for communication and mate selection.",

      meta_splash_sub: "Interactive Nature Study",
      meta_begin: "BEGIN STUDY",
      meta_test_knowledge: "TEST KNOWLEDGE",
      meta_arrange: "ARRANGE THE SEQUENCE",
      meta_study_of_nature: "A STUDY OF NATURE",
      meta_collapse: "Collapse Stage",
      meta_close: "Close Assembly",
      meta_try_again: "↺ TRY AGAIN",
      meta_sequence_verified: "✦ SEQUENCE VERIFIED — METAMORPHOSIS COMPLETE ✦",
      meta_correct_try_again: "{{correct}}/4 CORRECT — TRY AGAIN",
      meta_stages_explored: "STAGES EXPLORED",
      meta_did_you_know: "DID YOU KNOW",
      meta_sfx_on: "SFX ON",
      meta_sfx_off: "SFX OFF",

      meta_ticker_1:
        "A butterfly can travel up to 3,000 miles during migration",
      meta_ticker_2:
        "The monarch butterfly uses Earth's magnetic field to navigate",
      meta_ticker_3: "Some chrysalises can produce sounds to deter predators",
      meta_ticker_4:
        "A caterpillar increases its body mass by 1,000× before pupating",
      meta_ticker_5: "Butterflies taste with their feet via chemoreceptors",
      meta_ticker_6:
        "The blue morpho wing colour is structural, not pigment-based",
      meta_ticker_7:
        "Metamorphosis can take as little as 10 days in warm climates",

      meta_tt_egg: "Click to explore Stage 01: The Egg",
      meta_tt_larva: "Click to explore Stage 02: The Caterpillar",
      meta_tt_pupa: "Click to explore Stage 03: The Chrysalis",
      meta_tt_adult: "Click to explore Stage 04: The Butterfly",
      meta_item_chrysalis: "CHRYSALIS",
      meta_item_egg: "THE EGG",
      meta_item_butterfly: "BUTTERFLY",
      meta_item_caterpillar: "CATERPILLAR",
    },
  },
  uk: {
    translation: {
      brand: "БІОЛУМА",
      projects: "Ресурси",
      capabilities: "Про нас",
      hero_title: "Інтерактивна Біологія",
      hero_sub: "Пізнавальний ресурс та демонстрация клітинних структур",
      cta_start: "Дослідити модель",
      cta_metamorphosis: "Метаморфоза",
      cta_demo: "Переглянути галерею",
      est: "ОСВІТНІЙ РЕСУРС / БІО-ЛАБОРАТОРІЯ",
      initiate: "Запустити симуляцію",

      nav_back_home: "Назад на головну",
      landing_featured_resources: "ОБРАНІ РЕСУРСИ",
      landing_card_model_title: "Клітинна Динаміка",
      landing_card_model_desc:
        "Інтерактивна модель еукаріотичної клітини з даними органел у реальному часі",
      landing_card_micro_city_title: "Мікро-Місто Монітор",
      landing_card_micro_city_desc:
        "Ізометричний вигляд мікробіому з живим інтерфейсом захисту/загроз",
      landing_card_metamorphosis_title: "Метаморфоза",
      landing_card_metamorphosis_desc:
        "Інтерактивне дослідження + міні-гра: склади послідовність циклу життя",
      landing_card_architecture_title: "Атлас БіоЛабу",
      landing_card_architecture_desc:
        "Візуальна мапа систем, модулів і потоків даних платформи",

      // Biology Model
      bm_observation_paradigm: "ПАРАДИГМА СПОСТЕРЕЖЕННЯ",
      bm_sub_cellular: "Субклітинний геометричний фокус",
      bm_spectrum_mapping: "СПЕКТРАЛЬНЕ КАРТУВАННЯ",
      bm_organelle_index: "ІНДЕКС ОРГАНЕЛ",
      bm_magnification_scale: "МАСШТАБ ЗБІЛЬШЕННЯ",
      bm_zoom_factor_label: "МАСШТАБ 10,000X",
      bm_zoom_factor: "МАСШТАБ",
      bm_magnification: "ЗБІЛЬШЕННЯ",
      bm_render_mode: "РЕЖИМ РЕНДЕРУ",
      bm_mode_additive: "АДИТИВНИЙ",
      bm_mode_thermal: "ТЕПЛОВИЙ",
      bm_mode_wireframe: "КАРКАСНИЙ",
      bm_focus_depth: "ГЛИБИНА ФОКУСУ",
      bm_cell_vitals: "СЕРЦЕБИТТЯ КЛІТИНИ",
      bm_export_svg: "ЕКСПОРТ SVG",
      bm_reset_view: "СКИДАННЯ ВИГЛЯДУ",
      bm_data_source: "ДАНІ: SIEMENS NANO-SCAN // V.4.2",
      bm_render_mode_active: "РЕЖИМ: {{mode}} АКТИВНИЙ",
      bm_export_initiated: "ЕКСПОРТ ПОЧАТО: ФОРМУВАННЯ SVG...",
      bm_view_reset: "ВИГЛЯД СКИНУТО: КООРДИНАТИ ВИРІВНЯНО",
      bm_classification: "КЛАСИФІКАЦІЯ",
      bm_size_range: "РОЗМІРНИЙ ДІАПАЗОН",
      bm_membrane: "МЕМБРАНА",
      bm_copies_cell: "КОПІЙ / КЛІТИНУ",
      bm_rendering_complete: "РЕНДЕРИНГ ЗАВЕРШЕНО",
      bm_coordinates: "КООРДИНАТИ",
      bm_atp_output: "ВИХІД АТФ",
      bm_ph_level: "РІВЕНЬ PH",
      bm_none: "Відсутня",
      bm_variable: "Варіативно",
      bm_continuous: "Безперервно",
      bm_one_per_cell: "1 на клітину",
      bm_magenta_label: "ГЕНЕТИЧНЕ ЯДРО",
      bm_cyan_label: "МЕТАБОЛІЧНІ ОДИНИЦІ",
      bm_green_label: "ТРАВНІ ВЕКТОРИ",
      bm_white_label: "РИБОСОМАЛЬНІ СТАНЦІЇ",
      bm_label_nucleoid: "НУКЛЕОЇД",
      bm_label_nucleoid_seq: "ПОСЛ. GEN-001",

      bm_mobile_not_supported_title: "МОБІЛЬНИЙ ВИГЛЯД НЕ ПІДТРИМУЄТЬСЯ",
      bm_mobile_not_supported_desc:
        "Біологічна симуляція потребує дисплея з високою роздільною здатністю та точної взаємодії курсором. Будь ласка, завітайте до нас з настільного комп'ютера.",

      bm_organelle_nucleus_name: "НУКЛЕОЇД",
      bm_organelle_nucleus_sub: "ПОСЛ. 01 // ГЕНОМНИЙ РЕГІОН",
      bm_organelle_nucleus_class: "Немембранна генетична область",
      bm_organelle_nucleus_func: "Зберігання та реплікація ДНК",
      bm_organelle_nucleus_desc:
        "Щільна область ДНК у бактерій (не має ядерної оболонки). Містить основну хромосому та координує реплікацію і експресію генів.",

      bm_organelle_mito_name: "МІТОХОНДРІЯ",
      bm_organelle_mito_sub: "ПОСЛ. 02 // СИНТЕЗ АТФ",
      bm_organelle_mito_class: "Двомембранна метаболічна одиниця",
      bm_organelle_mito_func:
        "Вироблення енергії через окислювальне фосфорилювання",
      bm_organelle_mito_desc:
        "«Силова станція» клітини. Генерує аденозинтрифосфат (АТФ), використовуючи електрохімічний градієнт на своїй внутрішній мембрані.",

      bm_organelle_lysosome_name: "ЛІЗОСОМА",
      bm_organelle_lysosome_sub: "ПОСЛ. 03 // ПЕРЕРОБКА ВІДХОДІВ",
      bm_organelle_lysosome_class: "Сферична кисла органела",
      bm_organelle_lysosome_func: "Травлення макромолекул та залишків",
      bm_organelle_lysosome_desc:
        "Містить гідролітичні ферменти. Розщеплює клітинні відходи, пошкоджені органели та сторонні речовини шляхом контрольованого травлення.",

      bm_organelle_nucleolus_name: "ЯДЕРЦЕ",
      bm_organelle_nucleolus_sub: "ПОСЛ. 04 // РИБОСОМАЛЬНИЙ БІОГЕНЕЗ",
      bm_organelle_nucleolus_class: "Щільна немембранна область",
      bm_organelle_nucleolus_func: "Синтез рРНК та збирання рибосом",
      bm_organelle_nucleolus_desc:
        "Місце інтенсивної транскрипційної активності. Тут виробляється рибосомальна РНК, яка поєднується з білками для створення рибосомних субодиниць.",

      bm_organelle_membrane_name: "ПЛАЗМАТИЧНА МЕМБРАНА",
      bm_organelle_membrane_sub: "ПОСЛ. 05 // КОНТРОЛЬ БАР'ЄРУ",
      bm_organelle_membrane_class: "Фосфоліпідний бішар",
      bm_organelle_membrane_func: "Напівпроникна межа та сигналізація",
      bm_organelle_membrane_desc:
        "Захищає цілісність клітини. Регулює транспорт молекул і полегшує зв'язок із зовнішнім середовищем.",

      bm_organelle_er_name: "РЕТИКУЛУМ",
      bm_organelle_er_sub: "ПОСЛ. 06 // ТРАНСПОРТ БІЛКІВ",
      bm_organelle_er_class: "Мережа складчастих мембран",
      bm_organelle_er_func: "Синтез білків та ліпідів",
      bm_organelle_er_desc:
        "Розгалужена мережа трубочок і мішечків. Шорсткий ЕР (з рибосомами) синтезує білки, а гладкий ЕР зосереджений на метаболізмі ліпідів і детоксикації.",

      // Micro City
      mc_defense_active: "АКТИВНО",
      mc_defense_weak: "СЛАБО",
      mc_threat: "ЗАГРОЗА",
      mc_system_hud: "СИСТЕМНИЙ HUD",
      mc_integrity: "Цілісність",
      mc_defense: "Захист",
      mc_score: "Рахунок",
      mc_credits: "Кредити",
      mc_streak: "Серія",
      mc_resolved: "Нейтралізовано",
      mc_missed: "Пропущено",
      mc_start: "СТАРТ",
      mc_pause: "ПАУЗА",
      mc_resume: "ПРОДОВЖИТИ",
      mc_restart: "ПЕРЕЗАПУСТИТИ",
      mc_next: "ДАЛІ",
      mc_mission: "МІСІЯ",
      mc_status: "СТАТУС",
      mc_complete: "ВИКОНАНО",
      mc_in_progress: "В ПРОЦЕСІ",
      mc_operator_message: "ПОВІДОМЛЕННЯ ОПЕРАТОРА",
      mc_ok: "OK",
      mc_legend_macrophage: "Макрофаг",
      mc_legend_flora: "Флора (Блага)",
      mc_legend_pathogen: "Патоген",
      mc_online: "ОНЛАЙН",
      mc_idle: "ОЧІКУВАННЯ",

      // Metamorphosis
      meta_hdr_egg: "СТАДІЯ ЯЙЦЯ",
      meta_hdr_larva: "СТАДІЯ ЛИЧИНКИ",
      meta_hdr_pupa: "СТАДІЯ ЛЯЛЕЧКИ",
      meta_hdr_adult: "СТАДІЯ МЕТЕЛИКА",
      meta_stage_egg_name: "ЕТАП 01: ЯЙЦЕ",
      meta_stage_larva_name: "ЕТАП 02: ГУСІНЬ",
      meta_stage_pupa_name: "ЕТАП 03: ЛЯЛЕЧКА",
      meta_stage_adult_name: "ЕТАП 04: МЕТЕЛИК",
      meta_stage_egg_meta: "ФАЗА НУКЛЕАЦІЇ // OVR-RIDE",
      meta_stage_larva_meta: "ФАЗА РОСТУ // СПОЖИВАННЯ",
      meta_stage_pupa_meta: "ФАЗА ТРАНСФОРМАЦІЇ // RE-CODE",
      meta_stage_adult_meta: "ФАЗА ІМАГО // ТЕРМІНАЛ",
      meta_egg_p1:
        "Маленькі, овальні або круглі яйця метеликів зазвичай відкладаються на листя. Вони містять зародок, що розвивається.",
      meta_larva_p1:
        "Личинка (гусінь) вилуплюється і починає харчуватися рослиною-господарем, швидко ростучи.",
      meta_pupa_p1:
        "Всередині лялечки тканини гусені розчиняються і реорганізуються в структуру дорослої особини.",
      meta_adult_p1:
        "Метелик виходить, розправляє крила і готується до своєї фінальної стадії: розмноження.",
      meta_observation: "СПОСТЕРЕЖЕННЯ",
      meta_egg_obs: "Тверда зовнішня оболонка з мікропіле.",
      meta_larva_obs: "Високий темп метаболізму, кілька линьок.",
      meta_pupa_obs: "Внутрішнє розрідження тканин.",
      meta_adult_obs: "Складні візерунки крил, сенсорний фід.",

      meta_fact_egg_1_label: "⚡ ТРИВАЛІСТЬ",
      meta_fact_egg_1_text:
        "Яйця вилуплюються за 3–7 днів залежно від температури та виду.",
      meta_fact_egg_2_label: "🔬 МІКРОДЕТАЛЬ",
      meta_fact_egg_2_text:
        "Поверхня яйця має мікрорельєф (хоріон), який забезпечує газообмін для ембріона.",
      meta_fact_egg_3_label: "🌿 РОСЛИНА-ГОСПОДАР",
      meta_fact_egg_3_text:
        "Самки хімічно 'аналізують' листя лапками перед кладкою, щоб обрати правильне живлення для личинок.",

      meta_fact_larva_1_label: "⚡ РІСТ",
      meta_fact_larva_1_text:
        "Гусінь може збільшити масу тіла до 100× лише за кілька тижнів.",
      meta_fact_larva_2_label: "🦟 ХИЖАКИ",
      meta_fact_larva_2_text:
        "Понад 90% яєць і личинок з'їдають ще до стадії лялечки.",
      meta_fact_larva_3_label: "🧬 ЛИНЯННЯ",
      meta_fact_larva_3_text:
        "Линяння відбувається 4–5 разів. Кожна фаза — інстар: короткий період вразливості з м'якою новою шкірою.",

      meta_fact_pupa_1_label: "⚡ ТРИВАЛІСТЬ",
      meta_fact_pupa_1_text:
        "Стадія лялечки триває 10–14 днів влітку, але деякі види зимують у коконі місяцями.",
      meta_fact_pupa_2_label: "🔬 ВСЕРЕДИНІ",
      meta_fact_pupa_2_text:
        "Тіло гусені буквально розчиняється — виживають лише клітини імагінальних дисків, що формують дорослу особину.",
      meta_fact_pupa_3_label: "🛡 ЗАХИСТ",
      meta_fact_pupa_3_text:
        "Деякі лялечки вібрують і клацають, відлякуючи хижаків; інші маскуються під листя, кору або послід.",

      meta_fact_adult_1_label: "⚡ ТРИВАЛІСТЬ ЖИТТЯ",
      meta_fact_adult_1_text:
        "Більшість метеликів живе 2–4 тижні. Монархи можуть жити до 8 місяців, щоб завершити міграцію.",
      meta_fact_adult_2_label: "🌍 МІГРАЦІЯ",
      meta_fact_adult_2_text:
        "Монархи мігрують до 4500 км, орієнтуючись за Сонцем із 'компенсацією часу'.",
      meta_fact_adult_3_label: "👁 ЗІР",
      meta_fact_adult_3_text:
        "Метелики бачать ультрафіолет, який відкриває приховані візерунки на крилах для комунікації та вибору партнера.",

      meta_splash_sub: "Інтерактивне Дослідження Природи",
      meta_begin: "ПОЧАТИ",
      meta_test_knowledge: "ПЕРЕВІР ЗНАННЯ",
      meta_arrange: "РОЗТАШУЙ ПОСЛІДОВНІСТЬ",
      meta_study_of_nature: "ДОСЛІДЖЕННЯ ПРИРОДИ",
      meta_collapse: "Згорнути етап",
      meta_close: "Закрити",
      meta_try_again: "↺ СПРОБУВАТИ ЩЕ",
      meta_sequence_verified:
        "✦ ПОСЛІДОВНІСТЬ ПІДТВЕРДЖЕНО — МЕТАМОРФОЗУ ЗАВЕРШЕНО ✦",
      meta_correct_try_again: "{{correct}}/4 ПРАВИЛЬНО — СПРОБУЙ ЩЕ",
      meta_stages_explored: "ЕТАПІВ ВИВЧЕНО",
      meta_did_you_know: "ЧИ ЗНАВ(-ЛА) ТИ",
      meta_sfx_on: "ЗВУК УВІМК.",
      meta_sfx_off: "ЗВУК ВИМК.",

      meta_ticker_1: "Метелики можуть долати до 3000 миль під час міграції",
      meta_ticker_2: "Монарх використовує магнітне поле Землі для навігації",
      meta_ticker_3:
        "Деякі лялечки можуть видавати звуки, щоб відлякувати хижаків",
      meta_ticker_4:
        "Гусінь збільшує масу тіла до 1000× перед заляльковуванням",
      meta_ticker_5: "Метелики 'смакують' листя лапками через хеморецептори",
      meta_ticker_6: "Колір крил синього морфо — структурний, а не пігментний",
      meta_ticker_7:
        "Метаморфоза може тривати лише близько 10 днів у теплому кліматі",

      meta_tt_egg: "Натисни, щоб дослідити Етап 01: Яйце",
      meta_tt_larva: "Натисни, щоб дослідити Етап 02: Гусінь",
      meta_tt_pupa: "Натисни, щоб дослідити Етап 03: Лялечка",
      meta_tt_adult: "Натисни, щоб дослідити Етап 04: Метелик",
      meta_item_chrysalis: "ЛЯЛЕЧКА",
      meta_item_egg: "ЯЙЦЕ",
      meta_item_butterfly: "МЕТЕЛИК",
      meta_item_caterpillar: "ГУСІНЬ",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "uk",
    fallbackLng: "uk",
    supportedLngs: ["en", "uk"],
    nonExplicitSupportedLngs: true,
    detection: {
      order: ["localStorage"],
      lookupLocalStorage: "bioluma:lang",
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

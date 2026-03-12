export type FeaturedResource = {
  id: string;
  href: string;
  titleKey: string;
  descKey: string;
  indexLabel: string;
  titleText?: string;
  descText?: string;
  titleTextUk?: string;
  descTextUk?: string;
};

export const featuredResources: FeaturedResource[] = [
  {
    id: "model",
    href: "/model",
    titleKey: "landing_card_model_title",
    descKey: "landing_card_model_desc",
    indexLabel: "01",
  },
  {
    id: "micro-city",
    href: "/micro-city",
    titleKey: "landing_card_micro_city_title",
    descKey: "landing_card_micro_city_desc",
    indexLabel: "02",
  },
  {
    id: "metamorphosis",
    href: "/metamorphosis",
    titleKey: "landing_card_metamorphosis_title",
    descKey: "landing_card_metamorphosis_desc",
    indexLabel: "03",
  },
  {
    id: "architecture",
    href: "/architecture",
    titleKey: "landing_card_architecture_title",
    descKey: "landing_card_architecture_desc",
    indexLabel: "04",
    titleText: "Bio Lab Atlas",
    descText: "Visual map of systems, modules, and data flows across the platform",
    titleTextUk: "Атлас БіоЛабу",
    descTextUk: "Візуальна мапа систем, модулів і потоків даних платформи",
  },
];

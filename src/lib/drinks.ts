// Built-in drinks. Every mg value is cited; see research.md, "Caffeine numbers".

export type BuiltInDrink = {
  key: string;
  name: string;
  size: string;
  mg: number;
  /** Shown in the UI when the figure is a best guess rather than a label value. */
  estimate?: boolean;
};

export const BUILT_IN_DRINKS: BuiltInDrink[] = [
  // Red Bull, "Caffeine content": 80 mg per 250 ml can.
  { key: "red-bull", name: "Red Bull", size: "250 ml", mg: 80 },
  // Monster Energy 16 oz: 160 mg. Secondary sources only (unverified in research.md).
  { key: "monster", name: "Monster", size: "16 oz", mg: 160, estimate: true },
  // Celsius 12 oz: 200 mg, product label.
  { key: "celsius", name: "Celsius", size: "12 oz", mg: 200 },
  // Brewed coffee: USDA FDC 171890, 40 mg/100 g → ~95 mg per 8 oz (237 g).
  { key: "coffee", name: "Coffee", size: "8 oz", mg: 95 },
  // Espresso: USDA FDC 171891, 212 mg/100 g → ~63 mg per 1 oz shot (30 g).
  { key: "espresso", name: "Espresso", size: "1 shot", mg: 63 },
  // Black tea: USDA FDC 173227, 20 mg/100 g → ~47 mg per 8 oz.
  { key: "black-tea", name: "Black tea", size: "8 oz", mg: 47 },
  // Masala chai: no USDA value. Estimated from the black-tea figure, diluted with milk.
  { key: "chai", name: "Chai", size: "8 oz", mg: 40, estimate: true },
  // Green tea: USDA FDC 171917, 12 mg/100 g → ~28 mg per 8 oz.
  { key: "green-tea", name: "Green tea", size: "8 oz", mg: 28 },
  // Coca-Cola 12 oz: 34 mg, product label.
  { key: "coke", name: "Coca-Cola", size: "12 oz", mg: 34 },
];

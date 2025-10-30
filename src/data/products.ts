// Centralized product listings. Start empty; we'll fill with real data and images.
import type { Product } from "../store/productStore";

export const initialProducts: Product[] = [
  {
    id: 10,
    name: "TESTAS – Produkto pirkimas (€0.50)",
    price: 0.50,
    originalPrice: 0.99,
    image: "https://ae-pic-a1.aliexpress-media.com/kf/Se4e42f3e36004692bcd2bea0e11a30106.jpg",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/Se4e42f3e36004692bcd2bea0e11a30106.jpg"
    ],
    rating: 5,
    reviews: 3,
    discount: "-99%",
    description: "Testinis produktas Stripe apmokėjimui patikrinti. Kaina €0.01.",
    features: [
      "Skirtas tik testavimui",
      "Kaina – vienas centas",
      "Pašalinkite po sėkmingo testo"
    ],
    colors: [ { name: "Universalus", value: "one" } ],
    sizes: [ { name: "Universalus", value: "one" } ],
    category: "Testas",
    tags: ["testas", "stripe", "apmokėjimas"],
    stock: 9999,
    isNew: true,
    isPopular: false,
    createdAt: new Date()
  },
  {
    id: 1001,
    name: "Kalėdinis Durų Kilimėlis",
    price: 9.99,
    originalPrice: 18.99,
    image: "https://ae-pic-a1.aliexpress-media.com/kf/Sd0b1d77d28a24d1d9ef4bbba51142f1ac.jpg",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/Sd0b1d77d28a24d1d9ef4bbba51142f1ac.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/S054f234dc939406491db00974008b82ew.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/S14da364c4e7b4d35ac4c0478e5c910f3k.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/S688a2a217a8949969e3ab249ce9878a4n.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/S67e8d60e37b74184870f077dd30d05afR.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/S612c6eb10fa5471ab8f81a12a5a305b42.jpg"
    ],
    rating: 4.9,
    reviews: 78,
    discount: "-45%",
    description:
      "Minkštas, neslystantis kalėdinis kilimėlis lauko ir vidaus durims. Atsparus purvui ir drėgmei, lengvai valomas. Puiki šventinė detalė Jūsų namų įėjimui.",
    features: [
      "Neslystanti PVC apačia",
      "Greitai džiūstantis ir lengvai valomas paviršius",
      "Ryškūs šventiniai raštai (kelios versijos)",
      "Tinka vidaus ir lauko naudojimui",
      "Puiki dovanos idėja"
    ],
    colors: [
      { name: "Kalėdų eglutės (raudona)", value: "santa_green" },
      { name: "Senelis Kalėda (žalia/raudona)", value: "reindeer_green" },
      { name: "Kalėdų senelis rogėse", value: "trees_red" },
      { name: "JOY vainikas", value: "merry_red" },
      { name: "Merry Christmas (raudona)", value: "santa_sleigh" },
      { name: "Elniukas (žalia)", value: "joy_wreath" }
    ],
    sizes: [
      { name: "40×60 cm", value: "40x60" }
    ],
    category: "Dekoracijos",
    tags: ["durų kilimėlis", "kalėdos", "šventės", "dovana"],
    stock: 9999, // virtualus sandėlis dropshippingui
    isNew: true,
    isPopular: true,
    createdAt: new Date()
  },
  {
    id: 1002,
    name: "Kalėdiniai Stiklo Žaisliukai (40 vnt.)",
    price: 17.99,
    originalPrice: 29.99,
    image: "https://ae-pic-a1.aliexpress-media.com/kf/S5f77a5f5d009425aa7368485ff77e4d7j.jpg",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S5f77a5f5d009425aa7368485ff77e4d7j.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sfde8620c111046249f521e291d3b2a52L.png"
    ],
    rating: 4.8,
    reviews: 55,
    discount: "-50%",
    description: "Premium stiklinių kalėdinių žaisliukų rinkinys su aukso akcentais. Aukštos kokybės, trankūs puikiai tinkantys šventiniam dekoravimui. Idėalus kalėdiniam skaičiuoklei arba eglutės puošimui.",
    features: [
      "40 skirtingų stiklinių žaisliukų rinkinyje",
      "Aukso akcentai kiekvienoje žaisliuko dalyje",
      "Aukštos kokybės stiklas, gerai atlaiko metimą",
      "Puikiai tinka kiekvienam apšviečiamui",
      "Atkelia klasikinę Kalėdų atmosferą"
    ],
    colors: [
      { name: "Auksiniai (40 vnt.)", value: "gold_set" },
      { name: "Žalios (40 vnt.)", value: "green_set" }
    ],
    sizes: [
      { name: "Universalus", value: "universal" }
    ],
    category: "Dekoracijos",
    tags: ["žaisliukai", "kalėdos", "stiklo žaisliukai", "dekoravimas"],
    stock: 9999,
    isNew: true,
    isPopular: true,
    createdAt: new Date()
  },
  {
    id: 1003,
    name: "Kalėdinis Šeimos Pyžamos Komplektas",
    price: 14.99,
    originalPrice: 34.99,
    image: "https://ae-pic-a1.aliexpress-media.com/kf/Se4e42f3e36004692bcd2bea0e11a30106.jpg",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/Se4e42f3e36004692bcd2bea0e11a30106.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sc867e2f6a41d4c14a4a1850a5d9401daF.jpg"
    ],
    rating: 4.9,
    reviews: 32,
    discount: "-57%",
    description: "Puikios šeimos Kalėdų pyžamos su 'MERRY CHRISTMAS' tekstu ir šventiniais motyvais. Patogūs, minkšti, tinka visai šeimai - nuo mažiausių iki senesnio amžiaus. Puikiai tinka švenčioms švietimui arba nuotraukoms.",
    features: [
      "Komplektas visai šeimai (vadovas, mama, vaikai)",
      "Šventiniai motyvai: Senelis Kalėda, eglutės, elniukai, ledo kristalai",
      "Minkšti ir patogūs medžiagos",
      "Tinka skirtingų dydžių (moterims, vyrams, vaikams)",
      "Puiki dovana šeimai prieš Kalėdas"
    ],
    colors: [
      { name: "Juodas su raudonais akcentais", value: "black_red" }
    ],
    sizes: [
      { name: "XS", value: "xs_kids" },
      { name: "S", value: "s_kids" },
      { name: "M", value: "m_teens" },
      { name: "L", value: "l_teens" },
      { name: "XL", value: "xl_adult" },
      { name: "XXL", value: "xxl_adult" }
    ],
    category: "Drabužiai",
    tags: ["pyžamos", "kalėdos", "šeima", "šventinė dovana"],
    stock: 9999,
    isNew: true,
    isPopular: true,
    createdAt: new Date()
  }
];

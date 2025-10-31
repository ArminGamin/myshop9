// Centralized product listings. Start empty; we'll fill with real data and images.
import type { Product } from "../store/productStore";

export const initialProducts: Product[] = [
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
    imagesByColor: [
      ["https://ae-pic-a1.aliexpress-media.com/kf/Sd0b1d77d28a24d1d9ef4bbba51142f1ac.jpg"],
      ["https://ae-pic-a1.aliexpress-media.com/kf/S054f234dc939406491db00974008b82ew.jpg"],
      ["https://ae-pic-a1.aliexpress-media.com/kf/S14da364c4e7b4d35ac4c0478e5c910f3k.jpg"],
      ["https://ae-pic-a1.aliexpress-media.com/kf/S688a2a217a8949969e3ab249ce9878a4n.jpg"],
      ["https://ae-pic-a1.aliexpress-media.com/kf/S67e8d60e37b74184870f077dd30d05afR.jpg"],
      ["https://ae-pic-a1.aliexpress-media.com/kf/S612c6eb10fa5471ab8f81a12a5a305b42.jpg"]
    ],
    rating: 4.9,
    reviews: 78,
    discount: "-45%",
    description:
      "Kalėdinis durų kilimėlis – neslystantis, atsparus purvui ir drėgmei, tinkamas lauko ir vidaus naudojimui. Greitai džiūsta, lengvai valomas ir suteikia šventinį „welcome“ akcentą prie įėjimo. Puikiai tinka terasai, prieangyje, koridoriuje ar biure.",
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
    tags: ["kalėdinis durų kilimėlis", "lauko kilimėlis", "vidaus kilimėlis", "neslystantis", "kalėdos", "dovana"],
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
    imagesByColor: [
      ["https://ae-pic-a1.aliexpress-media.com/kf/S5f77a5f5d009425aa7368485ff77e4d7j.jpg"],
      ["https://ae-pic-a1.aliexpress-media.com/kf/Sfde8620c111046249f521e291d3b2a52L.png"]
    ],
    rating: 5.0,
    reviews: 55,
    discount: "-50%",
    description: "Premium stikliniai kalėdiniai eglutės žaisliukai (40 vnt.) su prabangiais aukso akcentais. Lengvi, tvirti ir saugūs pakabinti – idealiai tinka eglutei, vainikams, stalo kompozicijoms ir viso namų interjero puošybai. Puikus pasirinkimas išskirtiniam, elegantiškam šventiniam dekorui.",
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
    description: "Šeimos kalėdinės pižamos – suderintas komplektas su šventiniais motyvais. Minkštas, elastingas ir malonus liesti audinys, patogus vaikams ir suaugusiems. Idealiai tinka kalėdinei fotosesijai, jaukiems šeimos vakarams ir dovanai. Lengvai prižiūrimos, greitai džiūsta, galimi dydžiai XS–XXL.",
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
  },
  {
    id: 1004,
    name: "Šviečiančios dekoratyvinės šakelės",
    price: 11.99,
    originalPrice: 19.99,
    image: "https://ae-pic-a1.aliexpress-media.com/kf/S255daedfa95e4aab86e8670962d5f04dD.jpg",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S255daedfa95e4aab86e8670962d5f04dD.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sdd916890d5584acc92f188c9f06f2000S.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sc20382adf78d4b5c876af9058c9da251y.jpg"
    ],
    rating: 4.8,
    reviews: 45,
    discount: "-50%",
    description:
      "Šviečiančios dekoratyvinės šakelės su šilta balta LED spalva – stilingas namų dekoro akcentas. Lankstus kotelis leidžia lengvai formuoti vazose, vainikuose ar eglutėje. Energiją taupanti, ryški, sukuria jaukią atmosferą fotosesijoms, šventinėms kompozicijoms ir kasdieniam interjerui.",
    features: [
      "Šilta balta LED spalva",
      "Lanksti viela, lengva formuoti",
      "Mažos energijos sąnaudos",
      "Puikiai tinka Kalėdų dekorui"
    ],
    colors: [
      { name: "Šilta balta", value: "warm_white" }
    ],
    sizes: [
      { name: "LED", value: "led" }
    ],
    sizeLabel: "Tipas",
    category: "Dekoracijos",
    tags: ["dekoratyvinės šakelės", "LED šakelės", "šilta balta", "kalėdinis apšvietimas", "namų dekoras"],
    stock: 9999,
    isNew: true,
    isPopular: true,
    createdAt: new Date()
  },
  {
    id: 1005,
    name: "Kalėdinė Staltiesė",
    price: 12.99,
    originalPrice: 24.99,
    image: "https://ae-pic-a1.aliexpress-media.com/kf/S03fb1c7dcd6b49348c43a81e333fe66bF.jpg",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S03fb1c7dcd6b49348c43a81e333fe66bF.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/S05fe64ff6f1f41469f8521375d587e76X.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/S8b3c6152b5af4d56b95c2561c7ec6dd1G.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/S08487760aa7e4727bd3b235870bc3aaeA.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/S86f2e1b39fac4a0a8c993c7bf7098247q.jpg"
    ],
    imagesBySize: [
      [
        "https://ae-pic-a1.aliexpress-media.com/kf/S03fb1c7dcd6b49348c43a81e333fe66bF.jpg",
        "https://ae-pic-a1.aliexpress-media.com/kf/S05fe64ff6f1f41469f8521375d587e76X.jpg"
      ],
      [
        "https://ae-pic-a1.aliexpress-media.com/kf/S8b3c6152b5af4d56b95c2561c7ec6dd1G.jpg",
        "https://ae-pic-a1.aliexpress-media.com/kf/S08487760aa7e4727bd3b235870bc3aaeA.jpg",
        "https://ae-pic-a1.aliexpress-media.com/kf/S86f2e1b39fac4a0a8c993c7bf7098247q.jpg"
      ]
    ],
    rating: 4.7,
    reviews: 41,
    discount: "-48%",
    description:
      "Kalėdinė staltiesė – šventiškas, tankus ir malonus liesti stalo užtiesalas. Idealiai tinka Kalėdų vakarienei, fotosesijoms ir kasdieniam naudojimui. Lengvai skalbiama, atspari dėvėjimuisi ir suteikianti elegantišką šventinį akcentą jūsų namams.",
    features: [
      "Tankus, minkštas audinys",
      "Atsparus dėvėjimuisi, lengvai skalbiamas",
      "Idealus Kalėdų stalui ir fotosesijoms"
    ],
    colors: [
      { name: "Klasikinė", value: "classic" }
    ],
    sizes: [
      { name: "140×180 cm", value: "140x180" },
      { name: "Apvalus 150 cm", value: "round_150" }
    ],
    pricesBySize: [12.99, 10.99],
    originalPricesBySize: [24.99, 21.99],
    category: "Namai",
    tags: ["kalėdinė staltiesė", "stalo užtiesalas", "šventinis stalas", "kalėdos", "namų dekoras"],
    stock: 9999,
    isNew: true,
    isPopular: true,
    createdAt: new Date()
  }
  ,
  {
    id: 1006,
    name: "Pliušinis žaislas",
    price: 7.99,
    originalPrice: 14.99,
    image: "https://ae-pic-a1.aliexpress-media.com/kf/Sd0a54cae9f1d4760b4a22385c822a709u.jpg",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S8186e9f414ff4035a025049ae8d7a30bN.jpg", // Ruda A
      "https://ae-pic-a1.aliexpress-media.com/kf/Sd0a54cae9f1d4760b4a22385c822a709u.jpg", // Ruda B
      "https://ae-pic-a1.aliexpress-media.com/kf/S46c2f0c830394e439ae8ba458076eeadv.jpg", // Rožinė A
      "https://ae-pic-a1.aliexpress-media.com/kf/Sd9b142a49b884cf0b4217418cde67f4aa.jpg" // Rožinė B
    ],
    imagesByColor: [
      ["https://ae-pic-a1.aliexpress-media.com/kf/S8186e9f414ff4035a025049ae8d7a30bN.jpg"],
      ["https://ae-pic-a1.aliexpress-media.com/kf/Sd0a54cae9f1d4760b4a22385c822a709u.jpg"],
      ["https://ae-pic-a1.aliexpress-media.com/kf/S46c2f0c830394e439ae8ba458076eeadv.jpg"],
      ["https://ae-pic-a1.aliexpress-media.com/kf/Sd9b142a49b884cf0b4217418cde67f4aa.jpg"]
    ],
    rating: 4.8,
    reviews: 27,
    discount: "-47%",
    description:
      "Minkštas ir jaukus pliušinis žaislas – puiki dovana šventėms. Aukštos kokybės, malonus liesti, idealiai tinka kaip kalėdinė dovana vaikams ir suaugusiems, namų dekorui ar jaukiam interjerui.",
    features: [
      "Minkšta, maloni liesti medžiaga",
      "Tinka vaikams ir kaip dekoracija",
      "Puiki dovanos idėja Kalėdoms"
    ],
    colors: [
      { name: "Ruda A", value: "brown_a" },
      { name: "Ruda B", value: "brown_b" },
      { name: "Rožinė A", value: "pink_a" },
      { name: "Rožinė B", value: "pink_b" }
    ],
    pricesByColor: [7.99, 7.99, 7.99, 7.99],
    originalPricesByColor: [14.99, 14.99, 14.99, 14.99],
    sizes: [
      { name: "Universalus", value: "universal" }
    ],
    category: "Žaislai",
    tags: ["pliušinis", "žaislas", "kalėdos", "dovana"],
    stock: 9999,
    isNew: true,
    isPopular: true,
    createdAt: new Date()
  }
];

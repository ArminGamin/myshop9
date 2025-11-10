// Centralized product listings. Start empty; we'll fill with real data and images.
import type { Product } from "../store/productStore";

export const initialProducts: Product[] = [
  {
    id: 1001,
    name: "Kalėdinis Durų Kilimėlis",
    price: 10.99,
    originalPrice: 18.99,
    image: "https://ae-pic-a1.aliexpress-media.com/kf/S612c6eb10fa5471ab8f81a12a5a305b42.jpg",
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
    price: 22.99,
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
      "Komplektas visai šeimai (tėčiui, mamai, vaikam)",
      "Minkštos ir patogios medžiagos",
      "Tinka skirtingų dydžių (moterims, vyrams, vaikams)",
      "Puiki dovana šeimai prieš Kalėdas"
    ],
    colors: [
      { name: "Juodas su raudonais akcentais", value: "black_red" }
    ],
    sizeLabel: "Dydžiai",
    // Keep legacy sizes for backwards compatibility; not used when sizeGroups is present
    sizes: [
      { name: "M", value: "adult_m" },
      { name: "L", value: "adult_l" },
      { name: "XL", value: "adult_xl" },
      { name: "XXL", value: "adult_xxl" }
    ],
    sizeGroups: [
      {
        label: "Tėtis",
        sizes: [
          { name: "XS", value: "dad_xs" },
          { name: "S", value: "dad_s" },
          { name: "M", value: "dad_m" },
          { name: "L", value: "dad_l" },
          { name: "XL", value: "dad_xl" },
          { name: "XXL", value: "dad_xxl" }
        ]
      },
      {
        label: "Mama",
        sizes: [
          { name: "XS", value: "mom_xs" },
          { name: "S", value: "mom_s" },
          { name: "M", value: "mom_m" },
          { name: "L", value: "mom_l" },
          { name: "XL", value: "mom_xl" },
          { name: "XXL", value: "mom_xxl" }
        ]
      },
      {
        label: "Sūnus",
        sizes: [
          { name: "XS", value: "son_xs" },
          { name: "S", value: "son_s" },
          { name: "M", value: "son_m" },
          { name: "L", value: "son_l" },
          { name: "XL", value: "son_xl" },
          { name: "XXL", value: "son_xxl" }
        ]
      },
      {
        label: "Dukra",
        sizes: [
          { name: "XS", value: "daughter_xs" },
          { name: "S", value: "daughter_s" },
          { name: "M", value: "daughter_m" },
          { name: "L", value: "daughter_l" },
          { name: "XL", value: "daughter_xl" },
          { name: "XXL", value: "daughter_xxl" }
        ]
      }
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
    name: "Šviečiančios Dekoratyvinės Šakelės",
    price: 12.99,
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
    price: 13.99,
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
    pricesBySize: [13.99, 13.99],
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
    name: "Pliušinis Žaislas",
    price: 8.99,
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
      "Tinka kaip dovana ir kaip dekoracija",
      "Puiki dovanos idėja Kalėdoms"
    ],
    colors: [
      { name: "Ruda A", value: "brown_a" },
      { name: "Ruda B", value: "brown_b" },
      { name: "Rožinė A", value: "pink_a" },
      { name: "Rožinė B", value: "pink_b" }
    ],
    pricesByColor: [8.99, 8.99, 8.99, 8.99],
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
  },
  {
    id: 1007,
    name: "Kalėdiniai Raktų Pakabukai",
    price: 6.99,
    originalPrice: 11.99,
    image: "https://ae-pic-a1.aliexpress-media.com/kf/S071cb82cce914403989faee9341768c2T.jpg",
    images: [
      "https://ae-pic-a1.aliexpress-media.com/kf/S071cb82cce914403989faee9341768c2T.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sd8923f6c484c4622ab026da2090109dcr.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/Sb9a5d21008f64cdfa947cdd92b8ad62bC.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/S1c5a239762a4418bb61ec7d015846ac5B.jpg",
      "https://ae-pic-a1.aliexpress-media.com/kf/S1b4b8132e3d349c395a09a277bd5f9be9.jpg"
    ],
    imagesByColor: [
      ["https://ae-pic-a1.aliexpress-media.com/kf/S071cb82cce914403989faee9341768c2T.jpg"],
      ["https://ae-pic-a1.aliexpress-media.com/kf/Sd8923f6c484c4622ab026da2090109dcr.jpg"],
      ["https://ae-pic-a1.aliexpress-media.com/kf/Sb9a5d21008f64cdfa947cdd92b8ad62bC.jpg"],
      ["https://ae-pic-a1.aliexpress-media.com/kf/S1c5a239762a4418bb61ec7d015846ac5B.jpg"],
      ["https://ae-pic-a1.aliexpress-media.com/kf/S1b4b8132e3d349c395a09a277bd5f9be9.jpg"]
    ],
    rating: 4.8,
    reviews: 63,
    discount: "-50%",
    description:
      "Kalėdiniai raktų pakabukai – žaismingi šventiniai akcentai kasdienai. Pasirinkite iš variantų: Senelis Kalėda, Kalėdinės kojinės, Kalėdinis elnias, Sniego senis arba Kalėdinė eglutė. Lengvi ir tvirti, puikiai tinka kaip dovana, puošia raktus, kuprinę ar automobilio raktelį.",
    features: [
      "Lengvi ir tvirti – kasdieniam naudojimui",
      "Ryškūs šventiniai dizainai (5 dizainai)",
      "Puiki dovanos idėja Kalėdoms",
      "Universalus dydis – tinka prie bet kurių raktų"
    ],
    colors: [
      { name: "Senelis Kalėda", value: "santa_claus" },
      { name: "Kalėdinės kojinės", value: "christmas_socks" },
      { name: "Kalėdinis elnias", value: "christmas_elk" },
      { name: "Sniego senis", value: "christmas_snowman" },
      { name: "Kalėdinė eglutė", value: "christmas_tree" }
    ],
    pricesByColor: [6.99, 6.99, 6.99, 6.99, 6.99],
    originalPricesByColor: [11.99, 11.99, 11.99, 11.99, 11.99],
    sizes: [
      { name: "Universalus", value: "universal" }
    ],
    category: "Aksesuarai",
    tags: [
      "kalėdiniai raktų pakabukai",
      "raktų pakabukas",
      "šventiniai aksesuarai",
      "senelis kalėda",
      "sniego senis",
      "kalėdinė eglutė",
      "kalėdinės kojinės",
      "kalėdinis elnias",
      "dovana",
      "kalėdos",
      "raktai",
      "automobilio rakteliai"
    ],
    stock: 9999,
    isNew: true,
    isPopular: true,
    createdAt: new Date()
  }
  ,
  {
    id: 1008,
    name: "Kalėdinis Megztinis",
    price: 19.99,
    originalPrice: 29.99,
    image: "/products/megztiniai/red.png",
    images: [
      "/products/megztiniai/red.png",
      "/products/megztiniai/green.png",
      "/products/megztiniai/navy.png"
    ],
    imagesByColor: [
      ["/products/megztiniai/red.png"],
      ["/products/megztiniai/green.png"],
      ["/products/megztiniai/navy.png"]
    ],
    rating: 4.8,
    reviews: 42,
    discount: "-33%",
    description:
      "Kalėdinis megztinis – šiltas, minkštas ir patogus žiemos šventėms. Pasirinkite iš trijų klasikinių spalvų: žalia, raudona ir tamsiai mėlyna. Puikiai tinka šeimos fotosesijoms, darbo vakarėliams, kasdieniam nešiojimui ar kaip dovana. Kvėpuojantis audinys, lengva priežiūra, universalus dizainas moterims ir vyrams.",
    features: [
      "Aukštos kokybės, minkštas audinys – malonus odai",
      "Ryškios šventinės spalvos (žalia / raudona / tamsiai mėlyna)",
      "M, L, XL, XXL, XXXL dydžiai",
      "Lengva priežiūra",
      "Puiki dovana Kalėdoms, poroms ir šeimai"
    ],
    colors: [
      { name: "Raudona", value: "red" },
      { name: "Žalia", value: "green" },
      { name: "Tamsiai mėlyna", value: "navy_blue" }
    ],
    pricesByColor: [19.99, 19.99, 19.99],
    originalPricesByColor: [29.99, 29.99, 29.99],
    sizes: [
      { name: "M", value: "size_m" },
      { name: "L", value: "size_l" },
      { name: "XL", value: "size_xl" },
      { name: "XXL", value: "size_xxl" },
      { name: "XXXL", value: "size_xxxl" }
    ],
    sizeLabel: "Dydis",
    category: "Drabužiai",
    tags: [
      "kalėdinis megztinis",
      "megztinis",
      "šiltas megztinis",
      "žalias megztinis",
      "raudonas megztinis",
      "tamsiai mėlynas megztinis",
      "moteriškas megztinis",
      "vyriškas megztinis",
      "poroms",
      "šeimai",
      "dovana",
      "kalėdos",
      "žiema",
      "šventinis drabužis"
    ],
    stock: 9999,
    isNew: true,
    isPopular: true,
    createdAt: new Date()
  }
];

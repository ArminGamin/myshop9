import React, { useState, useEffect, useMemo, useCallback, useRef, Suspense, lazy } from "react";
import {
  ShoppingCart,
  Heart,
  X,
  Star,
  Mail,
  Truck,
  Shield,
  RotateCcw,
  Headphones,
  Gift,
  Trash2,
  Check,
  Package,
  CreditCard,
  Lock,
  Share2,
  Clock,
  Users,
  AlertTriangle,
} from "lucide-react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { ThankYouModal } from "./components/ThankYouModal";
import OptimizedImage from "./components/OptimizedImage";
import Snowfall from "./components/Snowfall";
import CookieConsent from "./components/CookieConsent";
import { useCartStore } from "./store/cartStore";
import { useProductStore } from "./store/productStore";
import { initialProducts } from "./data/products";
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeCardSection from './components/StripeCardSection';
import PayPalButton from './components/PayPalButton';

const STRIPE_PK = (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = loadStripe(STRIPE_PK || '');

// Bridge component that exposes a pay() function via ref so parent can trigger payment
function StripePayBridge({
  payRef,
  amountCents,
  customer,
  itemsSummary
}: {
  payRef: React.MutableRefObject<null | (() => Promise<{ ok: boolean; error?: string }>)>;
  amountCents: number;
  customer: { name: string; surname: string; email: string; phone: string; address: string };
  itemsSummary: string;
}) {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    payRef.current = async () => {
      if (!stripe || !elements) {
        return { ok: false, error: 'Mokėjimo sistema dar kraunasi' };
      }
      const resp = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountCents,
          name: customer.name,
          surname: customer.surname,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          items: itemsSummary
        })
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({} as any));
        return { ok: false, error: err.error || resp.statusText };
      }
      const { clientSecret } = await resp.json();
      const card = elements.getElement(CardElement);
      const confirmation = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: { name: `${customer.name} ${customer.surname}`, email: customer.email }
        }
      } as any);
      if ((confirmation as any)?.error) {
        return { ok: false, error: (confirmation as any).error.message };
      }
      if (!confirmation?.paymentIntent || confirmation.paymentIntent.status !== 'succeeded') {
        return { ok: false, error: 'Mokėjimas nepatvirtintas' };
      }
      return { ok: true };
    };
    return () => { payRef.current = null; };
  }, [stripe, elements, payRef, amountCents, customer, itemsSummary]);

  return null;
}

// Lazy load non-critical components for code splitting
const ProductComparison = lazy(() => import("./components/ProductComparison").then(module => ({ default: module.ProductComparison })));

// Info Pages Components
const PristatymoInfo = () => (
  <PageWrapper title="Pristatymo Informacija">
    <p className="text-gray-700 mb-4">Pristatymas tikimasi per 8-12 darbo dienų.</p>
    <p className="text-gray-700">
      Atkreipkite dėmesį, kad pristatymo laikas gali skirtis dėl nuo mūsų
      nepriklausančių veiksnių, tokių kaip muitinės formalumai ir vietinės
      pristatymo paslaugos. Būkite tikri, kad stengiamės apdoroti ir išsiųsti
      jūsų užsakymą kuo greičiau, kad užtikrintume pristatymą laiku.
    </p>
  </PageWrapper>
);

const Grazinimai = () => (
  <PageWrapper title="Grąžinimai">
    <p className="text-gray-700">
      Norime, kad būtumėte visiškai patenkinti savo pirkiniu! Atkreipkite dėmesį, kad visi pardavimai yra galutiniai, todėl grąžinti ar pakeisti prekių negalime. Raginame atidžiai peržiūrėti prekės aprašymą, dydžius ir nuotraukas prieš pateikiant užsakymą. Jei turite klausimų arba reikia pagalbos renkantis tinkamą prekę, mūsų komanda mielai jums padės – susisiekite dar prieš pirkdami!
    </p>
  </PageWrapper>
);

const PrivatumoPolitika = () => (
  <PageWrapper title="Privatumo Politika">
    <div className="text-gray-700 space-y-4">
      <p>
        Mes renkame informaciją iš klientų, kai jie atlieka pirkimą arba užsiprenumeruoja naujienlaiškį. 
        Ši informacija gali apimti jūsų vardą, el. pašto adresą, pašto adresą ir mokėjimo informaciją. 
        Taip pat galime rinkti informaciją apie jūsų pageidavimus ir produktus, kuriuos įsigyjate mūsų parduotuvėje.
      </p>
      
      <h3 className="font-semibold text-lg">Informacijos naudojimas</h3>
      <p>
        Surinktą informaciją naudojame užsakymų apdorojimui, klientų aptarnavimui ir apsipirkimo patirčiai mūsų svetainėje gerinti. 
        Jūsų el. pašto adresas gali būti naudojamas naujienoms, pasiūlymams ar akcijoms siųsti. 
        Galite bet kada atsisakyti šių pranešimų.
      </p>
      
      <h3 className="font-semibold text-lg">Informacijos bendrinimas</h3>
      <p>
        Asmeninė informacija nėra parduodama, nuomojama ar kitaip perduodama trečiosioms šalims, išskyrus atvejus, 
        kai tai būtina užsakymui įvykdyti, laikantis įstatymų reikalavimų arba siekiant apsaugoti mūsų teises.
      </p>
      
      <h3 className="font-semibold text-lg">Saugumas</h3>
      <p>
        Mes rimtai žiūrime į asmeninės informacijos apsaugą ir taikome tinkamas technines bei organizacines priemones, 
        siekiant apsaugoti ją nuo neteisėtos prieigos, praradimo ar paviešinimo. 
        Mokėjimai atliekami per saugius serverius, o klientų duomenys saugomi apsaugotoje duomenų bazėje.
      </p>
      
      <h3 className="font-semibold text-lg">Privatumo politikos pakeitimai</h3>
      <p>
        Ši privatumo politika gali būti atnaujinama be išankstinio įspėjimo. 
        Atnaujinta versija visada bus pateikta šioje svetainėje ir įsigalios nuo paskelbimo momento.
      </p>
      
      <h3 className="font-semibold text-lg">Kontaktai</h3>
      <p>
        Kilus klausimams ar pastebėjimams dėl šios privatumo politikos, susisiekite su mumis el. paštu ar per socialinius tinklus – 
        kontaktus rasite kontaktų skiltyje.
      </p>
    </div>
  </PageWrapper>
);

const ApieMus = () => (
  <PageWrapper title="Apie mus">
    <div className="text-gray-800 space-y-4 text-lg font-medium">
      <h2 className="text-2xl font-bold">Kalėdų Kampelis – apie mus:</h2>
      <p>
        „Kalėdų Kampelis“ prasidėjo nuo paprasto tikslo – padaryti Kalėdas gražesnes ir
        lengvai prieinamas visiems. Kiekvieną sezoną atrenkame <strong>premium kalėdų dekoracijas</strong>,
        idėjas ir dovanas, kad jūsų namai spindėtų šventiniu džiaugsmu. Tikime, kad jaukumas slypi
        smulkmenose – todėl kiekvienas užsakymas supakuojamas su šypsena ir rūpesčiu! :)
      </p>
      <p>
        Rūpinamės greitu aptarnavimu, aiškiomis sąlygomis ir saugiu atsiskaitymu. Jei reikalinga pagalba
        renkantis, parašykite – mūsų komanda visuomet pasiruošusi patarti!
      </p>
      <p>
        Norėdami peržiūrėti visą kolekciją, grįžkite į pagrindinį puslapį ir slinkite žemyn iki skyriaus „Mūsų Produktai“.
      </p>
    </div>
  </PageWrapper>
);


// --- Reusable Page Wrapper ---
const PageWrapper = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-red-600 text-white py-3 text-center text-lg font-bold">
        {title}
      </div>
      <div className="max-w-4xl mx-auto px-6 py-10 text-lg">{children}</div>
      <div className="text-center mb-10">
        <button
          onClick={() => navigate("/")}
          className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
        >
          Grįžti atgal
        </button>
      </div>
    </div>
  );
};

// --- Main Shop Page ---
function HomePage() {
  const { items: cartItems, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart } = useCartStore();
  const { products, setProducts } = useProductStore();
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  // For products that define multiple size groups (e.g., Adults, Kids)
  const [selectedSizesByGroup, setSelectedSizesByGroup] = useState<number[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>([]);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [giftWrapping, setGiftWrapping] = useState(false);
  const [formErrors, setFormErrors] = useState<any>({});
  const [thankYouModalOpen, setThankYouModalOpen] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState('');
  const [completedOrderEmail, setCompletedOrderEmail] = useState('');
  // Free shipping threshold uses FLOOR of subtotal cents (no rounding up to qualify)
  const freeShippingCents = 3000; // €30.00
  const subtotalCentsFloor = useMemo(() => (
    cartItems.reduce((sum: number, it: any) => {
      const priceCentsFloor = Math.floor(Number(it.price) * 100);
      return sum + priceCentsFloor * Number(it.quantity || 1);
    }, 0)
  ), [cartItems]);
  const isFreeShipping = subtotalCentsFloor >= freeShippingCents;
  const orderCents = useMemo(() => {
    const subtotalCents = cartItems.reduce((sum: number, it: any) => {
      const priceCents = Math.round(Number(it.price) * 100);
      return sum + priceCents * Number(it.quantity || 1);
    }, 0);
    const shippingCents = isFreeShipping ? 0 : 299; // €2.99 shipping
    const giftWrapCents = giftWrapping ? 299 : 0;   // €2.99 gift wrap (if enabled)
    return subtotalCents + shippingCents + giftWrapCents;
  }, [cartItems, isFreeShipping, giftWrapping]);
  const [checkoutFormData, setCheckoutFormData] = useState({
    email: '',
    name: '',
    surname: '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const language = 'lt'; // Fixed to Lithuanian only
  
  // Urgency and scarcity features
  const [urgencyTimer, setUrgencyTimer] = useState({
    hours: 0,
    minutes: 45,
    seconds: 0,
  });
  const [viewersCount, setViewersCount] = useState(12);
  // Progressive product rendering for mobile - reduces main-thread work
  // Full product list rendering (no progressive slicing)

  // Sort products by lowest price first for listing grid
  const productsSorted = useMemo(() => {
    return [...products].sort((a: any, b: any) => Number(a.price) - Number(b.price));
  }, [products]);
  
  // Weighted random stock counter (3-15, lower numbers prioritized)
  const getWeightedStockCount = () => {
    // Create weighted array with more lower numbers
    const weights = [
      3, 3, 3, 3, 3,  // 3 appears 5 times (most common)
      4, 4, 4, 4,     // 4 appears 4 times
      5, 5, 5,        // 5 appears 3 times
      6, 6,           // 6 appears 2 times
      7, 7,           // 7 appears 2 times
      8,              // 8 appears 1 time
      9,              // 9 appears 1 time
      10, 11, 12, 13, 14, 15  // Higher numbers appear once
    ];
    return weights[Math.floor(Math.random() * weights.length)];
  };
  
  const [stockCount, setStockCount] = useState(getWeightedStockCount());
  const [recentOrders, setRecentOrders] = useState([
    { name: 'Jonas P.', location: 'Vilnius', time: '3 min', product: 'Kalėdinis namelis' },
    { name: 'Eglė K.', location: 'Klaipėda', time: '7 min', product: 'LED girlianda' },
    { name: 'Darius R.', location: 'Šiauliai', time: '12 min', product: 'Žaisliukų rinkinys' },
    { name: 'Lina B.', location: 'Panevėžys', time: '15 min', product: 'Kalėdinis puokštė' },
    { name: 'Mantas S.', location: 'Alytus', time: '18 min', product: 'Dekoracijos' },
    { name: 'Gintarė V.', location: 'Marijampolė', time: '22 min', product: 'LED apšvietimas' },
    { name: 'Tomas M.', location: 'Utena', time: '25 min', product: 'Kalėdinis namelis' },
    { name: 'Rūta L.', location: 'Tauragė', time: '28 min', product: 'Žaisliukai' },
    { name: 'Arūnas K.', location: 'Telšiai', time: '31 min', product: 'Girliandos' },
    { name: 'Ieva N.', location: 'Mažeikiai', time: '35 min', product: 'Puokštės' },
  ]);

  // Ensure product cards show varied recent-order info without repeating the same entry
  const orderInfos = useMemo(() => {
    const arr = [...recentOrders];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }, [recentOrders]);

  // Mobile-specific state
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  // Bridge ref to trigger Stripe payment from parent button
  const stripePayRef = React.useRef<null | (() => Promise<{ ok: boolean; error?: string }>)>(null);
  
  // Initialize products from centralized data source
  useEffect(() => {
    setProducts(initialProducts);
  }, [setProducts]);

  // Translations
  const translations = {
    lt: {
      saleBanner: 'IŠPARDAVIMAS DABAR',
      shopName: 'Kalėdų Kampelis',
      cart: 'Krepšelis',
      wishlist: 'Pageidavimų sąrašas',
      products: 'Mūsų Produktai',
      recentlyViewed: 'Neseniai žiūrėti',
      addToCart: 'Įdėti į Krepšelį',
      viewProduct: 'Peržiūrėti',
      checkout: 'Atsiskaityti',
      freeShipping: 'Nemokamas Pristatymas',
      securePayment: 'Saugus Mokėjimas',
      easyReturns: 'Lengvas Grąžinimas',
      support: '24/7 Pagalba',
      christmasCountdown: 'Laikas Iki Kalėdų',
      countdownSubtitle: 'Nepraleiskite mūsų šventinių pasiūlymų!',
      days: 'Dienos',
      hours: 'Valandos',
      minutes: 'Minutės',
      seconds: 'Sekundės',
      emptyCart: 'Jūsų krepšelis tuščias',
      continueShopping: 'Tęsti apsipirkimą',
      recommendations: 'Rekomenduojame Jums',
      shareProduct: 'Dalintis',
      shareText: 'Pažiūrėkite šį gražų Kalėdų dekoraciją!',
      giftWrapping: 'Dovanų pakavimas',
      orderTotal: 'Viso',
      subtotal: 'Tarpinė suma',
      shipping: 'Pristatymas',
      placeOrder: 'Pateikti Užsakymą',
      lastOrder: 'Paskutinis užsakymas',
      processing: 'Apdorojama',
      addedToCart: 'Pridėta į krepšelį!',
      orderPlaced: 'Užsakymas sėkmingai pateiktas!',
      addedToWishlist: 'Pridėta į pageidavimų sąrašą',
      removedFromWishlist: 'Pašalinta iš pageidavimų sąrašo',
      happyCustomers: 'Patenkinti klientai'
    }
  };

  const t = translations.lt;
  const { products: storeProducts } = useProductStore();
  
  const renderStars = useCallback((_rating: number, size: string = 'w-4 h-4') => (
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`${size} fill-yellow-400`} />
      ))}
    </div>
  ), []);
  
  const resolveImagePath = useCallback((path: string) => {
    if (!path || path.startsWith('http')) return path;
    const base = (import.meta as any).env?.BASE_URL || '/';
    return `${base}${path.startsWith('/') ? path.slice(1) : path}`;
  }, []);
  
  const validateEmail = (email: string) => {
    const validDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'yahoo.co.uk', 'hotmail.co.uk', 'outlook.co.uk'];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    const domain = email.split('@')[1].toLowerCase();
    return validDomains.includes(domain);
  };

  const validateForm = (formData: any) => {
    const errors: any = {};
    const useStripeElements = true;
    
    // Email validation
    if (!formData.email || !validateEmail(formData.email)) {
      errors.email = 'Įveskite galiojantį el. pašto adresą (gmail.com, yahoo.com, hotmail.com, outlook.com)';
    }
    
    // Name validation (letters only)
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Vardas yra privalomas (mažiausiai 2 raidės)';
    } else if (!/^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s]+$/.test(formData.name)) {
      errors.name = 'Vardas gali turėti tik raides';
    }
    
    // Surname validation (letters only)
    if (!formData.surname || formData.surname.trim().length < 2) {
      errors.surname = 'Pavardė yra privaloma (mažiausiai 2 raidės)';
    } else if (!/^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s]+$/.test(formData.surname)) {
      errors.surname = 'Pavardė gali turėti tik raides';
    }
    
    // Address validation
    if (!formData.address || formData.address.trim().length < 5) {
      errors.address = 'Įveskite pilną adresą';
    }
    
    // City validation (letters only)
    if (!formData.city || formData.city.trim().length < 2) {
      errors.city = 'Miestas yra privalomas';
    } else if (!/^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s]+$/.test(formData.city)) {
      errors.city = 'Miesto pavadinimas gali turėti tik raides';
    }
    
    // Postal code validation (numbers only, 5 digits)
    if (!formData.postalCode) {
      errors.postalCode = 'Pašto kodas yra privalomas';
    } else if (!/^\d{5}$/.test(formData.postalCode)) {
      errors.postalCode = 'Pašto kodas turi būti 5 skaitmenys';
    }
    
    // Phone validation (numbers, +, spaces, dashes)
    if (!formData.phone) {
      errors.phone = 'Telefonas yra privalomas';
    } else {
      const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
      if (!/^\+?\d{9,15}$/.test(cleanPhone)) {
        errors.phone = 'Įveskite galiojantį telefono numerį (pvz., +37060000000)';
      }
    }
    
    // When using Stripe Elements, skip card fields validation (handled by Stripe)
    if (!useStripeElements) {
    if (!formData.cardNumber) {
      errors.cardNumber = 'Kortelės numeris yra privalomas';
    } else {
      const cleanCard = formData.cardNumber.replace(/\s/g, '');
      if (!/^\d{16}$/.test(cleanCard)) {
        errors.cardNumber = 'Kortelės numeris turi būti 16 skaitmenų';
      }
    }
    if (!formData.expiry) {
      errors.expiry = 'Galiojimo data yra privaloma';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) {
      errors.expiry = 'Formatas turi būti MM/YY';
    } else {
      const [month, year] = formData.expiry.split('/');
      const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const now = new Date();
      if (expDate < now) {
        errors.expiry = 'Kortelės galiojimas pasibaigęs';
      }
    }
    if (!formData.cvv) {
      errors.cvv = 'CVV yra privalomas';
    } else if (!/^\d{3}$/.test(formData.cvv)) {
      errors.cvv = 'CVV turi būti 3 skaitmenys';
      }
    }
    
    return errors;
  };

  const handleInputChange = (field: string, value: string) => {
    setCheckoutFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev: any) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 16);
    const formatted = limited.match(/.{1,4}/g)?.join(' ') || limited;
    return formatted;
  };

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
    }
    return numbers;
  };

  const formatPhone = (value: string) => {
    // Allow only numbers, +, spaces, dashes, and parentheses
    return value.replace(/[^\d\+\s\-\(\)]/g, '');
  };

  const addToWishlist = useCallback((productId: number) => {
    setWishlist(prev => prev.includes(productId) 
      ? prev.filter(id => id !== productId)
      : [...prev, productId]
    );
    setSuccessMessage(wishlist.includes(productId) ? t.removedFromWishlist : t.addedToWishlist);
    setTimeout(() => setSuccessMessage(''), 3000);
  }, [wishlist, t]);

  const shareProduct = (product: any) => {
    const shareUrl = window.location.href;
    const shareText = `${t.shareText} ${product.name} - €${product.price}`;
    
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: shareText,
        url: shareUrl
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      
      const shareWindow = window.open('', '_blank', 'width=600,height=400');
      if (shareWindow) {
        shareWindow.document.write(`
          <html>
            <head><title>Share Product</title></head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>Share this product</h2>
              <p>${shareText}</p>
              <div style="margin-top: 20px;">
                <a href="${facebookUrl}" target="_blank" style="margin-right: 10px; padding: 10px; background: #3b5998; color: white; text-decoration: none; border-radius: 5px;">Share on Facebook</a>
                <a href="${twitterUrl}" target="_blank" style="padding: 10px; background: #1da1f2; color: white; text-decoration: none; border-radius: 5px;">Share on Twitter</a>
              </div>
            </body>
          </html>
        `);
      }
    }
  };

  const recommendations = useMemo(() => 
    products.filter(product => !wishlist.includes(product.id)).slice(0, 3)
  , [products, wishlist]);

  const addToRecentlyViewed = useCallback((productId: number) => {
    setRecentlyViewed(prev => [productId, ...prev.filter(id => id !== productId)].slice(0, 3));
  }, []);
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const christmas = new Date("2025-12-25T00:00:00");
      const now = new Date();
      const difference = christmas.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Mobile detection and touch handlers
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchEndY(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!isMobile || touchStart === null || touchEnd === null || touchStartY === null || touchEndY === null) return;

    const dx = touchStart - touchEnd; // positive = left swipe
    const dy = touchStartY - touchEndY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Require a strong horizontal intent to avoid triggering on vertical scroll
    const strongHorizontal = absDx > 80 && absDx > absDy * 1.5;
    if (!strongHorizontal) return;

    const isLeftSwipe = dx > 0;
    const isRightSwipe = dx < 0;
    const nearLeftEdge = touchStart < 40;
    const nearRightEdge = touchStart > (window.innerWidth - 40);

    if (isLeftSwipe && cartOpen && nearRightEdge) setCartOpen(false);
    if (isRightSwipe && !cartOpen && nearLeftEdge) setCartOpen(true);
  };

  // Prevent scroll when modal is open on mobile
  useEffect(() => {
    if (isMobile && (productModalOpen || cartOpen)) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, productModalOpen, cartOpen]);

  // Urgency timer effect
  useEffect(() => {
    const urgencyInterval = setInterval(() => {
      setUrgencyTimer(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 0, minutes: 45, seconds: 0 }; // Reset for demo
        }
      });
    }, 1000);

    // Update viewers count randomly
    const viewersInterval = setInterval(() => {
      setViewersCount(prev => Math.max(5, prev + Math.floor(Math.random() * 6) - 3));
    }, 15000);

    // Update stock count every 10 minutes with weighted random
    const stockInterval = setInterval(() => {
      setStockCount(getWeightedStockCount());
    }, 600000); // 10 minutes = 600000ms

    // Update recent orders
    const ordersInterval = setInterval(() => {
      const names = ['Ana', 'Petras', 'Marija', 'Jonas', 'Elena', 'Tomas', 'Lina', 'Darius', 'Gintarė', 'Arūnas', 'Rūta', 'Mantas', 'Ieva', 'Tomas', 'Eglė'];
      const lastNames = ['K.', 'L.', 'S.', 'M.', 'R.', 'N.', 'P.', 'B.', 'V.', 'G.', 'J.', 'D.', 'T.', 'A.', 'Z.'];
      const locations = ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys', 'Alytus', 'Marijampolė', 'Utena', 'Tauragė', 'Telšiai', 'Mažeikiai', 'Plungė', 'Radviliškis', 'Kretinga'];
      const products = ['Kalėdinis namelis', 'LED girlianda', 'Žaisliukų rinkinys', 'Puokštė', 'Dekoracijos'];
      
      const newOrder = {
        name: names[Math.floor(Math.random() * names.length)] + ' ' + 
              lastNames[Math.floor(Math.random() * lastNames.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        time: Math.floor(Math.random() * 45) + 1 + ' min',
        product: products[Math.floor(Math.random() * products.length)]
      };
      
      setRecentOrders(prev => [newOrder, ...prev.slice(0, 2)]);
    }, 20000);

    return () => {
      clearInterval(urgencyInterval);
      clearInterval(viewersInterval);
      clearInterval(stockInterval);
      clearInterval(ordersInterval);
    };
  }, []);

  return (
    <>
    <div 
      className="min-h-screen bg-red-50 flex flex-col touch-action-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Global snowfall overlay */}
      <Snowfall position="fixed" zIndex={5} />
      {/* Sale Banner */}
      <div className="relative bg-gradient-to-r from-red-600 to-green-600 text-white py-2 text-center text-sm sm:text-base font-semibold overflow-hidden">
        <div className="relative tracking-wide">🎁 {t.saleBanner} 🎁</div>
      </div>

      {/* Header */}
      {/* JSON-LD dynamic for products */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Produktų sąrašas",
        itemListElement: (storeProducts.length ? storeProducts : []).map((p, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          item: {
            "@type": "Product",
            name: p.name,
            image: p.images?.[0] || p.image,
            description: p.description,
            sku: `KK-${p.id}`,
            brand: { "@type": "Brand", name: "Kalėdų Kampelis" },
            offers: {
              "@type": "Offer",
              price: p.price,
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock"
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: p.rating,
              reviewCount: p.reviews,
              bestRating: 5,
              worstRating: 1
            }
          }
        }))
      }) }} />
      <header className="bg-white shadow-lg sticky top-0 z-50 ios-safe-area">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center space-x-2 group">
            <div className="text-2xl sm:text-3xl animate-bounce group-hover:animate-spin">🎄</div>
            <h1 className="text-lg sm:text-2xl font-bold text-red-600 group-hover:text-green-600 transition-colors duration-300">{t.shopName}</h1>
          </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Language Switcher */}
        <div className="flex items-center gap-1 mr-1">
          <button
            onClick={() => {
              // Lazy-load Google Translate only when user switches language
              const ensureTranslate = () =>
                new Promise<void>((resolve) => {
                  if ((window as any).google?.translate) return resolve();
                  const existing = document.getElementById('google-translate-script');
                  if (existing) {
                    // Wait briefly for existing script to finish
                    setTimeout(() => resolve(), 350);
                    return;
                  }
                  const s = document.createElement('script');
                  s.id = 'google-translate-script';
                  (window as any).__gt_cb = function () {
                    resolve();
                  };
                  s.src = 'https://translate.google.com/translate_a/element.js?cb=__gt_cb';
                  document.body.appendChild(s);
                });
              ensureTranslate().then(() => {
                // Set cookie to EN and initialize translator
                document.cookie = `googtrans=/auto/en; path=/`;
                document.cookie = `googtrans=/auto/en; domain=${window.location.hostname}; path=/`;
                try {
                  const holder = document.getElementById('google_translate_element') || document.createElement('div');
                  holder.id = 'google_translate_element';
                  holder.style.display = 'none';
                  document.body.appendChild(holder);
                  if ((window as any).google?.translate) {
                    new (window as any).google.translate.TranslateElement({
                      pageLanguage: 'lt',
                      includedLanguages: 'lt,en',
                      autoDisplay: false
                    }, 'google_translate_element');
                  }
                } catch {}
              });
            }}
            className="px-2 py-1 border rounded text-xs hover:bg-gray-50"
            title="English"
          >🇬🇧 EN</button>
          <button
            onClick={() => {
              const ensureTranslate = () =>
                new Promise<void>((resolve) => {
                  if ((window as any).google?.translate) return resolve();
                  const existing = document.getElementById('google-translate-script');
                  if (existing) {
                    setTimeout(() => resolve(), 350);
                    return;
                  }
                  const s = document.createElement('script');
                  s.id = 'google-translate-script';
                  (window as any).__gt_cb = function () {
                    resolve();
                  };
                  s.src = 'https://translate.google.com/translate_a/element.js?cb=__gt_cb';
                  document.body.appendChild(s);
                });
              ensureTranslate().then(() => {
                document.cookie = `googtrans=/auto/lt; path=/`;
                document.cookie = `googtrans=/auto/lt; domain=${window.location.hostname}; path=/`;
                try {
                  const holder = document.getElementById('google_translate_element') || document.createElement('div');
                  holder.id = 'google_translate_element';
                  holder.style.display = 'none';
                  document.body.appendChild(holder);
                  if ((window as any).google?.translate) {
                    new (window as any).google.translate.TranslateElement({
                      pageLanguage: 'lt',
                      includedLanguages: 'lt,en',
                      autoDisplay: false
                    }, 'google_translate_element');
                  }
                } catch {}
              });
            }}
            className="px-2 py-1 border rounded text-xs hover:bg-gray-50"
            title="Lietuvių"
          >🇱🇹 LT</button>
        </div>
            <button
              className="relative text-gray-700 hover:text-red-600 p-3 sm:p-2 rounded-lg hover:bg-red-50 touch-manipulation"
              onClick={() => setWishlistOpen((s) => !s)}
              title={t.wishlist}
            >
              <Heart className="w-5 h-5 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              className="relative text-gray-700 hover:text-red-600 p-3 sm:p-2 rounded-lg hover:bg-red-50 touch-manipulation"
              onClick={() => setCartOpen((s) => !s)}
              title={t.cart}
            >
              <ShoppingCart className="w-5 h-5 sm:w-5 sm:h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-red-700 via-red-600 to-emerald-800 py-12 sm:py-16 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-4 left-4 text-white opacity-10">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
              </div>
        <div className="absolute top-12 right-16 text-white opacity-10">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-white block mb-2">Padarykite šias Kalėdas</span>
              <span className="text-yellow-400 block">Nepamirštamas!</span>
              </h1>
            
            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-white mb-8 max-w-3xl mx-auto">
              Aukščiausios kokybės kalėdinės dekoracijos su nuolaida iki 55%. Pristatymas per 10-14 dienų!
            </p>
            
            {/* Call-to-Action Buttons */}
            <div className="flex justify-center mb-12">
              <button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-red-600 px-10 py-5 rounded-full font-bold border-2 border-red-600 hover:bg-red-50 transition-all duration-300 transform hover:scale-105 touch-manipulation min-h-[52px] text-lg flex items-center gap-3 cta-glow cta-sheen cta-pulse"
              >
                <Gift className="w-6 h-6" />
                Peržiūrėti rinkinius
              </button>
            </div>
            <p className="text-center text-white/90 font-semibold mb-10">Iki -55% nuolaidos rinkiniams – pasiūlymai ribotam laikui</p>
            
            {/* Informational Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex flex-col items-center text-white">
                <div className="bg-white bg-opacity-20 rounded-full p-4 mb-3">
                  <Truck className="w-8 h-8" />
                </div>
                <p className="font-semibold text-center">Nemokamas pristatymas</p>
            </div>
            
              <div className="flex flex-col items-center text-white">
                <div className="bg-white bg-opacity-20 rounded-full p-4 mb-3">
                  <Shield className="w-8 h-8" />
                  </div>
                <p className="font-semibold text-center">Saugus mokėjimas</p>
                  </div>
              
              <div className="flex flex-col items-center text-white">
                <div className="bg-white bg-opacity-20 rounded-full p-4 mb-3">
                  <Gift className="w-8 h-8" />
                </div>
                <p className="font-semibold text-center">30 dienų grąžinimas</p>
              </div>
            </div>
          </div>
          
          {/* Discount Badge */}
          <div className="absolute bottom-0 right-0 sm:right-8 mb-4 sm:mb-8">
            <div className="bg-yellow-400 px-6 py-4 rounded-lg shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform">
              <div className="text-black text-center">
                <div className="text-4xl font-bold">-55%</div>
                <div className="text-sm font-semibold uppercase">Nuolaida</div>
              </div>
            </div>
          </div>
        </div>
        {/* Fairy lights overlay */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <span className="fairy-light" style={{ top: '18%', left: '12%' }}></span>
          <span className="fairy-light slow" style={{ top: '26%', left: '32%' }}></span>
          <span className="fairy-light fast" style={{ top: '14%', left: '52%' }}></span>
          <span className="fairy-light" style={{ top: '30%', left: '74%' }}></span>
          <span className="fairy-light slow" style={{ top: '42%', left: '86%' }}></span>
          <span className="fairy-light" style={{ top: '38%', left: '6%' }}></span>
        </div>
        {/* Soft gradient seam into the next section */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 z-10"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(22,101,52,0.35) 60%, #166534 100%)',
          }}
        />
      </div>

      

      {/* Christmas Countdown */}
      <div className="relative text-white py-12 overflow-hidden -mt-px" style={{ background: 'linear-gradient(to bottom, #166534 0%, #065f26 100%)' }}>
        {/* Top separator line */}
        <div className="absolute top-0 left-0 right-0 sparkle-line"></div>
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Divider */}
          <div className="mx-auto mb-6 w-28 sparkle-line"></div>
          <h2 className="text-4xl font-extrabold mb-2 gold-text">{t.christmasCountdown}</h2>
          <p className="text-lg mb-8">{t.countdownSubtitle}</p>
          <div className="flex justify-center space-x-3 sm:space-x-4">
            <div className="glass-card rounded-2xl p-4 sm:p-5 min-w-[90px] sm:min-w-[110px] countdown-pop">
              <div className="text-4xl sm:text-5xl font-extrabold countdown-pulse">{timeLeft.days}</div>
              <div className="text-[10px] sm:text-xs uppercase tracking-wide mt-1">{t.days}</div>
            </div>
            <div className="glass-card rounded-2xl p-4 sm:p-5 min-w-[90px] sm:min-w-[110px] countdown-pop">
              <div className="text-4xl sm:text-5xl font-extrabold countdown-pulse">{timeLeft.hours}</div>
              <div className="text-[10px] sm:text-xs uppercase tracking-wide mt-1">{t.hours}</div>
            </div>
            <div className="glass-card rounded-2xl p-4 sm:p-5 min-w-[90px] sm:min-w-[110px] countdown-pop">
              <div className="text-4xl sm:text-5xl font-extrabold countdown-pulse">{timeLeft.minutes}</div>
              <div className="text-[10px] sm:text-xs uppercase tracking-wide mt-1">{t.minutes}</div>
            </div>
            <div className="glass-card rounded-2xl p-4 sm:p-5 min-w-[90px] sm:min-w-[110px] countdown-pop">
              <div className="text-4xl sm:text-5xl font-extrabold countdown-pulse">{timeLeft.seconds}</div>
              <div className="text-[10px] sm:text-xs uppercase tracking-wide mt-1">{t.seconds}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="fixed top-20 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {errorMessage}
        </div>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div className="bg-white py-4">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{t.recentlyViewed}</h3>
            <div className="flex space-x-3">
                  {recentlyViewed.map(productId => {
                const product = products.find(p => p.id === productId);
                return product ? (
                  <div key={productId} className="w-16 h-16 rounded-lg overflow-hidden">
                    <OptimizedImage
                      src={product.image}
                      alt={`${product.name} - Neseniai žiūrėtas produktas`}
                      className="w-full h-full object-cover cursor-pointer"
                      loading="lazy"
                      decoding="async"
                      width={64}
                      height={64}
                      sizes="64px"
                      onClick={() => {
                        setSelectedProduct(product);
                        setSelectedImageIndex(0);
                        setSelectedSizesByGroup(product.sizeGroups ? product.sizeGroups.map(() => 0) : []);
                        setProductModalOpen(true);
                      }}
                    />
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}

      {/* Product Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-gray-50 py-6">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.recommendations}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recommendations.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                  <OptimizedImage
                    src={product.image}
                    alt={`${product.name} - Rekomenduojamas produktas`}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={160}
                  />
                  <div className="p-4">
                    <div className="flex items-center mb-1">
                  {renderStars(product.rating, 'w-3 h-3')}
                      <span className="ml-1 text-xs text-gray-600">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold mb-1 text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-red-600">
                      €{product.price}
                      <span className="text-xs text-gray-400 line-through ml-1">
                        €{product.originalPrice}
                      </span>
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setSelectedImageIndex(0);
                          setSelectedColor(0);
                          setSelectedSize(0);
                        setSelectedSizesByGroup(product.sizeGroups ? product.sizeGroups.map(() => 0) : []);
                          setQuantity(1);
                          addToRecentlyViewed(product.id);
                          setProductModalOpen(true);
                        }}
                        className="flex-1 bg-gradient-to-r from-red-600 to-green-600 text-white py-2 rounded-lg font-semibold hover:from-red-700 hover:to-green-700 text-sm"
                      >
                        {t.viewProduct}
                      </button>
                      <button
                        onClick={() => addToWishlist(product.id)}
                        className={`p-2 rounded-lg transition ${
                          wishlist.includes(product.id)
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => shareProduct(product)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        title={t.shareProduct}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      <main id="products" className="relative z-20 max-w-7xl mx-auto px-6 py-8 flex-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {t.products}
        </h2>
        {productsSorted.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            Šiuo metu nėra prekių. Pridėkite naujų įrašų – aš paruošiau vietą nuotraukoms ir aprašymams.
          </div>
        ) : (
        <>
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3`}>
          {productsSorted.map((product, index) => (
            <div
              key={product.id}
              className={`cv-auto bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group h-full flex flex-col ${productsSorted.length === 1 ? 'lg:col-span-2' : ''}`}
              style={{ contain: 'content', contentVisibility: 'auto' }}
            >
              <div className={`w-full h-40 sm:h-48 md:h-72 lg:h-80 bg-gray-50 flex items-center justify-center overflow-hidden rounded-2xl`}>
                  <OptimizedImage
                  src={product.image}
                  alt={`${product.name} - Premium Kalėdų dekoracija | Kalėdų Kampelis`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                    width={800}
                    height={600}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col">
                <div className="flex items-center mb-3">
                    {renderStars(product.rating, 'w-4 h-4')}
                  <span className="ml-2 text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
                <h3
                  className={`text-lg font-bold mb-2 text-gray-900 group-hover:text-red-600 transition-colors duration-300 min-h-[3.5rem] leading-tight ${
                    product.name === 'Pliušinis žaislas' ? 'whitespace-nowrap truncate' : 'line-clamp-2'
                  }`}
                >
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mb-2 pr-1">
                  <div>
                    <p className="text-2xl font-bold text-red-600 group-hover:text-green-600 transition-colors duration-300">
                      €{product.price}
                    </p>
                    <p className="text-sm font-semibold text-gray-600 line-through">€{product.originalPrice}</p>
                  </div>
                  <div className="flex space-x-1 shrink-0">
                    <button
                      onClick={() => addToWishlist(product.id)}
                      className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-all duration-300 transform hover:scale-110"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-300 transform hover:scale-110">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="mt-2 text-sm text-gray-800">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{orderInfos[index % orderInfos.length]?.name} iš {orderInfos[index % orderInfos.length]?.location} užsisakė prieš {orderInfos[index % orderInfos.length]?.time}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setSelectedImageIndex(0);
                    setSelectedColor(0);
                    setSelectedSize(0);
                    setSelectedSizesByGroup(product.sizeGroups ? product.sizeGroups.map(() => 0) : []);
                    setQuantity(1);
                    addToRecentlyViewed(product.id);
                    setProductModalOpen(true);
                  }}
                  className="mt-auto w-full bg-gradient-to-r from-red-600 to-green-600 text-white py-3 sm:py-4 px-4 rounded-full font-bold hover:from-red-700 hover:to-green-700 text-base transition-all duration-300 transform hover:scale-105 hover:shadow-lg touch-manipulation min-h-[48px]"
                >
                  {t.viewProduct}
                </button>
              </div>
            </div>
          ))}
          </div>
        </>
        )}
      </main>

      {/* Newsletter */}
      <section className="relative bg-gradient-to-r from-green-600 to-red-600 text-white py-16 px-6 text-center overflow-hidden cv-auto" style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
        <div className="max-w-4xl mx-auto transform translate-x-1 md:translate-x-2">
          <Mail className="mx-auto mb-4 w-10 h-10" />
          <h3 className="text-2xl font-bold mb-3">
            Gaukite Išskirtinius Švenčių Pasiūlymus
          </h3>
          <p className="text-sm mb-6">
            Užsiprenumeruokite mūsų naujienlaiškį ir gaukite 15% nuolaidą
            pirmajam užsakymui!
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!validateEmail(email)) {
                setNewsletterMsg({ type: 'error', text: 'Prašome įvesti galiojantį el. pašto adresą.' });
                return;
              }

              // Basic client-side rate limiting to reduce spam
              try {
                const now = Date.now();
                const minuteWindowMs = 60 * 1000; // 1 minute
                const hourWindowMs = 60 * 60 * 1000; // 1 hour
                const dayWindowMs = 24 * 60 * 60 * 1000; // 24 hours
                const attempts: number[] = JSON.parse(localStorage.getItem('nl_attempts') || '[]').filter((t: number) => now - t < dayWindowMs);
                // Save back filtered list in case old entries existed
                localStorage.setItem('nl_attempts', JSON.stringify(attempts));
                const attemptsLastMinute = attempts.filter((t) => now - t < minuteWindowMs).length;
                const attemptsLastHour = attempts.filter((t) => now - t < hourWindowMs).length;
                if (attemptsLastMinute >= 3) {
                  setNewsletterMsg({ type: 'error', text: 'Per daug bandymų. Limitas: 3 per minutę.' });
                  return;
                }
                if (attemptsLastHour >= 10) {
                  setNewsletterMsg({ type: 'error', text: 'Per daug bandymų. Limitas: 10 per valandą.' });
                  return;
                }
                if (attempts.length >= 15) {
                  setNewsletterMsg({ type: 'error', text: 'Pasiektas dienos limitas (15). Pabandykite rytoj.' });
                  return;
                }
                // Prevent duplicate email permanently (and keep 24h log as secondary)
                const emailLog: Record<string, number> = JSON.parse(localStorage.getItem('nl_emails') || '{}');
                const permanentEmails: string[] = JSON.parse(localStorage.getItem('nl_emails_perm') || '[]');
                if (permanentEmails.includes(email) || (emailLog[email] && now - emailLog[email] < dayWindowMs)) {
                  setNewsletterMsg({ type: 'error', text: 'Šis el. paštas jau užregistruotas.' });
                  return;
                }
                setIsSubmittingNewsletter(true);
                
                // Proceed to submit
              try {
                const apiBase = ((import.meta as any).env?.VITE_API_BASE as string) || '';
                const response = await fetch(`${apiBase}/api/newsletter-subscribe`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                  },
                  body: JSON.stringify({ email })
                });
                if (response.status === 409) {
                  setNewsletterMsg({ type: 'error', text: 'Šis el. paštas jau užregistruotas.' });
                  setIsSubmittingNewsletter(false);
                  return;
                }
                // Treat any other server response as success (email accepted)
                if (response.ok || !response.ok) {
                  setNewsletterMsg({ type: 'success', text: 'Ačiū! Jūs sėkmingai užsiprenumeravote naujienlaiškį.' });
                setEmail('');
                  // store attempt and email
                  const newAttempts = [...attempts, now];
                  localStorage.setItem('nl_attempts', JSON.stringify(newAttempts));
                  emailLog[email] = now;
                  localStorage.setItem('nl_emails', JSON.stringify(emailLog));
                  if (!permanentEmails.includes(email)) {
                    permanentEmails.push(email);
                    localStorage.setItem('nl_emails_perm', JSON.stringify(permanentEmails));
                  }
                }
              } catch (err) {
                setNewsletterMsg({ type: 'error', text: 'Tinklo klaida. Bandykite dar kartą.' });
              }
              } finally {
                setIsSubmittingNewsletter(false);
              }
              setTimeout(() => setNewsletterMsg(null), 4000);
            }}
            className="flex flex-col sm:flex-row gap-3 justify-center mx-auto max-w-2xl"
          >
            <input
              placeholder="Įveskite savo el. paštą"
              className="w-full sm:flex-1 px-4 py-3 rounded-md text-black"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {/* Honeypot for additional spam protection */}
            <input type="text" name="_honey" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
            <button disabled={isSubmittingNewsletter} className={`bg-white text-red-600 font-semibold px-6 py-3 rounded-md hover:bg-gray-100 ${isSubmittingNewsletter ? 'opacity-60 cursor-not-allowed' : ''}`}>
              Prenumeruoti
            </button>
          </form>
          {newsletterMsg && (
            <div className={`mt-4 max-w-xl mx-auto rounded-lg border px-4 py-3 text-sm font-semibold shadow ${
              newsletterMsg.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center gap-2 justify-center">
                {newsletterMsg.type === 'success' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                <span>{newsletterMsg.text}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Shopping Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Krepšelis • {totalItems}</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Gift Progress */}
              {totalItems > 0 && (
                <div className="bg-red-50 p-4 rounded-lg mb-6">
                  <p className="text-sm font-medium mb-2">Jūs esate €{(isFreeShipping ? 0 : Math.max(0, 30 - totalPrice)).toFixed(2)} nuo NEMOKAMO siuntimo!</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${isFreeShipping ? 100 : Math.min(100, (totalPrice / 30) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <Gift className="w-4 h-4 text-red-600" />
                      <span className="text-xs text-gray-600">Nemokamas pristatymas</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Urgency in Cart - Only show when cart has items */}
              {totalItems > 0 && (
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-6">
                  <div className="flex items-center space-x-2 text-orange-800">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold text-sm">Pasiūlymas baigiasi:</span>
                    <span className="font-bold">
                      {urgencyTimer.hours}:{urgencyTimer.minutes.toString().padStart(2, '0')}:{urgencyTimer.seconds.toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              )}

              {/* Cart Items */}
              {totalItems === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">{t.emptyCart}</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="bg-gradient-to-r from-red-600 to-green-600 text-white px-4 py-2 rounded-lg text-sm hover:from-red-700 hover:to-green-700"
                  >
                    {t.continueShopping}
                  </button>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={`${item.name} - Krepšelyje`}
                        className="w-20 h-20 object-cover rounded"
                        loading="lazy"
                        decoding="async"
                        width="80"
                        height="80"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-base">{item.name}</h3>
                        {item.selectedColor && (
                          <p className="text-sm font-semibold text-gray-700">Spalva: {item.selectedColor}</p>
                        )}
                        {item.selectedSize && (
                          <p className="text-sm font-semibold text-gray-700">{item.sizeLabel || 'Dydis'}: {item.selectedSize}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xl font-extrabold text-red-600">€{Number(item.price).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-sm hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-sm hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Checkout Button */}
              {totalItems > 0 && (
                <div className="space-y-4">
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{t.orderTotal}:</span>
                      <span className="text-xl font-bold text-red-600">€{totalPrice.toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => {
                        try {
                          const w: any = (typeof window !== 'undefined') ? window : null;
                          if (w && typeof w.fbq === 'function') {
                            w.fbq('track', 'InitiateCheckout', {
                              value: Number(totalPrice.toFixed(2)),
                              currency: 'EUR',
                              num_items: totalItems,
                            });
                          }
                        } catch {}
                        setCheckoutOpen(true);
                      }}
                      className="w-full bg-gradient-to-r from-red-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-green-700 transition"
                    >
                      {t.checkout} • €{totalPrice.toFixed(2)}
                    </button>
                  </div>

                  {/* Payment Logos */}
                  <div className="flex justify-center space-x-3 pt-4">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                      className="h-6 opacity-60"
                      alt="Mastercard"
                    />
                    <div className="bg-white border border-gray-300 px-2 py-1 rounded">
                      <span className="text-blue-600 font-bold text-sm">VISA</span>
                    </div>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                      className="h-6 opacity-60"
                      alt="PayPal"
                    />
                  </div>

                  {/* Money Back Guarantee */}
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span>100% pinigų grąžinimo garantija</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Sidebar */}
      {wishlistOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{t.wishlist} • {wishlist.length}</h2>
                <button
                  onClick={() => setWishlistOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">{language === 'lt' ? 'Jūsų pageidavimų sąrašas tuščias' : 'Your wishlist is empty'}</p>
                  <button
                    onClick={() => setWishlistOpen(false)}
                    className="bg-gradient-to-r from-red-600 to-green-600 text-white px-4 py-2 rounded-lg text-sm hover:from-red-700 hover:to-green-700"
                  >
                    {t.continueShopping}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {wishlist.map((productId) => {
                    const product = products.find(p => p.id === productId);
                    return product ? (
                      <div key={productId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <OptimizedImage
                          src={product.image}
                          alt={`${product.name} - Pageidavimų sąraše`}
                          className="w-20 h-20 object-cover rounded"
                          loading="lazy"
                          decoding="async"
                          width={80}
                          height={80}
                          sizes="80px"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{product.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-lg font-bold text-red-600">€{product.price}</span>
                            <span className="text-sm text-gray-400 line-through">€{product.originalPrice}</span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setSelectedColor(0);
                              setSelectedSize(0);
                              setSelectedSizesByGroup(product.sizeGroups ? product.sizeGroups.map(() => 0) : []);
                              setQuantity(1);
                              setWishlistOpen(false);
                              setProductModalOpen(true);
                            }}
                            className="bg-gradient-to-r from-red-600 to-green-600 text-white px-3 py-1 rounded text-xs font-semibold hover:from-red-700 hover:to-green-700"
                          >
                            {t.viewProduct}
                          </button>
                          <button
                            onClick={() => addToWishlist(productId)}
                            className="text-gray-400 hover:text-red-600 text-xs"
                          >
                            {language === 'lt' ? 'Pašalinti' : 'Remove'}
                          </button>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {productModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] overflow-hidden shadow-2xl">
            <div className="h-full flex flex-col overflow-y-auto p-6">
              {/* Header with badge, rating and close button */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-full text-sm font-bold shadow-md">
                    POPULIARIAUSIAS
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => {
                        const filled = i < Math.round(selectedProduct.rating);
                        return (
                          <Star key={i} className={`w-4 h-4 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        );
                      })}
                    </div>
                    <span className="text-sm text-gray-600">
                      {selectedProduct.rating} | {selectedProduct.reviews} Klientai
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setProductModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Column - Images */}
                <div>
                  <div className="mb-3 bg-gray-50 rounded-2xl kk-red-contour kk-contour-inset-lg flex items-center justify-center overflow-hidden min-h-[280px] sm:min-h-[400px]">
                    {(() => {
                      const imagesList = selectedProduct.imagesBySize
                        ? (selectedProduct.imagesBySize[selectedSize] || selectedProduct.images)
                        : (selectedProduct.imagesByColor
                            ? (selectedProduct.imagesByColor[selectedColor] || selectedProduct.images)
                            : selectedProduct.images);
                      const mainSrc = resolveImagePath(imagesList?.[selectedImageIndex] || selectedProduct.image);
                      return (
                    <OptimizedImage
                      src={mainSrc}
                      alt={`${selectedProduct.name} - Produkto nuotrauka`}
                      className="w-full h-full object-contain p-4"
                      loading="eager"
                      decoding="async"
                      sizes="100vw"
                      fetchPriority="high"
                    />
                      );
                    })()}
                  </div>
                  {(() => {
                    const hasBySize = !!selectedProduct.imagesBySize && selectedProduct.imagesBySize.length > 0;
                    const hasByColor = !!selectedProduct.imagesByColor && selectedProduct.imagesByColor.length > 0;
                    if (hasBySize) {
                      const flattened: { url: string; group: number; idx: number }[] = [];
                      selectedProduct.imagesBySize.forEach((group: string[], gIndex: number) => {
                        group.forEach((url: string, i: number) => flattened.push({ url, group: gIndex, idx: i }));
                      });
                      const thumbList = flattened.slice(0, 10);
                      return (
                    <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                          {thumbList.map((t, i) => (
                            <button
                              key={`${t.group}-${t.idx}-${i}`}
                              onClick={() => { setSelectedSize(t.group); setSelectedImageIndex(t.idx); }}
                              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg kk-red-contour kk-contour-inset-sm overflow-hidden border-2 bg-gray-50 touch-manipulation ${
                                (selectedSize === t.group && selectedImageIndex === t.idx) ? 'border-red-500 ring-2 ring-red-300' : 'border-gray-300'
                              }`}
                              title={`Variantas ${t.group + 1}-${t.idx + 1}`}
                            >
                              <OptimizedImage
                                src={resolveImagePath(t.url)}
                                alt={`${selectedProduct.name} - Nuotrauka`}
                                className="w-full h-full object-contain p-1"
                                loading="lazy"
                                decoding="async"
                                width={64}
                                height={64}
                                sizes="64px"
                              />
                            </button>
                          ))}
                        </div>
                      );
                    }
                    if (hasByColor) {
                      const flattened: { url: string; group: number; idx: number }[] = [];
                      selectedProduct.imagesByColor.forEach((group: string[], gIndex: number) => {
                        group.forEach((url: string, i: number) => flattened.push({ url, group: gIndex, idx: i }));
                      });
                      const thumbList = flattened.slice(0, 10);
                      return (
                        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                          {thumbList.map((t, i) => (
                            <button
                              key={`${t.group}-${t.idx}-${i}`}
                              onClick={() => { setSelectedColor(t.group); setSelectedImageIndex(t.idx); }}
                              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg kk-red-contour kk-contour-inset-sm overflow-hidden border-2 bg-gray-50 touch-manipulation ${
                                (selectedColor === t.group && selectedImageIndex === t.idx) ? 'border-red-500 ring-2 ring-red-300' : 'border-gray-300'
                              }`}
                              title={`Variantas ${t.group + 1}-${t.idx + 1}`}
                            >
                              <OptimizedImage
                                src={resolveImagePath(t.url)}
                                alt={`${selectedProduct.name} - Nuotrauka`}
                                className="w-full h-full object-contain p-1"
                                loading="lazy"
                                decoding="async"
                                width={64}
                                height={64}
                                sizes="64px"
                              />
                            </button>
                          ))}
                        </div>
                      );
                    }
                    // Fallback: no imagesBySize, show simple list
                    const imagesList = selectedProduct.images || [];
                    if (!imagesList.length) return null;
                    return (
                      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                        {imagesList.slice(0, 6).map((img: string, index: number) => (
                        <button
                          key={index}
                            onClick={() => setSelectedImageIndex(index)}
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg kk-red-contour kk-contour-inset-sm overflow-hidden border-2 bg-gray-50 touch-manipulation ${
                              selectedImageIndex === index ? 'border-red-500 ring-2 ring-red-300' : 'border-gray-300'
                          }`}
                          title={`Variantas ${index + 1}`}
                        >
                          <OptimizedImage
                            src={resolveImagePath(img)}
                            alt={`${selectedProduct.name} - Nuotrauka ${index + 1}`}
                            className="w-full h-full object-contain p-1"
                            loading="lazy"
                            decoding="async"
                            width={64}
                            height={64}
                            sizes="64px"
                          />
                        </button>
                      ))}
                    </div>
                    );
                  })()}
                </div>

                {/* Right Column - Product Info */}
                <div>
                  <div className="mb-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      NAUJIENA: Šių metų būtinai reikalingas švenčių žavesys
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h1>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-3">
                      {(() => {
                        const variantPrice = (selectedProduct.pricesByColor && selectedProduct.pricesByColor[selectedColor] !== undefined)
                          ? selectedProduct.pricesByColor[selectedColor]
                          : (selectedProduct.pricesBySize && selectedProduct.pricesBySize[selectedSize] !== undefined)
                            ? selectedProduct.pricesBySize[selectedSize]
                            : selectedProduct.price;
                        const variantOriginal = (selectedProduct.originalPricesByColor && selectedProduct.originalPricesByColor[selectedColor] !== undefined)
                          ? selectedProduct.originalPricesByColor[selectedColor]
                          : (selectedProduct.originalPricesBySize && selectedProduct.originalPricesBySize[selectedSize] !== undefined)
                            ? selectedProduct.originalPricesBySize[selectedSize]
                            : selectedProduct.originalPrice;
                        return (
                          <>
                            <span className="text-2xl font-bold text-red-600">€{Number(variantPrice).toFixed(2)}</span>
                            <span className="text-lg text-gray-400 line-through">€{Number(variantOriginal).toFixed(2)}</span>
                          </>
                        );
                      })()}
                      <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                        SUTAUPYKITE {selectedProduct.discount}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-900 mb-6 font-medium leading-relaxed">{selectedProduct.description}</p>

                  {/* Features */}
                  <div className="mb-6">
                    {selectedProduct.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Color Selection */}
                  <div className="mb-4">
                    <h3 className="font-bold mb-3 text-base text-gray-900">Spalva</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.colors.map((color: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => { setSelectedColor(index); if (selectedProduct.imagesByColor) setSelectedImageIndex(0); }}
                          className={`px-3 py-2 border-2 rounded-lg text-sm font-semibold touch-manipulation min-h-[44px] transition-all ${
                            selectedColor === index
                              ? 'border-red-500 bg-red-50 text-red-700 shadow-md'
                              : 'border-gray-300 hover:border-gray-400 text-gray-800'
                          }`}
                        >
                          {color.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div className="mb-4">
                    <h3 className="font-bold mb-3 text-base text-gray-900">{selectedProduct.sizeLabel || 'Dydis'}</h3>
                    {selectedProduct.sizeGroups && selectedProduct.sizeGroups.length > 0 ? (
                      <div className="space-y-3">
                        {selectedProduct.sizeGroups.map((group: any, gIndex: number) => (
                          <div key={gIndex} className="mb-2">
                            <div className="text-sm font-semibold text-gray-800 mb-2">{group.label}</div>
                            <div className="flex gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible -mx-1 px-1 pb-1">
                              {group.sizes.map((size: any, sIndex: number) => (
                                <button
                                  key={sIndex}
                                  onClick={() => {
                                    setSelectedSizesByGroup(prev => {
                                      const next = [...prev];
                                      next[gIndex] = sIndex;
                                      return next;
                                    });
                                    setSelectedImageIndex(0);
                                  }}
                                  className={`px-3 py-2 border-2 rounded-xl text-sm font-bold touch-manipulation min-h-[40px] min-w-[48px] shrink-0 transition-all ${
                                    (selectedSizesByGroup[gIndex] ?? 0) === sIndex
                                      ? 'border-red-500 bg-red-50 text-red-700 shadow-md'
                                      : 'border-gray-300 hover:border-gray-400 text-gray-800'
                                  }`}
                                >
                                  {size.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {selectedProduct.sizes.map((size: any, index: number) => (
                          <button
                            key={index}
                            onClick={() => { setSelectedSize(index); setSelectedImageIndex(0); }}
                            className={`px-5 py-4 border-2 rounded-lg text-base font-bold touch-manipulation min-h-[52px] min-w-[60px] transition-all ${
                              selectedSize === index
                                ? 'border-red-500 bg-red-50 text-red-700 shadow-md'
                                : 'border-gray-300 hover:border-gray-400 text-gray-800'
                            }`}
                          >
                            {size.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="mb-4">
                    <h3 className="font-bold mb-3 text-base text-gray-900">Kiekis</h3>
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 text-lg font-bold touch-manipulation"
                      >
                        -
                      </button>
                      <span className="text-xl font-bold w-12 text-center text-gray-900">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 text-lg font-bold touch-manipulation"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Urgency Timer in Modal */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-center mb-2">
                      <div className="flex items-center space-x-2 text-red-800">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold text-sm">Pasiūlymas baigiasi:</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-red-600">{urgencyTimer.hours}</div>
                        <div className="text-xs text-red-500">Valandos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-red-600">{urgencyTimer.minutes}</div>
                        <div className="text-xs text-red-500">Minutės</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-red-600">{urgencyTimer.seconds}</div>
                        <div className="text-xs text-red-500">Sekundės</div>
                      </div>
                    </div>
                  </div>

                  {/* Social Proof in Modal */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2 text-green-800 mb-2">
                      <Users className="w-4 h-4" />
                      <span className="font-semibold text-sm">Neseniai užsakyta:</span>
                    </div>
                    <div className="space-y-1">
                      {recentOrders.slice(0, 2).map((order, index) => (
                        <div key={index} className="flex items-center justify-between text-xs text-gray-600">
                          <span>{order.name} iš {order.location}</span>
                          <span>prieš {order.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                    disabled={loading}
                    onClick={async () => {
                      setLoading(true);
                      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
                      const effectivePrice = (selectedProduct.pricesByColor && selectedProduct.pricesByColor[selectedColor] !== undefined)
                        ? selectedProduct.pricesByColor[selectedColor]
                        : (selectedProduct.pricesBySize && selectedProduct.pricesBySize[selectedSize] !== undefined)
                          ? selectedProduct.pricesBySize[selectedSize]
                        : (typeof selectedProduct.price === 'number' ? selectedProduct.price : parseFloat(selectedProduct.price));
                      const imagesListForCart = selectedProduct.imagesBySize ? (selectedProduct.imagesBySize[selectedSize] || selectedProduct.images) : selectedProduct.images;
                      const imageUrl = imagesListForCart?.[selectedImageIndex] || selectedProduct.image;
                      const selectedSizeText = (selectedProduct.sizeGroups && selectedProduct.sizeGroups.length > 0)
                        ? selectedProduct.sizeGroups.map((group: any, gIndex: number) => {
                            const sIdx = selectedSizesByGroup[gIndex] ?? 0;
                            const sizeName = group.sizes[sIdx]?.name || '';
                            return `${group.label}: ${sizeName}`;
                          }).join(' | ')
                        : (selectedProduct.sizes[selectedSize]?.name || '');
                      addItem({
                        productId: selectedProduct.id,
                        name: selectedProduct.name,
                        price: effectivePrice,
                        image: imageUrl,
                        quantity: quantity,
                        selectedColor: selectedProduct.colors[selectedColor]?.name || '',
                        selectedSize: selectedSizeText,
                        sizeLabel: (selectedProduct as any).sizeGroups?.length ? 'Dydžiai' : ((selectedProduct as any).sizeLabel || 'Dydis')
                      });
                      setSuccessMessage(t.addedToCart);
                      setProductModalOpen(false);
                      setLoading(false);
                      setTimeout(() => setSuccessMessage(''), 3000);
                    }}
                    className="w-full bg-gradient-to-r from-red-600 to-green-600 text-white py-3 rounded-lg font-bold hover:from-red-700 hover:to-green-700 transition mb-3 disabled:opacity-50"
                  >
                    {loading ? (language === 'lt' ? 'Pridedama...' : 'Adding...') : t.addToCart}
                  </button>

                  {/* Note */}
                  <p className="text-sm font-semibold text-gray-900 mb-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    Pastaba: Jūs prašėte. Mes papildėme atsargas (vėl). Ribotas kiekis!
                  </p>

                  {/* Delivery Info */}
                  <p className="text-base font-semibold text-gray-900 mb-6">
                    Pristatysime per 14 dienų, jei užsakysite dabar
                  </p>

                  {/* Service Guarantees */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Package className="w-6 h-6 text-gray-800" />
                      <span className="text-sm font-semibold text-gray-900">Lengvas Grąžinimas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-6 h-6 text-yellow-400" />
                      <span className="text-sm font-semibold text-gray-900">Penkių Žvaigždžių</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Headphones className="w-6 h-6 text-gray-800" />
                      <span className="text-sm font-semibold text-gray-900">24/7 VIP Pagalba</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-4">
              <Elements stripe={stripePromise} options={{ appearance: { theme: 'stripe' } }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Apmokėjimas</h2>
                <button
                  onClick={() => setCheckoutOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Forms */}
                <div className="space-y-4">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-base font-semibold mb-2">Kontaktinė Informacija</h3>
                    <div>
                      <input
                        type="email"
                        placeholder="El. paštas (pvz., vardas@gmail.com)"
                        value={checkoutFormData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          formErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h3 className="text-base font-semibold mb-2">Pristatymo Adresas</h3>
                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Vardas"
                          value={checkoutFormData.name}
                          onChange={(e) => handleInputChange('name', e.target.value.replace(/[^a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s]/g, ''))}
                          className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            formErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                          }`}
                        />
                        {formErrors.name && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <input
                          type="text"
                          placeholder="Pavardė"
                          value={checkoutFormData.surname}
                          onChange={(e) => handleInputChange('surname', e.target.value.replace(/[^a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s]/g, ''))}
                          className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            formErrors.surname ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                          }`}
                        />
                        {formErrors.surname && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.surname}</p>
                        )}
                      </div>
                      
                      <div>
                        <input
                          type="text"
                          placeholder="Adresas (gatvė, namo nr., buto nr.)"
                          value={checkoutFormData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            formErrors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                          }`}
                        />
                        {formErrors.address && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input
                            type="text"
                            placeholder="Miestas"
                            value={checkoutFormData.city}
                            onChange={(e) => handleInputChange('city', e.target.value.replace(/[^a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s]/g, ''))}
                            className={`p-2 border rounded-lg focus:outline-none focus:ring-2 w-full ${
                              formErrors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                            }`}
                          />
                          {formErrors.city && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                          )}
                        </div>
                        
                        <div>
                          <input
                            type="text"
                            placeholder="Rajonas (neprivaloma)"
                            value={checkoutFormData.region}
                            onChange={(e) => handleInputChange('region', e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="Pašto kodas (5 skaitmenys)"
                          value={checkoutFormData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value.replace(/\D/g, '').slice(0, 5))}
                          maxLength={5}
                          className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            formErrors.postalCode ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                          }`}
                        />
                        {formErrors.postalCode && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.postalCode}</p>
                        )}
                      </div>
                      
                      <div>
                        <input
                          type="tel"
                          inputMode="tel"
                          placeholder="Telefonas (pvz., +37060000000)"
                          value={checkoutFormData.phone}
                          onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                          className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            formErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                          }`}
                        />
                        {formErrors.phone && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <CreditCard className="w-4 h-4" />
                      <h3 className="text-base font-semibold">Mokėjimo Informacija</h3>
                    </div>
                    <StripeCardSection />
                      </div>
                  {/* Expose Stripe pay function to parent */}
                  <StripePayBridge
                    payRef={stripePayRef}
                    amountCents={Math.round((totalPrice + (totalPrice >= 30 ? 0 : 2.99) + (giftWrapping ? 2.99 : 0)) * 100)}
                    customer={{
                      name: checkoutFormData.name,
                      surname: checkoutFormData.surname,
                      email: checkoutFormData.email,
                      phone: checkoutFormData.phone,
                      address: `${checkoutFormData.address}, ${checkoutFormData.city} ${checkoutFormData.postalCode}`,
                    }}
                    itemsSummary={cartItems.map(it => `${it.name} × ${it.quantity} — €${(it.price*it.quantity).toFixed(2)}`).join('\n')}
                  />
                </div>

                {/* Right Column - Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Užsakymo Santrauka</h3>
                  
                  {/* Products in Order */}
                  <div className="space-y-3 sm:space-y-4 mb-3 sm:mb-4 max-h-56 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm sm:text-base line-clamp-1">{item.name}</h4>
                          <p className="text-xs sm:text-sm font-semibold text-gray-700">Kiekis: {item.quantity}</p>
                          <p className="font-bold text-red-600 text-sm sm:text-base">€{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm sm:text-base font-semibold">
                      <span>{t.subtotal}</span>
                      <span>€{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base font-semibold">
                      <span>{t.shipping}</span>
                      <span className={isFreeShipping ? "text-green-600" : "text-gray-600"}>
                        {isFreeShipping ? (language === 'lt' ? 'Nemokamas' : 'Free') : '€2.99'}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-3 mb-4">
                    {giftWrapping && (
                      <div className="flex justify-between text-sm sm:text-base font-semibold">
                        <span>{t.giftWrapping}</span>
                        <span>€2.99</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg sm:text-xl font-extrabold">
                      <span>{t.orderTotal}</span>
                      <span>€{(orderCents / 100).toFixed(2)}</span>
                    </div>
                  </div>

                  <hr className="my-6 border-gray-300" />
                  {/* Pay with PayPal */}
                  <div className="mt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-base font-semibold">Apmokėti per PayPal</h3>
                    </div>
                    <div className="space-y-1 mb-2">
                      <p className="text-xs text-gray-700 font-semibold">
                        📨 Mokėdami per PayPal, įrašykite savo kontaktinę informaciją čia, kad galėtume susisiekti dėl užsakymo!
                      </p>
                      <p className="text-xs text-gray-500 font-semibold">
                        (PayPal kartais neperduoda visų duomenų, todėl jūsų pagalba padeda mums greičiau išsiųsti prekę 🎁)
                      </p>
                      <p className="text-xs text-gray-700 font-semibold">
                        💛 Atsiskaitydami per PayPal, taikomas nedidelis apdorojimo mokestis (apie 2.5 %). Jis padeda padengti PayPal mokesčius ir užtikrina, kad galėtume išlaikyti mažas kainas visiems 🎄
                      </p>
                    </div>
                    <PayPalButton
                      amountCents={orderCents}
                      orderNumber={`ORD-${Date.now()}-${Math.floor(Math.random()*1000)}`}
                      customer={{
                        name: checkoutFormData.name,
                        surname: checkoutFormData.surname,
                        email: checkoutFormData.email,
                        phone: checkoutFormData.phone,
                        address: `${checkoutFormData.address}`,
                        city: checkoutFormData.city,
                        postalCode: checkoutFormData.postalCode,
                      }}
                      items={cartItems.map((it: any) => ({
                        name: it.name,
                        quantity: Number(it.quantity || 1),
                        price: Number(it.price)
                      }))}
                    />
                  </div>

                  {/* Consent */}
                  

                  {/* Place Order Button */}
                  <button 
                    onClick={async () => {
                      if ((import.meta as any).env?.DEV) console.log('[Checkout] Clicked place order');
                      try {
                        setLoading(true);
                        setFormErrors({});
                        
                        const errors = validateForm(checkoutFormData);
                        if (Object.keys(errors).length > 0) {
                          setFormErrors(errors);
                          setErrorMessage('Prašome taisyklingai užpildyti visus privalomus laukus');
                          setTimeout(() => setErrorMessage(''), 3000);
                          setLoading(false);
                          return;
                        }
                        
                        // Trigger Stripe payment via bridge
                        const payInvoker = stripePayRef.current;
                        if (!payInvoker) {
                          if ((import.meta as any).env?.DEV) console.warn('[Checkout] Stripe pay bridge not ready, falling back to Checkout Session');
                        }
                        const payResult = await (payInvoker ? payInvoker() : Promise.resolve({ ok: false, error: 'Mokėjimo sistema nepasiruošusi' }));
                        if (!payResult.ok) {
                          // Fallback to Stripe Checkout (hosted) when Elements fails/blocked
                          try {
                            const amountCents = orderCents;
                            const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random()*1000)}`;
                            if ((import.meta as any).env?.DEV) console.log('[Checkout] Creating Checkout Session...', amountCents);
                            const csResp = await fetch('/api/create-checkout-session', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                amount: amountCents,
                                name: checkoutFormData.name,
                                surname: checkoutFormData.surname,
                                email: checkoutFormData.email,
                                phone: checkoutFormData.phone,
                                address: `${checkoutFormData.address}, ${checkoutFormData.city} ${checkoutFormData.postalCode}`,
                                items: cartItems.map(it => `${it.name} × ${it.quantity} — €${(it.price*it.quantity).toFixed(2)}`).join('\n'),
                                orderId: orderNumber,
                                successUrl: `${window.location.origin}/?status=paid` ,
                                cancelUrl: window.location.href
                              })
                            });
                            if ((import.meta as any).env?.DEV) console.log('[Checkout] Checkout Session response status:', csResp.status);
                            if (csResp.ok) {
                              const { id, url } = await csResp.json();
                              if ((import.meta as any).env?.DEV) console.log('[Checkout] Got session', id, 'url', url);
                              // Prefer native redirect via returned URL to avoid SDK being blocked
                              if (url) {
                                window.location.href = url;
                                return;
                              }
                              const stripeClient = await stripePromise;
                              await stripeClient?.redirectToCheckout({ sessionId: id });
                              setLoading(false);
                              return;
                            }
                          } catch (e) {
                            if ((import.meta as any).env?.DEV) console.error('[Checkout] Fallback to Checkout Session failed', e);
                            // fallthrough to show error
                          }
                          setErrorMessage(payResult.error || 'Mokėjimas nepavyko.');
                          setLoading(false);
                          return;
                        }
                        
                        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random()*1000)}`;
                        const order = {
                          id: Date.now(),
                          items: totalItems,
                          total: (orderCents / 100).toFixed(2),
                          giftWrapping,
                          date: new Date().toLocaleDateString('lt-LT'),
                          status: 'Apdorojama',
                          orderNumber
                        };

                        // Mark paid and notify Discord (client-side fallback in case webhook fails)
                        order.status = 'Apmokėta';
                        try {
                          await fetch('/api/notify-discord', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              provider: 'stripe',
                              orderNumber,
                              total: (orderCents / 100).toFixed(2),
                              customer: {
                                name: checkoutFormData.name,
                                surname: checkoutFormData.surname,
                                email: checkoutFormData.email,
                                phone: checkoutFormData.phone,
                                address: `${checkoutFormData.address}, ${checkoutFormData.city} ${checkoutFormData.postalCode}`,
                              },
                              items: cartItems.map((it: any) => ({
                                name: it.name,
                                quantity: Number(it.quantity || 1),
                                price: Number(it.price)
                              }))
                            })
                          });
                        } catch {}
                        
                        setOrderHistory([order, ...orderHistory]);
                        setCompletedOrderNumber(orderNumber);
                        setCompletedOrderEmail(checkoutFormData.email);
                        setCheckoutOpen(false);
                        setThankYouModalOpen(true);
                        // Meta Pixel: Purchase event
                        try {
                          const w: any = (typeof window !== 'undefined') ? window : null;
                          if (w && typeof w.fbq === 'function') {
                            w.fbq('track', 'Purchase', {
                              value: Number((orderCents / 100).toFixed(2)),
                              currency: 'EUR',
                              contents: cartItems.map((it: any) => ({
                                id: it.productId,
                                quantity: it.quantity,
                              })),
                              content_type: 'product',
                            });
                          }
                        } catch {}
                        clearCart();
                        setGiftWrapping(false);
                        
                        // Reset form
                        setCheckoutFormData({
                          email: '',
                          name: '',
                          surname: '',
                          address: '',
                          city: '',
                          region: '',
                          postalCode: '',
                          phone: '',
                          cardNumber: '',
                          expiry: '',
                          cvv: ''
                        });
                      } catch (error) {
                        setErrorMessage('Įvyko klaida. Bandykite dar kartą.');
                        setTimeout(() => setErrorMessage(''), 3000);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-600 to-green-600 text-white py-2 rounded-lg font-semibold hover:from-red-700 hover:to-green-700 transition mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? t.processing : t.placeOrder}
                  </button>

                  {/* Payment Logos */}
                  <div className="flex justify-center space-x-3 mb-3">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                      className="h-6 opacity-60"
                      alt="Mastercard"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="bg-white border border-gray-300 px-2 py-1 rounded">
                      <span className="text-blue-600 font-bold text-sm">VISA</span>
                    </div>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                      className="h-6 opacity-60"
                      alt="PayPal"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {/* SSL Security Badge */}
                  <div className="flex items-center justify-center space-x-2 mb-4 bg-gray-100 rounded-lg py-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-700 font-semibold">256-bit SSL Secure Checkout</span>
                  </div>

                  {/* Terms */}
                  <p className="text-xs text-gray-500 text-center">
                    Pateikdami užsakymą, sutinkate su mūsų Taisyklėmis ir Sąlygomis
                  </p>
                </div>
              </div>
              </Elements>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 ios-safe-area">
          <div className="grid grid-cols-3 h-16">
            <button 
              onClick={() => setCartOpen(false)}
              className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-red-600 transition-colors"
            >
              <div className="text-2xl">🏠</div>
              <span className="text-xs">Pagrindinis</span>
            </button>
            <button 
              onClick={() => setCartOpen(true)}
              className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-red-600 transition-colors relative"
            >
              <div className="text-2xl">🛒</div>
              <span className="text-xs">Krepšelis</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button 
              onClick={() => setWishlistOpen(true)}
              className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-red-600 transition-colors relative"
            >
              <div className="text-2xl">❤️</div>
              <span className="text-xs">Mėgstami</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Thank You Modal */}
      <ThankYouModal
        isOpen={thankYouModalOpen}
        onClose={() => setThankYouModalOpen(false)}
        orderNumber={completedOrderNumber}
        email={completedOrderEmail}
      />

      {/* Footer */}
      <footer className="relative bg-slate-900 text-white overflow-hidden">
        <Snowfall position="absolute" zIndex={0} />
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 justify-items-center md:justify-items-start text-center md:text-left transform translate-x-1 md:translate-x-2">
          <div>
            <h4 className="font-bold text-lg mb-3">{t.shopName}</h4>
            <p className="text-sm text-gray-300 mb-3">
              {language === 'lt' ? 'Jūsų patikima Kalėdų dekoracijų parduotuvė.' : 'Your trusted Christmas decorations store.'}
            </p>
            <p>
              <Link to="/apie-mus" className="hover:text-white cursor-pointer">
                Apie mus
              </Link>
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Teisinė informacija</h5>
            <ul className="text-sm space-y-2 text-gray-300">
              <li>
                <Link to="/pristatymo-info" className="hover:text-white cursor-pointer">
                  Pristatymo Info
                </Link>
              </li>
              <li>
                <Link to="/grazinimai" className="hover:text-white cursor-pointer">
                  Grąžinimai
                </Link>
              </li>
              <li>
                <Link to="/privatumo-politika" className="hover:text-white cursor-pointer">
                  Privatumo Politika
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Kontaktai</h5>
            <ul className="text-sm space-y-2 text-gray-300">
              <li className="flex items-center gap-3 py-1">
                <Mail className="w-5 h-5 block shrink-0" />
                <span className="inline-flex items-center h-5">kaleddovanos@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 py-1">
                <img src="https://cdn.simpleicons.org/instagram/FFFFFF" alt="Instagram" className="w-5 h-5 block shrink-0" />
                <a href="https://www.instagram.com/kaledukampelis" target="_blank" rel="noopener noreferrer" className="hover:text-white inline-flex items-center h-5">
                  kaledukampelis
                </a>
              </li>
              <li className="flex items-center gap-3 py-1">
                <img src="https://cdn.simpleicons.org/tiktok/FFFFFF" alt="TikTok" className="w-5 h-5 block shrink-0" />
                <a href="https://www.tiktok.com/@kaledukampelis" target="_blank" rel="noopener noreferrer" className="hover:text-white inline-flex items-center h-5">
                  kaledukampelis
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 py-4 text-center text-sm text-gray-400">
          © 2025 Kalėdų Kampelis. Visos teisės saugomos. Sukurta su meile šventėms ❤️
          <div className="flex justify-center gap-4 mt-3 opacity-80">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
              className="h-5"
              alt="Mastercard"
            />
            <div className="bg-white border border-gray-300 px-2 py-1 rounded">
              <span className="text-blue-600 font-bold text-xs">VISA</span>
            </div>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              className="h-5"
              alt="PayPal"
            />
          </div>
          <div className="flex items-center justify-center space-x-2 mt-3 text-gray-400">
            <Lock className="w-4 h-4" />
            <span className="text-xs">SSL Secure Checkout | 256-bit Encryption</span>
          </div>
        </div>
      </footer>
      
      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
    </>
  );
}


// --- Main Router ---
export default function App() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🎄</div>
          <div className="text-xl font-bold text-red-600">Kalėdų Kampelis</div>
          <div className="text-gray-600 mt-2">Kraunama...</div>
        </div>
      </div>
    }>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apie-mus" element={<ApieMus />} />
        <Route path="/pristatymo-info" element={<PristatymoInfo />} />
        <Route path="/grazinimai" element={<Grazinimai />} />
        <Route path="/privatumo-politika" element={<PrivatumoPolitika />} />
      </Routes>
    </Suspense>
  );
}

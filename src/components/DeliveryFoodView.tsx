import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Clock, 
  Star, 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  Check, 
  X, 
  Truck, 
  Store, 
  Utensils, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Calendar, 
  Users, 
  Phone, 
  Navigation, 
  DollarSign, 
  Award, 
  Flame, 
  Tag, 
  Compass, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  ExternalLink,
  MessageSquare,
  Settings,
  PenTool,
  Percent,
  Save,
  Sparkles
} from 'lucide-react';
import { 
  RestaurantStore, 
  MenuItem, 
  CartItem, 
  DeliveryOrder, 
  DeliveryDriver, 
  DeliveryZone, 
  CouponCode, 
  TableBooking,
  OrderStatus,
  INITIAL_RESTAURANTS,
  INITIAL_DRIVERS,
  INITIAL_DELIVERY_ZONES,
  INITIAL_COUPONS,
  INITIAL_ORDERS
} from '../data/deliveryData';
import { AdBanner } from './AdBanner';
import { DeliveryMap } from './DeliveryMap';
import { User } from '../types';

interface DeliveryFoodViewProps {
  currentUser: User;
  onOpenRecipe?: (recipeId: string) => void;
  restaurants?: RestaurantStore[];
  onUpdateRestaurants?: React.Dispatch<React.SetStateAction<RestaurantStore[]>>;
  orders?: DeliveryOrder[];
  onUpdateOrders?: React.Dispatch<React.SetStateAction<DeliveryOrder[]>>;
}

type DeliveryRoleView = 'customer' | 'vendor' | 'driver' | 'admin' | 'config';

export const DeliveryFoodView: React.FC<DeliveryFoodViewProps> = ({
  currentUser,
  restaurants: externalRestaurants,
  onUpdateRestaurants,
  orders: externalOrders,
  onUpdateOrders,
}) => {
  // Active App View Mode
  const [roleView, setRoleView] = useState<DeliveryRoleView>('customer');
  
  // Data States
  const [internalRestaurants, setInternalRestaurants] = useState<RestaurantStore[]>(INITIAL_RESTAURANTS);
  const restaurants = externalRestaurants || internalRestaurants;
  const setRestaurants = onUpdateRestaurants || setInternalRestaurants;

  const [internalOrders, setInternalOrders] = useState<DeliveryOrder[]>(INITIAL_ORDERS);
  const orders = externalOrders || internalOrders;
  const setOrders = onUpdateOrders || setInternalOrders;
  const [drivers, setDrivers] = useState<DeliveryDriver[]>(INITIAL_DRIVERS);
  const [zones, setZones] = useState<DeliveryZone[]>(INITIAL_DELIVERY_ZONES);
  const [coupons] = useState<CouponCode[]>(INITIAL_COUPONS);
  const [bookings, setBookings] = useState<TableBooking[]>([]);

  // Customer UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'restaurant' | 'store'>('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantStore | null>(null);
  const [selectedDishForModal, setSelectedDishForModal] = useState<MenuItem | null>(null);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(orders[0]?.id || null);
  const [showMapExplorer, setShowMapExplorer] = useState<boolean>(true);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('24 Rue de Clichy, 75009 Paris');
  const [customerPhone, setCustomerPhone] = useState('+33 6 12 34 56 78');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile_money' | 'apple_pay' | 'cash'>('card');
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState<DeliveryOrder | null>(null);

  // Restaurant Table Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingRestaurant, setBookingRestaurant] = useState<RestaurantStore | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-10-10');
  const [bookingTime, setBookingTime] = useState('20:00');
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingSuccessToast, setBookingSuccessToast] = useState(false);

  // Vendor Panel State
  const [vendorSelectedRestId, setVendorSelectedRestId] = useState<string>(restaurants[0].id);

  // Filtered Restaurants & Stores
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(r => {
      if (selectedType !== 'all' && r.type !== selectedType) return false;
      if (selectedCuisine !== 'all' && !r.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase())) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = r.name.toLowerCase().includes(q);
        const matchCuisine = r.cuisine.toLowerCase().includes(q);
        const matchDish = r.menu.some(m => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
        if (!matchName && !matchCuisine && !matchDish) return false;
      }
      return true;
    });
  }, [restaurants, selectedType, selectedCuisine, searchQuery]);

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.itemTotal, 0);
  }, [cart]);

  const activeCartRestaurant = useMemo(() => {
    if (cart.length === 0) return null;
    return restaurants.find(r => r.id === cart[0].restaurantId) || null;
  }, [cart, restaurants]);

  const deliveryFee = activeCartRestaurant ? activeCartRestaurant.deliveryFee : 2.50;

  // Frais de commission de livraison & service plateforme Afrodelicious
  const platformCommissionFee = useMemo(() => {
    if (!activeCartRestaurant) return 1.20;
    if (activeCartRestaurant.deliveryCommissionFixed) {
      return activeCartRestaurant.deliveryCommissionFixed;
    }
    const rate = activeCartRestaurant.deliveryCommissionRate || 0.12;
    return Math.round((cartSubtotal * rate) * 100) / 100;
  }, [activeCartRestaurant, cartSubtotal]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountPercent) {
      return (cartSubtotal * appliedCoupon.discountPercent) / 100;
    }
    if (appliedCoupon.discountAmount) {
      return Math.min(cartSubtotal, appliedCoupon.discountAmount);
    }
    return 0;
  }, [appliedCoupon, cartSubtotal]);

  const cartTotal = Math.max(0, cartSubtotal + deliveryFee + platformCommissionFee - discountAmount);

  // Delivery Polygon Save Handler
  const handleSaveDeliveryPolygon = (restaurantId: string, polygon: { lat: number; lng: number }[]) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id === restaurantId) {
        return {
          ...r,
          deliveryPolygon: polygon,
          deliveryRadiusKm: Math.round((polygon.length * 0.6) * 10) / 10
        };
      }
      return r;
    }));
  };

  // Add Item to Cart
  const handleAddToCart = (dish: MenuItem, restaurant: RestaurantStore, customOptions?: string[]) => {
    // If cart has items from another restaurant, confirm reset
    if (cart.length > 0 && cart[0].restaurantId !== restaurant.id) {
      const confirmChange = window.confirm(`Votre panier contient des plats de "${cart[0].restaurantName}". Souhaitez-vous vider le panier pour commander chez "${restaurant.name}" ?`);
      if (!confirmChange) return;
      setCart([]);
    }

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.dish.id === dish.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        updated[existingIndex].itemTotal = updated[existingIndex].quantity * dish.price;
        return updated;
      }
      return [
        ...prev,
        {
          dish,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          quantity: 1,
          selectedOptions: customOptions,
          itemTotal: dish.price
        }
      ];
    });
    setIsCartDrawerOpen(true);
    setSelectedDishForModal(null);
  };

  const handleUpdateQuantity = (dishId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.dish.id === dishId) {
            const newQty = item.quantity + delta;
            return {
              ...item,
              quantity: newQty,
              itemTotal: newQty * item.dish.price
            };
          }
          return item;
        })
        .filter(item => item.quantity > 0);
    });
  };

  // Apply Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const clean = couponInput.trim().toUpperCase();
    const found = coupons.find(c => c.code === clean);
    if (!found) {
      setCouponError('Code promo invalide');
      return;
    }
    if (cartSubtotal < found.minOrder) {
      setCouponError(`Montant minimum de commande de ${found.minOrder}€ requis`);
      return;
    }
    setAppliedCoupon(found);
    setCouponInput('');
  };

  // Checkout Execution
  const handleCheckout = () => {
    if (cart.length === 0 || !activeCartRestaurant) return;

    const newOrder: DeliveryOrder = {
      id: `AFRO-${Math.floor(1000 + Math.random() * 9000)}`,
      restaurantId: activeCartRestaurant.id,
      restaurantName: activeCartRestaurant.name,
      customerName: currentUser.name || 'Client Gourmand',
      customerPhone: customerPhone,
      customerAddress: deliveryAddress,
      customerLatLng: { lat: 48.889, lng: 2.349 },
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      platformCommissionFee,
      driverPayout: Math.round(deliveryFee * 0.85 * 100) / 100,
      restaurantPayout: Math.round(cartSubtotal * (1 - (activeCartRestaurant.deliveryCommissionRate || 0.12)) * 100) / 100,
      discount: discountAmount,
      total: cartTotal,
      status: 'pending',
      createdAt: "À l'instant",
      estimatedDeliveryMinutes: activeCartRestaurant.deliveryTimeMin + 5,
      driver: drivers[0],
      paymentMethod,
      paymentStatus: 'paid',
      couponCodeApplied: appliedCoupon?.code
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsCartDrawerOpen(false);
    setOrderPlacedSuccess(newOrder);
    setActiveTrackingOrderId(newOrder.id);
  };

  // Book a Table Execution
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRestaurant) return;

    const newBooking: TableBooking = {
      id: `BOOK-${Date.now().toString().slice(-4)}`,
      restaurantId: bookingRestaurant.id,
      restaurantName: bookingRestaurant.name,
      customerName: currentUser.name,
      customerPhone: customerPhone,
      customerEmail: currentUser.email,
      guestsCount: bookingGuests,
      date: bookingDate,
      time: bookingTime,
      status: 'confirmed'
    };

    setBookings(prev => [newBooking, ...prev]);
    setIsBookingModalOpen(false);
    setBookingSuccessToast(true);
    setTimeout(() => setBookingSuccessToast(false), 4000);
  };

  // Order Tracking Details
  const trackingOrder = orders.find(o => o.id === activeTrackingOrderId) || orders[0] || null;

  // Vendor actions
  const handleVendorUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleVendorToggleDishAvailability = (restId: string, dishId: string) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id === restId) {
        return {
          ...r,
          menu: r.menu.map(d => d.id === dishId ? { ...d, isAvailable: !d.isAvailable } : d)
        };
      }
      return r;
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Role Switcher Navigation Bar (Customer / Restaurant / Delivery Driver / Admin) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-gradient-to-r from-slate-950 via-[#0F3E2E] to-slate-900 text-white shadow-lg border border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#FF4E27] text-white shadow-md shadow-[#FF4E27]/30">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest uppercase text-[#F59E0B] bg-white/10 px-2 py-0.5 rounded-full">
                E-Commerce & Food Delivery
              </span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Network Active
              </span>
            </div>
            <h1 className="font-serif font-black text-xl sm:text-2xl text-white mt-0.5">
              Afrodelicious Delivery Food
            </h1>
            <p className="text-xs text-slate-300">
              Commandes en ligne, épiceries du terroir, suivi coursier GPS & réservations de table
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => setRoleView('customer')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              roleView === 'customer'
                ? 'bg-[#FF4E27] text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Client</span>
          </button>

          <button
            type="button"
            onClick={() => setRoleView('vendor')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              roleView === 'vendor'
                ? 'bg-[#F59E0B] text-slate-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Restaurateur</span>
          </button>

          <button
            type="button"
            onClick={() => setRoleView('driver')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              roleView === 'driver'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Livreur</span>
          </button>

          <button
            type="button"
            onClick={() => setRoleView('admin')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              roleView === 'admin'
                ? 'bg-white text-slate-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => setRoleView('config')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              roleView === 'config'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md'
                : 'text-amber-300 hover:text-white hover:bg-white/10'
            }`}
            title="Configuration de livraison : périmètres, commissions & frais"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Config Livraison</span>
          </button>
        </div>
      </div>

      {/* Booking Toast */}
      {bookingSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#0F3E2E] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#F59E0B]" />
          <span>Votre table a été réservée avec succès ! Confirmation envoyée par SMS.</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. CUSTOMER VIEW: STORE/RESTAURANT DIRECTORY & ORDERING      */}
      {/* ============================================================ */}
      {roleView === 'customer' && (
        <div className="space-y-6">
          
          {/* AdSense & AdMob Live Placement */}
          <AdBanner format="feed_native" className="mb-2" />

          {/* Quick Active Order Alert Pill (if any order is active) */}
          {trackingOrder && trackingOrder.status !== 'delivered' && (
            <div 
              onClick={() => {
                const el = document.getElementById('live-tracking-panel');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between gap-3 shadow-md cursor-pointer hover:opacity-95 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/20">
                  <Truck className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                    Commande en cours #{trackingOrder.id}
                  </span>
                  <p className="text-xs sm:text-sm font-bold mt-0.5">
                    {trackingOrder.restaurantName} · Livreur {trackingOrder.driver?.name} en route !
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold underline shrink-0 flex items-center gap-1">
                <span>Voir le suivi GPS</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          )}

          {/* Search & Category Filter Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Rechercher un plat, restaurant, attiéké, colombo, bokit, mafé..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF4E27]"
                />
              </div>

              {/* Type Switcher: Tous, Restaurants, Épiceries */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedType('all')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    selectedType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Tous ({restaurants.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType('restaurant')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                    selectedType === 'restaurant' ? 'bg-[#FF4E27] text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Utensils className="w-3 h-3" />
                  <span>Restaurants</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType('store')}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                    selectedType === 'store' ? 'bg-[#0F3E2E] text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Store className="w-3 h-3" />
                  <span>Épiceries Terroir</span>
                </button>
              </div>

              {/* Cart Button */}
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative px-4 py-2.5 rounded-2xl bg-[#FF4E27] hover:bg-[#e03d16] text-white text-xs font-bold transition-all shadow-md shadow-[#FF4E27]/25 flex items-center gap-2 shrink-0"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Panier</span>
                {cart.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-white text-[#FF4E27] text-[10px] font-black">
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Quick Cuisine Badges */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0">
                Terroirs :
              </span>
              {[
                { id: 'all', label: '🌍 Tous les terroirs' },
                { id: 'sénégal', label: '🇸🇳 Sénégalaise' },
                { id: 'créole', label: '🇬🇵 Créole & Bokits' },
                { id: 'jamaïquaine', label: '🇯🇲 Jerk Jamaïque' },
                { id: 'ivoirienne', label: '🇨🇮 Ivoirienne' },
                { id: 'épicerie', label: '🛒 Épicerie & Épices' }
              ].map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCuisine(c.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    selectedCuisine === c.id
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Google Maps & Delivery Zones Explorer */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#0F3E2E] text-white shadow-md border border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF4E27] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-black text-white">
                      Carte Interactive Google Maps & Zones de Livraison
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      GPS Live
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Visualisez les zones de livraison ({zones.length} zones), le rayon de nos coursiers et la géolocalisation des restaurants.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMapExplorer(!showMapExplorer)}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 self-start sm:self-auto shrink-0 shadow-md active:scale-95 ${
                  showMapExplorer
                    ? 'bg-white text-slate-900 hover:bg-slate-100'
                    : 'bg-gradient-to-r from-[#FF4E27] to-[#FF7849] hover:from-[#E03814] hover:to-[#FF4E27] text-white'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>{showMapExplorer ? 'Masquer la Carte' : 'Ouvrir la Carte Google Maps'}</span>
              </button>
            </div>

            {showMapExplorer && (
              <DeliveryMap
                trackingOrder={trackingOrder}
                zones={zones}
                restaurants={restaurants}
                selectedRestaurant={selectedRestaurant}
                onSelectRestaurant={(r) => setSelectedRestaurant(r)}
                onSaveDeliveryPolygon={handleSaveDeliveryPolygon}
                className="w-full"
              />
            )}
          </div>

          {/* Restaurant Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Cover & Badges */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={restaurant.coverImage}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10 flex items-center gap-1">
                      <span>{restaurant.countryFlag}</span>
                      <span>{restaurant.cuisine}</span>
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-bold flex items-center gap-1 shadow-xs">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{restaurant.rating}</span>
                      <span className="text-[10px] text-slate-400">({restaurant.reviewsCount})</span>
                    </span>
                  </div>

                  {restaurant.promoBadge && (
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg bg-[#FF4E27] text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{restaurant.promoBadge}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Body Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-[#FF4E27] transition-colors">
                          {restaurant.name}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{restaurant.address} · {restaurant.city}</span>
                        </p>
                      </div>
                      <img
                        src={restaurant.logo}
                        alt={restaurant.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                    </div>

                    {/* Delivery metrics */}
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-3 border-t border-slate-100 mt-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#FF4E27]" />
                        <span>{restaurant.deliveryTimeMin}-{restaurant.deliveryTimeMax} min</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Livraison {restaurant.deliveryFee.toFixed(2)} €</span>
                      </span>
                      <span>·</span>
                      <span className="text-slate-400 text-[11px]">Min. {restaurant.minOrder}€</span>
                    </div>

                    {/* Preview Dishes */}
                    <div className="mt-3 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Plats signatures :
                      </span>
                      <div className="space-y-1">
                        {restaurant.menu.slice(0, 2).map(dish => (
                          <div
                            key={dish.id}
                            onClick={() => setSelectedDishForModal(dish)}
                            className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 hover:bg-orange-50/60 border border-slate-100 transition-colors cursor-pointer"
                          >
                            <span className="font-medium text-slate-800 truncate pr-2">
                              {dish.name}
                            </span>
                            <span className="font-bold text-[#FF4E27] shrink-0">
                              {dish.price.toFixed(2)} €
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Voir la carte / Commander / Réserver une table */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedRestaurant(restaurant)}
                      className="py-2.5 px-3 rounded-xl bg-[#0F3E2E] hover:bg-[#15533e] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span>Voir la carte</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setBookingRestaurant(restaurant);
                        setIsBookingModalOpen(true);
                      }}
                      className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#FF4E27]" />
                      <span>Réserver table</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ============================================================ */}
          {/* LIVE ORDER TRACKING PANEL WITH GOOGLE MAPS SIMULATION        */}
          {/* ============================================================ */}
          {trackingOrder && (
            <div id="live-tracking-panel" className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Suivi en temps réel GPS (Google Maps Live)
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-800">
                        Commande #{trackingOrder.id}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-slate-900 mt-0.5">
                      {trackingOrder.restaurantName}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Statut :</span>
                  <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                    trackingOrder.status === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-[#FF4E27] text-white animate-pulse'
                  }`}>
                    {trackingOrder.status === 'pending' && 'En attente validation'}
                    {trackingOrder.status === 'accepted' && 'Validée par restaurant'}
                    {trackingOrder.status === 'in_kitchen' && 'En cuisine au feu'}
                    {trackingOrder.status === 'out_for_delivery' && 'Livreur en route !'}
                    {trackingOrder.status === 'delivered' && 'Commande Livrée'}
                  </span>
                </div>
              </div>

              {/* Interactive Google Maps Driver Tracking & Delivery Zones */}
              <DeliveryMap
                trackingOrder={trackingOrder}
                zones={zones}
                restaurants={restaurants}
                className="w-full"
              />

              {/* Driver & Order Summary Footer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <img
                    src={trackingOrder.driver?.avatar || INITIAL_DRIVERS[0].avatar}
                    alt="Driver"
                    className="w-10 h-10 rounded-full object-cover shrink-0 border"
                  />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Livreur Attitré</span>
                    <h5 className="text-xs font-bold text-slate-900">{trackingOrder.driver?.name}</h5>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{trackingOrder.driver?.rating} ({trackingOrder.driver?.totalDeliveries} courses)</span>
                    </p>
                  </div>
                  <a
                    href={`tel:${trackingOrder.driver?.phone}`}
                    className="ml-auto p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    title="Appeler le livreur"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Adresse de dépose</span>
                  <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{trackingOrder.customerAddress}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Note : Sonner à l'interphone</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Montant Total</span>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{trackingOrder.total.toFixed(2)} €</p>
                  <p className="text-[11px] text-emerald-600 font-semibold">Payé par {trackingOrder.paymentMethod.toUpperCase()}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ============================================================ */}
      {/* 2. VENDOR / RESTAURANT MANAGER PANEL                         */}
      {/* ============================================================ */}
      {roleView === 'vendor' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#FF4E27] uppercase tracking-wider">
                  Espace Restaurateur & Gestion de Cuisine
                </span>
                <h2 className="font-serif font-bold text-xl text-slate-900">
                  Tableau de bord Restaurant Partenaire
                </h2>
              </div>

              {/* Restaurant Selector */}
              <select
                value={vendorSelectedRestId}
                onChange={(e) => setVendorSelectedRestId(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF4E27]"
              >
                {restaurants.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.countryFlag} {r.name} ({r.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Vendor Live Orders Queue */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#FF4E27]" />
                <span>Commandes en direct ({orders.filter(o => o.restaurantId === vendorSelectedRestId).length})</span>
              </h3>

              {orders.filter(o => o.restaurantId === vendorSelectedRestId).length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
                  Aucune commande active pour cet établissement actuellement.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orders.filter(o => o.restaurantId === vendorSelectedRestId).map(order => (
                    <div key={order.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-slate-900">
                          #{order.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#FF4E27] text-[10px] font-bold">
                          {order.status}
                        </span>
                      </div>

                      <div className="text-xs space-y-1">
                        <p className="font-bold text-slate-800">Client : {order.customerName} ({order.customerPhone})</p>
                        <p className="text-slate-500 text-[11px]">Adresse : {order.customerAddress}</p>
                      </div>

                      <div className="border-t border-slate-200 pt-2 space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-slate-700">
                            <span>{item.quantity}x {item.dish.name}</span>
                            <span className="font-bold">{item.itemTotal.toFixed(2)} €</span>
                          </div>
                        ))}
                      </div>

                      {/* Status Transition Buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        {order.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => handleVendorUpdateOrderStatus(order.id, 'accepted')}
                            className="w-full py-2 rounded-xl bg-[#FF4E27] text-white text-xs font-bold"
                          >
                            Accepter la commande
                          </button>
                        )}
                        {order.status === 'accepted' && (
                          <button
                            type="button"
                            onClick={() => handleVendorUpdateOrderStatus(order.id, 'in_kitchen')}
                            className="w-full py-2 rounded-xl bg-amber-500 text-white text-xs font-bold"
                          >
                            Passer au fourneau (En cuisine)
                          </button>
                        )}
                        {order.status === 'in_kitchen' && (
                          <button
                            type="button"
                            onClick={() => handleVendorUpdateOrderStatus(order.id, 'out_for_delivery')}
                            className="w-full py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                          >
                            Prêt pour le livreur !
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Menu Items Management */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Gestion de la carte & Disponibilité des plats
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {restaurants.find(r => r.id === vendorSelectedRestId)?.menu.map(dish => (
                  <div key={dish.id} className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
                    <img src={dish.imageUrl} alt={dish.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 truncate">{dish.name}</h5>
                      <span className="text-[11px] font-bold text-[#FF4E27]">{dish.price.toFixed(2)} €</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleVendorToggleDishAvailability(vendorSelectedRestId, dish.id)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                        dish.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {dish.isAvailable ? 'En stock' : 'Rupture'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. DELIVERY DRIVER / LIVREUR PANEL                           */}
      {/* ============================================================ */}
      {roleView === 'driver' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={drivers[0].avatar}
                  alt={drivers[0].name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                />
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                    Application Coursier Livreur · En ligne
                  </span>
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    {drivers[0].name} ({drivers[0].vehicle})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Gains du jour : 84.50 € · 6 livraisons effectuées
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-emerald-700">GPS Connecté</span>
              </div>
            </div>

            {/* Assigned Orders */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Courses attribuées
              </h4>

              {orders.map(order => (
                <div key={order.id} className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-orange-50/30 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      Course #{order.id}
                    </span>
                    <span className="text-xs font-bold text-[#FF4E27]">
                      Rémunération course : {(order.deliveryFee * 0.8).toFixed(2)} €
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">1. Enlèvement Restaurant</span>
                      <p className="font-bold text-slate-900">{order.restaurantName}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">2. Livraison Client</span>
                      <p className="font-bold text-slate-900">{order.customerAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleVendorUpdateOrderStatus(order.id, 'delivered')}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Valider la livraison & Signature Client</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. ADMIN DASHBOARD & FINANCIAL METRICS                       */}
      {/* ============================================================ */}
      {roleView === 'admin' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-bold text-[#FF4E27] uppercase tracking-wider">
                Console d'Administration Afrodelicious Delivery
              </span>
              <h2 className="font-serif font-bold text-xl text-slate-900">
                Pilotage des Opérations, Zones & Flux Financiers
              </h2>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
                <span className="text-[10px] font-bold text-[#FF4E27] uppercase">Chiffre d'Affaires</span>
                <p className="text-xl font-black text-slate-900 mt-1">2 840,50 €</p>
                <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>+18.4% cette semaine</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Commandes Totales</span>
                <p className="text-xl font-black text-slate-900 mt-1">{orders.length + 184}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Taux de succès 99.2%</p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                <span className="text-[10px] font-bold text-blue-700 uppercase">Établissements Actifs</span>
                <p className="text-xl font-black text-slate-900 mt-1">{restaurants.length}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">France, Sénégal, Côte d'Ivoire</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-700 uppercase">Livreurs sur la route</span>
                <p className="text-xl font-black text-slate-900 mt-1">{drivers.length}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Temps moyen 28 min</p>
              </div>
            </div>

            {/* Delivery Zones Management & Google Maps Console */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Zones de livraison & Radar Live Google Maps
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Visualisation cartographique interactive des zones et du positionnement des coursiers.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {zones.length} zones couvertes
                </span>
              </div>

              {/* Interactive Google Map in Admin */}
              <DeliveryMap
                zones={zones}
                restaurants={restaurants}
                trackingOrder={orders.find(o => o.status === 'out_for_delivery') || trackingOrder}
                className="w-full"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {zones.map(z => (
                  <div key={z.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{z.name}</h5>
                      <p className="text-[11px] text-slate-500">{z.city} · {z.estMinutes} min estimées</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Frais {z.baseFee} {z.city === 'Dakar' || z.city === 'Abidjan' ? 'FCFA' : '€'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. CONFIG LIVRAISON (CONFIGURATION DE LIVRAISON & POLIGONES) */}
      {/* ============================================================ */}
      {roleView === 'config' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white border border-amber-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
                    Espace Gestionnaire
                  </span>
                  <span className="text-xs text-slate-300 font-bold">
                    Paramètres & Périmètres de Service
                  </span>
                </div>
                <h2 className="font-serif font-black text-xl sm:text-2xl text-white mt-0.5">
                  Configuration de Livraison & Périmètre Polygone
                </h2>
                <p className="text-xs text-slate-300">
                  Délimitez visuellement le polygone de service sur Google Maps, réglez les commissions plateforme et vos frais de livraison.
                </p>
              </div>
            </div>

            {/* Restaurant Selector */}
            <div className="bg-slate-800/90 p-2 rounded-2xl border border-slate-700 flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-300 pl-2">Restaurant :</span>
              <select
                value={vendorSelectedRestId}
                onChange={(e) => setVendorSelectedRestId(e.target.value)}
                className="bg-slate-900 text-white font-bold text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-amber-400"
              >
                {restaurants.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.countryFlag} {r.name} ({r.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Restaurant Configuration Dashboard */}
          {(() => {
            const currentRest = restaurants.find(r => r.id === vendorSelectedRestId) || restaurants[0];
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Google Maps Interactive Polygon Editor */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF4E27] flex items-center justify-center font-bold">
                          <PenTool className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-serif font-black text-sm text-slate-900">
                            Tracé du Périmètre de Livraison (Polygone sur Google Maps)
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            Délimitez la zone exacte où votre établissement assure ses livraisons.
                          </p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono font-bold">
                        {currentRest.deliveryPolygon?.length || 0} sommets tracés
                      </span>
                    </div>

                    {/* Interactive Google Map with Drawing Mode Active */}
                    <DeliveryMap
                      restaurants={restaurants}
                      selectedRestaurant={currentRest}
                      onSelectRestaurant={(r) => setVendorSelectedRestId(r.id)}
                      onSaveDeliveryPolygon={handleSaveDeliveryPolygon}
                      zones={zones}
                      enablePolygonDrawing={true}
                      className="w-full"
                    />

                    {/* Coordinates Summary */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">
                          Coordonnées actuelles du périmètre :
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          Rayon moyen : ~{currentRest.deliveryRadiusKm || 3.5} km
                        </span>
                      </div>

                      <div className="max-h-28 overflow-y-auto space-y-1 font-mono text-[11px] text-slate-600">
                        {currentRest.deliveryPolygon && currentRest.deliveryPolygon.length > 0 ? (
                          currentRest.deliveryPolygon.map((pt, i) => (
                            <div key={i} className="flex items-center justify-between px-2 py-0.5 rounded bg-white border border-slate-100">
                              <span className="font-bold text-amber-700">Sommet #{i + 1}</span>
                              <span>Lat: {pt.lat.toFixed(5)}, Lng: {pt.lng.toFixed(5)}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400 italic">Aucun polygone personnalisé. Utilisez l'éditeur sur la carte ci-dessus pour tracer le contour.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Fees, Commissions, and Delivery Thresholds Form */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-serif font-black text-base text-slate-900">
                        Frais & Commissions de Livraison
                      </h3>
                    </div>

                    {/* Delivery Fee Charged to Customer */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Frais de livraison facturés au client (€) :
                      </label>
                      <input
                        type="number"
                        step="0.10"
                        min="0"
                        value={currentRest.deliveryFee}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setRestaurants(prev => prev.map(r => r.id === currentRest.id ? { ...r, deliveryFee: val } : r));
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF4E27]"
                      />
                      <p className="text-[10px] text-slate-400">Montant payé par le client lors du passage de commande</p>
                    </div>

                    {/* Platform Delivery Commission Rate */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">
                          Taux de commission livraison Afrodelicious (%) :
                        </label>
                        <span className="text-xs font-black text-emerald-600">
                          {Math.round((currentRest.deliveryCommissionRate || 0.12) * 100)} %
                        </span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="25"
                        step="1"
                        value={Math.round((currentRest.deliveryCommissionRate || 0.12) * 100)}
                        onChange={(e) => {
                          const val = (parseInt(e.target.value, 10) || 12) / 100;
                          setRestaurants(prev => prev.map(r => r.id === currentRest.id ? { ...r, deliveryCommissionRate: val } : r));
                        }}
                        className="w-full accent-[#FF4E27]"
                      />
                      <p className="text-[10px] text-slate-400">Commission plateforme prélevée pour assurer la gestion logistique et le support</p>
                    </div>

                    {/* Fixed Commission / Service Fee */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Frais fixe de service plateforme (€) :
                      </label>
                      <input
                        type="number"
                        step="0.10"
                        min="0"
                        value={currentRest.deliveryCommissionFixed || 1.20}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setRestaurants(prev => prev.map(r => r.id === currentRest.id ? { ...r, deliveryCommissionFixed: val } : r));
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FF4E27]"
                      />
                    </div>

                    {/* Free Delivery Threshold & Minimum Order */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 block">
                          Livraison offerte dès (€) :
                        </label>
                        <input
                          type="number"
                          value={currentRest.freeDeliveryThreshold || 35}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setRestaurants(prev => prev.map(r => r.id === currentRest.id ? { ...r, freeDeliveryThreshold: val } : r));
                          }}
                          className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 block">
                          Commande min (€) :
                        </label>
                        <input
                          type="number"
                          value={currentRest.minOrder}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setRestaurants(prev => prev.map(r => r.id === currentRest.id ? { ...r, minOrder: val } : r));
                          }}
                          className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    {/* Delivery Time min - max */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 block">
                          Délai min (min) :
                        </label>
                        <input
                          type="number"
                          value={currentRest.deliveryTimeMin}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 20;
                            setRestaurants(prev => prev.map(r => r.id === currentRest.id ? { ...r, deliveryTimeMin: val } : r));
                          }}
                          className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 block">
                          Délai max (min) :
                        </label>
                        <input
                          type="number"
                          value={currentRest.deliveryTimeMax}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 40;
                            setRestaurants(prev => prev.map(r => r.id === currentRest.id ? { ...r, deliveryTimeMax: val } : r));
                          }}
                          className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    {/* Restaurant Open / Delivery Status */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Statut des livraisons :</span>
                        <span className="text-[11px] text-slate-500">
                          {currentRest.isOpen ? 'Actuellement ouvert aux commandes' : 'Service de livraison suspendu'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setRestaurants(prev => prev.map(r => r.id === currentRest.id ? { ...r, isOpen: !r.isOpen } : r));
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          currentRest.isOpen
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {currentRest.isOpen ? 'Ouvert' : 'En pause'}
                      </button>
                    </div>

                    {/* Save Confirmation Button */}
                    <button
                      type="button"
                      onClick={() => {
                        alert(`Configuration de livraison pour "${currentRest.name}" mise à jour avec succès !`);
                      }}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer la Configuration de Livraison</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })()}

        </div>
      )}

      {/* ============================================================ */}
      {/* RESTAURANT MENU DETAIL MODAL                                 */}
      {/* ============================================================ */}
      {selectedRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center-safe justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="relative h-48 w-full">
              <img
                src={selectedRestaurant.coverImage}
                alt={selectedRestaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedRestaurant(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FF4E27] px-2 py-0.5 rounded-md">
                  {selectedRestaurant.countryFlag} {selectedRestaurant.cuisine}
                </span>
                <h3 className="font-serif font-black text-2xl text-white mt-1">
                  {selectedRestaurant.name}
                </h3>
                <p className="text-xs text-slate-300">
                  {selectedRestaurant.address} · {selectedRestaurant.deliveryTimeMin}-{selectedRestaurant.deliveryTimeMax} min
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Menu & Carte des Plats
              </h4>
              <div className="space-y-3">
                {selectedRestaurant.menu.map(dish => (
                  <div
                    key={dish.id}
                    className="p-3.5 rounded-2xl border border-slate-200/90 hover:border-orange-300 transition-all flex items-center justify-between gap-4 bg-white"
                  >
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900">{dish.name}</h5>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{dish.description}</p>
                      <span className="text-xs font-black text-[#FF4E27] mt-0.5 block">
                        {dish.price.toFixed(2)} €
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(dish, selectedRestaurant)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#FF4E27] hover:bg-[#e03d16] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CART & CHECKOUT DRAWER MODAL                                 */}
      {/* ============================================================ */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#FF4E27]" />
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    Mon Panier Afrodelicious
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">Votre panier est vide pour l'instant.</p>
                </div>
              ) : (
                <>
                  <div className="text-xs text-slate-500 font-semibold bg-slate-50 p-2.5 rounded-xl">
                    Établissement : <strong className="text-slate-900">{activeCartRestaurant?.name}</strong>
                  </div>

                  {/* Cart Items List */}
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {cart.map(item => (
                      <div key={item.dish.id} className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-slate-900 truncate">{item.dish.name}</h5>
                          <span className="text-[11px] text-slate-500">{item.dish.price.toFixed(2)} € / unité</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.dish.id, -1)}
                            className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-slate-900 min-w-[16px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.dish.id, 1)}
                            className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-slate-900 min-w-[50px] text-right">
                          {item.itemTotal.toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Code Section */}
                  <form onSubmit={handleApplyCoupon} className="space-y-1 pt-2 border-t border-slate-100">
                    <label className="block text-[11px] font-bold text-slate-600">
                      Code promo / Réduction (ex: AFRO15, FREESHIP)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Entrez votre code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs uppercase font-mono focus:outline-none focus:border-[#FF4E27]"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
                      >
                        Appliquer
                      </button>
                    </div>
                    {couponError && <p className="text-[10px] text-rose-600 font-medium">{couponError}</p>}
                    {appliedCoupon && (
                      <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Code {appliedCoupon.code} appliqué : {appliedCoupon.description}</span>
                      </p>
                    )}
                  </form>

                  {/* Address & Payment Method */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Adresse de livraison</label>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Paiement</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium"
                      >
                        <option value="card">Carte Bancaire (Stripe API)</option>
                        <option value="mobile_money">Wave / Orange Money / MTN MoMo</option>
                        <option value="apple_pay">Apple Pay / Google Pay</option>
                        <option value="cash">Paiement en espèces à la livraison</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Checkout Pricing Summary */}
            {cart.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{cartSubtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de livraison livreur</span>
                    <span>{deliveryFee.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <span>Frais de commission de livraison</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 font-bold" title="Commission de service Afrodelicious & assurance livraison">
                        Plateforme
                      </span>
                    </span>
                    <span className="font-semibold">{platformCommissionFee.toFixed(2)} €</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Réduction code promo</span>
                      <span>-{discountAmount.toFixed(2)} €</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                    <span>Total à régler</span>
                    <span className="text-[#FF4E27]">{cartTotal.toFixed(2)} €</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF4E27] to-[#FF7849] hover:from-[#e03d16] hover:to-[#e66334] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-[#FF4E27]/25 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Confirmer la commande ({cartTotal.toFixed(2)} €)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TABLE BOOKING MODAL                                          */}
      {/* ============================================================ */}
      {isBookingModalOpen && bookingRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center-safe justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#FF4E27]" />
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  Réserver chez {bookingRestaurant.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de convives</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={bookingGuests}
                  onChange={(e) => setBookingGuests(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Heure</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  >
                    <option value="12:30">12:30 (Midi)</option>
                    <option value="13:15">13:15 (Midi)</option>
                    <option value="19:30">19:30 (Soir)</option>
                    <option value="20:00">20:00 (Soir)</option>
                    <option value="20:45">20:45 (Soir)</option>
                    <option value="21:30">21:30 (Soir)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#0F3E2E] hover:bg-[#15533e] text-white text-xs font-bold transition-all shadow-md mt-2"
              >
                Confirmer la réservation instantanée
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

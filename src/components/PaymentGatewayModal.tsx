import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Smartphone, 
  CheckCircle2, 
  Lock, 
  Key, 
  Webhook, 
  RefreshCw, 
  Settings, 
  DollarSign,
  AlertCircle,
  FileText,
  Wallet,
  PiggyBank,
  Plus,
  Percent
} from 'lucide-react';
import { Course } from '../types';

export interface PaymentGatewayConfig {
  provider: 'stripe' | 'paypal' | 'orange_money' | 'wave' | 'mtn_momo' | 'afro_wallet';
  apiKey: string;
  publishableKey: string;
  webhookSecret: string;
  currency: string;
  isTestMode: boolean;
}

export const DEFAULT_PAYMENT_CONFIG: PaymentGatewayConfig = {
  provider: 'stripe',
  apiKey: 'sk_live_afro_9941a28841d99e',
  publishableKey: 'pk_live_afro_51N8xP99120',
  webhookSecret: 'whsec_9b2e88a004128f0e',
  currency: 'EUR',
  isTestMode: true
};

interface PaymentGatewayModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (courseId: string, transactionId: string) => void;
  config?: PaymentGatewayConfig;
  onUpdateConfig?: (newConfig: PaymentGatewayConfig) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  course,
  isOpen,
  onClose,
  onPaymentSuccess,
  config = DEFAULT_PAYMENT_CONFIG,
  onUpdateConfig = () => {}
}) => {
  const [activeTab, setActiveTab] = useState<'checkout' | 'api_settings'>('checkout');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile_money' | 'paypal' | 'ewallet'>('ewallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // Form Fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState('Amina Traoré');
  const [mobileProvider, setMobileProvider] = useState<'orange' | 'wave' | 'mtn'>('wave');
  const [mobilePhone, setMobilePhone] = useState('+221 77 000 00 00');

  // E-Wallet Form Fields
  const [eWalletProvider, setEWalletProvider] = useState<'afro_wallet' | 'wave_wallet' | 'apple_google_wallet'>('afro_wallet');
  const [eWalletId, setEWalletId] = useState('AFRO-WAL-99420-77');
  const [eWalletBalance, setEWalletBalance] = useState(145.50);
  const [walletDepositToast, setWalletDepositToast] = useState(false);

  // API Config State
  const [apiConfig, setApiConfig] = useState<PaymentGatewayConfig>(config);
  const [configSavedToast, setConfigSavedToast] = useState(false);

  if (!isOpen || !course) return null;

  const handleProcessPayment = () => {
    setIsProcessing(true);

    // Simulate API authorization and webhook cycle
    setTimeout(() => {
      const generatedTxId = `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      setTransactionId(generatedTxId);
      setIsProcessing(false);
      setPaymentSuccess(true);

      setTimeout(() => {
        onPaymentSuccess(course.id, generatedTxId);
        onClose();
        setPaymentSuccess(false);
      }, 1800);
    }, 1500);
  };

  const handleSaveApiConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(apiConfig);
    setConfigSavedToast(true);
    setTimeout(() => setConfigSavedToast(false), 3000);
  };

  const currencySymbol = apiConfig.currency === 'USD' ? '$' : apiConfig.currency === 'XOF' ? 'FCFA ' : '€';

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Tab Switcher */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-[#0F3E2E] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#F59E0B]" />
              <h3 className="font-serif font-bold text-lg">
                Passerelle de Paiement API Masterclass
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Intégration bancaire & Mobile Money sécurisée par API
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('checkout')}
            className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'checkout'
                ? 'bg-white border-[#FF4E27] text-slate-900 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-[#FF4E27]" />
            <span>Paiement Client</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('api_settings')}
            className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'api_settings'
                ? 'bg-white border-[#FF4E27] text-slate-900 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-emerald-600" />
            <span>Configuration API Passerelle</span>
          </button>
        </div>

        {/* Tab 1: Checkout View */}
        {activeTab === 'checkout' && (
          <div className="p-6 space-y-5">
            {/* Course Summary Card with 70% User / 30% Platform Split */}
            <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-2.5">
              <div className="flex items-center gap-3">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-orange-300"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#FF4E27] uppercase tracking-wider">
                    Masterclass Certifiante
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {course.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Par {course.chefName} · Accès illimité à vie
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-black text-slate-900">
                    {course.price === 0 ? 'Gratuit' : `${course.price.toFixed(2)} ${currencySymbol}`}
                  </span>
                </div>
              </div>

              {/* Explicit 70% User / 30% Platform Split */}
              {course.price > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-orange-200/80 text-[11px]">
                  <div className="p-2 rounded-xl bg-white border border-orange-100 flex items-center justify-between">
                    <span className="text-slate-600 font-medium flex items-center gap-1">
                      <Percent className="w-3 h-3 text-emerald-600" />
                      <span>Part Formateur (70%)</span>
                    </span>
                    <span className="font-bold text-emerald-700">
                      {(course.price * 0.70).toFixed(2)} {currencySymbol}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-orange-100 flex items-center justify-between">
                    <span className="text-slate-600 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#FF4E27]" />
                      <span>Plateforme (30%)</span>
                    </span>
                    <span className="font-bold text-slate-700">
                      {(course.price * 0.30).toFixed(2)} {currencySymbol}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Selector (Including E-Wallet) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Mode de règlement sécurisé
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  Gateway: {apiConfig.provider.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('ewallet')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all relative ${
                    paymentMethod === 'ewallet'
                      ? 'border-[#00C9A7] bg-teal-50/80 text-slate-900 ring-2 ring-[#00C9A7]/30 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded-full bg-[#00C9A7] text-slate-950 text-[8px] font-black uppercase">
                    E-Wallet
                  </span>
                  <Wallet className="w-4 h-4 text-teal-700" />
                  <span>E-Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#FF4E27] bg-[#FF4E27]/5 text-slate-900 ring-2 ring-[#FF4E27]/20 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#FF4E27]" />
                  <span>Carte Bancaire</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('mobile_money')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === 'mobile_money'
                      ? 'border-emerald-600 bg-emerald-50 text-slate-900 ring-2 ring-emerald-600/20 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Mobile Money</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-blue-600 bg-blue-50 text-slate-900 ring-2 ring-blue-600/20 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <span>PayPal</span>
                </button>
              </div>
            </div>

            {/* E-WALLET SECTION */}
            {paymentMethod === 'ewallet' && (
              <div className="space-y-3 bg-teal-50/50 p-4 rounded-2xl border border-teal-200/80">
                <div className="flex items-center justify-between pb-2 border-b border-teal-200/60">
                  <div className="flex items-center gap-2">
                    <PiggyBank className="w-5 h-5 text-teal-700" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Solde Portefeuille E-Wallet
                      </span>
                      <span className="text-[11px] text-teal-800 font-mono font-bold">
                        {eWalletBalance.toFixed(2)} {currencySymbol} disponible
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEWalletBalance(prev => prev + 50);
                      setWalletDepositToast(true);
                      setTimeout(() => setWalletDepositToast(false), 2500);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-[#00C9A7] hover:bg-[#00b093] text-slate-950 text-[11px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                    <span>Recharger (+50)</span>
                  </button>
                </div>

                {walletDepositToast && (
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900 text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>+50.00 {currencySymbol} ajoutés avec succès à votre E-Wallet !</span>
                  </div>
                )}

                {/* E-Wallet Provider Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Sélectionnez votre type de E-Wallet
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setEWalletProvider('afro_wallet')}
                      className={`p-2 rounded-xl border text-[11px] font-bold transition-all ${
                        eWalletProvider === 'afro_wallet'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      AfroWallet In-App
                    </button>
                    <button
                      type="button"
                      onClick={() => setEWalletProvider('wave_wallet')}
                      className={`p-2 rounded-xl border text-[11px] font-bold transition-all ${
                        eWalletProvider === 'wave_wallet'
                          ? 'bg-sky-500 text-white border-sky-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      Wave E-Wallet
                    </button>
                    <button
                      type="button"
                      onClick={() => setEWalletProvider('apple_google_wallet')}
                      className={`p-2 rounded-xl border text-[11px] font-bold transition-all ${
                        eWalletProvider === 'apple_google_wallet'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      Apple / G-Wallet
                    </button>
                  </div>
                </div>

                {/* E-Wallet ID / Address Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Adresse ou Identifiant E-Wallet (Portefeuille électronique)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={eWalletId}
                      onChange={(e) => setEWalletId(e.target.value)}
                      placeholder="AFRO-WAL-..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-[#00C9A7]"
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] text-emerald-600 font-bold">
                      ✓ Connecté
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Débit direct instantané et sécurisé sans frais de transaction bancaires.
                  </p>
                </div>
              </div>
            )}

            {/* Form Fields by Method */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Titulaire de la carte
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FF4E27]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-[#FF4E27]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Expiration (MM/AA)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-[#FF4E27]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-[#FF4E27]"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'mobile_money' && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Opérateur Mobile Money (Afrique de l'Ouest & Centrale)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setMobileProvider('wave')}
                      className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                        mobileProvider === 'wave' ? 'bg-sky-500 text-white border-sky-600' : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      Wave
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileProvider('orange')}
                      className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                        mobileProvider === 'orange' ? 'bg-orange-500 text-white border-orange-600' : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      Orange Money
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileProvider('mtn')}
                      className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                        mobileProvider === 'mtn' ? 'bg-yellow-400 text-slate-900 border-yellow-500' : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      MTN MoMo
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Numéro de téléphone du compte
                  </label>
                  <input
                    type="tel"
                    value={mobilePhone}
                    onChange={(e) => setMobilePhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-[#FF4E27]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Une notification push d'autorisation API sera envoyée sur votre application Mobile Money.
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-center space-y-2">
                <DollarSign className="w-8 h-8 text-blue-600 mx-auto" />
                <h5 className="text-xs font-bold text-slate-900">
                  Connexion instantanée au SDK PayPal & Apple Pay
                </h5>
                <p className="text-[11px] text-slate-600">
                  Réglez en 1 clic sans ressaisir vos coordonnées bancaires avec protection acheteur 100%.
                </p>
              </div>
            )}

            {/* Action Button */}
            {paymentSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900">
                  Paiement validé par API !
                </h4>
                <p className="text-xs text-emerald-700 font-mono">
                  Réf : {transactionId}
                </p>
                <p className="text-[11px] text-emerald-600">
                  Ouverture de votre accès masterclass...
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FF4E27] to-[#FF7849] hover:from-[#e03d16] hover:to-[#e66334] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-[#FF4E27]/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Appel API Passerelle en cours...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirmer et Payer ({course.price === 0 ? 'Gratuit' : `${course.price.toFixed(2)} ${currencySymbol}`})</span>
                  </>
                )}
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Chiffrement SSL 256-bit conforme PCI-DSS Niveau 1 · API Webhooks v2</span>
            </div>
          </div>
        )}

        {/* Tab 2: API Gateway Settings */}
        {activeTab === 'api_settings' && (
          <form onSubmit={handleSaveApiConfig} className="p-6 space-y-4">
            {configSavedToast && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Paramètres d'API Passerelle sauvegardés avec succès !</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Fournisseur de Passerelle (API Gateway Provider)
              </label>
              <select
                value={apiConfig.provider}
                onChange={(e) => setApiConfig({ ...apiConfig, provider: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#FF4E27]"
              >
                <option value="stripe">Stripe Connect (Cartes bancaires, Apple Pay, SEPA)</option>
                <option value="wave">Wave API (Sénégal, Côte d'Ivoire, Mali)</option>
                <option value="orange_money">Orange Money Web Payment API</option>
                <option value="mtn_momo">MTN MoMo API (Afrique Centrale & de l'Ouest)</option>
                <option value="paypal">PayPal REST API v2</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Clé Publique API (Publishable Key)
              </label>
              <input
                type="text"
                value={apiConfig.publishableKey}
                onChange={(e) => setApiConfig({ ...apiConfig, publishableKey: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#FF4E27]"
                placeholder="pk_live_..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Clé Secrète API (Secret API Key)
              </label>
              <input
                type="password"
                value={apiConfig.apiKey}
                onChange={(e) => setApiConfig({ ...apiConfig, apiKey: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#FF4E27]"
                placeholder="sk_live_..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Secret Webhook API (Signature de vérification)
              </label>
              <input
                type="text"
                value={apiConfig.webhookSecret}
                onChange={(e) => setApiConfig({ ...apiConfig, webhookSecret: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#FF4E27]"
                placeholder="whsec_..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Devise principale
                </label>
                <select
                  value={apiConfig.currency}
                  onChange={(e) => setApiConfig({ ...apiConfig, currency: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#FF4E27]"
                >
                  <option value="EUR">EUR (€) - Zone Euro</option>
                  <option value="USD">USD ($) - International</option>
                  <option value="XOF">XOF (FCFA) - UEMOA</option>
                  <option value="XAF">XAF (FCFA) - CEMAC</option>
                  <option value="GBP">GBP (£) - Royaume-Uni</option>
                  <option value="JMD">JMD - Jamaïque</option>
                  <option value="HTG">HTG - Haïti</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Environnement
                </label>
                <select
                  value={apiConfig.isTestMode ? 'sandbox' : 'production'}
                  onChange={(e) => setApiConfig({ ...apiConfig, isTestMode: e.target.value === 'sandbox' })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#FF4E27]"
                >
                  <option value="sandbox">Sandbox / Mode Test</option>
                  <option value="production">Production Live</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>Enregistrer la Configuration API</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

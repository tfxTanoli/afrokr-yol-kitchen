import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  CheckCircle2, 
  Store, 
  User as UserIcon, 
  Calendar, 
  CreditCard,
  ShieldCheck,
  Package,
  HeartHandshake
} from 'lucide-react';
import { DeliveryOrder } from '../data/deliveryData';
import { User } from '../types';
import { generateDeliveryInvoicePdf } from '../utils/pdfInvoiceGenerator';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: DeliveryOrder | null;
  currentUser?: User;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  order,
  currentUser
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !order) return null;

  const invoiceNumber = `FAC-${order.id.replace(/[^A-Za-z0-9]/g, '')}-${new Date().getFullYear()}`;
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const subtotal = order.subtotal;
  const deliveryFee = order.deliveryFee;
  const commission = order.platformCommissionFee || 1.20;
  const tip = order.driverTip || 0;
  const discount = order.discount || 0;
  const total = order.total;

  const tvaPlats = Math.round((subtotal - (subtotal / 1.10)) * 100) / 100;
  const tvaServices = Math.round(((deliveryFee + commission) - ((deliveryFee + commission) / 1.20)) * 100) / 100;
  const totalTVA = Math.round((tvaPlats + tvaServices) * 100) / 100;
  const totalHT = Math.round((total - tip - totalTVA) * 100) / 100;

  const handleDownloadPdf = () => {
    generateDeliveryInvoicePdf(order, currentUser);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Action Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF4E27] text-white flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-black text-sm sm:text-base text-white">
                Facture Détaillée · Commande #{order.id}
              </h3>
              <p className="text-[11px] text-slate-400">
                Document officiel d'achat Afrodelicious Delivery Food
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              title="Imprimer la facture"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF4E27] hover:bg-[#e03814] text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Download Success Alert */}
        {downloadSuccess && (
          <div className="px-6 py-2.5 bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Facture PDF générée et téléchargée avec succès sur votre appareil !</span>
          </div>
        )}

        {/* Printable/Preview Invoice Canvas */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto bg-white" id="invoice-printable-area">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-serif">
                  AFRO<span className="text-[#FF4E27]">DELICIOUS</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#0F3E2E] text-white text-[10px] font-bold">
                  DELIVERY
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Plateforme de Gastronomie Afro-Caribéenne & Livraison Express
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Afrodelicious SAS · 84 Avenue des Terroirs, 75018 Paris · SIRET: 894 123 762 00014
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-xs font-mono font-black text-[#FF4E27] uppercase tracking-wider block">
                FACTURE ACQUITTÉE
              </span>
              <p className="text-sm font-bold text-slate-900">
                N° {invoiceNumber}
              </p>
              <p className="text-xs text-slate-500">
                Date : {currentDate}
              </p>
            </div>
          </div>

          {/* Parties: Emetteur & Destinataire */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
                <Store className="w-3.5 h-3.5 text-[#0F3E2E]" />
                <span>Restaurant Émetteur</span>
              </div>
              <p className="font-bold text-slate-800 text-sm">{order.restaurantName}</p>
              <p className="text-slate-500">Partenaire certifié Afrodelicious</p>
              <p className="text-slate-500">Support client : support@afrodelicious.app</p>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#FF4E27] font-bold uppercase tracking-wider text-[11px]">
                <UserIcon className="w-3.5 h-3.5" />
                <span>Facturé à / Client</span>
              </div>
              <p className="font-bold text-slate-800 text-sm">
                {currentUser?.name || order.customerName}
              </p>
              <p className="text-slate-600">
                Adresse : {order.customerAddress}
              </p>
              <p className="text-slate-500">
                Téléphone : {order.customerPhone || '06 12 34 56 78'}
              </p>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Réf. Commande</span>
              <span className="font-mono font-bold text-slate-900">#{order.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Date de Commande</span>
              <span className="font-bold text-slate-900">{order.createdAt}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Mode de Paiement</span>
              <span className="font-bold text-slate-900 capitalize">{order.paymentMethod.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Statut Fiscal</span>
              <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                PAYÉE EN LIGNE
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#0F3E2E] text-white font-bold">
                <tr>
                  <th className="py-2.5 px-4">Désignation de l'article</th>
                  <th className="py-2.5 px-3 text-center">Qté</th>
                  <th className="py-2.5 px-3 text-right">P.U. TTC</th>
                  <th className="py-2.5 px-4 text-right">Total TTC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'}>
                    <td className="py-2.5 px-4">
                      <span className="font-bold text-slate-900 block">{item.dish.name}</span>
                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <span className="text-[10px] text-slate-400 italic">
                          Options : {item.selectedOptions.join(', ')}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600">
                      {item.dish.price.toFixed(2)} €
                    </td>
                    <td className="py-2.5 px-4 text-right font-black text-slate-900">
                      {item.itemTotal.toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Breakdown & Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left: VAT detail */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Détail TVA & Fiscalité
              </span>
              <div className="flex justify-between text-slate-600">
                <span>Total Hors Taxes (HT) :</span>
                <span>{totalHT.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>TVA Restauration 10% :</span>
                <span>{tvaPlats.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>TVA Services & Livraison 20% :</span>
                <span>{tvaServices.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-slate-800 font-bold pt-1 border-t border-slate-200">
                <span>Total TVA :</span>
                <span>{totalTVA.toFixed(2)} €</span>
              </div>

              {order.driver && (
                <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Livraison assurée par {order.driver.name} ({order.driver.vehicle})</span>
                </div>
              )}
            </div>

            {/* Right: Financial Totals */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total repas</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Frais de livraison coursier</span>
                <span>{deliveryFee.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Frais de service Afrodelicious</span>
                <span>{commission.toFixed(2)} €</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Remise promo ({order.couponCodeApplied})</span>
                  <span>-{discount.toFixed(2)} €</span>
                </div>
              )}
              {tip > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Pourboire livreur (100% reversé)</span>
                  <span>+{tip.toFixed(2)} €</span>
                </div>
              )}
              <div className="flex justify-between font-black text-base text-slate-900 pt-2 border-t border-slate-300">
                <span>Total TTC Net Payé</span>
                <span className="text-[#FF4E27]">{total.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 space-y-0.5">
            <p className="font-bold text-slate-600">
              Afrodelicious SAS · Document officiel généré automatiquement · Facture conforme aux normes fiscales
            </p>
            <p>
              Pour toute réclamation, contactez notre service client sous 48h muni de votre référence commande.
            </p>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
          <span className="text-xs text-slate-500">
            Format PDF haute fidélité prêt pour impression et comptabilité
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
            >
              Fermer
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-xl bg-[#FF4E27] hover:bg-[#e03814] text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger Facture PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

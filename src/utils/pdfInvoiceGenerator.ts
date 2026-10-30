import jsPDF from 'jspdf';
import { DeliveryOrder } from '../data/deliveryData';
import { User } from '../types';

export interface InvoiceDetails {
  invoiceNumber: string;
  orderDate: string;
  invoiceDate: string;
  companyName: string;
  companyAddress: string;
  companyVat: string;
  companySiret: string;
  companyEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  restaurantName: string;
  paymentMethod: string;
  paymentStatus: string;
}

export function generateDeliveryInvoicePdf(order: DeliveryOrder, currentUser?: User): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const invoiceNumber = `FAC-${order.id.replace(/[^A-Za-z0-9]/g, '')}-${new Date().getFullYear()}`;
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // ==========================================
  // 1. TOP BRAND BANNER (Afrodelicious Green & Orange)
  // ==========================================
  doc.setFillColor(15, 62, 46); // #0F3E2E - Afrodelicious Forest Green
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Orange accent stripe
  doc.setFillColor(255, 78, 39); // #FF4E27 - Afrodelicious Warm Coral Orange
  doc.rect(0, 28, pageWidth, 2.5, 'F');

  // Brand title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('AFRODELICIOUS', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(245, 158, 11); // Amber
  doc.text('DELIVERY FOOD & GASTRONOMIE AFRO-CARIBÉENNE', margin, 20);

  // Invoice Title Right Aligned
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('FACTURE OFFICIELLE', pageWidth - margin, 14, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(220, 230, 225);
  doc.text(`N° ${invoiceNumber}`, pageWidth - margin, 20, { align: 'right' });

  let y = 38;

  // ==========================================
  // 2. METADATA & PARTIES SECTION
  // ==========================================
  // Left Box: Platform & Restaurant Details
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth * 0.48, 38, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth * 0.48, 38, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 62, 46);
  doc.text('ÉMETTEUR & RESTAURANT PARTENAIRE', margin + 3.5, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(order.restaurantName || 'Restaurant Partenaire Afrodelicious', margin + 3.5, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Opéré par Afrodelicious SAS - Plateforme de livraison', margin + 3.5, y + 17);
  doc.text('84 Avenue des Terroirs, 75018 Paris, France', margin + 3.5, y + 22);
  doc.text('SIRET: 894 123 762 00014 · TVA: FR 42 894123762', margin + 3.5, y + 27);
  doc.text('Support : support@afrodelicious.app · www.afrodelicious.app', margin + 3.5, y + 32);

  // Right Box: Customer & Delivery Info
  const rightBoxX = margin + contentWidth * 0.52;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(rightBoxX, y, contentWidth * 0.48, 38, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(rightBoxX, y, contentWidth * 0.48, 38, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 78, 39);
  doc.text('CLIENT & ADRESSE DE LIVRAISON', rightBoxX + 3.5, y + 6);

  const customerDisplayName = currentUser?.name || order.customerName || 'Client Afrodelicious';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(customerDisplayName, rightBoxX + 3.5, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Tél : ${order.customerPhone || currentUser?.phone || '06 12 34 56 78'}`, rightBoxX + 3.5, y + 17);
  
  // Wrap address if long
  const addressText = `Adresse : ${order.customerAddress || 'Livraison à domicile'}`;
  const splitAddress = doc.splitTextToSize(addressText, contentWidth * 0.48 - 7);
  doc.text(splitAddress, rightBoxX + 3.5, y + 22);

  doc.text(`Email : ${currentUser?.email || 'client@afrodelicious.com'}`, rightBoxX + 3.5, y + 32);

  y += 44;

  // ==========================================
  // 3. ORDER SUMMARY BAR (Date, Payment, Status)
  // ==========================================
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 12, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  const colW = contentWidth / 4;
  doc.text('Commande :', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(`#${order.id}`, margin + 4, y + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.text('Date de commande :', margin + colW + 2, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${order.createdAt || currentDate}`, margin + colW + 2, y + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.text('Règlement :', margin + colW * 2 + 2, y + 5);
  doc.setFont('helvetica', 'normal');
  const payLabel = order.paymentMethod === 'card' 
    ? 'Carte bancaire (Stripe)'
    : order.paymentMethod === 'apple_pay'
    ? 'Apple Pay'
    : order.paymentMethod === 'mobile_money'
    ? 'Mobile Money (Wave/Orange)'
    : 'Paiement en ligne';
  doc.text(payLabel, margin + colW * 2 + 2, y + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.text('État facture :', margin + colW * 3 + 2, y + 5);
  doc.setTextColor(16, 185, 129); // Emerald Green
  doc.text('ACQUITTÉE (Payée)', margin + colW * 3 + 2, y + 9.5);

  y += 18;

  // ==========================================
  // 4. ITEMS TABLE
  // ==========================================
  // Table Header
  doc.setFillColor(15, 62, 46);
  doc.rect(margin, y, contentWidth, 7.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);

  const colDesig = margin + 3;
  const colQty = margin + contentWidth * 0.58;
  const colUnit = margin + contentWidth * 0.72;
  const colTotal = margin + contentWidth - 3;

  doc.text('DÉSIGNATION DES ARTICLES', colDesig, y + 5);
  doc.text('QTÉ', colQty, y + 5);
  doc.text('P.U. TTC', colUnit, y + 5);
  doc.text('TOTAL TTC', colTotal, y + 5, { align: 'right' });

  y += 7.5;

  // Table Body Rows
  let alternate = false;
  order.items.forEach((item, index) => {
    // Check if we need a new page
    if (y > pageHeight - 55) {
      doc.addPage();
      y = 20;
    }

    const rowH = item.selectedOptions && item.selectedOptions.length > 0 ? 10 : 7.5;

    if (alternate) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, rowH, 'F');
    }
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + rowH, margin + contentWidth, y + rowH);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(item.dish.name, colDesig, y + 4.5);

    if (item.selectedOptions && item.selectedOptions.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Options : ${item.selectedOptions.join(', ')}`, colDesig, y + 8.5);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`${item.quantity}`, colQty, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.text(`${item.dish.price.toFixed(2)} €`, colUnit, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.text(`${item.itemTotal.toFixed(2)} €`, colTotal, y + 4.5, { align: 'right' });

    y += rowH;
    alternate = !alternate;
  });

  y += 4;

  // ==========================================
  // 5. TOTALS & FINANCIAL BREAKDOWN
  // ==========================================
  const subtotal = order.subtotal;
  const deliveryFee = order.deliveryFee;
  const commission = order.platformCommissionFee || 1.20;
  const tip = order.driverTip || 0;
  const discount = order.discount || 0;
  const total = order.total;

  // Estimated Taxes (TVA 10% food, 20% logistics/services)
  const tvaPlats = Math.round((subtotal - (subtotal / 1.10)) * 100) / 100;
  const tvaServices = Math.round(((deliveryFee + commission) - ((deliveryFee + commission) / 1.20)) * 100) / 100;
  const totalTVA = Math.round((tvaPlats + tvaServices) * 100) / 100;
  const totalHT = Math.round((total - tip - totalTVA) * 100) / 100;

  // Right calculation box
  const totalsBoxW = contentWidth * 0.48;
  const totalsBoxX = margin + contentWidth - totalsBoxW;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(totalsBoxX, y, totalsBoxW, tip > 0 ? 56 : 50, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(totalsBoxX, y, totalsBoxW, tip > 0 ? 56 : 50, 2, 2, 'S');

  let rowY = y + 5;
  const labelX = totalsBoxX + 4;
  const valX = totalsBoxX + totalsBoxW - 4;

  const printSummaryRow = (label: string, value: string, isBold: boolean = false, textColor: [number, number, number] = [71, 85, 105]) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...textColor);
    doc.text(label, labelX, rowY);
    doc.text(value, valX, rowY, { align: 'right' });
    rowY += 5;
  };

  printSummaryRow('Sous-total plats (TTC)', `${subtotal.toFixed(2)} €`);
  printSummaryRow('Frais de livraison coursier (TTC)', `${deliveryFee.toFixed(2)} €`);
  printSummaryRow('Frais de service & plateforme (TTC)', `${commission.toFixed(2)} €`);

  if (discount > 0) {
    printSummaryRow(`Remise code promo (${order.couponCodeApplied || 'PROMO'})`, `-${discount.toFixed(2)} €`, true, [16, 185, 129]);
  }

  if (tip > 0) {
    printSummaryRow('Pourboire coursier (100% reversé, exonéré)', `+${tip.toFixed(2)} €`, true, [5, 150, 105]);
  }

  doc.setDrawColor(203, 213, 225);
  doc.line(labelX, rowY - 1, valX, rowY - 1);
  rowY += 1;

  // Net Total to Pay
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(255, 78, 39); // Warm Coral
  doc.text('TOTAL NET PAYÉ (TTC)', labelX, rowY + 1.5);
  doc.text(`${total.toFixed(2)} €`, valX, rowY + 1.5, { align: 'right' });

  // Left side info: VAT Breakdown & Driver Note
  const leftInfoW = contentWidth * 0.48;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, leftInfoW, 40, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, leftInfoW, 40, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 62, 46);
  doc.text('VENTILATION DE LA TVA & FISCALITÉ', margin + 3.5, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Total Hors Taxes (HT) : ${totalHT.toFixed(2)} €`, margin + 3.5, y + 10);
  doc.text(`TVA 10,0% (Alimentation & restauration) : ${tvaPlats.toFixed(2)} €`, margin + 3.5, y + 15);
  doc.text(`TVA 20,0% (Livraison & commission de service) : ${tvaServices.toFixed(2)} €`, margin + 3.5, y + 20);
  doc.text(`Total TVA collectée : ${totalTVA.toFixed(2)} €`, margin + 3.5, y + 25);

  if (order.driver) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`Coursier assigné : ${order.driver.name} (${order.driver.vehicle})`, margin + 3.5, y + 33);
  }

  // ==========================================
  // 6. OFFICIAL FOOTER / STAMP
  // ==========================================
  const footerY = pageHeight - 16;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(15, 62, 46);
  doc.text('AFRODELICIOUS DELIVERY FOOD - La première plateforme de gastronomie africaine & caribéenne certifiée', pageWidth / 2, footerY, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Facture acquittée générée électroniquement sous réserve des conditions générales d\'utilisation Afrodelicious SAS. Aucune signature manuscrite requise.', pageWidth / 2, footerY + 4, { align: 'center' });
  doc.text(`Document certifié conforme · Date d'impression : ${currentDate} · Page 1 / 1`, pageWidth / 2, footerY + 8, { align: 'center' });

  // Save the PDF
  doc.save(`Facture_Afrodelicious_${order.id}.pdf`);
}

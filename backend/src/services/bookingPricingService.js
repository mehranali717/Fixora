const VAT_RATE = 0.05;
const EMERGENCY_FEE = 120;

const round2 = (value) => Math.round(value * 100) / 100;

export const calculateBookingPricing = ({ basePrice, serviceDetails }) => {
  let addOnsPrice = 0;
  let urgencyFee = 0;
  const addOns = [];

  const cleaners = Number(serviceDetails.cleaners || 1);
  if (cleaners > 1) {
    const extraCleanerPrice = (cleaners - 1) * 35;
    addOnsPrice += extraCleanerPrice;
    addOns.push(`Extra cleaners x${cleaners - 1}`);
  }

  if (serviceDetails.bringMaterials) {
    addOnsPrice += 25;
    addOns.push("Cleaning materials");
  }

  if (serviceDetails.insideCabinets) {
    addOnsPrice += 20;
    addOns.push("Inside cabinets");
  }

  if (serviceDetails.ironingRequired) {
    addOnsPrice += 15;
    addOns.push("Ironing");
  }

  const itemsToFix = Number(serviceDetails.itemsToFix || 1);
  if (itemsToFix > 1) {
    const extraItemPrice = (itemsToFix - 1) * 20;
    addOnsPrice += extraItemPrice;
    addOns.push(`Extra handyman items x${itemsToFix - 1}`);
  }

  if (serviceDetails.urgencyLevel === "emergency") {
    urgencyFee = EMERGENCY_FEE;
    addOns.push("Emergency booking fee");
  }

  const subtotal = Number(basePrice) + addOnsPrice + urgencyFee;
  const vat = round2(subtotal * VAT_RATE);
  const total = round2(subtotal + vat);

  return {
    pricing: {
      basePrice: round2(Number(basePrice)),
      addOnsPrice: round2(addOnsPrice),
      urgencyFee: round2(urgencyFee),
      vat,
      total,
    },
    addOns,
  };
};
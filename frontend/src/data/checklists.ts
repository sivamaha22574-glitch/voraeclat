export interface ChecklistItem {
  id: string;
  name: string;
  category: string;
  recommendedQty: string;
  essentialLevel: 'Must Have' | 'Recommended' | 'Nice to Have';
  suggestedDepartment: string;
  note: string;
}

export const HOSPITAL_BAG_CHECKLIST: ChecklistItem[] = [
  {
    id: 'hosp-1',
    name: 'Newborn Organic Cotton Rompers / Sleepsuits',
    category: 'For Baby',
    recommendedQty: '4-6 pairs',
    essentialLevel: 'Must Have',
    suggestedDepartment: 'Baby & Toddler',
    note: 'Choose front-zipper or side-snap styles for easy hospital diaper changes.',
  },
  {
    id: 'hosp-2',
    name: 'Newborn Bamboo Diapers & Water Wipes',
    category: 'For Baby',
    recommendedQty: '1 pack (30-40 diapers) + 2 wipes packs',
    essentialLevel: 'Must Have',
    suggestedDepartment: 'Diapering & Essentials',
    note: 'Pure water wipes with 99.9% water content prevent meconium rash.',
  },
  {
    id: 'hosp-3',
    name: 'Organic Cotton Swaddles & Receiving Blankets',
    category: 'For Baby',
    recommendedQty: '3 blankets',
    essentialLevel: 'Must Have',
    suggestedDepartment: 'Nursery & Gear',
    note: 'Lightweight muslin swaddles keep baby secure and snug in air-conditioned recovery rooms.',
  },
  {
    id: 'hosp-4',
    name: 'Baby Booties, Scratch Mittens & Soft Caps',
    category: 'For Baby',
    recommendedQty: '3 sets',
    essentialLevel: 'Must Have',
    suggestedDepartment: 'Footwear & Accessories',
    note: 'Protects delicate skin from sharp newborn fingernails.',
  },
  {
    id: 'hosp-5',
    name: 'Maternity Nursing Wrap Gown & Robe',
    category: 'For Mom',
    recommendedQty: '2 gowns',
    essentialLevel: 'Must Have',
    suggestedDepartment: 'Moms & Maternity',
    note: 'Discreet feeding slits enable easy skin-to-skin bonding post delivery.',
  },
  {
    id: 'hosp-6',
    name: 'Postpartum Maternity Pads & Disposable Briefs',
    category: 'For Mom',
    recommendedQty: '2 packs',
    essentialLevel: 'Must Have',
    suggestedDepartment: 'Moms & Maternity',
    note: 'Extra-absorbent breathable organic cotton pads.',
  },
  {
    id: 'hosp-7',
    name: 'Natural Nipple Butter & Breast Therapy Gel Pads',
    category: 'For Mom',
    recommendedQty: '1 jar',
    essentialLevel: 'Recommended',
    suggestedDepartment: 'Feeding & Nursing',
    note: '100% plant-based organic lanolin alternative that requires no wipe-off before nursing.',
  },
  {
    id: 'hosp-8',
    name: 'Infant Car Seat (Rear-Facing)',
    category: 'Going Home',
    recommendedQty: '1 installed unit',
    essentialLevel: 'Must Have',
    suggestedDepartment: 'Nursery & Gear',
    note: 'Required by all hospitals before infant discharge.',
  },
];

export const BABY_SIZE_GUIDE = [
  { age: '0 - 3 Months', weightKg: '3.2 - 5.5 kg', weightLbs: '7 - 12 lbs', heightCm: '50 - 60 cm', footCm: '8 - 9.5 cm', shoeSize: '0 - 1' },
  { age: '3 - 6 Months', weightKg: '5.5 - 7.5 kg', weightLbs: '12 - 16 lbs', heightCm: '60 - 68 cm', footCm: '9.5 - 10.5 cm', shoeSize: '1 - 2' },
  { age: '6 - 12 Months', weightKg: '7.5 - 10.0 kg', weightLbs: '16 - 22 lbs', heightCm: '68 - 76 cm', footCm: '10.5 - 12.0 cm', shoeSize: '2 - 3.5' },
  { age: '1 - 2 Years', weightKg: '10.0 - 12.5 kg', weightLbs: '22 - 27 lbs', heightCm: '76 - 86 cm', footCm: '12.0 - 13.5 cm', shoeSize: '4 - 5.5' },
  { age: '2 - 4 Years', weightKg: '12.5 - 16.0 kg', weightLbs: '27 - 35 lbs', heightCm: '86 - 102 cm', footCm: '13.5 - 15.5 cm', shoeSize: '6 - 8' },
  { age: '4 - 6 Years', weightKg: '16.0 - 21.0 kg', weightLbs: '35 - 46 lbs', heightCm: '102 - 116 cm', footCm: '15.5 - 17.5 cm', shoeSize: '8.5 - 11' },
];

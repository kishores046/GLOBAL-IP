/**
 * International Classification to English Name Mapping
 * Nice Trade Class reference: https://www.wipo.int/madrid/en/goods_services/
 */

export const CLASS_NAMES: Record<string, string> = {
  '001': 'Chemicals & Pharmaceuticals',
  '002': 'Paints & Coatings',
  '003': 'Cleaning & Personal Care Products',
  '004': 'Industrial Oils & Waxes',
  '005': 'Pharmaceuticals & Medical Preparations',
  '006': 'Common Metals & Metal Products',
  '007': 'Machinery & Equipment',
  '008': 'Hand Tools & Implements',
  '009': 'Electrical & Scientific Apparatus',
  '010': 'Medical & Surgical Instruments',
  '011': 'Environmental Control Apparatus',
  '012': 'Vehicles & Transportation',
  '013': 'Firearms & Ammunition',
  '014': 'Jewelry & Precious Metals',
  '015': 'Musical Instruments',
  '016': 'Paper Goods & Office Supplies',
  '017': 'Rubber & Plastic Materials',
  '018': 'Leather & Leather Goods',
  '019': 'Non-Metallic Building Materials',
  '020': 'Furniture & Fixtures',
  '021': 'Household Utensils & Containers',
  '022': 'Rope, Cord & Textile Fibers',
  '023': 'Yarns & Threads',
  '024': 'Textiles & Fabric',
  '025': 'Clothing & Footwear',
  '026': 'Lace, Braid & Trimmings',
  '027': 'Carpets & Rugs',
  '028': 'Sports & Recreation Equipment',
  '029': 'Meat & Food Products',
  '030': 'Flour, Cereals & Prepared Foods',
  '031': 'Agricultural Products & Seeds',
  '032': 'Beer, Non-Alcoholic Beverages',
  '033': 'Alcoholic Beverages',
  '034': 'Tobacco & Smoking Supplies',
  '035': 'Advertising & Business Services',
  '036': 'Insurance & Financial Services',
  '037': 'Building & Construction Services',
  '038': 'Telecommunications Services',
  '039': 'Transportation & Storage Services',
  '040': 'Material Processing & Treatment',
  '041': 'Education & Training Services',
  '042': 'Computer & Scientific Services',
  '043': 'Food & Beverage Service',
  '044': 'Medical & Veterinary Services',
  '045': 'Legal & Security Services',
};

export const getClassNameWithCode = (code: string): string => {
  return `${code} - ${CLASS_NAMES[code] || 'Miscellaneous'}`;
};

export const getClassName = (code: string): string => {
  return CLASS_NAMES[code] || `Class ${code}`;
};


export type Region = {
  id: string;
  name: string;
};

export type Country = {
  id: string;
  name: string;
  code: string;
  regions: Region[];
};

export const countries: Country[] = [
  {
    id: "fr",
    name: "France",
    code: "FR",
    regions: [
      { id: "fr-pac", name: "Provence-Alpes-Côte d'Azur" },
      { id: "fr-idf", name: "Île-de-France" },
      { id: "fr-hdf", name: "Hauts-de-France" },
      { id: "fr-occ", name: "Occitanie" },
      { id: "fr-ara", name: "Auvergne-Rhône-Alpes" },
      { id: "fr-bfc", name: "Bourgogne-Franche-Comté" },
      { id: "fr-bre", name: "Bretagne" },
      { id: "fr-cvl", name: "Centre-Val de Loire" },
      { id: "fr-cor", name: "Corse" },
      { id: "fr-ges", name: "Grand Est" },
      { id: "fr-nor", name: "Normandie" },
      { id: "fr-naq", name: "Nouvelle-Aquitaine" },
      { id: "fr-pdl", name: "Pays de la Loire" }
    ]
  },
  {
    id: "tn",
    name: "Tunisia",
    code: "TN",
    regions: [
      { id: "tn-tun", name: "Tunis" },
      { id: "tn-sfax", name: "Sfax" },
      { id: "tn-sous", name: "Sousse" },
      { id: "tn-ari", name: "Ariana" },
      { id: "tn-ben", name: "Ben Arous" },
      { id: "tn-mon", name: "Monastir" },
      { id: "tn-nab", name: "Nabeul" },
      { id: "tn-man", name: "Manouba" },
      { id: "tn-biz", name: "Bizerte" },
      { id: "tn-gab", name: "Gabès" },
      { id: "tn-mah", name: "Mahdia" },
      { id: "tn-kai", name: "Kairouan" },
      { id: "tn-mede", name: "Médenine" },
      { id: "tn-gaf", name: "Gafsa" }
    ]
  }
];

export const getRegionsByCountryId = (countryId: string): Region[] => {
  const country = countries.find(c => c.id === countryId);
  return country ? country.regions : [];
};

export const getCountryById = (countryId: string): Country | undefined => {
  return countries.find(c => c.id === countryId);
};

export const getRegionById = (regionId: string): Region | undefined => {
  for (const country of countries) {
    const region = country.regions.find(r => r.id === regionId);
    if (region) {
      return region;
    }
  }
  return undefined;
};

export const getCountryAndRegionNames = (countryId: string | undefined, regionId: string | undefined): {
  countryName: string;
  regionName: string;
} => {
  if (!countryId && !regionId) {
    return { countryName: "", regionName: "" };
  }

  let countryName = "";
  let regionName = "";

  if (countryId) {
    const country = getCountryById(countryId);
    if (country) {
      countryName = country.name;
    }
  }

  if (regionId) {
    const region = getRegionById(regionId);
    if (region) {
      regionName = region.name;
    }
  }

  return { countryName, regionName };
};

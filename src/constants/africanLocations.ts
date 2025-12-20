export interface City {
  name: string;
  country: string;
}

export interface Country {
  code: string;
  name: string;
  cities: string[];
}

export const AFRICAN_COUNTRIES: Country[] = [
  {
    code: 'ZA',
    name: 'South Africa',
    cities: [
      'Johannesburg',
      'Cape Town',
      'Durban',
      'Pretoria',
      'Port Elizabeth',
      'Bloemfontein',
      'East London',
      'Polokwane',
      'Nelspruit',
      'Kimberley',
      'Rustenburg',
      'Pietermaritzburg',
      'Sandton',
      'Soweto',
      'Centurion'
    ]
  },
  {
    code: 'NG',
    name: 'Nigeria',
    cities: [
      'Lagos',
      'Abuja',
      'Kano',
      'Ibadan',
      'Port Harcourt',
      'Benin City',
      'Kaduna',
      'Enugu',
      'Calabar',
      'Uyo',
      'Warri',
      'Abeokuta',
      'Onitsha',
      'Jos',
      'Ilorin'
    ]
  },
  {
    code: 'GH',
    name: 'Ghana',
    cities: [
      'Accra',
      'Kumasi',
      'Tamale',
      'Takoradi',
      'Cape Coast',
      'Tema',
      'Koforidua',
      'Sunyani',
      'Ho',
      'Wa'
    ]
  },
  {
    code: 'KE',
    name: 'Kenya',
    cities: [
      'Nairobi',
      'Mombasa',
      'Kisumu',
      'Nakuru',
      'Eldoret',
      'Malindi',
      'Thika',
      'Nyeri',
      'Machakos',
      'Lamu'
    ]
  },
  {
    code: 'BW',
    name: 'Botswana',
    cities: [
      'Gaborone',
      'Francistown',
      'Maun',
      'Kasane',
      'Selebi-Phikwe',
      'Serowe',
      'Palapye',
      'Lobatse'
    ]
  },
  {
    code: 'TZ',
    name: 'Tanzania',
    cities: [
      'Dar es Salaam',
      'Zanzibar City',
      'Arusha',
      'Mwanza',
      'Dodoma',
      'Moshi',
      'Tanga',
      'Morogoro'
    ]
  },
  {
    code: 'UG',
    name: 'Uganda',
    cities: [
      'Kampala',
      'Entebbe',
      'Jinja',
      'Gulu',
      'Mbale',
      'Mbarara',
      'Fort Portal'
    ]
  },
  {
    code: 'RW',
    name: 'Rwanda',
    cities: [
      'Kigali',
      'Butare',
      'Gisenyi',
      'Ruhengeri',
      'Kibuye'
    ]
  },
  {
    code: 'ET',
    name: 'Ethiopia',
    cities: [
      'Addis Ababa',
      'Dire Dawa',
      'Gondar',
      'Bahir Dar',
      'Hawassa',
      'Mekelle',
      'Jimma'
    ]
  },
  {
    code: 'SN',
    name: 'Senegal',
    cities: [
      'Dakar',
      'Saint-Louis',
      'Thiès',
      'Kaolack',
      'Ziguinchor',
      'Rufisque'
    ]
  },
  {
    code: 'CI',
    name: 'Côte d\'Ivoire',
    cities: [
      'Abidjan',
      'Yamoussoukro',
      'Bouaké',
      'Daloa',
      'San-Pédro',
      'Grand-Bassam'
    ]
  },
  {
    code: 'MA',
    name: 'Morocco',
    cities: [
      'Casablanca',
      'Marrakech',
      'Rabat',
      'Fes',
      'Tangier',
      'Agadir',
      'Essaouira',
      'Chefchaouen'
    ]
  },
  {
    code: 'EG',
    name: 'Egypt',
    cities: [
      'Cairo',
      'Alexandria',
      'Giza',
      'Luxor',
      'Aswan',
      'Sharm El Sheikh',
      'Hurghada'
    ]
  },
  {
    code: 'MU',
    name: 'Mauritius',
    cities: [
      'Port Louis',
      'Curepipe',
      'Vacoas-Phoenix',
      'Quatre Bornes',
      'Rose Hill',
      'Grand Baie'
    ]
  },
  {
    code: 'ZM',
    name: 'Zambia',
    cities: [
      'Lusaka',
      'Livingstone',
      'Kitwe',
      'Ndola',
      'Kabwe'
    ]
  },
  {
    code: 'ZW',
    name: 'Zimbabwe',
    cities: [
      'Harare',
      'Bulawayo',
      'Victoria Falls',
      'Mutare',
      'Gweru'
    ]
  },
  {
    code: 'NA',
    name: 'Namibia',
    cities: [
      'Windhoek',
      'Swakopmund',
      'Walvis Bay',
      'Rundu',
      'Oshakati'
    ]
  },
  {
    code: 'MZ',
    name: 'Mozambique',
    cities: [
      'Maputo',
      'Beira',
      'Nampula',
      'Quelimane',
      'Tete',
      'Vilankulo'
    ]
  },
  {
    code: 'AO',
    name: 'Angola',
    cities: [
      'Luanda',
      'Lubango',
      'Benguela',
      'Huambo',
      'Lobito'
    ]
  },
  {
    code: 'CM',
    name: 'Cameroon',
    cities: [
      'Yaoundé',
      'Douala',
      'Bamenda',
      'Bafoussam',
      'Garoua',
      'Limbe'
    ]
  }
];

export const getAllCities = (): City[] => {
  return AFRICAN_COUNTRIES.flatMap(country => 
    country.cities.map(city => ({
      name: city,
      country: country.name
    }))
  );
};

export const getCountryNames = (): string[] => {
  return AFRICAN_COUNTRIES.map(c => c.name);
};

export const getCitiesByCountry = (countryName: string): string[] => {
  const country = AFRICAN_COUNTRIES.find(c => c.name === countryName);
  return country?.cities || [];
};

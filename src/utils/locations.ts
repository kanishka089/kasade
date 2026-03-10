export interface District {
  name: string;
  province: string;
  latitude: number;
  longitude: number;
  cities: { name: string; latitude: number; longitude: number }[];
}

export const SRI_LANKAN_DISTRICTS: District[] = [
  { name: 'Colombo', province: 'Western', latitude: 6.9271, longitude: 79.8612, cities: [
    { name: 'Colombo', latitude: 6.9271, longitude: 79.8612 },
    { name: 'Dehiwala-Mount Lavinia', latitude: 6.8390, longitude: 79.8650 },
    { name: 'Moratuwa', latitude: 6.7730, longitude: 79.8820 },
    { name: 'Kotte', latitude: 6.8910, longitude: 79.9060 },
    { name: 'Nugegoda', latitude: 6.8720, longitude: 79.8930 },
  ]},
  { name: 'Gampaha', province: 'Western', latitude: 7.0840, longitude: 80.0098, cities: [
    { name: 'Gampaha', latitude: 7.0840, longitude: 80.0098 },
    { name: 'Negombo', latitude: 7.2094, longitude: 79.8358 },
    { name: 'Wattala', latitude: 6.9890, longitude: 79.8910 },
    { name: 'Ja-Ela', latitude: 7.0750, longitude: 79.8910 },
    { name: 'Kadawatha', latitude: 6.9830, longitude: 79.9530 },
  ]},
  { name: 'Kalutara', province: 'Western', latitude: 6.5854, longitude: 79.9607, cities: [
    { name: 'Kalutara', latitude: 6.5854, longitude: 79.9607 },
    { name: 'Panadura', latitude: 6.7130, longitude: 79.9060 },
    { name: 'Horana', latitude: 6.7160, longitude: 80.0620 },
    { name: 'Beruwala', latitude: 6.4789, longitude: 79.9830 },
  ]},
  { name: 'Kandy', province: 'Central', latitude: 7.2906, longitude: 80.6337, cities: [
    { name: 'Kandy', latitude: 7.2906, longitude: 80.6337 },
    { name: 'Peradeniya', latitude: 7.2590, longitude: 80.5920 },
    { name: 'Katugastota', latitude: 7.3230, longitude: 80.6240 },
    { name: 'Gampola', latitude: 7.1640, longitude: 80.5770 },
  ]},
  { name: 'Matale', province: 'Central', latitude: 7.4675, longitude: 80.6234, cities: [
    { name: 'Matale', latitude: 7.4675, longitude: 80.6234 },
    { name: 'Dambulla', latitude: 7.8567, longitude: 80.6517 },
    { name: 'Sigiriya', latitude: 7.9570, longitude: 80.7603 },
  ]},
  { name: 'Nuwara Eliya', province: 'Central', latitude: 6.9497, longitude: 80.7891, cities: [
    { name: 'Nuwara Eliya', latitude: 6.9497, longitude: 80.7891 },
    { name: 'Hatton', latitude: 6.8916, longitude: 80.5958 },
  ]},
  { name: 'Galle', province: 'Southern', latitude: 6.0535, longitude: 80.2210, cities: [
    { name: 'Galle', latitude: 6.0535, longitude: 80.2210 },
    { name: 'Ambalangoda', latitude: 6.2357, longitude: 80.0540 },
    { name: 'Hikkaduwa', latitude: 6.1395, longitude: 80.1014 },
  ]},
  { name: 'Matara', province: 'Southern', latitude: 5.9549, longitude: 80.5550, cities: [
    { name: 'Matara', latitude: 5.9549, longitude: 80.5550 },
    { name: 'Weligama', latitude: 5.9740, longitude: 80.4299 },
  ]},
  { name: 'Hambantota', province: 'Southern', latitude: 6.1243, longitude: 81.1185, cities: [
    { name: 'Hambantota', latitude: 6.1243, longitude: 81.1185 },
    { name: 'Tangalle', latitude: 6.0231, longitude: 80.7954 },
  ]},
  { name: 'Jaffna', province: 'Northern', latitude: 9.6615, longitude: 80.0255, cities: [
    { name: 'Jaffna', latitude: 9.6615, longitude: 80.0255 },
    { name: 'Nallur', latitude: 9.6756, longitude: 80.0280 },
  ]},
  { name: 'Kilinochchi', province: 'Northern', latitude: 9.3803, longitude: 80.3770, cities: [
    { name: 'Kilinochchi', latitude: 9.3803, longitude: 80.3770 },
  ]},
  { name: 'Mannar', province: 'Northern', latitude: 8.9810, longitude: 79.9044, cities: [
    { name: 'Mannar', latitude: 8.9810, longitude: 79.9044 },
  ]},
  { name: 'Vavuniya', province: 'Northern', latitude: 8.7514, longitude: 80.4971, cities: [
    { name: 'Vavuniya', latitude: 8.7514, longitude: 80.4971 },
  ]},
  { name: 'Mullaitivu', province: 'Northern', latitude: 9.2671, longitude: 80.8142, cities: [
    { name: 'Mullaitivu', latitude: 9.2671, longitude: 80.8142 },
  ]},
  { name: 'Batticaloa', province: 'Eastern', latitude: 7.7170, longitude: 81.7000, cities: [
    { name: 'Batticaloa', latitude: 7.7170, longitude: 81.7000 },
  ]},
  { name: 'Ampara', province: 'Eastern', latitude: 7.2976, longitude: 81.6720, cities: [
    { name: 'Ampara', latitude: 7.2976, longitude: 81.6720 },
    { name: 'Kalmunai', latitude: 7.4132, longitude: 81.8213 },
  ]},
  { name: 'Trincomalee', province: 'Eastern', latitude: 8.5874, longitude: 81.2152, cities: [
    { name: 'Trincomalee', latitude: 8.5874, longitude: 81.2152 },
  ]},
  { name: 'Kurunegala', province: 'North Western', latitude: 7.4863, longitude: 80.3647, cities: [
    { name: 'Kurunegala', latitude: 7.4863, longitude: 80.3647 },
    { name: 'Kuliyapitiya', latitude: 7.4690, longitude: 80.0410 },
  ]},
  { name: 'Puttalam', province: 'North Western', latitude: 8.0362, longitude: 79.8283, cities: [
    { name: 'Puttalam', latitude: 8.0362, longitude: 79.8283 },
    { name: 'Chilaw', latitude: 7.5758, longitude: 79.7953 },
  ]},
  { name: 'Anuradhapura', province: 'North Central', latitude: 8.3114, longitude: 80.4037, cities: [
    { name: 'Anuradhapura', latitude: 8.3114, longitude: 80.4037 },
  ]},
  { name: 'Polonnaruwa', province: 'North Central', latitude: 7.9403, longitude: 81.0188, cities: [
    { name: 'Polonnaruwa', latitude: 7.9403, longitude: 81.0188 },
  ]},
  { name: 'Badulla', province: 'Uva', latitude: 6.9934, longitude: 81.0550, cities: [
    { name: 'Badulla', latitude: 6.9934, longitude: 81.0550 },
    { name: 'Bandarawela', latitude: 6.8283, longitude: 80.9881 },
  ]},
  { name: 'Monaragala', province: 'Uva', latitude: 6.8728, longitude: 81.3507, cities: [
    { name: 'Monaragala', latitude: 6.8728, longitude: 81.3507 },
  ]},
  { name: 'Ratnapura', province: 'Sabaragamuwa', latitude: 6.6828, longitude: 80.3992, cities: [
    { name: 'Ratnapura', latitude: 6.6828, longitude: 80.3992 },
    { name: 'Embilipitiya', latitude: 6.3420, longitude: 80.8490 },
  ]},
  { name: 'Kegalle', province: 'Sabaragamuwa', latitude: 7.2513, longitude: 80.3464, cities: [
    { name: 'Kegalle', latitude: 7.2513, longitude: 80.3464 },
    { name: 'Mawanella', latitude: 7.2530, longitude: 80.4530 },
  ]},
];

export const RELIGIONS = ['Buddhism', 'Hinduism', 'Islam', 'Christianity', 'Other'];

export const EDUCATION_LEVELS = [
  'Below O/L', 'O/L Passed', 'A/L Passed', 'Diploma',
  'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Professional Qualification', 'Other',
];

export const CASTES = [
  'Govigama', 'Karava', 'Salagama', 'Durava', 'Navandanna', 'Bathgama',
  'Wahumpura', 'Radala', 'Other', 'Prefer not to say',
];

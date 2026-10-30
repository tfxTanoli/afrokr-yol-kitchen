// Central image assets registry for authentic African/Carib chefs and matching dishes
// `new URL(..., import.meta.url)` lets Vite bundle each image (hashed URL in production builds).

const asset = (file: string) => new URL(`../assets/images/${file}`, import.meta.url).href;

// Authentic Chef Portraits
export const CHEF_AVATARS = {
  fatou: asset('chef_fatou_portrait_1791052167407.jpg'),
  rodrigue: asset('chef_rodrigue_portrait_1791052180350.jpg'),
  marcus: asset('chef_marcus_portrait_1791052194260.jpg'),
  marieline: asset('marieline_portrait_1791052205466.jpg'),
  aicha: asset('chef_aicha_portrait_1791052219392.jpg'),
  driverMoussa: asset('chef_rodrigue_portrait_1791052180350.jpg'),
  driverKoffi: asset('chef_marcus_portrait_1791052194260.jpg'),
  driverSarah: asset('marieline_portrait_1791052205466.jpg')
};

// Authentic Recipe Dish Photos accurately matching titles
export const RECIPE_DISH_IMAGES = {
  thieboudienne: asset('thieboudienne_dish_1791052230956.jpg'),
  colomboCabri: asset('colombo_cabri_dish_1791052243117.jpg'),
  griotHaitien: asset('griot_haitien_dish_1791052256472.jpg'),
  attiekeGarba: asset('attieke_garba_dish_1791052267593.jpg'),
  jerkChicken: asset('jerk_chicken_dish_1791052279134.jpg'),
  bokitGuadeloupe: asset('bokit_guadeloupe_dish_1791052292094.jpg'),
  allocoIvoirien: asset('alloco_ivoirien_dish_1791052304906.jpg'),
  pastelsSenegal: asset('pastels_senegal_dish_1791052318700.jpg')
};

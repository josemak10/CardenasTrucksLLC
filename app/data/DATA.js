const DataScreen = [
  {
    id: "001-DELIVERY",
    title: "Delivery",
    icon: "md-create",
    iconType: "ionicon",
    stack: "home-stack",
    screen: "delivery",
    permission: ["admin"],
  },
  {
    id: "002-DELIVERIES-PROGRESS",
    title: "Progress",
    icon: "ios-today",
    iconType: "ionicon",
    stack: "home-stack",
    screen: "delivery-search",
    permission: ["admin"],
  },
  {
    id: "003-DRIVER-MILES",
    title: "Driver miles",
    icon: "speedometer-slow",
    iconType: "material-community",
    stack: "home-stack",
    screen: "driver-miles",
    permission: ["driver"],
  },
  {
    id: "004-DELIVERY-BY-DRIVER",
    title: "Delivery by driver",
    icon: "md-person",
    iconType: "ionicon",
    stack: "home-stack",
    screen: "driver-delivery",
    permission: ["driver"],
  },
  {
    id: "005-SETTING",
    title: "Setting",
    icon: "ios-settings",
    iconType: "ionicon",
    stack: "setting-stack",
    screen: "setting-user",
    permission: ["admin", "driver"],
  },
];

export { DataScreen };

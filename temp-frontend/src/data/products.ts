import { Product } from '../types/index';

export const products: Product[] = [
  {
    id: "1",
    name: "Y010 3-IN-1 Wireless Charger Foldable 15W Fast Charging Station",
    price: 8.00,
    description: "Premium 3-in-1 wireless charging dock for your phone, smartwatch, and earphones. Features 15W/10W/7.5W/5W charging capabilities, made with high-quality ABS and Aluminum materials. Includes night light ambient light and foldable design for easy storage.",
    image: "https://s.alicdn.com/@sc04/kf/Ha5a083aaaea8453bb941aaf1c5ee8d6fY.jpg_720x720q50.jpg",
    features: [
      "Multi-device charging (Phone + Earphones + Watch)",
      "15W/10W/7.5W/5W/3W power output",
      "Night Light Ambient Light",
      "Foldable design",
      "Type-C port",
      "CE FCC ROHS certified",
      "Compact design: 46X31X42 cm"
    ],
    specifications: {
      material: "ABS, Aluminum",
      input: "12-24V/5A",
      output: "9V/2A, 5V/3A, 12V/1.5A",
      chargingDistance: "<6mm",
      warranty: "1 year",
      protection: ["Short Circuit", "Overcurrent", "Overvoltage"]
    },
    colors: [
      {
        name: "White",
        image: "https://s.alicdn.com/@sc04/kf/H39bf4944d26c4a1fbecb796104f6f6a0T.jpg_720x720q50.jpg"
      },
      {
        name: "Black",
        image: "https://s.alicdn.com/@sc04/kf/Hedb053c5b1d842b79c8887382ad7a2d0j.jpg_720x720q50.jpg"
      }
    ]
  }
]; 
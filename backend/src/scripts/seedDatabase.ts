import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../config/environment';
import { User } from '../models/User';
import { Product } from '../models/Product';

const sampleProducts = [
  {
    name: "Y010 3-IN-1 Wireless Charger Foldable 15W Fast Charging Station",
    description: "Premium 3-in-1 wireless charging dock for your phone, smartwatch, and earphones. Features 15W/10W/7.5W/5W charging capabilities, made with high-quality ABS and Aluminum materials. Includes night light ambient light and foldable design for easy storage.",
    price: 8.00,
    category: "Electronics",
    stock: 50,
    images: [
      "https://s.alicdn.com/@sc04/kf/Ha5a083aaaea8453bb941aaf1c5ee8d6fY.jpg_720x720q50.jpg",
      "https://s.alicdn.com/@sc04/kf/H39bf4944d26c4a1fbecb796104f6f6a0T.jpg_720x720q50.jpg",
      "https://s.alicdn.com/@sc04/kf/Hedb053c5b1d842b79c8887382ad7a2d0j.jpg_720x720q50.jpg"
    ],
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
    ],
    averageRating: 4.5,
    numReviews: 12
  },
  {
    name: "Premium Wireless Earbuds Pro",
    description: "High-quality wireless earbuds with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.",
    price: 29.99,
    category: "Electronics",
    stock: 100,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500"
    ],
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Premium sound quality",
      "Water resistant",
      "Touch controls",
      "Wireless charging case"
    ],
    specifications: {
      batteryLife: "30 hours",
      connectivity: "Bluetooth 5.0",
      waterResistance: "IPX4",
      chargingTime: "2 hours"
    },
    averageRating: 4.8,
    numReviews: 45
  },
  {
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking watch with heart rate monitoring, GPS, and 7-day battery life. Perfect for athletes and health enthusiasts.",
    price: 49.99,
    category: "Electronics",
    stock: 75,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500"
    ],
    features: [
      "Heart rate monitoring",
      "GPS tracking",
      "7-day battery life",
      "Water resistant",
      "Sleep tracking",
      "Activity tracking"
    ],
    specifications: {
      batteryLife: "7 days",
      waterResistance: "5ATM",
      display: "1.4 inch AMOLED",
      connectivity: "Bluetooth 5.0"
    },
    averageRating: 4.6,
    numReviews: 28
  }
];

const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'fariddmahmudlu2008@gmail.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return existingAdmin;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('farid20082011', config.bcryptRounds);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'fariddmahmudlu2008@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin user created successfully');
    return adminUser;
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
};

const createSampleProducts = async () => {
  try {
    // Check if products already exist
    const existingProducts = await Product.find();
    if (existingProducts.length > 0) {
      console.log(`✅ ${existingProducts.length} products already exist`);
      return existingProducts;
    }

    // Create sample products
    const products = await Product.create(sampleProducts);
    console.log(`✅ ${products.length} sample products created successfully`);
    return products;
  } catch (error) {
    console.error('❌ Error creating sample products:', error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB');

    // Create admin user
    await createAdminUser();

    // Create sample products
    await createSampleProducts();

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Email: fariddmahmudlu2008@gmail.com');
    console.log('   Password: farid20082011');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase; 
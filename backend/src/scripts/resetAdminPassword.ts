import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../config/environment';
import { User } from '../models/User';

const ADMIN_EMAIL = 'fariddmahmudlu2008@gmail.com';
const ADMIN_PASSWORD = 'farid20082011';

const resetAdminAccount = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    // Remove all other admin accounts except the one with the specified email
    await User.deleteMany({ role: 'admin', email: { $ne: ADMIN_EMAIL } });
    let admin = await User.findOne({ email: ADMIN_EMAIL });
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, config.bcryptRounds);
    if (!admin) {
      admin = await User.create({
        name: 'Admin User',
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
      });
      console.log('✅ Admin user created successfully');
    } else {
      admin.password = hashedPassword;
      admin.role = 'admin';
      await admin.save();
      console.log('✅ Admin user password and role updated successfully');
    }
    console.log('   Email:', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
  } catch (error) {
    console.error('❌ Error resetting admin account:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
};

resetAdminAccount(); 
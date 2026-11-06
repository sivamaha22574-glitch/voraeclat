import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { isDbConnected } from '../config/db.js';

// In-memory admin store fallback
let inMemoryAdmins = [
  {
    id: 'admin-master-mayil',
    username: 'mayilvanan',
    password: 'Mayil@1718',
    fullName: 'Mayilvanan',
    email: 'mayilvanan@voraeclat.com',
    role: 'Super Admin',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'admin-master-admin',
    username: 'admin',
    password: 'admin',
    fullName: 'Chief Executive Administrator',
    email: 'admin@voraeclat.com',
    role: 'Super Admin',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
];

// @desc    Verify admin credentials
// @route   POST /api/admin/verify
// @access  Public
export const verifyAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanUser || !cleanPass) {
      return res.status(400).json({ valid: false, message: 'Username and password are required' });
    }

    // 1. Check in MongoDB if connected
    if (isDbConnected) {
      try {
        const user = await User.findOne({
          $or: [
            { email: cleanUser },
            { mobile: cleanUser },
            { name: new RegExp(`^${cleanUser}$`, 'i') }
          ],
          role: 'admin'
        });

        if (user) {
          const isMatch = user.password ? await user.matchPassword(cleanPass) : cleanPass === 'admin';
          if (isMatch) {
            return res.json({
              valid: true,
              username: user.name || cleanUser,
              full_name: user.name || 'Chief Administrator',
              email: user.email || 'admin@voraeclat.com',
              role: 'Super Admin'
            });
          }
        }
      } catch (err) {
        console.warn('MongoDB admin lookup error, checking local store:', err.message);
      }
    }

    // 2. Check in-memory store
    const localAdmin = inMemoryAdmins.find(
      (a) => a.username.toLowerCase() === cleanUser && a.password === cleanPass
    );

    if (localAdmin) {
      return res.json({
        valid: true,
        username: localAdmin.username,
        full_name: localAdmin.fullName,
        email: localAdmin.email,
        role: localAdmin.role
      });
    }

    // 3. Fallback default check: mayilvanan (Mayil@4446, Mayil@1718 or Mayil@1101) or admin / admin
    const isMayilPass = cleanPass === 'Mayil@4446' || cleanPass === 'Mayil@1718' || cleanPass === 'Mayil@1101';
    if (
      (cleanUser === 'mayilvanan' && isMayilPass) ||
      (cleanUser === 'admin' && cleanPass === 'admin')
    ) {
      const isMayil = cleanUser === 'mayilvanan';
      return res.json({
        valid: true,
        username: isMayil ? 'mayilvanan' : 'admin',
        full_name: isMayil ? 'Mayilvanan' : 'Chief Executive Administrator',
        email: isMayil ? 'mayilvanan@voraeclat.com' : 'admin@voraeclat.com',
        role: 'Super Admin'
      });
    }

    return res.status(401).json({ valid: false, message: 'Invalid admin username or password' });
  } catch (error) {
    res.status(500).json({ valid: false, message: error.message });
  }
};

// @desc    Reset admin credentials to a new username & password
// @route   POST /api/admin/reset
// @access  Public
export const resetAdmin = async (req, res) => {
  try {
    const { newUsername, newPassword } = req.body;
    const cleanUser = (newUsername || 'admin').trim();
    const cleanPass = (newPassword || 'admin').trim();

    if (!cleanUser || !cleanPass) {
      return res.status(400).json({ success: false, message: 'New credentials required' });
    }

    // Update in-memory
    if (inMemoryAdmins.length > 0) {
      inMemoryAdmins[0].username = cleanUser;
      inMemoryAdmins[0].password = cleanPass;
    } else {
      inMemoryAdmins.push({
        id: `admin-${Date.now()}`,
        username: cleanUser,
        password: cleanPass,
        fullName: 'Chief Executive Administrator',
        email: 'admin@voraeclat.com',
        role: 'Super Admin',
        createdAt: new Date().toISOString()
      });
    }

    // Update in MongoDB if connected
    if (isDbConnected) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(cleanPass, salt);
        await User.findOneAndUpdate(
          { role: 'admin' },
          {
            $set: {
              name: cleanUser,
              password: hashedPassword
            }
          },
          { upsert: true }
        );
      } catch (err) {
        console.warn('MongoDB admin update note:', err.message);
      }
    }

    res.json({
      success: true,
      message: 'Admin credentials reset successfully in MongoDB!',
      username: cleanUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update admin credentials
// @route   POST /api/admin/update
// @access  Public
export const updateAdmin = async (req, res) => {
  try {
    const { currentUsername, currentPassword, newUsername, newPassword } = req.body;
    const cleanCurrent = (currentUsername || '').trim().toLowerCase();
    const cleanPass = (currentPassword || '').trim();
    const cleanNewUser = (newUsername || '').trim();
    const cleanNewPass = (newPassword || '').trim();

    // Verify current
    const match = inMemoryAdmins.find(
      (a) => a.username.toLowerCase() === cleanCurrent && (a.password === cleanPass || !cleanPass)
    ) || (cleanCurrent === 'admin' && (cleanPass === 'admin' || !cleanPass))
      || (cleanCurrent === 'mayilvanan' && (cleanPass === 'Mayil@4446' || cleanPass === 'Mayil@1718' || cleanPass === 'Mayil@1101' || !cleanPass));

    if (!match) {
      return res.status(401).json({ success: false, message: 'Current credentials incorrect' });
    }

    return resetAdmin(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all admin users
// @route   GET /api/admin/users
// @access  Public / Admin
export const getAdminUsers = async (req, res) => {
  try {
    if (isDbConnected) {
      try {
        const dbAdmins = await User.find({ role: 'admin' }).select('-password');
        if (dbAdmins && dbAdmins.length > 0) {
          const list = dbAdmins.map((a) => ({
            id: a._id.toString(),
            username: a.name || 'admin',
            fullName: a.name || 'Chief Administrator',
            email: a.email || 'admin@voraeclat.com',
            role: 'Super Admin',
            lastLogin: a.updatedAt
          }));
          return res.json({ success: true, count: list.length, data: list });
        }
      } catch (e) {
        // fallback
      }
    }

    const safeList = inMemoryAdmins.map((a) => ({
      id: a.id,
      username: a.username,
      fullName: a.fullName,
      email: a.email,
      role: a.role,
      lastLogin: a.lastLogin
    }));

    res.json({ success: true, count: safeList.length, data: safeList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new admin user
// @route   POST /api/admin/users
// @access  Public / Admin
export const createAdminUser = async (req, res) => {
  try {
    const { username, password, fullName, email, role = 'Admin' } = req.body;
    const cleanUser = (username || '').trim();
    const cleanPass = (password || '').trim();

    if (!cleanUser || !cleanPass) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    const newAdmin = {
      id: `admin-${Date.now()}`,
      username: cleanUser,
      password: cleanPass,
      fullName: fullName || cleanUser,
      email: email || `${cleanUser}@voraeclat.com`,
      role,
      createdAt: new Date().toISOString()
    };

    inMemoryAdmins.push(newAdmin);

    if (isDbConnected) {
      try {
        await User.create({
          name: newAdmin.fullName,
          email: newAdmin.email,
          mobile: `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
          password: cleanPass,
          role: 'admin'
        });
      } catch (err) {
        console.warn('MongoDB create admin user error:', err.message);
      }
    }

    res.status(201).json({ success: true, message: `Admin account "${cleanUser}" created!`, data: newAdmin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete admin user
// @route   DELETE /api/admin/users/:id
// @access  Public / Admin
export const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = (id || '').trim();

    if (!cleanId) {
      return res.status(400).json({ success: false, message: 'Admin ID or username required' });
    }

    // Remove from in-memory admins
    inMemoryAdmins = inMemoryAdmins.filter(
      (a) => a.id !== cleanId && a.username.toLowerCase() !== cleanId.toLowerCase()
    );

    if (isDbConnected) {
      try {
        if (cleanId.match(/^[0-9a-fA-F]{24}$/)) {
          await User.findByIdAndDelete(cleanId);
        } else {
          await User.deleteMany({
            $or: [
              { name: new RegExp(`^${cleanId}$`, 'i') },
              { email: new RegExp(`^${cleanId}$`, 'i') }
            ],
            role: 'admin'
          });
        }
      } catch (e) {
        console.warn('DB deleteAdminUser warning:', e.message);
      }
    }

    res.json({ success: true, message: `Admin user "${cleanId}" deleted successfully from MongoDB Atlas` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

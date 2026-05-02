import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';
import bcrypt from 'bcrypt';

export default async function seedUsers() {
    const existingAdmin = await userRepository.findByEmail('admin@ejemplo.com');
    if (!existingAdmin) {
        const adminRole = await roleRepository.findByName('admin');
        const userRole = await roleRepository.findByName('user');
        
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
        const hashed = await bcrypt.hash('Admin123#', saltRounds);

        await userRepository.create({
            name: 'Administrador',
            lastName: 'Sistema',
            email: 'admin@ejemplo.com',
            password: hashed,
            phoneNumber: '1234567890',
            birthdate: new Date('1990-01-01'),
            url_profile: 'https://via.placeholder.com/150',
            address: 'Calle Falsa 123',
            roles: [adminRole._id, userRole._id]
        });
        console.log('Seeded admin user: admin@ejemplo.com (pwd: Admin123#)');
    }
}

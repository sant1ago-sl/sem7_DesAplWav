import userRepository from '../repositories/UserRepository.js';

class UserService {

    async getAll() {
        return userRepository.getAll();
    }

    async getById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return {
            id: user._id,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            age: user.age,
            address: user.address,
            url_profile: user.url_profile,
            roles: user.roles.map(r => r.name)
        };
    }

    async update(id, updateData) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }

        if (updateData.name) user.name = updateData.name;
        if (updateData.lastName) user.lastName = updateData.lastName;
        if (updateData.phoneNumber) user.phoneNumber = updateData.phoneNumber;
        if (updateData.address) user.address = updateData.address;
        if (updateData.url_profile) user.url_profile = updateData.url_profile;

        await user.save();

        return this.getById(id);
    }

    async delete(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        await userRepository.delete(id);
        return { message: 'Usuario eliminado correctamente' };
    }
}

export default new UserService();

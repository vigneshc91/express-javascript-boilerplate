import { hash } from 'argon2';
import { User, type } from '../../src/app/user/models/user.model.js';
import { Logger } from '../../src/util/logger.js';
import { getSHA512Hash } from '../../src/util/helper.js';
import admin from '../data/admin.json' assert { type: 'json' };

const data = admin;

export default class AdminSeeder {
    async run() {
        try {
            const isAdminExist = await User.countDocuments({ type: type.ADMIN });
            if (isAdminExist) {
                Logger.info('Admin already exist', 'SEED');
                return false;
            }
            data.password = await hash(getSHA512Hash(data.password));
            await User.create(data);
            Logger.info('Admin seeded successfully', 'SEED');
            return true;
        } catch (error) {
            Logger.error(error, 'SEED');
            return false;
        }
    }
}

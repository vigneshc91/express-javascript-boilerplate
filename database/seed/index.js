import { config } from 'dotenv';
config();
import { Logger } from '../../src/util/logger.js';
import '../../src/config/database.js';
import AdminSeeder from './admin.seeder.js';

const seeders = [
    AdminSeeder
];

seeders.forEach(async (item, index, array) => {
    if (index === 0) {
        Logger.info('Seeder started', 'SEED');
    }
    await new item().run();
    if (index === array.length - 1) {
        Logger.info('Seeder completed', 'SEED');
        process.exit(1);
    }
});

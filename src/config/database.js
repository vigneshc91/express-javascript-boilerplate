import mongoose from 'mongoose';

export const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/test';

mongoose.connect(DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });

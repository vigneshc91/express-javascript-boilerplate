import { Schema, model } from "mongoose";

export const status = {
    DRAFT: 0,
    ACTIVE: 1,
    DELETED: 2,
}

export const type = {
    ADMIN: 1,
    USER: 2,
}

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    type: { type: Number, enum: Object.values(type) },
    status: { type: Number, enum: Object.values(status), default: status.DRAFT }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

export const User = model('User', userSchema);

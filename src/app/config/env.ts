export const env = {
    // Server
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Database
    DATABASE_URL: process.env.DATABASE_URL || '',

    // JWT
    JWT_SECRET: process.env.JWT_SECRET || '',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

    // Cloudinary
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

    // URLs
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
};
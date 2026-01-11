import { Server } from "http";
import app from "./app";
import { prisma } from "./lib/prisma";
import logger from "./app/utils/logger";

const port = process.env.PORT || 3000;

async function bootstrap() {
    try {
        // Test database connection
        await prisma.$connect();
        logger.info('✅ Database connected successfully');

        // Start server
        const server: Server = app.listen(port, () => {
            logger.info(`🚀 Server running on http://localhost:${port}`);
            logger.info(`📊 Database: ${process.env.DATABASE_URL?.split('@')[1]}`);
        });

        // Graceful shutdown
        const shutdown = async () => {
            console.log('🛑 Shutting down gracefully...');

            server.close(async () => {
                await prisma.$disconnect();
                logger.info('✅ Server closed and Prisma disconnected');
                process.exit(0);
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                logger.error('❌ Force shutdown after 10 seconds');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);

    } catch (error) {
        logger.error('❌ Failed to start server:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

bootstrap();
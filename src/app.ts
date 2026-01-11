import express, { Application, Request, Response } from 'express';
import cors from 'cors';
// import router from './app/routes';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { prisma } from './lib/prisma';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { requestLogger } from './app/middlewares/requestLogger';

const app: Application = express();
app.use(cors());

// Security middleware
app.use(helmet());

// par sar
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// Request logging
app.use(requestLogger);

app.get('/', async (_req: Request, res: Response) => {
    const user = await prisma.user.findMany();
    console.log(user)
    res.send({
        Message: "Start server.."
    })
});

app.get('/health', async (_req: Request, res: Response) => {
    try {
        // Test database connection
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({
            status: 'success',
            message: 'Server is running',
            timestamp: new Date().toISOString(),
            database: 'connected'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// app.use('/api/v1', router);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString()
    });
});

// global error handler
app.use(globalErrorHandler);

export default app;
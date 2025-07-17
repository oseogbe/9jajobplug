/**
 * @copyright 2025 Osememen Ogbe
 * @license Apache-2.0
 */

/**
 * node modules
 */
import '@/config/instrument'
import * as Sentry from "@sentry/node";
import express from 'express'
import cors, { CorsOptions } from 'cors'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import helmet from 'helmet'

/**
 * custom modules
 */
import config from '@/config'
import limiter from '@/lib/express-rate-limit'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/winston'
import errorHandler from '@/middlewares/error-handler';

/**
 * router
 */
import v1Routes from "@/routes/v1"

const app = express()

const corsOptions: CorsOptions = {
    origin(origin, callback) {
        // In development, allow all origins
        if (config.NODE_ENV === 'development') {
            callback(null, true)
            return
        }

        // In production, only allow whitelisted origins
        if (origin && config.WHITELIST_ORIGINS.includes(origin)) {
            callback(null, true)
        } else {
            logger.warn(`CORS error: ${origin} is not allowed by CORS`)
            callback(new Error(`CORS error: ${origin} is not allowed by CORS`), false)
        }
    },
    credentials: true
}

app.use(cors(corsOptions))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

app.use(compression({
    threshold: 1024,    // only compress responses larger than 1kb
}))

// using helmet to enhance security by setting various HTTP headers
app.use(helmet())

// applying rate limiting middleware to prevent excessive requests and enhance security
app.use(limiter)

; (async () => {
    try {
        app.use('/api/v1', v1Routes)

        Sentry.setupExpressErrorHandler(app)

        // Register error handler after all routes and middleware
        app.use(errorHandler)

        app.listen(config.PORT, () => {
            logger.info(`Server running: http://localhost:${config.PORT}`)
        })

    } catch (err) {
        logger.error('Failed to start the server', err)

        if (config.NODE_ENV === 'production') {
            process.exit(1)
        }
    }
})()

/**
 * handles server shutdown gracefully by disconnecting from the database
 * 
 * - attempts to disconnect from the database before the shutting down the server
 * - logs a success message if the disconnection is successful
 * - if an error occurs during disconnection, it is logged to the console
 * - exits the process with status code `0` (indicating a successful shutdown)
 */
const handleServerShutdown = async () => {
    try {
        logger.info('Disconnecting from database...')
        await prisma.$disconnect()
        logger.warn('Server SHUTDOWN')
        process.exit(0)
    } catch (err) {
        logger.error('Error during server shutdown', err)
        process.exit(1)
    }
}

/**
 * listens for termination signals (`SIGTERM` and `SIGINT`)
 * 
 * - `SIGTERM` is typically sent when stopping a process (e.g., `kill` command or container shutdown)
 * - `SIGINT` is triggered when the user interrupts the process (e.g., pressing `Ctrl + C`)
 * - when either signal is received, `handleServerShutdown` is executed to ensure proper cleanup
 */
process.on('SIGTERM', handleServerShutdown)
process.on('SIGINT', handleServerShutdown)

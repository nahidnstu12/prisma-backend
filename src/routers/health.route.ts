import prisma from '@/lib/prisma';
import { Router } from 'express';
import os from 'os';

const router = Router();


// Types for health check response
type ServiceStatus = 'healthy' | 'unhealthy' | 'degraded';

type HealthCheckResponse = {
  status: ServiceStatus;
  timestamp: string;
  uptime: number;
  system: {
    memory: {
      total: number;
      used: number;
      free: number;
    };
    cpu: {
      loadAvg: number[];
      cores: number;
    };
    platform: string;
  };
  services: {
    database: {
      status: ServiceStatus;
      latency: number;
    };
  };
  version: string;
}

// Health check utility functions
async function checkDatabaseHealth(): Promise<{ status: ServiceStatus; latency: number }> {
  const start = Date.now();
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;
    
    return {
      status: latency > 1000 ? 'degraded' : 'healthy',
      latency
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      latency: Date.now() - start
    };
  }
}

function getSystemInfo() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  return {
    memory: {
      total: Math.round(totalMem / 1024 / 1024),
      used: Math.round(usedMem / 1024 / 1024),
      free: Math.round(freeMem / 1024 / 1024)
    },
    cpu: {
      loadAvg: os.loadavg(),
      cores: os.cpus().length
    },
    platform: `${os.type()} ${os.release()}`
  };
}

// Health check route
router.get('/health', async (req, res) => {
  const dbHealth = await checkDatabaseHealth();
  const systemInfo = getSystemInfo();

  const healthCheck: HealthCheckResponse = {
    status: dbHealth.status === 'healthy' ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    system: systemInfo,
    services: {
      database: dbHealth
    },
    version: process.env.npm_package_version || '1.0.0'
  };

  const statusCode = healthCheck.status === 'healthy' ? 200 : 
                     healthCheck.status === 'degraded' ? 200 : 503;

  res.status(statusCode).json(healthCheck);
});

// Detailed database health check route
router.get('/health/db', async (req, res) => {
  const dbHealth = await checkDatabaseHealth();
  
  const response = {
    status: dbHealth.status,
    timestamp: new Date().toISOString(),
    details: {
      latency: dbHealth.latency,
      connection: dbHealth.status === 'healthy' ? 'established' : 'failed'
    }
  };

  const statusCode = dbHealth.status === 'healthy' ? 200 : 
                     dbHealth.status === 'degraded' ? 200 : 503;

  res.status(statusCode).json(response);
});

export default router;
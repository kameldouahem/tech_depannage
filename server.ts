import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import {
  getAllTickets,
  createTicketInDb,
  updateTicketInDb,
  deleteTicketInDb,
  getTicketByNumberOrPhone,
  seedInitialTicketsIfEmpty,
} from './src/db/tickets.ts';
import {
  getCompanyProfileFromDb,
  updateCompanyProfileInDb,
} from './src/db/profile.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    res.json({ status: 'ok', database: 'Cloud SQL (PostgreSQL)', timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ error: 'Health check failed' });
  }
});

// Tickets endpoints
app.get('/api/tickets', async (_req: Request, res: Response) => {
  try {
    const list = await getAllTickets();
    res.json(list);
  } catch (error: any) {
    console.error('API /api/tickets error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch tickets' });
  }
});

app.post('/api/tickets', async (req: Request, res: Response) => {
  try {
    const created = await createTicketInDb(req.body);
    res.status(201).json(created);
  } catch (error: any) {
    console.error('API POST /api/tickets error:', error);
    res.status(500).json({ error: error.message || 'Failed to create ticket' });
  }
});

app.put('/api/tickets/:id', async (req: Request, res: Response) => {
  try {
    const { updates, changeNote } = req.body;
    const updated = await updateTicketInDb(req.params.id, updates, changeNote);
    if (!updated) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(updated);
  } catch (error: any) {
    console.error('API PUT /api/tickets/:id error:', error);
    res.status(500).json({ error: error.message || 'Failed to update ticket' });
  }
});

app.delete('/api/tickets/:id', async (req: Request, res: Response) => {
  try {
    const success = await deleteTicketInDb(req.params.id);
    res.json({ success });
  } catch (error: any) {
    console.error('API DELETE /api/tickets/:id error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete ticket' });
  }
});

// Company profile endpoints
app.get('/api/profile', async (_req: Request, res: Response) => {
  try {
    const profile = await getCompanyProfileFromDb();
    res.json(profile);
  } catch (error: any) {
    console.error('API GET /api/profile error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch profile' });
  }
});

app.post('/api/profile', async (req: Request, res: Response) => {
  try {
    const updated = await updateCompanyProfileInDb(req.body);
    res.json(updated);
  } catch (error: any) {
    console.error('API POST /api/profile error:', error);
    res.status(500).json({ error: error.message || 'Failed to update profile' });
  }
});

// Public endpoints for Social Media Client Interface
app.get('/api/public/tickets/:query', async (req: Request, res: Response) => {
  try {
    const ticket = await getTicketByNumberOrPhone(req.params.query);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error: any) {
    console.error('API GET /api/public/tickets/:query error:', error);
    res.status(500).json({ error: 'Failed to search ticket' });
  }
});

app.post('/api/public/tickets', async (req: Request, res: Response) => {
  try {
    const created = await createTicketInDb(req.body);
    res.status(201).json(created);
  } catch (error: any) {
    console.error('API POST /api/public/tickets error:', error);
    res.status(500).json({ error: 'Failed to submit public request' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TechDepan server running on http://0.0.0.0:${PORT} with Cloud SQL PostgreSQL`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});

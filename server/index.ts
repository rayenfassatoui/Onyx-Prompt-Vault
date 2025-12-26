import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db';
import { prompts } from './schema';
import { eq, desc } from 'drizzle-orm';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Auth Middleware
const checkAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader === process.env.ACCESS_CODE) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Verify Access
app.post('/api/verify', (req, res) => {
    const { code } = req.body;
    if (code === process.env.ACCESS_CODE) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

// Get all prompts
app.get('/api/prompts', checkAuth, async (req, res) => {
    try {
        const allPrompts = await db.select().from(prompts).orderBy(desc(prompts.createdAt));
        res.json(allPrompts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch prompts' });
    }
});

// Create prompt
app.post('/api/prompts', checkAuth, async (req, res) => {
    try {
        console.log('Creating prompt with body:', req.body);
        const promptData = {
            ...req.body,
            createdAt: new Date(req.body.createdAt),
        };
        const newPrompt = await db.insert(prompts).values(promptData).returning();
        res.json(newPrompt[0]);
    } catch (error) {
        console.error('Error creating prompt:', error);
        res.status(500).json({ error: 'Failed to create prompt' });
    }
});

// Update prompt
app.put('/api/prompts/:id', checkAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const promptData = { ...req.body };
        if (promptData.createdAt) {
            promptData.createdAt = new Date(promptData.createdAt);
        }
        const updatedPrompt = await db.update(prompts)
            .set(promptData)
            .where(eq(prompts.id, id))
            .returning();
        res.json(updatedPrompt[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update prompt' });
    }
});

// Delete prompt
app.delete('/api/prompts/:id', checkAuth, async (req, res) => {
    try {
        const { id } = req.params;
        await db.delete(prompts).where(eq(prompts.id, id));
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete prompt' });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;

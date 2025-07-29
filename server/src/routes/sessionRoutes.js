
// server/src/routes/sessionRoutes.js
// ====================================
import express from 'express';
import {
    createSession,
    getAllSessions,
    generateCodeForSession,
    deleteSession // 👈 Import new function
} from '../controllers/sessionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createSession);
router.get('/', authMiddleware, getAllSessions);
router.post('/:sessionId/generate', authMiddleware, generateCodeForSession);

// 👇 NEW DELETE ROUTE
router.delete('/:sessionId', authMiddleware, deleteSession);

export default router;

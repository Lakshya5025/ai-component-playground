// server/src/controllers/sessionController.js
import admin from 'firebase-admin';
import axios from 'axios';

// Helper function to recursively delete subcollections in Firestore
async function deleteCollection(db, collectionPath, batchSize) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        resolve();
        return;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    process.nextTick(() => {
        deleteQueryBatch(db, query, resolve);
    });
}

// Restored Function
export const createSession = async (req, res) => {
    const db = admin.firestore();
    try {
        const { uid } = req.user;
        const newSession = {
            name: 'New Session',
            userId: uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            latestCode: { jsx: '', css: '' },
        };

        const docRef = await db.collection('sessions').add(newSession);
        res.status(201).json({ id: docRef.id, ...newSession });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).send('Error creating session.');
    }
};

// Restored Function
export const getAllSessions = async (req, res) => {
    const db = admin.firestore();
    try {
        const { uid } = req.user;
        const sessionsSnapshot = await db.collection('sessions')
            .where('userId', '==', uid)
            .orderBy('updatedAt', 'desc')
            .get();

        const sessions = [];
        sessionsSnapshot.forEach(doc => {
            sessions.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(sessions);
    } catch (error) {
        console.error('Error getting sessions:', error);
        res.status(500).send('Error getting sessions.');
    }
};

export const generateCodeForSession = async (req, res) => {
    const db = admin.firestore();
    const { sessionId } = req.params;
    const { prompt } = req.body;
    const { uid } = req.user;

    try {
        const sessionRef = db.collection('sessions').doc(sessionId);
        const messagesRef = sessionRef.collection('messages');

        // Save user's message
        await messagesRef.add({
            role: 'user', content: prompt, createdAt: new Date().toISOString(),
        });

        const AI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const systemPrompt = `
      You are an expert React developer who ONLY responds with JSON.
      Based on the user's request, generate a single self-contained React component.
      Your response MUST be a single minified JSON object with two keys: "jsx" and "css".
      Example Response: {"jsx":"import React from 'react';\\n\\nconst MyButton = () => {\\n  return <button className=\\"my-button\\">Click Me</button>;\\n};\\n\\nexport default MyButton;","css":".my-button { color: red; }"}

      Do not include any other text, explanations, or markdown formatting like \`\`\`json.
      Only output the raw, minified JSON object.
    `;

        // --- THIS IS THE FIX ---
        // Use a more robust, multi-turn payload structure
        const requestPayload = {
            contents: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }]
                },
                {
                    role: "model",
                    parts: [{ text: "Okay, I am ready to generate the component JSON." }]
                },
                {
                    role: "user",
                    parts: [{ text: prompt }]
                }
            ]
        };

        const aiResponse = await axios.post(AI_API_URL, requestPayload);
        // ----------------------

        const responseText = aiResponse.data.candidates[0].content.parts[0].text;

        // Find the JSON part of the string, even if it's wrapped in markdown
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No valid JSON object found in the AI's response.");
        }
        const jsonString = jsonMatch[0];
        const generatedCode = JSON.parse(jsonString); // This will be { jsx: "...", css: "..." }

        // Save AI's message
        await messagesRef.add({
            role: 'ai', content: 'Generated component code.', createdAt: new Date().toISOString(),
        });

        // Update the session with the correct object structure
        await sessionRef.update({
            latestCode: generatedCode,
            updatedAt: new Date().toISOString(),
        });

        // Fetch all the updated data to send back to the client
        const updatedSessionDoc = await sessionRef.get();
        const updatedMessagesSnapshot = await messagesRef.orderBy('createdAt', 'asc').get();
        const messages = [];
        updatedMessagesSnapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));

        res.status(200).json({ ...updatedSessionDoc.data(), id: updatedSessionDoc.id, messages });

    } catch (error) {
        console.error("Error generating code:", error.message);
        res.status(500).send('Failed to generate code.');
    }
};

// Restored Function
export const deleteSession = async (req, res) => {
    const db = admin.firestore();
    const { sessionId } = req.params;
    const { uid } = req.user;

    try {
        const sessionRef = db.collection('sessions').doc(sessionId);
        const sessionDoc = await sessionRef.get();

        if (!sessionDoc.exists) {
            return res.status(404).send('Session not found.');
        }

        if (sessionDoc.data().userId !== uid) {
            return res.status(403).send('Forbidden: You do not own this session.');
        }

        // Delete the 'messages' subcollection first
        await deleteCollection(db, `sessions/${sessionId}/messages`, 50);

        // Then delete the main session document
        await sessionRef.delete();

        res.status(200).send({ message: 'Session deleted successfully' });
    } catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).send('Error deleting session.');
    }
};

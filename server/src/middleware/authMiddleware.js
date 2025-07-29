import admin from 'firebase-admin';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized: No token provided.');
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        // Verify the token using the Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken; // Add user info to the request object
        next(); // Proceed to the next function (the controller)
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(403).send('Unauthorized: Invalid token.');
    }
};

export default authMiddleware;
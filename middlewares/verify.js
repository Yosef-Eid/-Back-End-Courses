import jwt from 'jsonwebtoken';

export async function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid token' });
    }
}

export function verifyTokenAndAuthorization(req, res, next) {
    verifyToken(req, res, () => {
        req.user.id === req.params.id || req.user.admin ? next()
            : res.status(403).json({ message: "you are not allowed" });
    })
}

export function verifyTokenIsAdmin(req, res, next) {
    verifyToken(req, res, () => {
        req.user.admin ? next()
            : res.status(403).json({ message: "you are not allowed" });
    })
}

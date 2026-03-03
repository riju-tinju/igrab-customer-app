module.exports = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'Session expired, please login again' });
    }

    // Set req.user for compatibility with existing controllers
    req.user = { id: req.session.userId };
    next();
};

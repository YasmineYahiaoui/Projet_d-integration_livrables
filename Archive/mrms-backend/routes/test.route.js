/**
 * Fichier de route de test
 */

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Route de test fonctionnelle' });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const storeBranchController = require('../controllers/storeBranchController');

router.get('/', storeBranchController.getAllBranches);
router.get('/nearest', storeBranchController.getNearestBranch);
router.get('/:id', storeBranchController.getBranchById);

module.exports = router;

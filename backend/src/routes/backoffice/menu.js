const express = require('express');
const router = express.Router();
const menuController = require('../../controllers/backoffice/menuController');

// Categorías
router.get('/categories', menuController.getAllCategories);
router.post('/categories', menuController.createCategory);
router.put('/categories/:id', menuController.updateCategory);
router.delete('/categories/:id', menuController.deleteCategory);
router.post('/categories/reorder', menuController.reorderCategories);

// Ítems
router.post('/items', menuController.createItem);
router.put('/items/:id', menuController.updateItem);
router.delete('/items/:id', menuController.deleteItem);

module.exports = router;

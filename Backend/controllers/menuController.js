import MenuItem from '../models/MenuItem.js';

// @desc    Get all menu items
// @route   GET /api/menu
export const getMenuItems = async (req, res) => {
    try {
        const menu = await MenuItem.find({ available: true });
        res.status(200).json(menu);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching menu', error: error.message });
    }
};

// @desc    Create a new menu item (Admin)
// @route   POST /api/menu
export const createMenuItem = async (req, res) => {
    try {
        const itemData = { ...req.body };
        if (req.file) {
            itemData.imageUrl = req.file.path;
        }

        const newItem = new MenuItem(itemData);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: 'Error creating menu item', error: error.message });
    }
};

// @desc    Update a menu item (Admin)
// @route   PUT /api/menu/update-item/:id
export const updateMenuItem = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.imageUrl = req.file.path;
        }

        const updatedItem = await MenuItem.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true } // Update hone ke baad naya data return karega
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: 'Error updating menu item', error: error.message });
    }
};

// @desc    Delete a menu item (Admin)
// @route   DELETE /api/menu/delete-item/:id
export const deleteMenuItem = async (req, res) => {
    try {
        const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting menu item', error: error.message });
    }
};
import Restaurant from '../models/Restaurant.js';

// @desc    Get restaurant info (Public / AI Tool)
// @route   GET /api/restaurant/info
export const getRestaurantInfo = async (req, res) => {
    try {
        const info = await Restaurant.findOne();
        res.status(200).json(info || {});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching restaurant info', error: error.message });
    }
};

// @desc    Update or Create restaurant info (Admin)
// @route   PUT /api/restaurant/update-info
export const updateRestaurantInfo = async (req, res) => {
    try {
        let info = await Restaurant.findOne();
        
        if (info) {
            info = await Restaurant.findByIdAndUpdate(info._id, req.body, { new: true });
        } else {
            info = await Restaurant.create(req.body);
        }
        
        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({ message: 'Error updating restaurant info', error: error.message });
    }
};
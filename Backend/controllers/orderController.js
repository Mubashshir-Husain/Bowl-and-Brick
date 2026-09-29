import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';

export const createOrder = async (req, res) => {
    try {
        const { tableNumber, customerName, customerMobile, items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        let totalAmount = 0;
        const processedItems = [];

        for (const item of items) {
            const dbItem = await MenuItem.findById(item.menuItem);
            if (!dbItem || !dbItem.available) {
                return res.status(400).json({ message: `Item ${item.menuItem} not found or unavailable` });
            }

            const itemTotal = dbItem.price * item.quantity;
            totalAmount += itemTotal;

            processedItems.push({
                menuItem: dbItem._id,
                quantity: item.quantity,
                price: dbItem.price 
            });
        }

        const order = new Order({
            tableNumber,
            customerName,
            customerMobile,
            items: processedItems,
            totalAmount
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.menuItem', 'name price');
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
};

// Admin Action: Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const validStatuses = ['PENDING', 'ACCEPTED', 'PREPARING', 'SERVED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true } // Update hone ke baad naya document return karega
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};



// @desc    Get all orders (Admin Dashboard)
// @route   GET /api/orders/all-orders
export const getAllOrders = async (req, res) => {
    try {
        // Naye orders pehle dikhane ke liye sort({ createdAt: -1 })
        const orders = await Order.find()
            .populate('items.menuItem', 'name price')
            .sort({ createdAt: -1 }); 
            
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};
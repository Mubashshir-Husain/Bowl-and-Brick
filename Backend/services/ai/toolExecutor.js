import MenuItem from '../../models/MenuItem.js';
import Restaurant from '../../models/Restaurant.js'; // <-- NAYA IMPORT

const searchMenu = async (filters) => {
    const query = { available: true };

    if (filters.category) query.category = filters.category;
    if (filters.type) query.type = filters.type;
    if (filters.spiceLevel) query.spiceLevel = filters.spiceLevel;
    if (filters.maxPrice) query.price = { $lte: filters.maxPrice };

    const results = await MenuItem.find(query).select('name price description category type spiceLevel ingredients');
    return results;
};

// <-- NAYA FUNCTION START -->
const getRestaurantInfo = async () => {
    // Database se single restaurant document nikalenge
    const info = await Restaurant.findOne();
    
    if (!info) {
        return { message: "Restaurant information is not set in the database yet." };
    }

    // Sirf zaroori data wapas bhejenge
    return {
        name: info.name,
        address: info.address,
        openingHours: info.openingHours,
        contactNumber: info.contactNumber,
        isAcceptingOrders: info.isAcceptingOrders
    };
};
// <-- NAYA FUNCTION END -->

const toolMap = {
    searchMenu,
    getRestaurantInfo // <-- NAYE FUNCTION KO YAHAN ADD KIYA
};

export const executeTool = async (toolName, toolArgs) => {
    if (!toolMap[toolName]) {
        throw new Error(`Unsupported tool: ${toolName}`);
    }
    
    try {
        const result = await toolMap[toolName](toolArgs);
        return result;
    } catch (error) {
        console.error(`Error executing tool ${toolName}:`, error);
        return { error: "Failed to execute tool" };
    }
};  
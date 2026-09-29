export const    aiTools = [
    {
        type: "function",
        function: {
            name: "searchMenu",
            description: "Search available restaurant dishes using menu filters. Use this tool when the user asks for recommendations, prices, or specific types of food.",
            parameters: {
                type: "object",
                properties: {
                    category: { type: "string", description: "Menu category (e.g., Starter, Main Course)" },
                    type: { type: "string", description: "Food type (e.g., Veg, Non-Veg)" },
                    spiceLevel: { type: "string", enum: ["Low", "Medium", "High"], description: "Spice level" },
                    maxPrice: { type: "number", description: "Maximum price budget" }
                }
            }
        }
    },
    {
        type: "function",
        function: {
            name: "getRestaurantInfo",
            description: "Get general information about the restaurant like address, opening hours, contact number, and if they are currently accepting orders. Use this when user asks about restaurant details.",
            parameters: {
                type: "object",
                properties: {} // Isme koi filter nahi chahiye, seedha DB se sab uthana hai
            }
        }
    }
];
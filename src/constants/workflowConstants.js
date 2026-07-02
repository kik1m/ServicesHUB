/**
 * workflowConstants.js
 * All static data, labels, and config for the Workflow and Database workspaces.
 */

// ── Default Blueprint Placeholder ────────────────────────────────────────────
export const DEFAULT_BLUEPRINT = {
    projectName: 'Proposed Project Workflow Blueprint',
    description: 'Start chatting with the smart assistant to generate and detail your project workflow and schema blueprints here.',
    phases: [],
    database_schema: [],
};

// ── Phase Status Colors ───────────────────────────────────────────────────────
export const PHASE_STATUS = {
    completed: {
        label: 'Completed',
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.2)',
    },
    'in-progress': {
        label: 'In Progress',
        color: '#00d2ff',
        bg: 'rgba(0, 210, 255, 0.08)',
        border: 'rgba(0, 210, 255, 0.2)',
    },
    pending: {
        label: 'Pending',
        color: '#8e9099',
        bg: 'rgba(255, 255, 255, 0.03)',
        border: 'rgba(255, 255, 255, 0.05)',
    },
};

export const TASK_STATUS = {
    completed: { color: '#10b981', label: 'Completed' },
    'in-progress': { color: '#00d2ff', label: 'In Progress' },
    pending: { color: '#8e9099', label: 'Pending' },
};

// ── Fallback Database Schema Tables ─────────────────────────────────────────
export const DB_SCHEMA_TABLES = [
    {
        name: 'users',
        desc: 'User account records, permission roles, and authentication credentials.',
        columns: [
            { name: 'id', type: 'UUID', desc: 'Unique identifier of the user (Primary Key)' },
            { name: 'email', type: 'VARCHAR', desc: 'Registered email address' },
            { name: 'password_hash', type: 'TEXT', desc: 'Securely hashed password token' },
            { name: 'role', type: 'TEXT', desc: 'Assigned system role: customer / restaurant / admin' },
        ],
    },
    {
        name: 'restaurants',
        desc: 'Details of registered restaurants and active stores on the platform.',
        columns: [
            { name: 'id', type: 'UUID', desc: 'Unique identifier of the restaurant (Primary Key)' },
            { name: 'user_id', type: 'UUID', desc: 'Store owner identifier (Foreign Key -> users.id)' },
            { name: 'name', type: 'VARCHAR', desc: 'Restaurant or brand name' },
            { name: 'description', type: 'TEXT', desc: 'Restaurant description and cuisine details' },
            { name: 'address', type: 'TEXT', desc: 'Physical address registered for deliveries' },
            { name: 'phone', type: 'VARCHAR', desc: 'Contact phone number' },
            { name: 'logo_url', type: 'TEXT', desc: 'Uploaded restaurant logo URL' },
            { name: 'rating', type: 'NUMERIC', desc: 'General average rating of the restaurant' },
        ],
    },
    {
        name: 'menu_items',
        desc: 'Meal items and options offered by registered restaurants.',
        columns: [
            { name: 'id', type: 'UUID', desc: 'Unique identifier of the menu item (Primary Key)' },
            { name: 'restaurant_id', type: 'UUID', desc: 'Associated restaurant identifier (Foreign Key -> restaurants.id)' },
            { name: 'name', type: 'VARCHAR', desc: 'Name of the meal item' },
            { name: 'description', type: 'TEXT', desc: 'Ingredients and nutritional details' },
            { name: 'price', type: 'NUMERIC', desc: 'Meal item price in default currency' },
            { name: 'image_url', type: 'TEXT', desc: 'URL of the meal display image' },
            { name: 'category', type: 'VARCHAR', desc: 'Main category (appetizer, main dish, drink, etc.)' },
        ],
    },
    {
        name: 'orders',
        desc: 'Meal ordering transactions, delivery statuses, and payment records.',
        columns: [
            { name: 'id', type: 'UUID', desc: 'Unique identifier of the order (Primary Key)' },
            { name: 'user_id', type: 'UUID', desc: 'Customer identifier placing the order (Foreign Key -> users.id)' },
            { name: 'restaurant_id', type: 'UUID', desc: 'Recipient restaurant identifier (Foreign Key -> restaurants.id)' },
            { name: 'status', type: 'TEXT', desc: 'Order status: pending / preparing / delivered' },
            { name: 'total_amount', type: 'NUMERIC', desc: 'Total paid amount for the order' },
            { name: 'order_date', type: 'TIMESTAMP', desc: 'Timestamp of when the order was completed' },
            { name: 'delivery_address', type: 'TEXT', desc: 'Delivery address selected by the customer' },
        ],
    },
    {
        name: 'order_items',
        desc: 'Item details and specific quantities added to each order.',
        columns: [
            { name: 'id', type: 'UUID', desc: 'Unique identifier of the order item (Primary Key)' },
            { name: 'order_id', type: 'UUID', desc: 'Associated main order identifier (Foreign Key -> orders.id)' },
            { name: 'menu_item_id', type: 'UUID', desc: 'Requested meal identifier (Foreign Key -> menu_items.id)' },
            { name: 'quantity', type: 'INTEGER', desc: 'Requested item quantity' },
            { name: 'price_at_order', type: 'NUMERIC', desc: 'Actual price of the meal item at checkout time' },
        ],
    },
];

// ── Canvas Config ─────────────────────────────────────────────────────────────
export const CANVAS_CONFIG = {
    INITIAL_ZOOM: 0.85,
    MIN_ZOOM: 0.25,
    MAX_ZOOM: 2.0,
    ZOOM_FACTOR: 1.08,
    PHASE_NODE_WIDTH: 320,
    PHASE_NODE_HEIGHT_APPROX: 332,
    PHASE_SPACING_X: 420,
    TABLE_NODE_WIDTH: 290,
    TABLE_SPACING_X: 450,
    TABLE_SPACING_Y: 370,
};

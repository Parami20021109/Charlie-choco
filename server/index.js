require('dotenv').config(); // Dependencies loaded

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Models
const User = require('./models/User');
const Ingredient = require('./models/Ingredient');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Recipe = require('./models/Recipe');
const Supplier = require('./models/Supplier');
const Feedback = require('./models/Feedback');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB & Seed Admin
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
    console.log('MongoDB Connected');
    await seedAdmin();
    await seedSupplier();
    await seedDelivery();
  })
  .catch(err => console.error('MongoDB Connection Error:', err));

// Seed Admin Function
async function seedAdmin() {
    try {
        const adminEmail = 'admin@gmail.com';
        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (!existingAdmin) {
            console.log('Seeding Admin User...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const adminUser = new User({
                username: 'Willy Wonka',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            await adminUser.save();
        }
    } catch (err) {
        console.error('Seeding Error:', err);
    }
}

// Seed Supplier Function
async function seedSupplier() {
    try {
        const supplierEmail = 'supplier@gmail.com';
        const existingSupplier = await User.findOne({ email: supplierEmail });
        
        if (!existingSupplier) {
            console.log('Seeding Supplier User...');
            const hashedPassword = await bcrypt.hash('supplier', 10);
            const supplierUser = new User({
                username: 'CocoaSupplier',
                email: supplierEmail,
                password: hashedPassword,
                role: 'supplier'
            });
            await supplierUser.save();
            console.log('Supplier Account Created: supplier@gmail.com / supplier');
        }
    } catch (err) {
        console.error('Supplier Seeding Error:', err);
        }
}

// Seed Delivery Function
async function seedDelivery() {
    try {
        const deliveryEmail = 'delivery@gmail.com';
        const existingDelivery = await User.findOne({ email: deliveryEmail });
        
        if (!existingDelivery) {
            console.log('Seeding Delivery User...');
            const hashedPassword = await bcrypt.hash('delivery', 10);
            const deliveryUser = new User({
                username: 'ExpressDelivery',
                email: deliveryEmail,
                password: hashedPassword,
                role: 'delivery'
            });
            await deliveryUser.save();
            console.log('Delivery Account Created: delivery@gmail.com / delivery');
        }
    } catch (err) {
        console.error('Delivery Seeding Error:', err);
    }
}


// Basic Route
app.get('/', (req, res) => {
  res.send('Charlie Chocolate Factory API is running!');
});

// --- AUTH ROUTES ---

// Register Route
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role: 'user' });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
        token, 
        user: { 
            id: user._id, 
            username: user.username, 
            email: user.email,
            role: user.role 
        } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// --- INVENTORY API ---

// Get Ingredients
app.get('/api/ingredients', async (req, res) => {
    try {
        const ingredients = await Ingredient.find();
        res.json(ingredients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add/Update Ingredient
app.post('/api/ingredients', async (req, res) => {
    try {
        const { name, quantity, unit, minLevel } = req.body;
        // Check if exists
        let ingredient = await Ingredient.findOne({ name });
        if (ingredient) {
            ingredient.quantity += parseInt(quantity); // Simply add to stock
            if(unit) ingredient.unit = unit;
            await ingredient.save();
        } else {
            ingredient = new Ingredient({ name, quantity, unit, minLevel });
            await ingredient.save();
        }
        res.json(ingredient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Ingredient Stock Directly (Set value)
app.put('/api/ingredients/:id', async (req, res) => {
    try {
        const updated = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Ingredient
app.delete('/api/ingredients/:id', async (req, res) => {
    try {
        await Ingredient.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- STORE API ---

// Get Products (Replaces previous mock)
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Product
app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Product
app.put('/api/products/:id', async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Product
app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Order Routes ---

// Create Order
app.post('/api/orders', async (req, res) => {
    try {
        const { items, customerName, email, address, totalAmount, userId } = req.body;
        
        if (!items || items.length === 0) return res.status(400).json({ msg: 'No items in order' });

        const newOrder = new Order({
            user: userId || null,
            customerName,
            email,
            address,
            items,
            totalAmount,
            status: 'Paid'
        });

        await newOrder.save();
        
        // --- INVENTORY DEDUCTION ---
        for (const item of items) {
            // 1. Decrease Finished Product Stock
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });

            // 2. Decrease Raw Ingredients (Based on Recipe)
            // Find if there's a recipe linked to this product
            const recipe = await Recipe.findOne({ productLink: item.product });
            if (recipe) {
                for (const ingItem of recipe.ingredients) {
                    await Ingredient.findByIdAndUpdate(ingItem.ingredient, { 
                        $inc: { quantity: -(ingItem.quantity * item.quantity) } 
                    });
                }
            }
        }

        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Get All Orders (Admin/Inventory)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Orders by User ID
app.get('/api/orders/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Recipe & Production Routes ---

// Get All Recipes
app.get('/api/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('ingredients.ingredient').populate('productLink');
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Recipe
app.post('/api/recipes', async (req, res) => {
    try {
        const newRecipe = new Recipe(req.body);
        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Recipe
app.put('/api/recipes/:id', async (req, res) => {
    try {
        const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Recipe
app.delete('/api/recipes/:id', async (req, res) => {
    try {
        await Recipe.findByIdAndDelete(req.params.id);
        res.json({ message: 'Recipe deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cook (Production) Endpoint
app.post('/api/cook', async (req, res) => {
    try {
        const { recipeId, batches } = req.body;
        const recipe = await Recipe.findById(recipeId);
        if(!recipe) return res.status(404).json({ msg: 'Recipe not found' });

        if (!recipe.ingredients || recipe.ingredients.length === 0) {
            return res.status(400).json({ msg: 'This recipe has no ingredients added!' });
        }

        console.log(`--- Production Started: ${recipe.name} (${batches} batches) ---`);

        // 1. Check Ingredients
        for (const item of recipe.ingredients) {
            const ingredient = await Ingredient.findById(item.ingredient);
            const totalNeeded = item.quantity * batches;
            
            if (!ingredient || ingredient.quantity < totalNeeded) {
                console.log(`❌ Failed: Not enough ${ingredient ? ingredient.name : 'unknown ingredient'}`);
                return res.status(400).json({ msg: `Not enough ${ingredient ? ingredient.name : 'ingredient'}` });
            }
        }

        // 2. Deduct
        for (const item of recipe.ingredients) {
            const totalNeeded = item.quantity * batches;
            const updatedIng = await Ingredient.findByIdAndUpdate(
                item.ingredient, 
                { $inc: { quantity: -totalNeeded } },
                { new: true }
            );
            console.log(`✅ Deducted: ${totalNeeded}${updatedIng.unit} from ${updatedIng.name} (Remaining: ${updatedIng.quantity})`);
        }

        // 3. Add to Product Stock (if linked)
        if (recipe.productLink) {
            await Product.findByIdAndUpdate(recipe.productLink, { $inc: { stock: batches } });
            console.log(`📈 Increased Product Stock: +${batches}`);
        }

        console.log(`--- Production Successful ---`);
        res.json({ msg: 'Production successful', batchesProduced: batches });
    } catch (err) {
        console.error('Cooking Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// --- User Routes ---
// Get All Users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete User
app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Supplier Routes ---

// Get All Suppliers
app.get('/api/suppliers', async (req, res) => {
    try {
        const suppliers = await Supplier.find().populate('suppliedIngredients');
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Supplier
app.post('/api/suppliers', async (req, res) => {
    try {
        const newSupplier = new Supplier(req.body);
        await newSupplier.save();
        res.status(201).json(newSupplier);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Supplier
app.put('/api/suppliers/:id', async (req, res) => {
    try {
        const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Supplier
app.delete('/api/suppliers/:id', async (req, res) => {
    try {
        await Supplier.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Supplier deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Feedback Routes ---

// Submit Feedback & Update Product Rating
app.post('/api/feedback', async (req, res) => {
    try {
        const { user, product, rating, comment } = req.body;
        
        // 1. Create Feedback Record
        const feedback = new Feedback({ user, product, rating, comment });
        await feedback.save();

        // 2. Update Product Reviews & Average Rating
        const productDoc = await Product.findById(product);
        if (productDoc) {
            const userDoc = await User.findById(user);
            const newReview = {
                user: user,
                name: userDoc ? userDoc.username : 'Anonymous',
                rating: Number(rating),
                comment: comment
            };

            productDoc.reviews.push(newReview);

            // Recalculate Average
            const totalRating = productDoc.reviews.reduce((acc, item) => acc + item.rating, 0);
            productDoc.ratings.average = totalRating / productDoc.reviews.length;
            productDoc.ratings.count = productDoc.reviews.length;

            await productDoc.save();
        }

        res.status(201).json(feedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Feedback for Product
app.get('/api/feedback/product/:id', async (req, res) => {
    try {
        const feedbackList = await Feedback.find({ product: req.params.id }).populate('user', 'username');
        res.json(feedbackList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Delivery Routes ---

// Get Delivery Staff
app.get('/api/users/delivery-staff', async (req, res) => {
    try {
        const staff = await User.find({ role: 'delivery' }).select('-password');
        res.json(staff);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Assign Delivery Staff
app.put('/api/orders/:id/assign', async (req, res) => {
    try {
        const { staffId } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id, 
            { 
                deliveryStaff: staffId, 
                deliveryStatus: 'Assigned',
                $push: { deliveryUpdates: { status: 'Assigned', note: 'Order assigned to delivery staff.' } }
            }, 
            { new: true }
        );
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Delivery Status
app.put('/api/orders/:id/delivery-status', async (req, res) => {
    try {
        const { status, note } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id, 
            { 
                deliveryStatus: status,
                status: status === 'Delivered' ? 'Delivered' : undefined, // Update main status only if Delivered
                $push: { deliveryUpdates: { status, note } }
            }, 
            { new: true }
        );
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Assigned Orders for Delivery Staff
app.get('/api/orders/delivery/:staffId', async (req, res) => {
    try {
        const orders = await Order.find({ deliveryStaff: req.params.staffId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

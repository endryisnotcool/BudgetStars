const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Add bcrypt for password hashing

const mongoose = require('mongoose');
const User = require('../database/userModel');
const Budget = require('../database/budgetModel');
const Expense = require('../database/expenseModel');
const Report = require('../database/reportModel');
const Notification = require('../database/notificationModel');

const PORT = 5001;
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const dbUrl = 'mongodb://localhost:27017/budgetStars';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// User registration endpoint
app.post("/api/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const { email, password } = req.body;
  const newUser = new User({ email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
});

// User login endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      res.json({ message: "Login successful" });
    } else {
      res.status(401).send({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Set budget endpoint
app.post("/api/budget/set", async (req, res) => {
  const { userId, totalBudget, period, startDate, endDate } = req.body;
  const newBudget = new Budget({ userId, totalBudget, period, startDate, endDate });
  try {
    await newBudget.save();
    res.json({ message: "Budget set successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update category spending
app.post("/api/budget/spend", async (req, res) => {
  const { userId, amount, category } = req.body;
  try {
    const userBudget = await Budget.findOne({ userId });
    // Assuming spending does not need to be saved as a new document
    if (!userBudget){
      return res.status(404).send({message: "Budget not found"})
    }
    //check to see if there's enough budget
    if (userBudget.totalBudget < amount){
      return res.status(400).send({message: "Insufficient budget"})
    }

    userBudget.totalBudget -= amount;
    await userBudget.save();

    res.json({ message: "Category spending updated" });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/users', async(req, res)=> {
  try {
    const users = await User.find();
    res.status(200).json(users);
  }
  catch(error){
    res.status(500).json({success: false, error: error.message})
  }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';
import bcrypt from 'bcrypt'; // Add bcrypt for password hashing

import mongoose from 'mongoose';
import { User } from '../backend/user.js';
import {Budget} from "../backend/budget.js";
console.log(Budget);
/*const Expense = require('../database/expenseModel');
const Report = require('../database/reportModel');
const Notification = require('../database/notificationModel');*/

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

// const budget = new Budget(5000,{Food: 1000});
// console.log(budget);

// User registration endpoint
app.post("/api/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const {username, password } = req.body;
  const newUser = new User({username, hashedPassword });
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
    const user = await User.findByEmail({ email });
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
  const { totalBudget, food, clothing, education, entertainment, health } = req.body;
  const categoryList = {
    Food: food,
    Clothing: clothing,
    Education: education,
    Entertainment: entertainment,
    Health: health,
  };
  const newBudgetEntry = new Budget(totalBudget, categoryList);
  try {
    const savedBudget = await newBudgetEntry.save(userId);
    res.json({ message: "Budget set successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update category spending
app.post("/api/budget/spend", async (req, res) => {
  const { userId, amount, category } = req.body;
  try {
    const userBudget = await Budget.findByUserId({ userId });
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

app.post("/api/expense/add", async(req,res) => {
  const{userId, amount, category, description} = req.body;
  const newExpense = new Expense ({userId, amount, category, description})

  try{
    const savedExpense = await newExpense.save();
    res.json({message: "Expense added successfully"});
  }
  catch (error) {
    res.status(400).send(error);
  }
})

app.post("/api/notification/add", async(req, res) => {
  const {userId, type, message} = req.body;
  const newNotification = new Notification({userId, type, message});
  try {
    const savedNotification = await newNotification.save();
    res.json({message: "Notification created successfully"});
  }
  catch (error) {
    res.status(400).send(error);
  }
})

app.get('/api/users', async(req, res)=> {
  try {
    const users = await User.find();
    res.status(200).json(users);
  }
  catch(error){
    res.status(500).json({success: false, error: error.message})
  }
})

app.get("/api/budget", async(req, res) => {
  const {userId} = req.params;

  try {
    const setBudget = await Budget.findByUserId({userId});
    res.json(200).json(setBudget);
  }
  catch (error) {
    res.status(400).send(error);
  }
})

app.get("/api/notification/:userId", async(req, res) => {
  const {userID} = req.params;
  try {
    const notification = await Notification.find({userId});
    res.json(notifications);
  }
  catch (error) {
    res.status(400).send(error);
  }
})

app.get("/api/reports/:userId", async(req,res) => {
  const {userId} = req.params;
  try {
    const reports = await Report.find(userId);
    res.json(reports);
  }
  catch(error) {
    res.status(400).send(error);
  }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BudgetSetup.css";

const BudgetSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [totalBudget, setTotalBudget] = useState<number | string>("");
  const [categories, setCategories] = useState({
    Food: 0,
    Clothing: 0,
    Education: 0,
    Entertainment: 0,
    Health: 0,
  });

  const [previousValues, setPreviousValues] = useState({ ...categories });

  const handleBudgetChange = (category: string, value: number) => {
    if (value < 0) {
      alert("Budget values cannot be negative.");
      return; // Exit the function early
    }

    const updatedCategories = { ...categories, [category]: value };
    const sumOfBudgets = Object.values(updatedCategories).reduce(
      (sum, val) => sum + val,
      0
    );

    if (totalBudget && sumOfBudgets > Number(totalBudget)) {
      alert("The sum of the categorical budgets cannot exceed the total budget.");
      setCategories(previousValues); // Revert to previous values
    } else {
      setPreviousValues(updatedCategories); // Save the current state
      setCategories(updatedCategories);
      fetch("http://localhost:5001/api/budget/set", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalBudget: totalBudget, // Ensure this is a number
          categories: {
            Food: updatedCategories.Food,
            Clothing: updatedCategories.Clothing,
            Education: updatedCategories.Education,
            Entertainment: updatedCategories.Entertainment,
            Health: updatedCategories.Health
          }
        })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
    }
  };

  const calculateTotal = () => {
    return Object.values(categories).reduce((sum, val) => sum + val, 0);
  };


  const calculateWeekly = (amount: number) => (amount / 4).toFixed(2);

  return (
    <div className="feature-page">
      <header className="header">
        <h2>Budget Setup & Tracking</h2>
        <p>Set your total monthly budget and allocate it across categories.</p>
      </header>
      <div className="content-container">
        <form className="budget-form">
          <div className="form-group">
            <label htmlFor="total-budget"><strong>Total Monthly Budget</strong></label>
            <input
              type="number"
              id="total-budget"
              value={totalBudget}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value < 0) {
                  alert("The total budget cannot be negative.");
                } else {
                  setTotalBudget(value);
                }
              }}
              placeholder="Enter your total budget"
            />
          </div>

          {Object.keys(categories).map((category) => (
            <div key={category} className="form-group">
              <label htmlFor={category}>{category} Budget</label>
              <input
                type="number"
                id={category}
                value={categories[category as keyof typeof categories]}
                onChange={(e) =>
                  handleBudgetChange(category, Number(e.target.value))
                }
                placeholder={`Enter budget for ${category}`}
              />
            </div>
          ))}
        </form>

        <div className="chart-container">
          <h3>Weekly Spending</h3>
          <table className="spending-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Weekly Budget</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(categories).map(([category, value]) => (
                <tr key={category}>
                  <td>{category}</td>
                  <td>${calculateWeekly(value)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td>${calculateWeekly(calculateTotal())}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <button className="home-button" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default BudgetSetupPage;

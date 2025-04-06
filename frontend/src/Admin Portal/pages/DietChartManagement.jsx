import React, { useState } from "react";
import apiClient from "../../utils/axiosConfig";
import '../styles/DietChartForm.css'; // Import the new CSS file

const DietChartForm = () => {
  const [patientId, setPatientId] = useState("");
  const [meals, setMeals] = useState([{ timeOfDay: "", mealPlan: "", ingredients: "", instructions: "" }]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleMealChange = (index, field, value) => {
    const updatedMeals = [...meals];
    updatedMeals[index][field] = value;
    setMeals(updatedMeals);
  };

  const addMeal = () => {
    setMeals([...meals, { timeOfDay: "", mealPlan: "", ingredients: "", instructions: "" }]);
  };

  const removeMeal = (index) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("/api/diet-charts", {
        patientId,
        meals,
        additionalNotes,
      });
      setResponseMessage(response.data.message);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
      setResponseMessage("");
    }
  };

  return (
    <div className="diet-chart-form">
      <h2>Create Diet Chart</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Patient ID:
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            />
          </label>
        </div>

        <h3>Meals</h3>
        {meals.map((meal, index) => (
          <div key={index} className="meal-entry">
            <div className="form-group">
              <label>
                Time of Day:
                <select
                  value={meal.timeOfDay}
                  onChange={(e) => handleMealChange(index, "timeOfDay", e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </label>
            </div>
            <div className="form-group">
              <label>
                Meal Plan:
                <input
                  type="text"
                  value={meal.mealPlan}
                  onChange={(e) => handleMealChange(index, "mealPlan", e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Ingredients:
                <input
                  type="text"
                  value={meal.ingredients}
                  onChange={(e) => handleMealChange(index, "ingredients", e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Instructions (optional):
                <input
                  type="text"
                  value={meal.instructions}
                  onChange={(e) => handleMealChange(index, "instructions", e.target.value)}
                />
              </label>
            </div>
            <button type="button" className="remove-meal-btn" onClick={() => removeMeal(index)}>
              Remove Meal
            </button>
          </div>
        ))}
        <button type="button" className="add-meal-btn" onClick={addMeal}>
          Add Meal
        </button>

        <div className="form-group">
          <label>
            Additional Notes (optional):
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
            />
          </label>
        </div>

        <button type="submit" className="submit-btn">Create Diet Chart</button>
      </form>

      {responseMessage && <p className="response-message">{responseMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default DietChartForm;

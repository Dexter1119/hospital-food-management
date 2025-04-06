import React, { useState } from "react";
import apiClient from "../../utils/axiosConfig"; // Make sure axiosConfig is properly set up
import '../styles/PatinetMangement.css'; // Import the custom CSS file

const PatientManagement = () => {
  const [patientForm, setPatientForm] = useState({
    name: "",
    age: "",
    gender: "",
    contactInfo: "",
    emergencyContact: "",
    roomNumber: "",
    bedNumber: "",
    floorNumber: "",
    diseases: "",
    allergies: "",
    additionalDetails: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const prepareFormData = () => {
    const formData = { ...patientForm };
    formData.diseases = formData.diseases ? formData.diseases.split(",").map((item) => item.trim()) : [];
    formData.allergies = formData.allergies ? formData.allergies.split(",").map((item) => item.trim()) : [];
    return formData;
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    const preparedData = prepareFormData();
    console.log(preparedData);

    apiClient
      .post("/api/patient", preparedData)
      .then((response) => {
        alert("Patient added successfully!");
        setPatientForm({
          name: "",
          age: "",
          gender: "",
          contactInfo: "",
          emergencyContact: "",
          roomNumber: "",
          bedNumber: "",
          floorNumber: "",
          diseases: "",
          allergies: "",
          additionalDetails: "",
        });
      })
      .catch((error) => {
        console.error("Error adding patient:", error);
      });
  };

  return (
    <div className="patient-management-container">
      <h3>Add New Patient</h3>
      <form onSubmit={handleAddPatient} className="space-y-6">
        {/* Form Fields */}
        <div className="space-y-2">
          <label htmlFor="name">Patient Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={patientForm.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={patientForm.age}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={patientForm.gender}
            onChange={handleChange}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="contactInfo">Contact Information</label>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={patientForm.contactInfo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="emergencyContact">Emergency Contact</label>
          <input
            type="text"
            id="emergencyContact"
            name="emergencyContact"
            value={patientForm.emergencyContact}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="roomNumber">Room Number</label>
          <input
            type="text"
            id="roomNumber"
            name="roomNumber"
            value={patientForm.roomNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="bedNumber">Bed Number</label>
          <input
            type="text"
            id="bedNumber"
            name="bedNumber"
            value={patientForm.bedNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="floorNumber">Floor Number</label>
          <input
            type="text"
            id="floorNumber"
            name="floorNumber"
            value={patientForm.floorNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="diseases">Diseases (comma-separated)</label>
          <input
            type="text"
            id="diseases"
            name="diseases"
            value={patientForm.diseases}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="allergies">Allergies (comma-separated)</label>
          <input
            type="text"
            id="allergies"
            name="allergies"
            value={patientForm.allergies}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="additionalDetails">Additional Details</label>
          <textarea
            id="additionalDetails"
            name="additionalDetails"
            value={patientForm.additionalDetails}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-submit">
            Add Patient
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientManagement;

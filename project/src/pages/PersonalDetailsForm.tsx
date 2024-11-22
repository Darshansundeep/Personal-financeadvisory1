import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormLayout from '../components/FormLayout';
import InputField from '../components/InputField';
import { useFinanceStore } from '../store/financeStore';

export default function PersonalDetailsForm() {
  const navigate = useNavigate();
  const setPersonalDetails = useFinanceStore((state) => state.setPersonalDetails);
  const existingData = useFinanceStore((state) => state.data.personal);

  const [formData, setFormData] = useState({
    fullName: existingData?.fullName || '',
    email: existingData?.email || '',
    age: existingData?.age || '',
    occupation: existingData?.occupation || '',
    dependents: existingData?.dependents || '',
  });

  const [errors, setErrors] = useState({
    email: '',
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleEmailChange = (value: string) => {
    setFormData({ ...formData, email: value });
    setErrors({ ...errors, email: validateEmail(value) });
  };

  const handleSubmit = () => {
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors({ ...errors, email: emailError });
      return;
    }

    setPersonalDetails({
      fullName: formData.fullName,
      email: formData.email,
      age: Number(formData.age),
      occupation: formData.occupation,
      dependents: Number(formData.dependents),
    });
    navigate('/income');
  };

  const isValid = formData.fullName && 
    formData.email && 
    formData.age && 
    formData.occupation && 
    formData.dependents !== '' && 
    !errors.email;

  return (
    <FormLayout
      title="Personal Details"
      subtitle="Let's start with some basic information about you"
      onNext={isValid ? handleSubmit : undefined}
    >
      <InputField
        label="Full Name"
        value={formData.fullName}
        onChange={(value) => setFormData({ ...formData, fullName: value })}
        required
        placeholder="John Doe"
      />
      <InputField
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleEmailChange}
        required
        placeholder="john@example.com"
        error={errors.email}
        pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
      />
      <InputField
        label="Age"
        type="number"
        value={formData.age}
        onChange={(value) => setFormData({ ...formData, age: value })}
        required
        min={18}
      />
      <InputField
        label="Occupation"
        value={formData.occupation}
        onChange={(value) => setFormData({ ...formData, occupation: value })}
        required
        placeholder="Software Engineer"
      />
      <InputField
        label="Number of Dependents"
        type="number"
        value={formData.dependents}
        onChange={(value) => setFormData({ ...formData, dependents: value })}
        required
        min={0}
        placeholder="0"
      />
    </FormLayout>
  );
}
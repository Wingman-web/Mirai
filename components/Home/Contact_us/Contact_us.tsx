'use client';

import { useState, FormEvent } from 'react';
import DayViewImg from './day_view.png';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const validateName = (value: string): string => {
    if (!value.trim()) return 'Please enter your name';
    if (value.length < 3) return 'Name must be at least 3 characters';
    if (!/^[a-zA-Z\s.']+$/.test(value)) return 'Name contains invalid characters';
    return '';
  };

  const validateEmail = (value: string): string => {
    if (!value.trim()) return 'Please enter your email';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Enter a valid email address';
    return '';
  };

  const validatePhone = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return 'Please enter your phone number';
    if (digits.length !== 10) return 'Phone number must be 10 digits';
    return '';
  };

  const handleBlur = (field: 'name' | 'email' | 'phone') => {
    setTouched({ ...touched, [field]: true });
    
    let error = '';
    if (field === 'name') error = validateName(formData.name);
    else if (field === 'email') error = validateEmail(formData.email);
    else if (field === 'phone') error = validatePhone(formData.phone);
    
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (field: 'name' | 'email' | 'phone', value: string) => {
    if (field === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setFormData({ ...formData, [field]: value });
    
    if (touched[field]) {
      let error = '';
      if (field === 'name') error = validateName(value);
      else if (field === 'email') error = validateEmail(value);
      else if (field === 'phone') error = validatePhone(value);
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowSuccess(false);

    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);

    setErrors({
      name: nameError,
      email: emailError,
      phone: phoneError,
    });

    setTouched({
      name: true,
      email: true,
      phone: true,
    });

    if (!nameError && !emailError && !phoneError) {
      // Handle form submission here
      console.log('Form submitted:', formData);
      
      setShowSuccess(true);
      setFormData({ name: '', email: '', phone: '', acceptTerms: false });
      setErrors({ name: '', email: '', phone: '' });
      setTouched({ name: false, email: false, phone: false });

      setTimeout(() => setShowSuccess(false), 4000);
    }
  };

  const getInputClassName = (field: 'name' | 'email' | 'phone') => {
    const base = 'w-full px-4 py-5 border-0 border-b bg-transparent text-base outline-none transition-all duration-150';
    if (touched[field] && errors[field]) {
      return `${base} border-red-500`;
    }
    if (touched[field] && !errors[field] && formData[field]) {
      return `${base} border-green-600`;
    }
    return `${base} border-gray-200 focus:border-blue-600 focus:shadow-[0_3px_12px_rgba(10,108,255,0.08)]`;
  };

  return (
    <section
      id="contact"
      className="relative bg-black bg-cover bg-center"
      style={{ backgroundImage: `url(${DayViewImg.src})` }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto max-w-275 py-8 lg:py-20 relative z-10">
        <div className="flex flex-wrap justify-center py-4 lg:py-16">
          <div className="w-full lg:w-1/2 lg:pr-12">
            <div className="bg-white rounded-xl p-7 lg:p-8 shadow-[0_6px_24px_rgba(12,17,31,0.06)] animate-zoom-in">
              <div className="mb-4">
                <h5 className="font-semibold text-lg m-0">CONTACT US</h5>
              </div>
              
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-8 relative">
                  <input
                    type="text"
                    id="name"
                    className={getInputClassName('name')}
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    aria-describedby="nameFeedback"
                    aria-invalid={touched.name && !!errors.name}
                  />
                  {touched.name && errors.name && (
                    <div id="nameFeedback" className="text-red-500 text-sm mt-1.5" role="alert">
                      {errors.name}
                    </div>
                  )}
                </div>

                <div className="mb-8 relative">
                  <input
                    type="email"
                    id="email"
                    className={getInputClassName('email')}
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    aria-describedby="emailFeedback"
                    aria-invalid={touched.email && !!errors.email}
                  />
                  {touched.email && errors.email && (
                    <div id="emailFeedback" className="text-red-500 text-sm mt-1.5" role="alert">
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="mb-8 relative">
                  <input
                    type="tel"
                    id="phone"
                    className={getInputClassName('phone')}
                    placeholder="Number"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    aria-describedby="phoneFeedback"
                    aria-invalid={touched.phone && !!errors.phone}
                  />
                  {touched.phone && errors.phone && (
                    <div id="phoneFeedback" className="text-red-500 text-sm mt-1.5" role="alert">
                      {errors.phone}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    id="accept-terms"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="accept-terms" className="text-sm">
                    I accept the terms and conditions
                  </label>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white border-0 py-3 px-12 text-base cursor-pointer rounded mt-8 hover:brightness-95 transition-all"
                >
                  Submit Form
                </button>

                {showSuccess && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="mt-4 p-3 rounded-lg bg-green-50 text-green-600 border border-green-100"
                  >
                    Thanks! Your message was submitted.
                  </div>
                )}
              </form>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 text-center">
            {/* Optional right column content */}
          </div>
        </div>
      </div>
    </section>
  );
}
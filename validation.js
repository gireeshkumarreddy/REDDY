(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.EnquiryValidation = factory();
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  function validate(input) {
    const data = {};
    const errors = {};
    for (const key of ['name', 'email', 'phone', 'message']) {
      data[key] = typeof input[key] === 'string' ? input[key].trim() : '';
    }
    if (!data.name || data.name.length > 80 || /[\r\n\x00-\x1f]/.test(data.name)) {
      errors.name = 'Please enter your name (up to 80 characters).';
    }
    if (data.email.length > 254 || !/^[^\s@<>]+@[^\s@<>.]+(?:\.[^\s@<>.]+)+$/.test(data.email)) {
      errors.email = 'Please enter a valid email, such as name@example.com.';
    }
    const digits = data.phone.replace(/\D/g, '');
    if (!/^\+?[\d\s().-]+$/.test(data.phone) || data.phone.length > 32 || digits.length < 7 || digits.length > 15) {
      errors.phone = 'Please enter a valid phone number with 7–15 digits.';
    }
    if ((input.message != null && typeof input.message !== 'string') || data.message.length > 3000) {
      errors.message = 'Please keep your project details under 3,000 characters.';
    }
    return { data, errors, valid: Object.keys(errors).length === 0 };
  }
  return { validate };
});

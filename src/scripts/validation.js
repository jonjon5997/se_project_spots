export const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-button",
  inactiveButtonClass: "modal__submit-button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__submit-button_type_error",
};

const showInputError = (formEl, inputElement, errorMsg, config) => {
  const errorMsgID = inputElement.id + "-error";
  const errorMsgEl = formEl.querySelector("#" + errorMsgID);
  errorMsgEl.textContent = errorMsg;
  inputElement.classList.add(config.errorClass);
};

// Function to hide an error message
const hideInputError = (formEl, inputElement, config) => {
  const errorMsgEl = formEl.querySelector(`#${inputElement.id}-error`);
  errorMsgEl.textContent = "";
  inputElement.classList.remove(config.errorClass);
};

// Function to check if input is valid and show or hide error messages
const checkInputValidity = (formEl, inputElement, config) => {
  if (!inputElement.validity.valid) {
    showInputError(
      formEl,
      inputElement,
      inputElement.validationMessage,
      config
    );
  } else {
    hideInputError(formEl, inputElement, config);
  }
};

// Helper function to check if any input is invalid
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

// Function to toggle the submit button's state
const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement, config);
  } else {
    enableButton(buttonElement, config);
  }
};

// Function to disable the submit button
export const disableButton = (buttonElement, config) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
  buttonElement.classList.add(config.errorClass);
};

// Function to enable the submit button
const enableButton = (buttonElement, config) => {
  buttonElement.disabled = false;
  buttonElement.classList.remove(config.inactiveButtonClass);
  buttonElement.classList.remove(config.errorClass);
};

// Function to set event listeners for input validation
const setEventListeners = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formEl, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

// Function to enable validation for all forms on the page
export const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });
};
export const resetValidation = (formEl, inputList, config) => {
  inputList.forEach((inputElement) => {
    hideInputError(formEl, inputElement, config);
  });
  const submitButton = formEl.querySelector(config.submitButtonSelector);
  disableButton(submitButton, config);
};

const showInputError = (formEl, inputElement, errorMsg) => {
  const errorMsgID = inputElement.id + "-error";
  const errorMsgEl = formEl.querySelector("#" + errorMsgID);
  errorMsgEl.textContent = errorMsg;
  inputElement.classList.add("modal__input_type_error");
};

const hideInputError = (formEl, inputElement) => {
  const errorMsgEl = formEl.querySelector(`#${inputElement.id}-error`);
  errorMsgEl.textContent = "";
  inputElement.classList.remove("modal__input_type_error");
};

const checkInputValidity = (formEl, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formEl, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formEl, inputElement);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement);
    // todo Add modifier class to the button element to make it grey
    buttonElement.classList.add("modal__submit-button_type_error");
    // todo dont forget the css
  } else {
    // todo remove the disabled class
    enableButton(buttonElement);
    buttonElement.classList.remove("modal__submit-button_type_error");
  }
};

const disableButton = (buttonElement) => {
  buttonElement.disabled = true;
};
const enableButton = (buttonElement) => {
  buttonElement.disabled = false;
};

const resetValidation = (formEl, inputList) => {
  inputList.forEach((input) => {
    hideInputError(formEl, input);
  });
};

const setEventListeners = (formEl) => {
  const inputList = Array.from(formEl.querySelectorAll(".modal__input"));
  const buttonElement = formEl.querySelector(".modal__submit-button");

  toggleButtonState(inputList, buttonElement);
  // TODO handle initial states
  //   toggleButtonState(inputList, buttonElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formEl, inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });
};
const enableValidation = () => {
  const formList = document.querySelectorAll(".modal__form");
  formList.forEach((formEl) => {
    setEventListeners(formEl);
  });
};

enableValidation();

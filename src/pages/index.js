import {
  enableValidation,
  settings,
  disableButton,
} from "../scripts/validation.js";
import "./index.css";

import { resetValidation } from "../scripts/validation.js";

import pencil from "../images/pencil.svg";
import plusIcon from "../images/plus.svg";
import spotLogo from "../images/logo.svg";
import avatar from "../images/avatar.jpg";
import pencilIcon from "../images/pencil-icon.svg";
import mobilePencil from "../images/pencil-icon-mobile.png";

import Api from "../utils/Api.js";

import { setButtonText } from "../utils/helpers.js";

//avatar form elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitButton = avatarModal.querySelector(".modal__submit-button");
const avatarCloseButton = avatarModal.querySelector(".modal__close-button");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarModalButton = document.querySelector(".profile__avatar-button");
const profileAvatarImg = document.querySelector(".profile__avatar");

//profile elements
const editModal = document.querySelector("#edit-modal");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileEditButton = document.querySelector(".profile__edit-button");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseButton = editModal.querySelector(".modal__close-button");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

//card elements
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardModalCloseButton = cardModal.querySelector(".modal__close-button");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const cardModalButton = document.querySelector(".profile__add-button");
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

//additional
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button"
);
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const submitButton = cardModal.querySelector(".modal__submit-button");

//delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const cancelButton = deleteModal.querySelector("#cancel-button");

let selectedCard;
let selectedCardId;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "d9c42335-bb0f-4233-9212-06bd7c09b9fe",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()

  .then(([cards, userInfo]) => {
    console.log(cards); // Check if `cards` contains data
    console.log(userInfo);
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      console.log("Card element:", cardElement); // Verify it returns an element
      cardsList.append(cardElement);
    });

    //handle user's information

    const pencilButtonImg = document.querySelector(".profile__edit-button img");
    const plusButtonImg = document.querySelector(".profile__add-button img");
    const spotLogoImg = document.querySelector(".header__logo");
    const pencilIconImg = document.querySelector(".profile__pencil-icon");
    const userNameElement = document.querySelector(".profile__name");
    const userDescriptionElement = document.querySelector(
      ".profile__description"
    );
    const mobilePencilImg = document.querySelector("#mobile-pencil");
    // Set the src attributes
    profileAvatarImg.src = avatar;
    pencilButtonImg.src = pencil;
    plusButtonImg.src = plusIcon;
    spotLogoImg.src = spotLogo;
    pencilIconImg.src = pencilIcon;
    mobilePencilImg.src = mobilePencil;
    profileAvatarImg.src = userInfo.avatar;
    //set textContent
    userNameElement.textContent = userInfo.name;
    userDescriptionElement.textContent = userInfo.about;
  })
  .catch(console.error);

// Function to close the modal
function closeModal() {
  const currentModal = document.querySelector(".modal_opened");
  if (currentModal) {
    currentModal.classList.remove("modal_opened");
    document.removeEventListener("keydown", handleEscapeKey);
    document.removeEventListener("click", handleOverlayClick);
  }
}

// Function to open the modal
function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
  document.addEventListener("click", handleOverlayClick);
}

// Handle clicks on the overlay
function handleOverlayClick(event) {
  // Check if the event target is the open modal's overlay (the modal itself, not its content)
  if (event.target.classList.contains("modal_opened")) {
    closeModal();
  }
}

// Escape key handler
function handleEscapeKey(event) {
  if (event.key === "Escape") {
    closeModal();
  }
}

// Handle profile form submission
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  //Change text content to "saving..."
  const submitButton = evt.submitter;
  // submitButton.textContent = "Saving...";
  setButtonText(submitButton, true, "Save", "Saving...");

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      profileAvatarImg.src = data.avatar; // Set the avatar image
      evt.target.reset(); // Reset the form only on success
      disableButton(submitButton, settings); // Assuming disableButton function exists
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false, "Save", "Saving...");
    });
}

// Handle card form submission
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };

  setButtonText(submitButton, true, "Save", "Saving..."); // Change the button text to indicate saving

  // add the card in the api
  api
    .addCard(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      evt.target.reset(); // Reset the form only on success
      disableButton(submitButton, settings); // Assuming disableButton function exists
      closeModal(cardModal); // Close the modal only on success
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false, "Save", "Saving..."); // Reset button text after request
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const avatarSubmitButton = evt.submitter;
  setButtonText(avatarSubmitButton, true, "Save", "Saving...");

  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      console.log(data.avatar);
      profileAvatarImg.src = data.avatar; // Update the profile avatar
      evt.target.reset(); // Reset the form only on success
      disableButton(avatarSubmitButton, settings); // Assuming disableButton function exists
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(avatarSubmitButton, false, "Save", "Saving...");
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  setButtonText(submitButton, true, "Delete", "Deleting...");
  console.log(selectedCardId);
  api
    .deleteCard(selectedCardId)
    .then((data) => {
      console.log(data);
      selectedCard.remove(); // Ensure the card is removed from the DOM
      evt.target.reset(); // Reset the form only on success
      closeModal(deleteModal); // Correctly close the delete modal
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false, "Delete", "Deleting...");
    });
}

function handleLike(evt, id) {
  const likeButton = evt.target; // Store the reference to the like button
  const isLiked = likeButton.classList.contains("card__like-button_liked"); // Determine the new liked state

  // Call the API to change the like status
  api
    .changeLikeStatus(id, isLiked)
    .then(() => {
      // Only toggle the class if the API call was successful
      likeButton.classList.toggle("card__like-button_liked");
    })
    .catch(console.error); // Log any errors
}

// Generate card element
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardNameEl.textContent = data.name;
  cardImage.alt = data.name;
  cardImage.src = data.link;
  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_liked");
  }

  // Toggle like button
  cardLikeButton.addEventListener("click", (evt) => handleLike(evt, data._id));

  deleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  // Open image preview modal
  cardImage.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  return cardElement;
}

function handleDeleteCard(cardElement, cardId) {
  // evt.target.closest(".card").remove();
  selectedCard = cardElement; // Assign the card element to selectedCard
  selectedCardId = cardId; // Assign the card's ID to selectedCardId
  console.log(cardId);
  openModal(deleteModal);
}

// Open edit modal
profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  ); // Assuming resetValidation function exists
  openModal(editModal);
});

// Open card modal
cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});
//open avatar modal
avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});
// Add event listeners to close buttons
const closeButtons = document.querySelectorAll(".modal__close-button");
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

cancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

// Add event listeners to forms
editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
avatarModal.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

//Enable validation by passing the settings object
enableValidation(settings);

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

// const initialCards = [
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Golden Gate Bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
// ];

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
const cardSubmitButton = cardModal.querySelector(".modal__submit-button");
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

// destructure the second item in the callback of the .then()
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

    console.log(mobilePencil);
    userNameElement.textContent = userInfo.name;
    userDescriptionElement.textContent = userInfo.about;
    profileAvatarImg.src = userInfo.avatar;
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
  const cardSubmitButton = evt.submitter;
  // cardSubmitButton.textContent = "Saving...";
  setButtonText(cardSubmitButton, true, "Save", "Saving...");

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      profileAvatarImg.src = data.avatar; // Set the avatar image
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(cardSubmitButton, false, "Save", "Saving...");
    });
}

// TODO-implement the loading text for all other form submissions

// Handle card form submission
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  // add the card in the api
  api.addCard(inputValues).then((data) => {
    const cardElement = getCardElement(data);
    cardsList.prepend(cardElement);
  });

  evt.target.reset();
  disableButton(cardSubmitButton, settings); // Assuming disableButton function exists
  closeModal(cardModal);
}

function handleLike(evt, id) {
  evt.target.classList.toggle("card__like-button_liked");
  // 1. check whether card is currently liked or not
  const isLiked = !evt.target.classList.contains("card__like-button_liked");
  // 2. call the chengeLikeStatus method passing it the appropriate arguments
  api
    .changeLikeStatus(id, isLiked)
    .then((updatedCard) => {
      // Optionally update the like count or any other UI elements based on `updatedCard`
      console.log("Updated card data:", updatedCard);
    })
    .catch(console.error);
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
  // TODO if the card is liked, set the active class on the card
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

// function handleDeleteSubmit(evt) {
//   evt.preventDefault();
//   const cardSubmitButton = evt.submitter;
//   setButtonText(cardSubmitButton, true, "Delete", "Deleting...");
//   api
//     .deleteCard(selectedCardId) //pass the id to the api function
//     .then((data) => {
//       console.log(data);

//       //remove card from the DOM
//       selectedCard.remove();

//       // Close the delete confirmation modal (or any other related modal)
//       closeModal(cardModal);
//     })
//     .catch(console.error)
//     .finally(() => {
//       setButtonText(cardSubmitButton, false, "Delete", "Deleting...");
//     });
// }

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const cardSubmitButton = evt.submitter;
  setButtonText(cardSubmitButton, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then((data) => {
      console.log(data);
      selectedCard.remove(); // Ensure the card is removed from the DOM
      closeModal(deleteModal); // Correctly close the delete modal
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(cardSubmitButton, false, "Delete", "Deleting...");
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const cardSubmitButton = evt.submitter;

  setButtonText(cardSubmitButton, true, "Save", "Saving...");
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      console.log(data.avatar);
      profileAvatarImg.src = data.avatar; // Update the profile avatar
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(cardSubmitButton, false, "Save", "Saving...");
    });
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
// Close avatar modal when close button is clicked
avatarCloseButton.addEventListener("click", () => {
  closeModal();
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

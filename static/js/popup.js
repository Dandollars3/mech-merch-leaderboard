document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("imagePopup");
  const popupImage = document.getElementById("popupImage");
  const closeBtn = document.getElementById("popupClose");
  const prevBtn = document.getElementById("popupPrev");
  const nextBtn = document.getElementById("popupNext");
  const modelImages = document.querySelectorAll(".model-image");

  let currentIndex = 0;
  const totalImages = 6; // We have 6 unique model images

  // Open popup when clicking on a model image
  modelImages.forEach((img, index) => {
    img.addEventListener("click", () => {
      // Pause the animation when opening popup
      document.querySelector(".model-track").style.animationPlayState =
        "paused";

      // Get the actual image id (1-6)
      const imageId = parseInt(img.getAttribute("data-id"));

      // Set current index based on real image id (0-5 for array index)
      currentIndex = imageId - 1;

      // Update popup image
      updatePopupImage();

      // Show popup with animation
      popup.classList.add("active");

      // Prevent page scrolling when popup is open
      document.body.style.overflow = "hidden";
    });
  });

  // Close popup
  closeBtn.addEventListener("click", closePopup);

  // Close popup when clicking outside the image
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      closePopup();
    }
  });

  // Navigate to previous image
  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;
    updatePopupImage();
  });

  // Navigate to next image
  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % totalImages;
    updatePopupImage();
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!popup.classList.contains("active")) return;

    if (e.key === "Escape") closePopup();
    if (e.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + totalImages) % totalImages;
      updatePopupImage();
    }
    if (e.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % totalImages;
      updatePopupImage();
    }
  });

  function closePopup() {
    popup.classList.remove("active");
    document.body.style.overflow = "";
    // Resume the animation when closing popup
    document.querySelector(".model-track").style.animationPlayState = "running";
  }

  function updatePopupImage() {
    // Get image path with the current index (+1 because filenames start at 1)
    const imagePath = `/static/images/model${currentIndex + 1}.jpg`;
    popupImage.src = imagePath;
    popupImage.alt = `Model ${currentIndex + 1}`;
  }
});

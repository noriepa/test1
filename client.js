const form = document.querySelector("form");
const imageContainer = document.querySelector("#image-container");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const cigaretteText = formData.get("search-text");
  generateImage(cigaretteText);
});

function generateImage(cigaretteText) {
  fetch("/render-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cigaretteText }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.blob();
    })
    .then((blob) => {
      const imageUrl = URL.createObjectURL(blob);
      const image = new Image();
      image.src = imageUrl;
      imageContainer.innerHTML = "";
      imageContainer.appendChild(image);
    })
    .catch((error) => {
      console.error("Error generating image:", error);
      imageContainer.innerHTML = "Error generating image. Please try again.";
    });
}




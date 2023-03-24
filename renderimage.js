import { render } from "./client.js";
import { encodeImageFileAsURL, downloadImage, getImageData } from "./utils.js";

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const renderButton = document.querySelector("#render-button");
const downloadButton = document.querySelector("#download-button");

renderButton.addEventListener("click", () => {
  encodeImageFileAsURL((srcData) => {
    render(srcData).then((result) => {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = result;
    });
  });
});

downloadButton.addEventListener("click", () => {
  const imageData = getImageData(canvas);
  downloadImage(imageData);
});

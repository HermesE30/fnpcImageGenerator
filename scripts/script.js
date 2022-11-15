const canvasPost = document.getElementById("canvas-post");
const contextPost = canvasPost.getContext("2d");

const canvasStory = document.getElementById("canvas-story");
const contextStory = canvasStory.getContext("2d");
let canvas = '';
let context = '';

const pantonFont = new FontFace(
  "myPantonFont",
  "url(./assets/montserrat.ttf)"
);
pantonFont.load().then(function (font) {
  // with canvas, if this is ommited won't work
  document.fonts.add(font);
});

const $main = document.querySelector("#main");
const $menu = document.querySelector("#menu");

let menuSelecionado = "";
function optionMenu() {
  return menuSelecionado;
}

function clickPost() {
  canvas = canvasPost;
  context = contextPost;
  canvasStory.style.display = 'none';
  canvasPost.style.display = 'block';
  menuSelecionado = "post";
  changeMenu();
}

function clickFoto() {
  canvas = canvasPost;
  context = contextPost;
  canvasStory.style.display = 'none';
  canvasPost.style.display = 'block';
  menuSelecionado = "filter";
  changeMenu();
}

function clickStory() {
  canvas = canvasStory;
  context = contextStory;
  canvasPost.style.display = 'none';
  canvasStory.style.display = 'block';
  menuSelecionado = "story";
  changeMenu();
}

const baseImageFigure = new Image();
baseImageFigure.src = "./fnpc-base.png?v=2";

const baseImageStory = new Image();
baseImageStory.src = "./fnpc-base-story.png?v=2";

const baseImageFiltro = new Image();
baseImageFiltro.src = "./fnpc-thumb-mascara.png?v=2";

const baseImageMascara = new Image();
baseImageMascara.src = "./fnpc-mascara.png?v=2";


let baseImageUsuario = new Image();

document.getElementById("btnShare").addEventListener("click", shareImage);
document.getElementById("btnSave").addEventListener("click", saveImage);

function roundRect(ctx, x, y, width, height, radius = 5) {
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height
  );
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  ctx.fill();
}

async function shareImage() {
  try {
    canvas.toBlob((blob) => {
      const filesArray = [
        new File(
          [blob],
          document.querySelector("input").value.trim() + ".jpg",
          {
            type: "image/jpeg",
            lastModified: new Date().getTime(),
          }
        ),
      ];
      const shareData = { files: filesArray };

      navigator.share(shareData);
    });
  } catch (error) {
    Alert(
      "Não foi possível compartilhar a imagem: " + (error.message || error)
    );
  }
}

function saveImage() {
  try {
    if (optionMenu() === "post") {
      arquivoName = document.querySelector("input[name=yourname]").value.trim();
    } else if (optionMenu() === "story") {
      arquivoName = "apoio";
    }

    const a = document.createElement("a");
    a.setAttribute("href", canvas.toDataURL("image/png"));
    a.setAttribute("download", arquivoName);
    a.click();
  } catch (error) {
    Alert("Não foi possível baixar a imagem: " + (error.message || error));
  }
}

function clickVoltar() {
  menuSelecionado = "";

  $menu.classList.remove("hidden");
  $main.classList.add("hidden");
}

function changeMenu() {
  baseImageUsuario = new Image();
  context.clearRect(0, 0, canvas.width, canvas.height);
  $menu.classList.add("hidden");
  $main.classList.remove("hidden");

  switch (optionMenu()) {
    case "filter":
      document.querySelector("input[name=yourname]").type = "file";
      drawArte();
      break;
    default:
      document.querySelector("input[name=yourname]").type = "text";
      drawArte();
      break;
  }
}

function drawArte() {
  const content = document.querySelector("input[name=yourname]").value.trim();
  const txt = content.replaceAll(' ', '\n');
  const lineheight = 120;
  const lines = txt.split('\n');

  if (optionMenu() === "post") {
    context.drawImage(baseImageFigure, 0, 0);
  } else if (optionMenu() === "story") {
    context.drawImage(baseImageStory, 0, 0);
  } else if (optionMenu() === "filter") {
    if (baseImageUsuario.src) {
      context.drawImage(baseImageMascara, 0, 0, 1080, 1080);
    } else {
      context.drawImage(baseImageFiltro, 0, 0, 1080, 1080);
    }
  }

  context.save();

  if (optionMenu() === "post" && txt) {
    context.translate(1080 / 2, 335);
    context.textBaseline = "middle";
    context.font = "144px myPantonFont";

    const width = context.measureText(content).width / 2;

    context.fillStyle = "#6F2DBD";
    context.textAlign = "center";
    for (var i = 0; i < lines.length; i++) {
      context.fillText(lines[i], -width / 80, 0 + (i * lineheight));
    }
  }

  if (optionMenu() === "story" && txt) {
    context.translate(1080 / 2, 335);
    context.textBaseline = "middle";
    context.font = "144px myPantonFont";

    const width = context.measureText(content).width / 2;

    context.fillStyle = "#6F2DBD";
    context.textAlign = "center";
    for (var i = 0; i < lines.length; i++) {
      context.fillText(lines[i], -width / 80, 450 + (i * lineheight));
    }
  }

  context.restore();
}

document
  .querySelector("input[name=yourname]")
  .addEventListener("keyup", (ev) => {
    ev.preventDefault();

    drawArte();
  });

document
  .querySelector("input[name=yourname]")
  .addEventListener("change", (ev) => {
    ev.preventDefault();

    if (ev.target.files && ev.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (ev) => {
        baseImageUsuario = new Image();
        context.clearRect(0, 0, canvas.width, canvas.height);
        baseImageUsuario.src = ev.target.result;

        baseImageUsuario.addEventListener("load", () => {
          const oldWidth = baseImageUsuario.width;
          baseImageUsuario.width = 1080;
          baseImageUsuario.height = (1080 / oldWidth) * baseImageUsuario.height;
          if (baseImageUsuario.height < 1080) {
            const oldHeight = baseImageUsuario.height;
            baseImageUsuario.height = 1080;
            baseImageUsuario.width =
              (1080 / oldHeight) * baseImageUsuario.width;
          }
          context.drawImage(
            baseImageUsuario,
            0 - (baseImageUsuario.width - 1080) / 2,
            0 - (baseImageUsuario.height - 1080) / 2,
            baseImageUsuario.width,
            baseImageUsuario.height
          );

          drawArte();
        });
      };
      reader.readAsDataURL(ev.target.files[0]);
    }
  });

window.onload = () => {
  drawArte();
};

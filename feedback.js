window.addEventListener("DOMContentLoaded", () => {
  const overlay = document.querySelector("#post");
  const delBtn = document.querySelector("#compose-btn");
  const closeBtn = document.querySelector("#close-modal");
  const postbtn = document.querySelector("#post-btn");

  const toggleModal = () => {
    overlay.classList.toggle("hidden");
    overlay.classList.toggle("flex");
  };

  window.onclick = function (event) {
    if (event.target == toggleModal) {
      overlay.classList.toggle("hidden");
    }
  };
  delBtn.addEventListener("click", toggleModal);
  closeBtn.addEventListener("click", toggleModal);
  postbtn.addEventListener("click", toggleModal);

  var posts = obtenerPostsLocalmente();

  // Mostrar los posts en la interfaz
  mostrarPostsEnInterfaz(posts);
  //borrarTodosLosPostsLocalmente()
});

function mostrarPostsEnInterfaz(posts) {
  var postContainer = document.getElementById("post-container");

  // Limpiar cualquier contenido existente en el contenedor
  postContainer.innerHTML = "";

  // Iterar sobre los posts y crear elementos HTML para cada uno
  for (var i = 0; i < posts.length; i++) {
      var post = posts[i];
      var postElement = crearElementoDePost(post);
      postContainer.appendChild(postElement);
  }
}

function crearElementoDePost(post) {
  
  var postDiv = document.createElement("div");
  postDiv.textContent = post.postText;

  return postDiv;
}

function borrarTodosLosPostsLocalmente() {
  // Eliminar el elemento 'posts' del almacenamiento local
  localStorage.removeItem('posts');

  // Opcional: Actualizar la interfaz para reflejar la eliminación de posts
  var postContainer = document.getElementById("post-container");
  postContainer.innerHTML = "";
}

function publicarPost() {
  var postText = document.getElementById("post-text").value;
  var username = localStorage.getItem('username');

  setInterval(function () {
    var currentTime = new Date();
    horaPublicacion = currentTime;
    document.getElementById("timestamp").textContent =
      obtenerMarcaTiempo(currentTime);
  }, 60000);

  var inputFile = document.getElementById("dropzone-file");

  if (postText.trim() !== "" || inputFile.files.length > 0) {
    var timestamp = obtenerMarcaTiempo();
    var postContainer = document.getElementById("post-container");
    var newPostDiv = document.createElement("div");
    newPostDiv.className = "bg-white rounded-md p-4";

    var post = {
      username: username,
      timestamp: obtenerMarcaTiempo(),
      postText: postText,
      likeCount: 0,
      // Otros campos del post...

      // Añadir información de la imagen si existe
      image: null
    };

    // Crear la estructura del nuevo elemento div utilizando DOM
    var postHeader = document.createElement("div");
    postHeader.className = "flex space-x-2";

    var imgElement = document.createElement("img");
    imgElement.src = "https://picsum.photos/200/300";
    imgElement.alt = "";
    imgElement.className = "rounded-full w-10 h-10";

    var userDiv = document.createElement("div");
    userDiv.className = "flex flex-col";

    var userName = document.createElement("h3");
    userName.className = "text-gray-500 font-semibold text-sm";
    userName.textContent = username;

    var timestampDiv = document.createElement("div");
    timestampDiv.className = "flex space-x-2 px-2 justify-center items-center";

    var timestampText = document.createElement("div");
    timestampText.className = "text-blue-500 text-sm";
    timestampText.id = "timestamp";
    timestampText.textContent = timestamp;

    var likeIcon = document.createElement("div");
    likeIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                class="w-4 h-4">
                <path fill-rule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM8.547 4.505a8.25 8.25 0 1011.672 8.214l-.46-.46a2.252 2.252 0 01-.422-.586l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.211.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.654-.261a2.25 2.25 0 01-1.384-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.279-2.132z"
                    clip-rule="evenodd" />
            </svg>
        `;

    // Agregar los elementos al DOM
    timestampDiv.appendChild(timestampText);
    timestampDiv.appendChild(likeIcon);

    userDiv.appendChild(userName);
    userDiv.appendChild(timestampDiv);

    postHeader.appendChild(imgElement);
    postHeader.appendChild(userDiv);

    newPostDiv.appendChild(postHeader);

    var postContent = document.createElement("div");
    postContent.className = "mt-2 text-gray-500";

    var postTextParagraph = document.createElement("p");
    postTextParagraph.textContent = postText;

    postContent.appendChild(postTextParagraph);

    if (inputFile.files.length > 0) {
      var file = inputFile.files[0];
      var reader = new FileReader();
      var imageContainer = document.createElement("div");
      imageContainer.className = "py-1 w-full h-[500px]";

      var uploadedImage = document.createElement("img");
      uploadedImage.id = "uploaded-image";
      uploadedImage.className = "w-full h-full object-contain";
      imageContainer.appendChild(uploadedImage);

      postContent.appendChild(imageContainer);
      reader.onload = function (e) {
        // Asignar la información de la imagen al objeto post
        post.image = e.target.result;

        // Guardar el post en localStorage después de leer la imagen
        guardarPostLocalmente(post);

        // Imprimir en la consola los posts actuales en localStorage
        console.log('Posts almacenados:', obtenerPostsLocalmente());
      };
      reader.readAsDataURL(file);
    } else {
      // Guardar el post en localStorage si no hay imagen
      guardarPostLocalmente(post);

      // Imprimir en la consola los posts actuales en localStorage
      console.log('Posts almacenados:', obtenerPostsLocalmente());
    
    }


    newPostDiv.appendChild(postContent);
    var postcount = document.createElement("div");
    postcount.className = "flex mt-4 space-x-2 justify-between";
    var postlikes = document.createElement("div");
    postlikes.className = "flex space-x-0";
    var likes = document.createElement("div");

    postcount.appendChild(postlikes);
    newPostDiv.appendChild(postcount);

    var hrElement = document.createElement("hr");
    hrElement.className = "mt-2";
    newPostDiv.appendChild(hrElement);

    var interactionDiv = document.createElement("div");
    interactionDiv.className = "flex justify-between m-2";

    var likeCommentDiv = document.createElement("div");
    likeCommentDiv.className = "flex space-x-2";

    var likeContainer = document.createElement("div");
    likeContainer.className = "flex space-x-2 cursor-pointer";

    var likeIcon2 = document.createElement("div");
    likeIcon2.innerHTML = `
    <i class="fa-regular fa-thumbs-up"></i>
    `;

    var likeText = document.createElement("div");
    //likeText.className = "text-gray-500";
    likeText.innerHTML = `
    <span class="text-gray-500">Me gusta</span>
    `;

    likeContainer.appendChild(likeIcon2);
    likeContainer.appendChild(likeText);

    var likeCount = 0;

    // Referenciar el elemento del contador de likes
    var likeCountSpan = document.createElement("span");
    likeCountSpan.className = "text-gray-500 font-bold text-base pl-2 ml-1";
    // Agregar evento de clic al botón "Me gusta"
    likeContainer.addEventListener("click", function () {
      // Alternar entre 0 y 1

      likeCount = 1 - likeCount;

      // Actualizar el texto del contador de likes o ocultarlo si está en 0
      likeCountSpan.textContent = likeCount === 1 ? "1" : "";
      if (likeCount === 1) {
        // Configurar el elemento de likes cuando el contador es 1
        likes.className = "bg-blue-500 rounded-full";
        likes.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-white p-1">
                        <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                    </svg>
                `;
        var youSpan = document.createElement("span");
        youSpan.textContent = "You";
        youSpan.className = "pl-2";
        postlikes.appendChild(likes);
        postlikes.appendChild(youSpan);
        postlikes.appendChild(likeCountSpan);
        likeText.innerHTML = `
        <span class="text-blue-500">Me gusta</span>
        `;
        likeIcon2.innerHTML = `
        <i class="fa-solid fa-thumbs-up text-blue-500 "></i>        
        `;
      } else {
        postlikes.innerHTML = "";
        likeIcon2.innerHTML = `
        <i class="fa-regular fa-thumbs-up"></i>
        `;
        likeText.innerHTML = `
        <span class="text-gray-500">Me gusta</span>
        `;
      }
    });

    likeCommentDiv.appendChild(likeContainer);

    var commentDiv = document.createElement("div");
    commentDiv.className = "flex space-x-2";

    var commentIcon = document.createElement("div");
    commentIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-6 h-6 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
            </svg>
        `;

    var cmtext = document.createElement("div");
    cmtext.className = "text-gray-500 cursor-pointer";
    cmtext.textContent = "Comentarios";

    commentDiv.appendChild(cmtext);
    commentDiv.appendChild(cmtext);

    var shareDiv = document.createElement("div");
    shareDiv.className = "flex space-x-2";

    var shareIcon = document.createElement("div");
    shareIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                class="w-6 h-6 text-gray-500">
                <path fill-rule="evenodd"
                    d="M14.47 2.47a.75.75 0 011.06 0l6 6a.75.75 0 010 1.06l-6 6a.75.75 0 11-1.06-1.06l4.72-4.72H9a5.25 5.25 0 100 10.5h3a.75.75 0 010 1.5H9a6.75 6.75 0 010-13.5h10.19l-4.72-4.72a.75.75 0 010-1.06z"
                    clip-rule="evenodd" />
            </svg>
        `;

    var shareText = document.createElement("div");
    shareText.className = "text-gray-500 cursor-pointer";
    shareText.textContent = "Compartir";

    shareDiv.appendChild(shareIcon);
    shareDiv.appendChild(shareText);

    interactionDiv.appendChild(likeCommentDiv);
    interactionDiv.appendChild(commentDiv);
    interactionDiv.appendChild(shareDiv);

    newPostDiv.appendChild(interactionDiv);

    var hrElement2 = document.createElement("hr");
    hrElement2.className = "mb-2";
    newPostDiv.appendChild(hrElement2);

    var commentInputDiv = document.createElement("div");
    commentInputDiv.className = "flex space-x-2 items-center mt-4";

    var profileImageDiv = document.createElement("div");
    profileImageDiv.className = "relative inline-block";

    var profileImage = document.createElement("img");
    profileImage.src = "https://picsum.photos/200";
    profileImage.className = "w-8 h-8 rounded-full";
    profileImageDiv.appendChild(profileImage);

    var statusDot = document.createElement("span");
    statusDot.className =
      "obsolute w-3 h-3 rounded-full bg-green-500 border-2 border-white absolute bottom-0 right-0";
    profileImageDiv.appendChild(statusDot);

    var commentInput = document.createElement("div");
    commentInput.className = "w-full";

    var inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.className =
      "bg-gray-100 rounded-lg px-2 py-2 w-full focus:outline-none";
    inputElement.placeholder = "Write a Comment";

    inputElement.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        crearComentario();
      }
    });

    function crearComentario() {
      var comentario = inputElement.value;
      var username = localStorage.getItem('username');

      var nuevoComentarioDiv = document.createElement("div");
      nuevoComentarioDiv.className = "pt-2 flex space-x-4 ml-4";

      var perfilImage = document.createElement("img");
      perfilImage.src = "https://picsum.photos/200/300";
      perfilImage.className = "w-8 h-8 rounded-full";
      nuevoComentarioDiv.appendChild(perfilImage);

      var comentarioContenidoDiv = document.createElement("div");
      comentarioContenidoDiv.className =
        "flex flex-col space-y-1 text-gray-500 bg-gray-100 py-2 px-2 rounded-lg";

      var usuarioSpan = document.createElement("span");
      usuarioSpan.id = "user";
      usuarioSpan.className = "font-semibold text-sm";
      usuarioSpan.textContent = username;
      comentarioContenidoDiv.appendChild(usuarioSpan);

      var comentarioSpan = document.createElement("span");
      comentarioSpan.id = "Comentario";
      comentarioSpan.textContent = comentario;
      comentarioContenidoDiv.appendChild(comentarioSpan);

      nuevoComentarioDiv.appendChild(comentarioContenidoDiv);

      commentInputDiv.parentNode.insertBefore(
        nuevoComentarioDiv,
        commentInputDiv
      );
      inputElement.value = "";
    }

    commentInput.appendChild(inputElement);

    commentInputDiv.appendChild(profileImageDiv);
    commentInputDiv.appendChild(commentInput);

    newPostDiv.appendChild(commentInputDiv);

    // Insertar el nuevo elemento antes del primer hijo del contenedor
    postContainer.insertBefore(newPostDiv, postContainer.firstChild);

    // Limpiar el área de texto
    document.getElementById("post-text").value = "";

    // Mostrar la imagen si se ha cargado
    if (inputFile.files.length > 0) {
      var file = inputFile.files[0];
      var reader = new FileReader();

      reader.onload = function (e) {
        // Mostrar la imagen en el modal
        document.getElementById("uploaded-image").src = e.target.result;
      };

      // Leer la imagen como una URL de datos
      reader.readAsDataURL(file);
    }
    document.getElementById("dropzone-file").value = "";
  } else {
    alert("Por favor, escribe un mensaje o sube una imagen antes de publicar.");
  }
}

function guardarPostLocalmente(post) {
  // Obtener posts actuales almacenados en localStorage
  var posts = obtenerPostsLocalmente();

  // Agregar el nuevo post al array
  posts.push(post);

  // Guardar el array actualizado en localStorage
  localStorage.setItem('posts', JSON.stringify(posts));
}

function obtenerPostsLocalmente() {
  // Obtener posts almacenados en localStorage
  var posts = localStorage.getItem('posts');

  // Si no hay posts almacenados, devolver un array vacío
  return posts ? JSON.parse(posts) : [];
}

// Llamada a obtenerPostsLocalmente al cargar la página
window.onload = function () {
  console.log('Posts almacenados:', obtenerPostsLocalmente());
};

function obtenerMarcaTiempo() {
  var ahora = new Date();
  var horaPublicacion = new Date(); // Utiliza la hora de publicación del post, deberías almacenarla cuando se crea el post
  var diferenciaEnMilisegundos = ahora - horaPublicacion;
  var minutosTranscurridos = Math.floor(diferenciaEnMilisegundos / (1000 * 60));

  return `Hace ${minutosTranscurridos} minutos`;
}

let currentStoryIndex = 0;

function uploadStory() {
  const fileInput = document.getElementById("fileInput");
  const storiesContainer = document.getElementById("storiesContainer");
  const storiesCloser = document.getElementById("storiesZoom");
  const file = fileInput.files[0];
  var username = localStorage.getItem('username');

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const imageUrl = e.target.result;
      const storyElement = document.createElement("div");
      storyElement.classList.add(
        "carousel-item",
        "story",
        "bg-gray-100",
        "w-40",
        "h-80",
        "rounded-md",
        "relative",
        "shadow-sm",
        "pr-4",
        "cursor-pointer"
      );

      storyElement.innerHTML = `
            <img src="${imageUrl}" class="rounded-md object-fill h-full w-full brightness-50 hover:brightness-75" alt="">
            <img src="https://picsum.photos/200/300" class="absolute top-4 left-1/4 -translate-x-1/2 w-10 h-10 rounded-full outline outline-offset-2 outline-2 outline-blue-500" alt="">
            <h1 class="absolute bottom-4 left-1/4 -translate-x-1/2 text-white font-bold text-sm">${username}</h1>
          `;
      storiesContainer.appendChild(storyElement);
      const storiesZoom = storyElement.cloneNode(true);
      storiesCloser.appendChild(storiesZoom);
    };

    reader.readAsDataURL(file);
  }

  storiesContainer.addEventListener("click", function () {
    openmdStories();
  });
}

const inputStorie = document.getElementById("commentstories");
inputStorie.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    crearComentarioStorie();
    closemdStories();
  }
});

const likeReact = document.getElementById("like");
likeReact.addEventListener("click", function () {
  const container = document.getElementById("notireaccion");
  const divmain = document.createElement("div");
  divmain.classList.add("hover:bg-gray-300", "cursor-pointer", "py-3");

  // Crea la estructura interna del comentario
  divmain.innerHTML = `
  <div class="flex flex-row">
  <img class="rounded-full w-14 h-14" src="https://picsum.photos/200" alt="">
  <div class="pr-4">
      <button
          class="flex items-center justify-center bg-blue-500 rounded-full h-7 w-7 z-20 absolute top-36 left-12">
          <svg class="text-white text-center" xmlns="http://www.w3.org/2000/svg"
              width="16" height="16" fill="currentColor" class="bi bi-people-fill"
              viewBox="0 0 16 16">
              <path
                  d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
          </svg>
      </button>
  </div>
  <div class="justify-center items-center">
      <div class="flex flex-row">
          <p class="text-sm pr-1"> Han reaccionado con:</p>
          <svg width='30' height='30' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><rect width='20' height='20' stroke='none' fill='#000000' opacity='0'/>
              <g transform="matrix(0.25 0 0 0.25 10 10)" >
              <g transform="matrix(1 0 0 1 8.5 -1.04)" >
              <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(250,239,222); fill-rule: nonzero; opacity: 1;" transform=" translate(-40.5, -30.96)" d="M 55 50.937 C 57.134 50.931999999999995 59.039 49.57 59.729 47.562 C 60.43 45.522 59.73 43.242 58 41.937 C 60.33 41.413 62 39.326 62 36.937 C 62 34.547999999999995 60.33 32.461 58 31.936999999999998 C 58.335 31.607999999999997 60.493 29.391 60 26.936999999999998 C 59.55 24.697999999999997 57.476 22.987 55 22.936999999999998 L 40.812 22.936999999999998 C 41.471999999999994 19.846999999999998 42.601 11.942999999999998 38.498999999999995 6.328999999999997 C 37.471 4.921 36.488 2.702 34 3 C 31.977 3.242 30.342 5.382 30 6 L 30.156 15 C 30.156 16.911 27.656 24.219 25 26.938000000000002 C 24.269 27.686000000000003 22.279 28.823000000000004 19 28.938000000000002 L 19 51.938 C 19.246 53.013000000000005 19.688 54.626000000000005 21 55.938 C 24 58.938 31 58.938 32 58.938 L 47 58.938 C 52.583 58.938 55.388 57.150000000000006 55.917 54.521 C 56.004 54.087 56.187 52.749 55 50.937 z" stroke-linecap="round" />
              </g>
              <g transform="matrix(1 0 0 1 -5.02 -13.22)" >
              <path style="stroke: rgb(255,247,240); stroke-width: 5; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform=" translate(-26.98, -18.78)" d="M 21.5 31.24 C 24.692 30.645999999999997 26.308 29.238 26.788 28.747 C 29.5 26.208 32.456 19.708 32.456 15.062 L 32.456 6.329" stroke-linecap="round" />
              </g>
              <g transform="matrix(1 0 0 1 -21 10.5)" >
              <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(133,203,248); fill-rule: nonzero; opacity: 1;" transform=" translate(-11, -42.5)" d="M 7 26 L 16 26 C 17.657 26 19 27.166 19 28.605 L 19 56.394000000000005 C 19 57.833 17.657 59 16 59 L 7 59 C 4.791 59 3 57.445 3 55.525999999999996 L 3 29.473 C 3 27.555 4.791 26 7 26 z" stroke-linecap="round" />
              </g>
              <g transform="matrix(1 0 0 1 -26.5 10.5)" >
              <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(159,221,255); fill-rule: nonzero; opacity: 1;" transform=" translate(-5.5, -42.5)" d="M 5.5 26 C 6.879 26 8 27.121 8 28.5 L 8 56.5 C 8 57.878 6.879 59 5.5 59 C 4.121 59 3 57.878 3 56.5 L 3 28.5 C 3 27.121 4.121 26 5.5 26 z" stroke-linecap="round" />
              </g>
              <g transform="matrix(1 0 0 1 -24 10.5)" >
              <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(141,108,159); fill-rule: nonzero; opacity: 1;" transform=" translate(-8, -42.5)" d="M 9 29 L 7 29 C 6.449 29 6 29.449 6 30 C 6 30.551 6.449 31 7 31 L 9 31 C 9.551 31 10 30.551 10 30 C 10 29.449 9.551 29 9 29 z M 9 34 L 7 34 C 6.449 34 6 34.449 6 35 C 6 35.551 6.449 36 7 36 L 9 36 C 9.551 36 10 35.551 10 35 C 10 34.449 9.551 34 9 34 z M 9 39 L 7 39 C 6.449 39 6 39.449 6 40 C 6 40.551 6.449 41 7 41 L 9 41 C 9.551 41 10 40.551 10 40 C 10 39.449 9.551 39 9 39 z M 9 44 L 7 44 C 6.449 44 6 44.449 6 45 C 6 45.551 6.449 46 7 46 L 9 46 C 9.551 46 10 45.551 10 45 C 10 44.449 9.551 44 9 44 z M 9 49 L 7 49 C 6.449 49 6 49.449 6 50 C 6 50.551 6.449 51 7 51 L 9 51 C 9.551 51 10 50.551 10 50 C 10 49.449 9.551 49 9 49 z M 9 54 L 7 54 C 6.449 54 6 54.449 6 55 C 6 55.551 6.449 56 7 56 L 9 56 C 9.551 56 10 55.551 10 55 C 10 54.449 9.551 54 9 54 z" stroke-linecap="round" />
              </g>
              <g transform="matrix(1 0 0 1 6 24.5)" >
              <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(239,216,190); fill-rule: nonzero; opacity: 1;" transform=" translate(-38, -56.5)" d="M 51 59 L 26 59 L 23 57 L 20 54 L 56 54 L 54 57 z" stroke-linecap="round" />
              </g>
              <g transform="matrix(1 0 0 1 8.5 -1)" >
              <path style="stroke: rgb(141,108,159); stroke-width: 2; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform=" translate(-40.5, -31)" d="M 55 51 C 57.134 50.995 59.039 49.633 59.729 47.625 C 60.43 45.585 59.731 43.305 58 42 C 60.33 41.476 62 39.389 62 37 C 62 34.611 60.33 32.524 58 32 C 58.335 31.671 60.493 29.454 60 27 C 59.55 24.761 57.476 23.05 55 23 L 40.349000000000004 23 C 40.873000000000005 20.373 42.397000000000006 11.308 37.62200000000001 5.917000000000002 C 36.618 4.782 35.313 3 32.956 3 C 30.466 3 30.012 5.015 30 6.062 L 30 15.062000000000001 C 30 18 27.656 24.281 25 27 C 24.269 27.748 22.279 28.885 19 29 L 19 54 C 19.672 54.829 20.545 55.752 21.715 56.546 C 25.359 59.019 30.016 59 32 59 L 47 59 C 52.583 59 55.388 57.212 55.917 54.583 C 56.004 54.15 56.187 52.811 55 51 z" stroke-linecap="round" />
              </g>
              <g transform="matrix(1 0 0 1 -21 10.5)" >
              <path style="stroke: rgb(141,108,159); stroke-width: 2; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform=" translate(-11, -42.5)" d="M 5 59 L 17 59 C 18.105 59 19 58.105 19 57 L 19 28 C 19 26.895 18.105 26 17 26 L 5 26 C 3.895 26 3 26.895 3 28 L 3 57 C 3 58.104 3.895 59 5 59 z" stroke-linecap="round" />
              </g>
              </g>
          </svg>
      </div>
      <p class="text-md">A tu foto.</p>
  </div>
</div>
  `;
  container.appendChild(divmain);
  closemdStories();

});


const loveReact = document.getElementById("love");
loveReact.addEventListener("click", function () {
  const container2 = document.getElementById("notireaccion");
  const divmain2 = document.createElement("div");
  divmain2.classList.add("hover:bg-gray-300", "cursor-pointer", "py-3");

  // Crea la estructura interna del comentario
  divmain2.innerHTML = `
  <div class="flex flex-row">
  <img class="rounded-full w-14 h-14" src="https://picsum.photos/200" alt="">
  <div class="pr-4">
      <button
          class="flex items-center justify-center bg-blue-500 rounded-full h-7 w-7 z-20 absolute top-36 left-12">
          <svg class="text-white text-center" xmlns="http://www.w3.org/2000/svg"
              width="16" height="16" fill="currentColor" class="bi bi-people-fill"
              viewBox="0 0 16 16">
              <path
                  d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
          </svg>
      </button>
  </div>
  <div class="justify-center items-center">
      <div class="flex flex-row">
          <p class="text-sm pr-1"> Han reaccionado con:</p>
          <svg  width='30' height='30' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><rect width='20' height='20' stroke='none' fill='#000000' opacity='0'/>


                                        <g transform="matrix(0.4 0 0 0.4 10 10)" >
                                        <g transform="matrix(1 0 0 1 0 -0.06)" >
                                        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(247,143,143); fill-rule: nonzero; opacity: 1;" transform=" translate(-20, -19.94)" d="M 20.023 35.377 C 17.729 33.522 2.5 20.933 2.5 13.739 C 2.5 8.645 6.624 4.5 11.692 4.5 C 14.943 4.5 17.889 6.182 19.57 8.998000000000001 L 20 9.717 L 20.429 8.998000000000001 C 22.111 6.182 25.056 4.5 28.308 4.5 C 33.377 4.5 37.5 8.645 37.5 13.739 C 37.5 22.858 22.364 33.749 20.023 35.377 z" stroke-linecap="round" />
                                        </g>
                                        <g transform="matrix(1 0 0 1 0 0)" >
                                        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(199,67,67); fill-rule: nonzero; opacity: 1;" transform=" translate(-20, -20)" d="M 28.308 5 C 33.101 5 37 8.92 37 13.739 C 37 22.287 23.119 32.578 20.042 34.754000000000005 C 14.791 30.513 3 19.734 3 13.739 C 3 8.92 6.899 5 11.692 5 C 14.766 5 17.55 6.59 19.141 9.254 L 20 10.692 L 20.859 9.254 C 22.449 6.59 25.234 5 28.308 5 M 28.308 4 C 24.776 4 21.694 5.905 20 8.742 C 18.306 5.905 15.224 4 11.692 4 C 6.339 4 2 8.36 2 13.739 C 2 21.814 20 36 20 36 C 20 36 38 23.957 38 13.739 C 38 8.36 33.661 4 28.308 4 L 28.308 4 z" stroke-linecap="round" />
                                        </g>
                                        </g>
                                        </g>
          </svg>
      </div>
      <p class="text-md">A tu foto.</p>
  </div>
</div>
  `;
  container2.appendChild(divmain2);
  closemdStories();

});


const laughReact = document.getElementById("laugh");
laughReact.addEventListener("click", function () {
  const container3 = document.getElementById("notireaccion");
  const divmain3 = document.createElement("div");
  divmain3.classList.add("hover:bg-gray-300", "cursor-pointer", "py-3");

  // Crea la estructura interna del comentario
  divmain3.innerHTML = `
  <div class="flex flex-row">
  <img class="rounded-full w-14 h-14" src="https://picsum.photos/200" alt="">
  <div class="pr-4">
      <button
          class="flex items-center justify-center bg-blue-500 rounded-full h-7 w-7 z-20 absolute top-36 left-12">
          <svg class="text-white text-center" xmlns="http://www.w3.org/2000/svg"
              width="16" height="16" fill="currentColor" class="bi bi-people-fill"
              viewBox="0 0 16 16">
              <path
                  d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
          </svg>
      </button>
  </div>
  <div class="justify-center items-center">
      <div class="flex flex-row">
          <p class="text-sm pr-1"> Han reaccionado con:</p>
          <svg width='30' height='30' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><rect width='20' height='20' stroke='none' fill='#000000' opacity='0'/>


                                        <g transform="matrix(0.67 0 0 0.67 10 10)" >
                                        <g transform="matrix(1 0 0 1 0 0)" >
                                        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,239,94); fill-rule: nonzero; opacity: 1;" transform=" translate(-12, -12)" d="M 12 23.5 C 18.3513 23.5 23.5 18.3513 23.5 12 C 23.5 5.64873 18.3513 0.5 12 0.5 C 5.64873 0.5 0.5 5.64873 0.5 12 C 0.5 18.3513 5.64873 23.5 12 23.5 Z" stroke-linecap="round" />
                                        </g>
                                        <g transform="matrix(1 0 0 1 0 -5.57)" >
                                        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,249,191); fill-rule: nonzero; opacity: 1;" transform=" translate(-12, -6.43)" d="M 12 4.5 C 14.4844 4.50019 16.9109 5.25054 18.9618 6.65282 C 21.0127 8.05509 22.5923 10.0439 23.494 12.359 C 23.494 12.239 23.5 12.12 23.5 12 C 23.5 8.95001 22.2884 6.02494 20.1317 3.86827 C 17.9751 1.7116 15.05 0.5 12 0.5 C 8.95001 0.5 6.02494 1.7116 3.86827 3.86827 C 1.7116 6.02494 0.5 8.95001 0.5 12 C 0.5 12.12 0.5 12.239 0.506 12.359 C 1.40766 10.0439 2.98733 8.05509 5.0382 6.65282 C 7.08906 5.25054 9.51556 4.50019 12 4.5 L 12 4.5 Z" stroke-linecap="round" />
                                        </g>
                                        <g transform="matrix(1 0 0 1 0.62 4.12)" >
                                        <path style="stroke: rgb(25,25,25); stroke-width: 2.2388059701492535; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" transform=" translate(-12, -15.5)" d="M 5.369 13.5 C 6.00639 14.7061 6.96066 15.7155 8.12908 16.4196 C 9.29751 17.1237 10.6358 17.4957 12 17.4957 C 13.3642 17.4957 14.7025 17.1237 15.8709 16.4196 C 17.0394 15.7155 17.9936 14.7061 18.631 13.5" stroke-linecap="round" />
                                        </g>
                                        <g transform="matrix(1 0 0 1 0.62 0.62)" >
                                        <path style="stroke: rgb(25,25,25); stroke-width: 2.2388059701492535; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" transform=" translate(-12, -12)" d="M 12 23.5 C 18.3513 23.5 23.5 18.3513 23.5 12 C 23.5 5.64873 18.3513 0.5 12 0.5 C 5.64873 0.5 0.5 5.64873 0.5 12 C 0.5 18.3513 5.64873 23.5 12 23.5 Z" stroke-linecap="round" />
                                        </g>
                                        <g transform="matrix(1 0 0 1 -4.38 -4.13)" >
                                        <path style="stroke: rgb(25,25,25); stroke-width: 2.2388059701492535; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" transform=" translate(-7, -7.25)" d="M 5.5 8.00001 C 5.83856 7.52299 6.28932 7.13664 6.81252 6.87504 C 7.33571 6.61344 7.91525 6.48464 8.5 6.50001" stroke-linecap="round" />
                                        </g>
                                        <g transform="matrix(1 0 0 1 5.62 -4.13)" >
                                        <path style="stroke: rgb(25,25,25); stroke-width: 2.2388059701492535; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: round; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" transform=" translate(-17, -7.25)" d="M 18.5 8.00001 C 18.1614 7.52299 17.7107 7.13664 17.1875 6.87504 C 16.6643 6.61344 16.0847 6.48464 15.5 6.50001" stroke-linecap="round" />
                                        </g>
                                        </g>
                                        </g>
                                    </svg>
      </div>
      <p class="text-md">A tu foto.</p>
  </div>
</div>
  `;
  container3.appendChild(divmain3);
  closemdStories();

});

const AngryReact = document.getElementById("angry");
AngryReact.addEventListener("click", function () {
  const container4 = document.getElementById("notireaccion");
  const divmain4 = document.createElement("div");
  divmain4.classList.add("hover:bg-gray-300", "cursor-pointer", "py-3");

  // Crea la estructura interna del comentario
  divmain4.innerHTML = `
  <div class="flex flex-row">
  <img class="rounded-full w-14 h-14" src="https://picsum.photos/200" alt="">
  <div class="pr-4">
      <button
          class="flex items-center justify-center bg-blue-500 rounded-full h-7 w-7 z-20 absolute top-36 left-12">
          <svg class="text-white text-center" xmlns="http://www.w3.org/2000/svg"
              width="16" height="16" fill="currentColor" class="bi bi-people-fill"
              viewBox="0 0 16 16">
              <path
                  d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
          </svg>
      </button>
  </div>
  <div class="justify-center items-center">
      <div class="flex flex-row">
          <p class="text-sm pr-1"> Han reaccionado con:</p>
          <svg width='30' height='30' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><rect width='20' height='20' stroke='none' fill='#000000' opacity='0'/>


                                        <g transform="matrix(0.13 0 0 0.13 10 10)" >
                                        <g transform="matrix(1 0 0 1 0 -1)" id="Layer_1" >
                                        <circle style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,180,128); fill-rule: nonzero; opacity: 1;" cx="0" cy="0" r="60" />
                                        </g>
                                        <g transform="matrix(1 0 0 1 0.08 32.01)" id="Layer_1" >
                                        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(68,75,84); fill-rule: nonzero; opacity: 1;" transform=" translate(-64.08, -96.01)" d="M 77 103 C 75.9 103 74.9 102.4 74.3 101.4 C 72.2 97.5 68.3 95 64 95 C 59.7 95 55.7 97.4 53.7 101.4 C 52.900000000000006 102.9 51.1 103.4 49.7 102.7 C 48.300000000000004 102 47.7 100.10000000000001 48.400000000000006 98.7 C 51.4 92.7 57.4 89 64 89 C 70.6 89 76.6 92.7 79.7 98.6 C 80.5 100.1 79.9 101.89999999999999 78.4 102.6 C 77.9 102.9 77.5 103 77 103 z" stroke-linecap="round" />
                                        </g>
                                        <g transform="matrix(1 0 0 1 -14.71 -46.75)" id="Layer_1" >
                                        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" translate(-49.29, -17.25)" d="M 34.7 24.9 C 33.800000000000004 24.9 32.800000000000004 24.5 32.2 23.599999999999998 C 31.300000000000004 22.2 31.6 20.4 32.900000000000006 19.4 C 42.00000000000001 12.999999999999998 52.800000000000004 9.599999999999998 63.900000000000006 9.599999999999998 C 65.60000000000001 9.599999999999998 66.9 10.899999999999999 66.9 12.599999999999998 C 66.9 14.299999999999997 65.60000000000001 15.599999999999998 63.900000000000006 15.599999999999998 C 54.00000000000001 15.599999999999998 44.400000000000006 18.599999999999998 36.300000000000004 24.299999999999997 C 35.9 24.7 35.3 24.9 34.7 24.9 z" stroke-linecap="round" />
                                        </g>
                                        <g transform="matrix(1 0 0 1 -40.96 -30.87)" id="Layer_1" >
                                        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform=" translate(-23.04, -33.13)" d="M 22.3 37.1 C 21.7 37.1 21.1 36.9 20.6 36.5 C 19.3 35.5 18.900000000000002 33.7 19.900000000000002 32.3 C 20.400000000000002 31.599999999999998 20.900000000000002 30.9 21.400000000000002 30.299999999999997 C 22.400000000000002 28.999999999999996 24.3 28.799999999999997 25.6 29.799999999999997 C 26.900000000000002 30.799999999999997 27.1 32.699999999999996 26.1 34 C 25.6 34.6 25.200000000000003 35.2 24.700000000000003 35.8 C 24.2 36.7 23.2 37.1 22.3 37.1 z" stroke-linecap="round" />
                                        </g>
                                        <g transform="matrix(1 0 0 1 -18.86 1.84)" id="Layer_1" >
                                        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(68,75,84); fill-rule: nonzero; opacity: 1;" transform=" translate(-45.14, -65.84)" d="M 35.7 50.7 C 34.1 50.5 32.6 51.7 32.400000000000006 53.400000000000006 C 32.2 55.00000000000001 33.400000000000006 56.50000000000001 35.10000000000001 56.7 C 39.30000000000001 57.2 43.30000000000001 58.7 46.70000000000001 61 C 42.50000000000001 61.3 39.10000000000001 65.6 39.10000000000001 71 C 39.10000000000001 76.5 42.70000000000001 81 47.10000000000001 81 C 51.50000000000001 81 55.10000000000001 76.5 55.10000000000001 71 C 55.10000000000001 69.9 54.900000000000006 68.8 54.70000000000001 67.8 C 54.80000000000001 67.8 54.90000000000001 67.8 54.90000000000001 67.8 C 55.500000000000014 67.8 56.20000000000001 67.6 56.70000000000001 67.2 C 58.00000000000001 66.2 58.30000000000001 64.3 57.30000000000001 63 C 52.1 56.1 44.2 51.7 35.7 50.7 z" stroke-linecap="round" />
                                        </g>
                                        <g transform="matrix(1 0 0 1 18.91 1.85)" id="Layer_1" >
                                        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(68,75,84); fill-rule: nonzero; opacity: 1;" transform=" translate(-82.91, -65.85)" d="M 95.6 53.4 C 95.39999999999999 51.8 93.89999999999999 50.6 92.3 50.699999999999996 C 83.8 51.599999999999994 75.9 56.099999999999994 70.8 63 C 69.8 64.3 70.1 66.2 71.39999999999999 67.2 C 71.89999999999999 67.60000000000001 72.6 67.8 73.19999999999999 67.8 C 73.29999999999998 67.8 73.39999999999999 67.8 73.39999999999999 67.8 C 73.1 68.8 72.99999999999999 69.89999999999999 72.99999999999999 71 C 72.99999999999999 76.5 76.59999999999998 81 80.99999999999999 81 C 85.39999999999999 81 88.99999999999999 76.5 88.99999999999999 71 C 88.99999999999999 65.6 85.59999999999998 61.3 81.39999999999999 61 C 84.8 58.6 88.8 57.1 92.99999999999999 56.7 C 94.6 56.5 95.8 55 95.6 53.4 z" stroke-linecap="round" />
                                        </g>
                                        </g>
                                        </g>
                                    </svg>
      </div>
      <p class="text-md">A tu foto.</p>
  </div>
</div>
  `;
  container4.appendChild(divmain4);
  closemdStories();
});


function crearComentarioStorie() {
  // Obtén el valor del input
  const comentarioTexto = document.getElementById("commentstories").value;
  var username = localStorage.getItem('username');
  // Crea un nuevo elemento div que representa el comentario
  const nuevoComentario = document.createElement("div");
  nuevoComentario.classList.add("hover:bg-gray-300", "cursor-pointer", "py-3");

  // Crea la estructura interna del comentario
  nuevoComentario.innerHTML = `
      <div class="flex flex-row">
          <img class="rounded-full w-14 h-14" src="https://picsum.photos/200/300" alt="">
          <div class="pr-4">
              <button class="flex items-center justify-center bg-blue-500 rounded-full h-7 w-7 z-20 absolute top-36 left-12">
                  <svg class="text-white text-center" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16">
                      <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                  </svg>
              </button>
          </div>
          <div class="justify-center items-center">
              <p class="text-sm pr-1">${username}</p>
              <p class="text-blue-500 text-md">${comentarioTexto}</p>
          </div>
      </div>
  `;

  // Agrega el nuevo comentario al contenedor deseado (puedes ajustar esto según tu estructura HTML)
  const contenedorComentarios = document.getElementById("contentDivComment");
  contenedorComentarios.appendChild(nuevoComentario);

  // Limpia el valor del input después de crear el comentario
  document.getElementById("commentstories").value = "";
}

const uploadInput = document.getElementById("upload");
const filenameLabel = document.getElementById("filename");
const imagePreview = document.getElementById("image-preview");

// Check if the event listener has been added before
let isEventListenerAdded = false;

uploadInput.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (file) {
    filenameLabel.textContent = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.innerHTML = `<img src="${e.target.result}" class="max-h-48 rounded-lg mx-auto" alt="Image preview" />`;
      imagePreview.classList.remove(
        "border-dashed",
        "border-2",
        "border-gray-400"
      );

      // Add event listener for image preview only once
      if (!isEventListenerAdded) {
        imagePreview.addEventListener("click", () => {
          uploadInput.click();
        });

        isEventListenerAdded = true;
      }
    };
    reader.readAsDataURL(file);
  } else {
    filenameLabel.textContent = "";
    imagePreview.innerHTML = `<div class="bg-gray-200 h-48 rounded-lg flex items-center justify-center text-gray-500">No image preview</div>`;
    imagePreview.classList.add("border-dashed", "border-2", "border-gray-400");

    // Remove the event listener when there's no image
    imagePreview.removeEventListener("click", () => {
      uploadInput.click();
    });

    isEventListenerAdded = false;
  }
});

uploadInput.addEventListener("click", (event) => {
  event.stopPropagation();
});

// Función para abrir el modal
function openModal() {
  document.getElementById("myModal").classList.remove("hidden");
}

// Función para cerrar el modal
function closeModal() {
  document.getElementById("myModal").classList.add("hidden");
}

function openmdStories() {
  document.getElementById("mdStories").classList.remove("hidden");
}

// Función para cerrar el modal
function closemdStories() {
  document.getElementById("mdStories").classList.add("hidden");
}

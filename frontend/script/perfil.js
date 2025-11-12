const nomeElement = document.getElementById("nome");
const profilePicElement = document.querySelector(".profile-pic"); 
const fotosPerfilSection = document.querySelector(".fotos-perfil");

const statsElements = document.querySelectorAll(".profile-stats span");
let postCountElement = null;
let likeCountElement = null
let savedCountElement = null

statsElements.forEach(span => {
  const text = span.textContent.toLowerCase()
    if (text.includes('posts')) {
        postCountElement = span;
    } else if (text.includes('likes')) {
        likeCountElement = span;
    } else if (text.includes('salvos')) {
        savedCountElement = span
    }
});

async function buscarPerfil() {
    try {
        const token = localStorage.getItem("usuario"); 

        if (!token) {
            window.location.href = 'index.html'; 
            return;
        }

        const resposta = await fetch("http://localhost:3000/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!resposta.ok) {
            if (resposta.status === 401) {
                 window.location.href = 'index.html';
                 localStorage.removeItem("token");
                 return;
            }
            throw new Error(`Erro ao buscar usuário: ${resposta.status}`);
        }

        const data = await resposta.json();
        console.log("Usuário logado:", data);

        if (data.success) {
            const usuario = data.data;

            if (nomeElement) {
                nomeElement.textContent = usuario.nome;
            }
            if (profilePicElement && usuario.imagemPerfil) {
                profilePicElement.src = `http://localhost:3000${usuario.imagemPerfil}`;
            }
        } else {
            alert("Erro ao carregar usuário: " + data.message);
        }

    } catch (err) {
        console.error("Erro na busca do perfil:", err.message);
    }
}

async function buscarMeusLikes() {
    try {
        const token = localStorage.getItem("usuario");
        if (!token) return;

        const resposta = await fetch("http://localhost:3000/usuario/stats/meus-likes", { 
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!resposta.ok) {
            throw new Error("Erro ao buscar o total de likes");
        }

        const data = await resposta.json();

        if (data.success && likeCountElement) {
            const likesCount = data.totalLikes || 0; 
            likeCountElement.textContent = `${likesCount} Likes`;
        }

    } catch (err) {
        console.error("Erro ao carregar meus likes:", err.message);
        if (likeCountElement) {
            likeCountElement.textContent = `0 Likes`;
        }
    }
}

async function buscarMeusSalvos() {
    try {
        const token = localStorage.getItem("usuario"); 
        if (!token) return;

        const resposta = await fetch("http://localhost:3000/usuario/stats/meus-salvos", { 
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!resposta.ok) {
            throw new Error("Erro ao buscar o total de salvos");
        }

        const data = await resposta.json();

        if (data.success && savedCountElement) {
            const savedCount = data.totalSalvos || 0; 
            savedCountElement.textContent = `${savedCount} Salvos`;
        }

    } catch (err) {
        console.error("Erro ao carregar meus salvos:", err.message);
        if (savedCountElement) {
            savedCountElement.textContent = `0 Salvos`;
        }
    }
}

async function buscarMinhasFotos() {
    try {
        const token = localStorage.getItem("usuario");
        if (!token) return;

        const resposta = await fetch("http://localhost:3000/fotos/minhas", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!resposta.ok) {
            throw new Error("Erro ao buscar as fotos");
        }

        const data = await resposta.json();

        if (data.success && fotosPerfilSection) {
            fotosPerfilSection.innerHTML = '';

            const postCount = data.data.length;
            if (postCountElement) {
                postCountElement.textContent = `${postCount} Posts`; 
            }

            data.data.forEach(foto => {
                const container = document.createElement('div');
                container.classList.add('foto-item');

                container.addEventListener('click', () => {
                     window.location.href = `fotografia.html?id=${foto.id}`;
                });
                
                container.innerHTML = `<img src="http://localhost:3000${foto.url}" alt="${foto.descricao || 'Foto'}">`;

                fotosPerfilSection.appendChild(container);
            });
        }
    } catch (err) {
        console.error("Erro ao carregar minhas fotos:", err.message);
    }
}

async function buscarPerfilDeOutro(idUsuario) {
    try {
        const resposta = await fetch(`http://localhost:3000/usuario?id=${idUsuario}`);

        const data = await resposta.json();

        if (data.success) {
            const usuario = data.data;

            likeCountElement.textContent = usuario.total_likes_recebidos + " Likes";
            savedCountElement.textContent = usuario.total_favoritos_dados + " Salvos";

            if (nomeElement) nomeElement.textContent = usuario.nome;
            if (profilePicElement && usuario.imagemPerfil) {
                profilePicElement.src = `http://localhost:3000${usuario.imagemPerfil}`;
            }

            buscarFotosDoUsuario(idUsuario);

        } else {
            alert("Usuário não encontrado");
        }

    } catch (err) {
        console.error("Erro:", err.message);
    }
}

async function buscarFotosDoUsuario(idUsuario) {
  const resposta = await fetch(
    `http://localhost:3000/fotos/usuario?id=${idUsuario}`
  );
  const data = await resposta.json();

  fotosPerfilSection.innerHTML = "";

  data.data.forEach((foto) => {
    const container = document.createElement("div");
    container.classList.add("foto-item");
    container.innerHTML = `<img src="http://localhost:3000${foto.url}" alt="">`;
    container.addEventListener("click", () => {
      window.location.href = `fotografia.html?id=${foto.id}`;
    });
    fotosPerfilSection.appendChild(container);
    postCountElement.textContent = data.data.length  + " Posts";
  });
}


const urlParams = new URLSearchParams(window.location.search);
const usuarioQuery = urlParams.get("user");

if (usuarioQuery === "me") {
    document.addEventListener('DOMContentLoaded', () => {
        buscarPerfil();
        buscarMinhasFotos();
        buscarMeusLikes();
        buscarMeusSalvos();
    });
} else {
    document.addEventListener('DOMContentLoaded', () => {
        buscarPerfilDeOutro(usuarioQuery);
    });
}
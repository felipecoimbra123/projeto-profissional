const nomeElement = document.getElementById("nome");
const profilePicElement = document.querySelector(".profile-pic"); 
const fotosPerfilSection = document.querySelector(".fotos-perfil");

const statsElements = document.querySelectorAll(".profile-stats span");
let postCountElement = null;

statsElements.forEach(span => {
    if (span.textContent.toLowerCase().includes('posts')) {
        postCountElement = span;
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


const urlParams = new URLSearchParams(window.location.search);
const usuarioQuery = urlParams.get("user");

if (usuarioQuery === "me") {
    document.addEventListener('DOMContentLoaded', () => {
        buscarPerfil();
        buscarMinhasFotos();
    });
}
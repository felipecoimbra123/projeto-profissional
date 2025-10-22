const nomeElement = document.getElementById("nome");
// Use 'document.querySelector' se você não tiver um id na tag <img>, ou adicione um id.
const profilePicElement = document.querySelector(".profile-pic");
const fotosPerfilSection = document.querySelector(".fotos-perfil");

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
      throw new Error("Erro ao buscar usuário");
    }

    const data = await resposta.json();
    console.log("Usuário logado:", data);

    if (data.success) {
      const usuario = data.data; // objeto do usuário

      // 1. Definir o Nome do Usuário
      if (nomeElement) {
        nomeElement.textContent = usuario.nome;
      }

      // 2. Definir a Foto de Perfil
      if (profilePicElement && usuario.imagemPerfil) {
        // MUDANÇA: Usando 'imagemPerfil'
        profilePicElement.src = `http://localhost:3000${usuario.imagemPerfil}`;
      }

    } else {
      alert("Erro ao carregar usuário");
    }

  } catch (err) {
    console.error(err.message);
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
      fotosPerfilSection.innerHTML = ''; // Limpa as imagens de teste

      // Renderiza as imagens postadas
      data.data.forEach(foto => {
        const container = document.createElement('div');
        container.classList.add('foto-item');

        container.innerHTML = `<a href="fotografia.html?id=${foto.id}"><img src="http://localhost:3000${foto.url}" alt="${foto.descricao || 'Foto'}"></a>`;

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
  buscarPerfil();
  buscarMinhasFotos();
}
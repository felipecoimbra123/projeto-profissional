const nome = document.getElementById("nome");

async function buscarPerfil() {
  try {
    const token = localStorage.getItem("usuario");

    if (!token) {
        window.location.href = 'index.html'
        return
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
            const usuario = data.data[0];
            
            if (nome) {
                nome.textContent = usuario.nome
                } 
        }
    else {
            alert("Erro ao carregar usuário");
        }

  } catch (err) {
    console.error(err.message);
  }
}

const urlParams = new URLSearchParams(window.location.search);
const usuario = urlParams.get("user");

if (usuario === "me") {
  buscarPerfil();
}

const nomeElement = document.getElementById("nome");
const emailElement = document.getElementById("email");

async function buscarPerfil() {
    try {
        const token = localStorage.getItem("usuario");

        const resposta = await fetch("http://localhost:3000/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!resposta.ok) {
            throw new Error("Erro ao buscar usuário");
        }

        const data = await resposta.json();
        console.log("Usuário logado:", data);
        if (data.success) {
            const usuario = data.data[0];
            nomeElement.value = usuario.nome;
            emailElement.value = usuario.email;
        } else {
            alert("Erro ao carregar usuário");
        }
    } catch (err) {
        console.error(err.message);
    }
}

// a logica para carregar o nome do usuario na página de perfil.html
const token = localStorage.getItem("usuario");

// verifica o token
if (!token) {
    location.href = "index.html";
}

const formEditar = document.querySelector(".form-edicao-perfil");

if (formEditar) {
    formEditar.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        try {
            const response = await fetch('http://localhost:3000/usuario/',
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`},
                    body: JSON.stringify({ nome, email, senha }),
                }
            );

            const result = await response.json();

            if (response.ok) {
                alert("Usuário editado com sucesso!");
                window.location.href = "perfil.html?user=me";
            } else {
                alert("Erro ao editar usuário: " + (result.error || result.message || "Erro desconhecido."));
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Não foi possível conectar ao servidor.");
        }
    })
}
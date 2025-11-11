const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

async function carregarArtigo() {
    try {
        const resposta = await fetch(`http://localhost:3000/artigos/${id}`);
        const data = await resposta.json();

        if (!data.success) return;

        document.getElementById("titulo-artigo").innerText = data.artigo.titulo;
        document.getElementById("conteudo-artigo").innerText = data.artigo.conteudo;

        // Mostrar botão somente se o usuário for dono do artigo
        const token = localStorage.getItem("usuario");
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.id;

            if (userId === data.artigo.autorId) {
                document.getElementById("btn-editar-artigo").style.display = "block";
            }
        }

    } catch (error) {
        console.error("Erro ao carregar artigo:", error);
    }
}

document.getElementById("btn-editar-artigo").addEventListener("click", () => {
    window.location.href = `editarArtigo.html?id=${id}`;
});

carregarArtigo();

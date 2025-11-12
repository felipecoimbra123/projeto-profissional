const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

async function carregarArtigo() {
    try {
        const resposta = await fetch(`http://localhost:3000/artigos/${id}`);
        const data = await resposta.json();

        if (!data.success) return;

        document.getElementById("titulo-artigo").innerText = data.artigo.titulo;
        document.getElementById("conteudo-artigo").innerText = data.artigo.conteudo;

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

const btnExcluir = document.getElementById("btn-excluir-artigo");

btnExcluir.addEventListener("click", async () => {
    const confirmacao = confirm("Tem certeza que deseja excluir este artigo?");
    if (!confirmacao) return;

    try {
        const token = localStorage.getItem("usuario");

        const response = await fetch(`http://localhost:3000/artigos/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            alert("Artigo excluído com sucesso!");
            window.location.href = "artigos.html";
        } else {
            alert(data.message);
        }

    } catch (error) {
        console.error("Erro ao excluir:", error);
    }
});


carregarArtigo();

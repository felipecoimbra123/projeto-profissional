const id = new URLSearchParams(window.location.search).get("id");

const form = document.getElementById("form-editar-artigo");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo-artigo").value;
    const conteudo = document.getElementById("conteudo-artigo").value;
    const token = localStorage.getItem('usuario');

    const res = await fetch(`http://localhost:3000/artigos/${id}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ titulo, conteudo })
    });

    const data = await res.json();
    alert(data.message);
    window.location.href = `verArtigo.html?id=${id}`;
});

async function carregarArtigo() {
    const res = await fetch(`http://localhost:3000/artigos/${id}`);
    const data = await res.json();

    document.getElementById("titulo-artigo").value = data.artigo.titulo;
    document.getElementById("conteudo-artigo").value = data.artigo.conteudo;
}

carregarArtigo();

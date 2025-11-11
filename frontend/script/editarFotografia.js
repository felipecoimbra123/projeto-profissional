const id = new URLSearchParams(window.location.search).get("id");

const form = document.getElementById("form-editar-fotografia");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const token = localStorage.getItem('usuario');
    const descricao = document.getElementById("descricao-fotografia").value;
    formData.append("descricao", descricao);

    const res = await fetch(`http://localhost:3000/fotografia/${id}`, {
        method: "PUT",
        headers: { 
            "Authorization": `Bearer ${token}`
        },
        body: formData
    });

    const data = await res.json();

    window.location.href = `fotografia.html?id=${id}`;
});

async function carregarFotografia() {
    const res = await fetch(`http://localhost:3000/fotografia/${id}`);
    const data = await res.json();

    document.getElementById("url").value = data.fotografia.url;
    document.getElementById("conteudo-fotografia").value = data.fotografia.descricao;
}

carregarFotografia();

const form = document.querySelector('.form-post-fotografia');
const inputDescricao = document.getElementById('descricao');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const comentarioTexto = inputDescricao.value.trim();
    if (!comentarioTexto) return alert("O comentário não pode ser vazio.");

    const fotoId = new URLSearchParams(window.location.search).get("fotoid") || new URLSearchParams(window.location.search).get("id");
    if (!fotoId) return alert("Foto não encontrada.");

    const token = localStorage.getItem('usuario');
    if (!token) return alert("Você precisa estar logado para comentar!");

    try {
        const resposta = await fetch(`http://localhost:3000/fotos/${fotoId}/comentar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // garante que o token é enviado correto
            },
            body: JSON.stringify({ texto: comentarioTexto })
        });

        const data = await resposta.json();

        if (resposta.ok && data.success) {
            alert("Comentário publicado com sucesso!");
            window.location.href = `fotografia.html?id=${fotoId}`;
        } else {
            alert(`Erro ao comentar: ${data.message || data.error || 'Desconhecido'}`);
        }
    } catch (err) {
        console.error("Erro de conexão:", err);
        alert("Não foi possível alcançar o servidor.");
    }
});

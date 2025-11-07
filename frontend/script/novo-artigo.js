// /frontend/script/novo_artigo.js

document.addEventListener('DOMContentLoaded', () => {
    const formArtigo = document.getElementById('form-artigo');

    if (!formArtigo) return;

    formArtigo.addEventListener('submit', async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("usuario"); 

        if (!token) {
            alert("Você precisa estar logado para publicar um artigo.");
            window.location.href = 'index.html'; // Redireciona para o login ou página inicial
            return;
        }

        const titulo = document.getElementById('titulo').value;
        const categoria = document.getElementById('categoria').value;
        const conteudo = document.getElementById('conteudo').value;

        const artigoData = {
            titulo: titulo,
            categoria: categoria,
            conteudo: conteudo
        };

        try {
            const resposta = await fetch("http://localhost:3000/artigos/publicar", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(artigoData)
            });

            const data = await resposta.json();

            if (resposta.ok && data.success) {
                alert(data.message);
                // Opcional: Redirecionar para a página de artigos ou para a visualização do novo artigo
                window.location.href = 'artigos.html'; 
            } else {
                // Tratar erros de validação (400) ou outros erros do servidor (500)
                const errorMessage = data.error || data.message || "Erro desconhecido ao publicar o artigo.";
                alert("Falha na publicação: " + errorMessage);
                console.error("Erro do servidor:", data);
            }

        } catch (err) {
            console.error("Erro na requisição:", err);
            alert("Não foi possível conectar ao servidor. Tente novamente mais tarde.");
        }
    });
});
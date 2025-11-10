// /frontend/script/novo_artigo.js - Trecho modificado

document.addEventListener('DOMContentLoaded', () => {
    const formArtigo = document.getElementById('form-artigo');

    if (!formArtigo) return;

    formArtigo.addEventListener('submit', async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("usuario"); 

        if (!token) {
            alert("Você precisa estar logado para publicar um artigo.");
            window.location.href = 'index.html';
            return;
        }

        // --- MUDANÇA AQUI: Usar FormData ---
        const formData = new FormData(formArtigo);
        // O FormData coleta todos os campos do formulário (titulo, categoria, conteudo, imagemArtigo)
        // Você pode verificar se a imagem foi selecionada:
        const imagemArtigo = document.getElementById('imagemArtigo').files[0];
        if (!imagemArtigo) {
             alert("A Imagem de Capa é obrigatória!");
             return;
        }
        // O campo 'imagemArtigo' já está no FormData por causa do construtor.

        try {
            const resposta = await fetch("http://localhost:3000/artigos/publicar", {
                method: "POST",
                headers: {
                    // Remover "Content-Type": "application/json"
                    "Authorization": `Bearer ${token}`,
                },
                // --- MUDANÇA AQUI: Enviar FormData ---
                body: formData 
            });

            const data = await resposta.json();

            if (resposta.ok && data.success) {
                alert(data.message);
                window.location.href = 'artigos.html'; 
            } else {
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
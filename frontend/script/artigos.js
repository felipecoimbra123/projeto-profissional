const botaoAdicionarArtigo = document.querySelector('.link-post-artigos')

botaoAdicionarArtigo.addEventListener('click', (e) => {
    e.preventDefault()
    window.location.href = 'criarArtigo.html'
})

async function carregarArtigos() {
    try {
        const response = await fetch('http://localhost:3000/artigos');
        const data = await response.json();

        if (!data.success) return;

        const artigos = data.artigos;

        const containerTecnicas = document.querySelector('.div-tecnicas-fotografia');
        const containerHistoria = document.querySelector('.div-historia-fotografia');

        artigos.forEach(artigo => {
            const card = `
            <div class="card-artigo">
                <div class="imagem-artigo" style="background-image: url('${artigo.imagemArtigo}')"></div>
                <div class="conteudo-artigo">
                    <h3>${artigo.titulo}</h3>
                    <p>${artigo.conteudo.substring(0, 120)}...</p>
                    <button class="botao-ler" onclick="lerArtigo(${artigo.id})">Ler mais...</button>
                </div>
            </div>
            `;

            if (artigo.categoria === "tecnica") {
                containerTecnicas.insertAdjacentHTML("beforeend", card);
            } else if (artigo.categoria === "historia") {
                containerHistoria.insertAdjacentHTML("beforeend", card);
            }
        });

    } catch (error) {
        console.error('Erro ao carregar artigos:', error);
    }
}

function lerArtigo(id) {
    window.location.href = `verArtigo.html?id=${id}`;
}

carregarArtigos();

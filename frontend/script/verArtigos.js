async function carregarArtigo() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const response = await fetch(`http://localhost:3000/artigos/${id}`);
    const data = await response.json();

    if (!data.success) return;

    const artigo = data.artigo;

    document.getElementById("titulo-artigo").innerText = artigo.titulo;
    document.getElementById("conteudo-artigo").innerText = artigo.conteudo;
    document.getElementById("imagem-artigo").src = artigo.imagemArtigo;
}

carregarArtigo();

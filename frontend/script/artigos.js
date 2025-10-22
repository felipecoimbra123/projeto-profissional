const botaoAdicionarArtigo = document.querySelector('.link-post-artigos')

botaoAdicionarArtigo.addEventListener('click', (e) => {
    e.preventDefault()

    window.location.href = 'criarArtigo.html'
})
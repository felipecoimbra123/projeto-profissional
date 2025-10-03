const formPost = document.querySelector('.form-post-fotografia')

formPost.addEventListener('submit', async (e) => {
    e.preventDefault()

    const usuarioId = localStorage.getItem('usuario')
    if (!usuarioId) {
        alert('Você precisa estar logado para postar')
        return
    }

    const formData = new FormData(formPost)
    formData.append('autor_id', usuarioId)

    try {
        const res = await fetch('http://localhost:3000/fotos/postagem', {
            method: 'POST',
            body: formData
        })

        const data = await res.json()
        console.log(data)

        if (data.success) {
            window.location.href = 'index.html'
        } else {
            alert('Erro: ' + data.message)
        }
    } catch (err) {
        console.error('Erro ao criar post', err)
        alert('Ocorreu um erro ao criar o post')
    }
})
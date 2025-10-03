const formPost = document.querySelector('.form-post-fotografia')

formPost.addEventListener('submit', async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('usuario')
    if (!token) {
        alert('Você precisa estar logado para postar')
        return
    }

    const formData = new FormData(formPost)

    try {
        const res = await fetch('http://localhost:3000/fotos/postagem', {
            method: 'POST',
            body: formData,
            headers: { 'Authorization': `Bearer ${token}` }
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
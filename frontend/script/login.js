const formLogin = document.querySelector('.form-login')

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault()

    const nome = document.getElementById('nome').value
    const senha = document.getElementById('senha').value

    const response = await fetch('http://localhost:3000/usuario/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, senha })
    })

    const result = await response.json()

    if (result.success) {
        alert('Login bem-sucedido!');
        localStorage.setItem('usuario', JSON.stringify(result.data))
        window.location.href = 'index.html'
    } else {
        alert('Login não concluído')
    }
})
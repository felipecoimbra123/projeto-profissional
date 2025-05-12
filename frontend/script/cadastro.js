const formRegister = document.querySelector('.form-register')

formRegister.addEventListener('submit', async (e) => {
    e.preventDefault()

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const senhaConfirmacao = document.getElementById('senha-confirmacao').value;

    const response = await fetch('http://localhost:3000/usuario/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, senhaConfirmacao })
    })

    const result = await response.json();

    if (result.success) {
        alert('Cadastro bem-sucedido!');
        localStorage.setItem('usuario', JSON.stringify({id: result.results.insertId}))
        window.location.href = 'index.html'
    } else {
        alert('Cadastro não concluído')
    }
})
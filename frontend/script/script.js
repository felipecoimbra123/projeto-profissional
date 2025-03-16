const buttonRegister = document.querySelector('.button-register');
const buttonLogin = document.querySelector('.button-login');

if (buttonRegister) {
    buttonRegister.addEventListener('click', (e) => {
        e.preventDefault();

        const nomeInput = document.querySelector('#nome');
        const emailInput = document.querySelector('#email');
        const senhaInput = document.querySelector('#senha');
        const senhaConfirmacao = document.querySelector('#senha-confirmacao');

        if (nomeInput && emailInput && senhaInput && senhaConfirmacao) {
            if (nomeInput.value.trim() !== '' && emailInput.value.trim() !== '' && senhaInput.value.trim() !== '' && senhaConfirmacao.value.trim() !== '') {
                window.location.href = 'index.html';
            } else {
                alert('Preencha todas informações');
            }
        }
    });
}

if (buttonLogin) {
    buttonLogin.addEventListener('click', (e) => {
        e.preventDefault();

        const nomeInput = document.querySelector('#nome-login');
        const senhaInput = document.querySelector('#senha-login');

        if (nomeInput && senhaInput) {
            if (nomeInput.value.trim() !== '' && senhaInput.value.trim() !== '') {
                window.location.href = 'index.html';
            } else {
                alert('Preencha todas informações');
            }
        }
    });
}
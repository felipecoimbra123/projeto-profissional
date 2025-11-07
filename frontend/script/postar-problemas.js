document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedback-form');
    const input = document.getElementById('feedback-input');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const texto = input.value.trim();
        const token = localStorage.getItem('usuario');

        if (!token) {
            alert('Você precisa estar logado para enviar um feedback.');
            window.location.href = 'login.html';
            return;
        }
        if (texto.length === 0) {
            alert('Por favor, digite seu feedback antes de enviar.');
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/feedback', {
                method: 'POST',
                headers: {'Content-Type': 'application/json','Authorization': `Bearer ${token}`},
                body: JSON.stringify({ texto: texto })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert(data.message);
                form.reset();
            } else {
                alert(`Erro ao enviar feedback: ${data.message || data.error || 'Erro desconhecido.'}`);
            }
        } catch (error) {
            console.error('Erro na requisição de feedback:', error);
            alert('Houve um problema ao conectar com o servidor. Tente novamente.');
        }
    });
});
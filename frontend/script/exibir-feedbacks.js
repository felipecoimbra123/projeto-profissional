document.addEventListener('DOMContentLoaded', () => {
    const feedbackList = document.getElementById('feedback-list');

    const API_URL = 'http://localhost:3000/feedbacks';
    
    const fetchFeedbacks = async () => {
        feedbackList.innerHTML = '';
        
        const token = localStorage.getItem('usuario'); 
        
        if (!token) {
            feedbackList.innerHTML = '<p class="error-message">Você precisa estar logado para ver os feedbacks. Redirecionando para o login...</p>';
            setTimeout(() => {
                window.location.href = 'login.html'; 
            }, 2000);
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                renderFeedbacks(data.data);
            } else {
                feedbackList.innerHTML = `<p class="error-message">Erro ao carregar feedbacks: ${data.message || 'Erro desconhecido.'}</p>`;
                if (response.status === 401 || response.status === 403) {
                     feedbackList.innerHTML += '<p class="error-message">Verifique sua permissão.</p>';
                }
            }
        } catch (error) {
            console.error('Erro na requisição de feedbacks:', error);
            feedbackList.innerHTML = '<p class="error-message">Houve um problema ao conectar com o servidor. Tente novamente.</p>';
        }
    };

    const renderFeedbacks = (feedbacks) => {
        if (feedbacks.length === 0) {
            feedbackList.innerHTML = '<p class="no-feedback-message">Nenhum feedback encontrado.</p>';
            return;
        }

        feedbacks.forEach(feedback => {
            const feedbackItem = document.createElement('div');
            feedbackItem.classList.add('feedback-item');

            const dataFormatada = new Date(feedback.criadoEm).toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const imagemPerfilUrl = feedback.autorImagemPerfil && feedback.autorImagemPerfil !== 'null' 
                                  ? `http://localhost:3000${feedback.autorImagemPerfil}` 
                                  : '/assets/Social Picture.png';

            const imgPath = imagemPerfilUrl.startsWith('http') ? imagemPerfilUrl : imagemPerfilUrl;


            feedbackItem.innerHTML = `
                <div class="feedback-header">
                    <img src="${imgPath}" alt="Foto de Perfil de ${feedback.autorNome}" class="feedback-author-img">
                    <span class="feedback-author-name">${feedback.autorNome}</span>
                    <span class="feedback-date">${dataFormatada}</span>
                </div>
                <p class="feedback-text">${feedback.texto}</p>
            `;

            feedbackList.appendChild(feedbackItem);
        });
    };

    fetchFeedbacks();
});
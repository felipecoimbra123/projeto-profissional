const galleryContainer = document.querySelector('.photo-gallery');

async function buscarTodasAsFotos() {
    if (!galleryContainer) return; 

    try {
        const resposta = await fetch('http://localhost:3000/fotos');

        if (!resposta.ok) {
            throw new Error("Erro ao buscar as fotos da galeria");
        }

        const data = await resposta.json();
        
        if (data.success) {
            galleryContainer.innerHTML = ""; 

            data.data.forEach(foto => {
                const photoCard = document.createElement('div');
                photoCard.classList.add('photo-card');
                
                photoCard.setAttribute('data-photo-id', foto.id); 
                
                const imageUrl = `http://localhost:3000${foto.url}`;
                
                const autorId = foto.autorId || 'default';

                photoCard.innerHTML = `
                    <p class="photo-title">
                        <a href="perfil.html?user=${autorId}" class="autor-link">
                            ${foto.autorNome}
                        </a>
                    </p>
                    <img 
                        src="${ imageUrl}" 
                        alt="${foto.descricao || 'Foto postada por ' + foto.autorNome}" 
                        class="photo-img"
                    >
                `;

               // NO ARQUIVO /frontend/script/explorar.js

// ... (código anterior)

                photoCard.addEventListener('click', (event) => {
                    if (event.target.classList.contains('autor-link')) {
                        event.stopPropagation();
                        return;
                    }

                    window.location.href = `fotografia.html?id=${foto.id}`; 
                });

                galleryContainer.appendChild(photoCard);
            });
        }
    } catch (err) {
        console.error("Erro ao carregar todas as fotos:", err.message);
        galleryContainer.innerHTML = '<p>Não foi possível carregar as fotos. Tente novamente mais tarde.</p>';
    }
}

document.addEventListener('DOMContentLoaded', buscarTodasAsFotos);
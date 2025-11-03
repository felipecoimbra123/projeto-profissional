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
                
                photoCard.innerHTML = `
                    <p class="photo-title">${foto.autorNome}</p>
                    <img 
                        src="${imageUrl}" 
                        alt="${foto.descricao || 'Foto postada por ' + foto.autorNome}" 
                        class="photo-img"
                    >
                `;

                photoCard.addEventListener('click', () => {
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
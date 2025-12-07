const autorNomeElement = document.getElementById("autor-nome-h1"); 
const imagemElement = document.querySelector(".foto-e-interacoes img");

const likesElement = document.getElementById("like-count");
const savesElement = document.getElementById("saves-count");
const avaliacaoElement = document.getElementById("avaliacao-rating");
const comentariosContainer = document.querySelector(".section-comentario");

const btnLike = document.getElementById('like-btn');
const btnFavorite = document.getElementById('btn-favorite')

const linkPostComentario = document.querySelector('.link-post-fotografia');

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

async function buscarComentarios(fotoId) {
    if (!fotoId) return;

    try {
        const resposta = await fetch(`http://localhost:3000/fotos/${fotoId}/comentarios`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar comentários");
        }

        const data = await resposta.json();
        
        if (data.success && comentariosContainer) {
            comentariosContainer.innerHTML = "";
            
            data.data.forEach(comentario => {
                console.log(comentario)
                const article = document.createElement('article');
                article.classList.add('article-comentario');

                const imagemPerfilUrl = comentario.autorImagemPerfil 
                    ? `http://localhost:3000${comentario.autorImagemPerfil}` 
                    : '/assets/aleatorio.png'; 
                
                article.innerHTML = `
                    <div>
                        <img class="img-perfil-comentario" src="${imagemPerfilUrl}" alt="Foto de perfil de ${comentario.autorNome}">
                        <span>${comentario.autorNome}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="like-comentario" viewBox="0 0 16 16">
                            <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                        </svg>
                        <button class="btn-delete-comentario" data-id="${comentario.id}" style="margin-left:10px; cursor:pointer; background:none; border:none; color:red;" title="Excluir comentário">Excluir</button>
                    </div>
                    <p>${comentario.texto}</p>
                `;

                comentariosContainer.appendChild(article);
            });

            const botoesDelete = document.querySelectorAll('.btn-delete-comentario');
            botoesDelete.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const comentarioId = e.currentTarget.getAttribute('data-id');
                    const confirmacao = confirm('Quer mesmo excluir este comentário?');
                    if (!confirmacao) return;

                    try {
                        const token = localStorage.getItem('usuario');
                        if (!token) {
                            alert('Você precisa estar logado para excluir comentários.');
                            return;
                        }

                        const response = await fetch(`http://localhost:3000/comentarios/${comentarioId}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        const result = await response.json();

                        if (result.success) {
                            alert('Comentário excluído!');
                            buscarComentarios(fotoId);
                        } else {
                            alert('Erro ao excluir: ' + result.message);
                        }
                    } catch (error) {
                        console.error('Erro ao excluir comentário:', error);
                        alert('Erro ao excluir comentário');
                    }
                });
            });
        }
    } catch (err) {
        console.error("Erro ao carregar comentários:", err.message);
    }
}

async function buscarFotoUnica(fotoId) {
    if (!fotoId) {
        window.location.href = 'index.html'; 
        return;
    }
    
    const token = localStorage.getItem('usuario'); 

    if(linkPostComentario) {
        linkPostComentario.href = `post-comentario.html?fotoid=${fotoId}`;
    }
    
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const resposta = await fetch(`http://localhost:3000/fotos/${fotoId}`, {
            headers: headers
        });
        
        if (!resposta.ok) {
            throw new Error(`Erro ao buscar a foto: ${resposta.statusText}`);
        }
        
        const data = await resposta.json();
        
        if (data.success) {
            const foto = data.data;
            
            if (autorNomeElement) {
                autorNomeElement.textContent = foto.autorNome;
            }
            if (imagemElement) {
                imagemElement.src = `http://localhost:3000${foto.url}`;
                imagemElement.alt = foto.descricao || 'Foto';
            }
        
            if (likesElement) {
                likesElement.textContent = foto.curtidas !== undefined ? foto.curtidas : 0; 
            }
            if (savesElement) {
                savesElement.textContent = foto.totalSalvos !== undefined ? foto.totalSalvos : 0; 
            }
            
            if (btnLike) {
                if (foto.curtidoPeloUsuario === 1) {
                    btnLike.classList.add('active');
                } else {
                    btnLike.classList.remove('active');
                }
            }
            
            if (btnFavorite) {
                if (foto.salvoPeloUsuario === 1) {
                    btnFavorite.classList.add('active');
                } else {
                    btnFavorite.classList.remove('active');
                }
            }
            
            if (avaliacaoElement) {
            }
            
            await buscarComentarios(fotoId);
        } else {
            alert("Erro ao carregar a foto: " + data.message);
        }
    } catch (err) {
        console.error("Erro ao carregar a foto:", err.message);
    }
}

async function toggleLike(fotoId) {
    const token = localStorage.getItem('usuario');
    if (!token) {
        alert('Você precisa estar logado para curtir uma foto.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/fotos/${fotoId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erro na requisição de like.');
        }

        const data = await response.json();

        const likeCountElement = document.getElementById('like-count');
        let currentLikes = parseInt(likeCountElement.textContent || '0');
        
        if (data.liked === true) {
            likeCountElement.textContent = currentLikes + 1;
            document.getElementById('like-btn').classList.add('active'); 
        } else {
            likeCountElement.textContent = Math.max(0, currentLikes - 1); 
            document.getElementById('like-btn').classList.remove('active'); 
        }
    } catch (err) {
        console.error('Erro ao curtir/descurtir:', err);
        alert('Ocorreu um erro ao processar o like.');
    }
}

async function toggleFavorite(fotoId) {
    const token = localStorage.getItem('usuario')
    if (!token) {
        alert('Você precisa estar logado para curtir uma foto.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/fotos/${fotoId}/favorite`, {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}` 
            }
        });

        if (!response.ok) {
            throw new Error('Erro na requisição de like.');
        }

        const data = await response.json();

        const savesCountElement = document.getElementById('saves-count')
        let currentSaves = parseInt(savesCountElement.textContent || '0')

        if (data.saved === true) {
            savesCountElement.textContent = currentSaves + 1;
            document.getElementById('btn-favorite').classList.add('active'); 
        } else {
            savesCountElement.textContent = Math.max(0, currentSaves - 1); 
            document.getElementById('btn-favorite').classList.remove('active'); 
        }
    } catch (err) {
        console.error('Erro ao salvar/desalvar:', err);
        alert('Ocorreu um erro ao processar o salvamento.');
    }
}

document.getElementById("btn-editar-fotografia").addEventListener("click", () => {
    window.location.href = `editarFotografia.html?id=${id}`;
});

const btnExcluir = document.getElementById("btn-excluir-fotografia");

btnExcluir.addEventListener("click", async () => {
    const confirmacao = confirm("Tem certeza que deseja excluir essa fotografia?");
    if (!confirmacao) return;

    try {
        const token = localStorage.getItem("usuario");

        const response = await fetch(`http://localhost:3000/fotografia/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            alert("Fotografia Excluída com sucesso!");
            window.location.href = "perfil.html?user=me";
        } else {
            alert(data.message);
        }

    } catch (error) {
        console.error("Erro ao excluir:", error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const fotoId = urlParams.get("id"); 

    if (fotoId) {
        buscarFotoUnica(fotoId); 
        
        if (btnLike) {
            btnLike.addEventListener("click", () => toggleLike(fotoId));
        }
        if (btnFavorite) {
            btnFavorite.addEventListener("click", () => toggleFavorite(fotoId));
        }
        
    } else {
        window.location.href = 'index.html'; 
    }
});
const nome = document.getElementById("nome");

async function buscarPerfil() {
  try {
    const token = localStorage.getItem("usuario");

    const resposta = await fetch("http://localhost:3000/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!resposta.ok) {
      throw new Error("Erro ao buscar usuário");
    }

    const data = await resposta.json();
    console.log("Usuário logado:", data);
     if (data.success) {
            const usuario = data.data[0];
            nome.textContent = usuario.nome;
        } else {
            alert("Erro ao carregar usuário");
        }

  } catch (err) {
    console.error(err.message);
  }
}

const urlParams = new URLSearchParams(window.location.search);
const usuario = urlParams.get("user");

if (usuario === "me") {
  buscarPerfil();
}

// a logica para carregar o nome do usuario na página de perfil.html
const token = localStorage.getItem('token');

// verifica o token
if (token) {
    const usuario = jwt_decode(token);
    
    // so pra ver se o nome existe
    const nomeElement = document.getElementById('nome');
    if (nomeElement && usuario.nome) {
        nomeElement.textContent = usuario.nome;
    }
}

if (window.location.pathname.includes('editarPerfil.html')) {
    const formEditar = document.querySelector('.form-edicao-perfil');

    if (formEditar) {
            const usuario = jwt_decode(token);

            // preenche os campos do formulário SÓ na página de edição
            // so pra ver se o email existe
            const emailElement = document.getElementById('email');
            if (emailElement && usuario.email) {
                emailElement.value = usuario.email;
            }

            formEditar.addEventListener('submit', async (e) => {
                e.preventDefault();

                if (usuario && usuario.id) {
                    const nome = document.getElementById('nome').value;
                    const email = document.getElementById('email').value;
                    const senha = document.getElementById('senha').value;
                    
                    try {
                        const response = await fetch(`http://localhost:3000/usuario/${usuario.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}` 
                            },
                            body: JSON.stringify({ nome, email, senha })
                        });

                        const result = await response.json();

                        if (response.ok) {
                            alert("Usuário editado com sucesso!");
                            
                            if (result.token) {
                                localStorage.setItem('token', result.token);
                            }

                            window.location.href = 'perfil.html';
                        } else {
                            alert("Erro ao editar usuário: " + (result.error || result.message || 'Erro desconhecido.'));
                        }
                    } catch (error) {
                        console.error('Erro na requisição:', error);
                        alert('Não foi possível conectar ao servidor.');
                    }
                } else {
                    alert("Usuário não encontrado!");
                }
            });
    }
}
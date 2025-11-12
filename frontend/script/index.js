async function carregarFotosMaisCurtidas() {
    try {
        const resposta = await fetch('http://localhost:3000/fotos/maisCurtidas');
        // console.log('Status da resposta /fotos/maisCurtidas:', resposta.status);
        const data = await resposta.json();
        // console.log('Resposta JSON /fotos/maisCurtidas:', data);

        if (!data.success || data.fotos.length === 0) {
            console.warn('Nenhuma foto curtida encontrada.');
            return;
        }

        const container = document.getElementById('container-curtidas');
        if (!container) return;
        
        container.innerHTML = '';

        data.fotos.forEach(foto => {
            const link = document.createElement('a');
            link.href = `/frontend/pages/fotografia.html?id=${foto.id}`;
            const img = document.createElement('img');
            img.src = `http://localhost:3000${foto.url}`;
            img.alt = foto.descricao || 'Fotografia';
            link.appendChild(img);
            container.appendChild(link);
        });
        
    } catch (erro) {
        console.error('Erro ao carregar fotos mais curtidas:', erro);
    }
}

async function carregarFotosMaisSalvas() {
    try {
        const resposta = await fetch('http://localhost:3000/fotos/maisSalvas');
        const data = await resposta.json();

        if (!data.success || data.fotos.length === 0) {
            console.warn('Nenhuma foto salva encontrada.');
            return;
        }

        const container = document.getElementById('container-salvas');
        if (!container) return;
        
        container.innerHTML = '';

        data.fotos.forEach(foto => {
            const link = document.createElement('a');
            link.href = `/frontend/pages/fotografia.html?id=${foto.id}`;
            const img = document.createElement('img');
            img.src = `http://localhost:3000${foto.url}`;
            img.alt = foto.descricao || 'Fotografia';
            link.appendChild(img);
            container.appendChild(link);
        });
        
    } catch (erro) {
        console.error('Erro ao carregar fotos mais salvas:', erro);
    }
}

carregarFotosMaisCurtidas();
carregarFotosMaisSalvas();
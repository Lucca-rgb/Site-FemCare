// Adiciona um listener para o evento de submit no formulário de agendamento
document.getElementById('appointment-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página ao enviar o formulário

    // Captura os valores dos campos do formulário
    const estado = document.getElementById('estado').value;
    const ubs = document.getElementById('ubs').value;
    const especialidade = document.getElementById('especialidade').value;
    const month = document.getElementById('month').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    // Cria um objeto de agendamento com os valores coletados
    const appointment = { estado, ubs, especialidade, month, date, time };
    // Recupera os agendamentos do localStorage ou inicializa um novo array se não houver
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    // Adiciona o novo agendamento ao array
    appointments.push(appointment);
    // Armazena o array atualizado no localStorage
    localStorage.setItem('appointments', JSON.stringify(appointments));

    // Exibe um alerta de confirmação com os detalhes do agendamento
    alert(`Agendamento realizado com sucesso!\nUBS: ${ubs}\nEspecialidade: ${especialidade}\nData: ${date} ${month}\nHora: ${time}`);
    // Redireciona para a tela de agendamento
    window.location.href = 'tela-agendamento.html'; 
});

// Dados das UBSs organizados por estado
const ubsData = {
    SP: [
        { value: "ubs1", name: "UBS Vila Mariana - São Paulo" },
        { value: "ubs2", name: "UBS São Mateus - São Paulo" },
        { value: "ubs3", name: "UBS Itaquera - São Paulo" },
        { value: "ubs4", name: "UBS Mooca - São Paulo" }
    ],
    RJ: [
        { value: "ubs5", name: "UBS Centro - Rio de Janeiro" },
        { value: "ubs6", name: "UBS Jardim Botânico - Rio de Janeiro" }
    ],
    DF: [
        { value: "ubs7", name: "UBS Setor Norte - Brasília" },
        { value: "ubs8", name: "UBS Asa Sul - Brasília" }
    ],
    MG: [
        { value: "ubs9", name: "UBS Centro - Belo Horizonte" },
        { value: "ubs10", name: "UBS Pampulha - Belo Horizonte" }
    ],
    PE: [
        { value: "ubs11", name: "UBS Boa Viagem - Recife" },
        { value: "ubs12", name: "UBS Olinda - Pernambuco" }
    ],
    PR: [
        { value: "ubs13", name: "UBS Centro - Curitiba" },
        { value: "ubs14", name: "UBS Santa Felicidade - Curitiba" }
    ],
    RS: [
        { value: "ubs15", name: "UBS Centro - Porto Alegre" },
        { value: "ubs16", name: "UBS Cidade Baixa - Porto Alegre" }
    ]
};

// Função para filtrar as UBSs com base no estado selecionado
function filterUBS() {
    const estado = document.getElementById('estado').value;
    const ubsSelect = document.getElementById('ubs');

    // Limpa as opções existentes
    ubsSelect.innerHTML = '<option value="" disabled selected>Selecione uma UBS</option>';

    // Se o estado tiver UBSs cadastradas, adiciona as opções ao select
    if (estado && ubsData[estado]) {
        ubsData[estado].forEach(ubs => {
            const option = document.createElement('option');
            option.value = ubs.value;
            option.textContent = ubs.name;
            ubsSelect.appendChild(option);
        });
    } else {
        // Caso não tenha UBS para o estado selecionado
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Nenhuma UBS disponível para este estado';
        ubsSelect.appendChild(option);
    }
}

// Função para definir o dia selecionado em um calendário
function setSelectedDay(day) {
    const days = document.querySelectorAll('.day');
    days.forEach(d => {
        d.classList.remove('selected-day'); // Remove a classe de todos os dias
    });
    day.classList.add('selected-day'); // Adiciona a classe ao dia selecionado
}

// Função para confirmar o agendamento
function confirmAgendamento() {
    const selectedDate = document.getElementById('datas-disponiveis').value;
    const selectedMonth = document.getElementById('mes').value;
    const selectedTime = document.getElementById('horarios').value;
    const selectedSpecialization = document.getElementById('especializacao').value;

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!selectedDate || !selectedTime || !selectedSpecialization) {
        alert("Por favor, selecione uma data, horário e especialidade.");
        return;
    }

    // Alerta com mês, dia, horário e especialidade
    alert(`Agendamento confirmado!\nEspecialidade: ${selectedSpecialization}\nData: ${selectedDate}/${selectedMonth}\nHora: ${selectedTime}`);

    // Armazena as informações no localStorage (opcional)
    localStorage.setItem('selectedDay', selectedDate);
    localStorage.setItem('selectedTime', selectedTime);
    localStorage.setItem('selectedMonth', selectedMonth);
    localStorage.setItem('selectedSpecialization', selectedSpecialization);

    // Redireciona para a tela de agendamento
    window.location.href = 'tela-agendamento.html'; 
}

// Função para alternar a exibição do chat
function toggleChat() {
    const chatContainer = document.getElementById('chat-container');
    const chatBody = document.getElementById('chat-body');

    // Alterna a classe 'expanded' no container do chat
    chatContainer.classList.toggle('expanded');

    // Alterna a visibilidade do chat body
    chatBody.classList.toggle('hidden');
}

// Função para normalizar a entrada do usuário
function normalizeInput(input) {
    const synonyms = {
        "cadastrar": ["cadastro", "castro", "cadastra", "cadrastra", "cadstro", "cadrastr", "cadastar", "cadstrar", "cadastr", "cadatro", "cadstro", "cadatro", "csdastro"],
        "preencher": ["preenchido", "preenche", "preencher", "prenchido", "preenchido", "preenchi", "preenchar", "preencahr", "preenchudo", "prenchido", "preencgido"],
        "problemas": ["problemas", "dificuldades", "dificuldade", "problem", "problemas", "proplemas", "probelmas", "probrwmas", "probkemas", "provlemas"],
        "senha": ["senha", "senhas", "chave", "senah", "senha", "sehna", "sena", "senh", "swnha", "senhs", "srnha"],
        "agendar": ["agendar", "marcar", "reservar", "agendamento", "agendamento", "agend", "agenadar", "agenar", "agendamenti", "agrndamento", "agwndamento"],
        "data": ["data", "datas", "horário", "informação", "data", "dat", "daata", "datra", "dsta", "dats", "dara"],
        "dores": ["dores", "dor", "desconforto", "intenso", "dor aguda", "dore", "doro", "dores", "dorres", "dorws", "dpres"],
        "gravidez": ["gravidez", "gestação", "nausea", "enjoo", "gravidez", "gravid", "gravidez", "gravez", "grsvidez", "gravudez", "gravidwz"],
        "menstruação": ["menstruação", "colicas", "cólica", "sintomas menstruais", "período", "menstruacao", "menstruação", "menstrsacao", "menstruacao", "mwnstruacao", "mrnstruacao"],
        "ansiedade": ["ansiedade", "estresse", "depressão", "saúde mental", "angústia", "ansied", "ansiedade", "ansiedada", "ansuedade", "ansiedadw"],
        "funcionou": ["funcionou", "deu certo", "tá certo", "foi bem", "funcionou", "funcinou", "funcion", "funciona", "funcona", "funcionalismo", "foi bem", "foi legal", "funcioma", "fnciona"],
        "hormonais": ["hormônio", "hormonoterapia", "hormonal", "hormônios", "endocrinologia", "terapia hormonal", "equilíbrio hormonal", "tratamento hormonal", "alterações hormonais"]
    };

    // Divide a entrada em palavras e substitui sinônimos pela palavra normalizada
    let words = input.split(" ");
    return words.map(word => {
        for (const key in synonyms) {
            if (synonyms[key].includes(word)) {
                return key;
            }
        }
        return word;
    }).join(" ");
}

// Função para enviar uma mensagem no chat
function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const issue = chatInput.value.trim().toLowerCase(); // Captura a entrada do usuário
    const normalizedIssue = normalizeInput(issue); // Normaliza a entrada
    const chatResponse = document.getElementById('chat-response');

    // Se a entrada estiver vazia, não faz nada
    if (!normalizedIssue) return;

    // Cria e exibe a mensagem do usuário no chat
    const userMessage = document.createElement('div');
    userMessage.classList.add('chat-message', 'user');
    userMessage.textContent = issue;
    chatResponse.appendChild(userMessage);
    chatInput.value = ''; // Limpa o campo de entrada

    let responseText = ''; // Inicializa a resposta do bot

    // Respostas do bot baseadas na entrada normalizada
    if (normalizedIssue.includes('cadastrar') || normalizedIssue.includes('registrar')) {
        responseText = 'Para problemas de cadastro, por favor, verifique se você está utilizando o e-mail correto e se o formulário está preenchido corretamente. Se o problema persistir, entre em contato com o suporte técnico.';
    } else if (normalizedIssue.includes('preencher') || normalizedIssue.includes('feito') || normalizedIssue.includes('pronto')) {
        responseText = 'Se o formulário já estiver preenchido e o email estiver correto, mas você não conseguir prosseguir, verifique se recebeu algum código pelo seu email. Caso não tenha recebido, talvez sua caixa de entrada esteja cheia.';
    } else if (normalizedIssue.includes('cheio') || normalizedIssue.includes('email') || normalizedIssue.includes('lotado') || normalizedIssue.includes('ocupado') || normalizedIssue.includes('sobrecarregado')) {
        responseText = 'Se ela estiver cheia, você pode limpa-la apagando alguns emails antigos ou irrelevantes. Assim, logo você terá acesso ao código. Caso o problema permaneça, entre em contato com o suporte.';
    } else if (normalizedIssue.includes('problemas') || normalizedIssue.includes('senha') || normalizedIssue.includes('dificuldades') || normalizedIssue.includes('acesso')) {
        responseText = 'Se você está tendo problemas com a senha, utilize a opção "Esqueci minha senha" na página de login para redefini-la. Se precisar de mais ajuda, entre em contato com o suporte.';
    } else if (normalizedIssue.includes('agendar') || normalizedIssue.includes('marcar')) {
        responseText = 'Para problemas com agendamento, verifique se você está selecionando a data e hora corretas. Caso o problema continue, entre em contato com o suporte para assistência.';
    } else if (normalizedIssue.includes('data') || normalizedIssue.includes('horário') || normalizedIssue.includes('informação')) {
        responseText = 'Se as informações estão certas, mas você não conseguir prosseguir, verifique as especialidades médicas disponíveis, assim como as datas, horários e locais.';
    } else if (normalizedIssue.includes('tentei') || normalizedIssue.includes('nao funcionou') || normalizedIssue.includes('não deu certo') || normalizedIssue.includes('não consegui')) {
        responseText = 'Talvez a especialidade que selecionou não esteja disponível no momento. Tente novamente com uma data diferente ou com um novo horário. Caso não consiga, entre em contato com o suporte. Estamos aqui para ajudar!';
    } else if (normalizedIssue.includes('menstruação') || normalizedIssue.includes('colicas') || normalizedIssue.includes('cólica')) {
        responseText = 'A menstruação pode causar cólicas e desconforto. Tente aplicar uma bolsa de água quente na barriga e faça exercícios leves para amenizar os sintomas, não sou humana, mas cólicas são horríveis 😖, melhoras rainha! 👑';
    } else if (normalizedIssue.includes('gravidez') || normalizedIssue.includes('meses') || normalizedIssue.includes('nausea') || normalizedIssue.includes('enjoo')) {
        responseText = 'Durante a gravidez, é normal sentir enjoo. Comer pequenas porções de alimentos secos, como biscoitos, pode ajudar a aliviar esses sintomas. Fique tranquila, tenho certeza que seu bebê vai ser lindo 😇.';
    } else if (normalizedIssue.includes('dor') || normalizedIssue.includes('forte') || normalizedIssue.includes('desconforto')) {
        responseText = 'Sintomas como dor e cansaço são comuns. Descanse bastante e considere consultar um médico se os sintomas persistirem ou forem severos.';
    } else if (normalizedIssue.includes('ansiedade') || normalizedIssue.includes('estresse') || normalizedIssue.includes('depressão') || normalizedIssue.includes('saúde mental')) {
        responseText = 'É normal sentir ansiedade ou estresse. Tente práticas de relaxamento como meditação ou yoga, e se os sentimentos persistirem, considere buscar apoio profissional. Você não está sozinha! 💕';
    } else if (normalizedIssue.includes('hormônio') || normalizedIssue.includes('hormonoterapia') || normalizedIssue.includes('hormonal') || normalizedIssue.includes('endocrinologia')) {
        responseText = 'Questões hormonais podem causar várias mudanças no corpo e na mente. É importante monitorar os efeitos e consultar um endocrinologista para ajustes na terapia. Se tiver dúvidas, não hesite em perguntar!';
    } else if (normalizedIssue.includes('obrigada') || normalizedIssue.includes('tchau') || normalizedIssue.includes('valeu') || normalizedIssue.includes('até logo') || normalizedIssue.includes('grata')) {
        responseText = 'Obrigada você por conversar comigo! Lembre-se de cuidar de si mesma e, se precisar, não hesite em buscar ajuda médica. Estarei aqui se você precisar de mais alguma coisa. Até logo! 😘';
    } else if (normalizedIssue.includes('funcionou') || normalizedIssue.includes('deu certo')) {
        responseText = 'Que bom que deu certo! Se precisar de mais alguma coisa, pode me chamar! 😉';
    } else {
        responseText = 'Desculpe, não entendi. Pergunte sobre problemas de cadastro, problemas com senha, problemas de agendamento, menstruação, gravidez, saúde mental ou sintomas e eu vou tentar ajudar! 🤗';
    }

    // Cria e exibe a mensagem de resposta do bot no chat
    const botMessage = document.createElement('div');
    botMessage.classList.add('chat-message', 'bot');
    botMessage.textContent = responseText;
    chatResponse.appendChild(botMessage);
}

  document.addEventListener('DOMContentLoaded', function() {
      preencherFooter();
      carregarDados();
  });

  function preencherFooter() {
      const hoje = new Date();
      const opcoes = { day: 'numeric', month: 'long', year: 'numeric' };
      const dataFormatada = hoje.toLocaleDateString('pt-BR', opcoes);
      
      document.getElementById("dataAtual").innerText = `São Paulo, ${dataFormatada}`;
  }

  function carregarDados() {
    const alunos = JSON.parse(sessionStorage.getItem("alunos") || "[]");
    const tabela = document.getElementById("tabelaAlunos");
    tabela.innerHTML = ""; 

    const professor = alunos.length > 0 ? alunos[0].nomeProfessor : "Não especificado";

    for (let index = 0; index < 10; index++) {
        const row = tabela.insertRow();
        row.insertCell(0).innerText = index + 1;

        if (index < alunos.length) {
            row.insertCell(1).innerText = alunos[index].nomeAluno;
            row.insertCell(2).innerText = formatarDataBR(alunos[index].dataDesistencia); 
            row.insertCell(3).innerText = alunos[index].dataUltimaFrequencia 
                ? formatarDataBR(alunos[index].dataUltimaFrequencia) 
                : "xx-xx-xxxx"; 
            row.insertCell(4).innerText = alunos[index].cargaHorariaCursada;
            row.insertCell(5).innerText = alunos[index].curso;
            row.insertCell(6).innerText = alunos[index].codigoTurma;
        } else {
            for (let i = 1; i < 7; i++) {
                row.insertCell(i).innerText = ""; 
            }
        }
    }

    document.getElementById("nomeDocente").innerText = professor;
  }

  function formatarDataBR(dataISO) {
    if (!dataISO) return ""; 
    const partes = dataISO.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  function salvarOuImprimirPDF() {
    window.print();
  }


  function aplicarEstiloBotao() {
    const botao = document.getElementById('pdfButton');
    botao.classList.add('botao-estilizado'); // Adiciona a classe personalizada
    alert('Estilo aplicado ao botão!');
  }
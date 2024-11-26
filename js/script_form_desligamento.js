let alunos = []; // Array global para armazenar os dados dos alunos
let alunoCount = 0;

function adicionarAluno() {
  const nomeAluno = document.getElementsByName("nome_aluno")[0].value;
  const dataDesistencia = document.getElementsByName("data_desistencia")[0].value;
  const dataUltimaFrequencia = document.getElementsByName("data_ultima_frequencia")[0].value;
  const cargaHorariaCursada = document.getElementsByName("carga_horaria_cursada")[0].value;
  const curso = document.getElementsByName("curso")[0].value;
  const codigoTurma = document.getElementsByName("codigo_turma")[0].value;
  const nomeProfessor = document.getElementsByName("nome_professor")[0].value;

  // Validação dos campos obrigatórios
  if (!nomeAluno || !dataDesistencia || !cargaHorariaCursada || !curso || !codigoTurma || !nomeProfessor) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
  }

  const aluno = {
      id: ++alunoCount,
      nomeAluno,
      dataDesistencia,
      dataUltimaFrequencia: dataUltimaFrequencia || null,
      cargaHorariaCursada,
      curso,
      codigoTurma,
      nomeProfessor
  };

  alunos.push(aluno);
  atualizarTabela();
  document.getElementById("formulario").reset();
}

function atualizarTabela() {
  const tabela = document.getElementById("tabelaAlunos");
  tabela.innerHTML = ""; // Limpa a tabela antes de atualizar

  alunos.forEach(aluno => {
      const row = tabela.insertRow();
      row.dataset.id = aluno.id;

      row.insertCell(0).innerText = aluno.id;
      row.insertCell(1).innerText = aluno.nomeAluno;
      row.insertCell(2).innerText = formatarDataBR(aluno.dataDesistencia);
      row.insertCell(3).innerText = aluno.dataUltimaFrequencia ? formatarDataBR(aluno.dataUltimaFrequencia) : "";
      row.insertCell(4).innerText = aluno.cargaHorariaCursada;
      row.insertCell(5).innerText = aluno.curso;
      row.insertCell(6).innerText = aluno.codigoTurma;

      const cellAcao = row.insertCell(7);
      cellAcao.innerHTML = '<i class="fas fa-trash-alt action-icon" onclick="excluirAluno(this)" style="cursor: pointer; color: red;"></i>';
  });
}

function excluirAluno(icon) {
  const row = icon.closest("tr");
  const alunoId = parseInt(row.dataset.id);

  alunos = alunos.filter(aluno => aluno.id !== alunoId);
  atualizarTabela();
}

function visualizar() {
  if (alunos.length > 0) {
      sessionStorage.setItem("alunos", JSON.stringify(alunos));
      window.open("solicitacao_desligamento_de_aluno.html", "_blank");
  } else {
      alert("Nenhum aluno para visualizar.");
  }
}

async function enviarEmail() {
  const fileInput = document.getElementById('attachment');
  const statusDiv = document.getElementById('status');

  if (fileInput.files.length === 0) {
      statusDiv.innerHTML = "<p class='text-red-500'>Por favor, selecione um arquivo.</p>";
      return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async function (e) {
      const base64File = e.target.result.split(",")[1];
      const corpoEmail = prepararCorpoEmail();

      try {
          const result = await Email.send({
              Host: "smtp.elasticemail.com",
              Username: "senaispbras@outlook.com",
              Password: "EE3DDE698842C1DD225C5A9C9F4DDDDF9C07",
              To: "senaispbras@outlook.com",
              From: "senaispbras@outlook.com",
              Subject: "FormHub - Sistema de Solicitações",
              Body: `Prezados, 

Estou escrevendo para solicitar o desligamento dos alunos abaixo:

${corpoEmail}

Segue anexo o documento com os detalhes.

Agradeço pela atenção e pela pronta colaboração nesse processo. 
Caso necessitem de mais informações ou esclarecimentos, estou à disposição.`,
              Attachments: [
                  {
                      name: file.name,
                      data: base64File
                  }
              ]
          });

          if (result === "OK") {
              statusDiv.innerHTML = "<p class='text-green-500'>E-mail enviado com sucesso!</p>";
              setTimeout(() => {
                  fecharJanelaEmail(); // Fecha a janela pop-up após o envio
              }, 3000); // Espera 3 segundos antes de fechar
          } else {
              statusDiv.innerHTML = `<p class='text-red-500'>Erro ao enviar e-mail: ${result}</p>`;
          }
      } catch (sendError) {
          console.error("Erro ao enviar e-mail:", sendError);
          statusDiv.innerHTML = `<p class='text-red-500'>Erro ao enviar e-mail: ${sendError.message}</p>`;
      }
  };

  reader.onerror = function(error) {
      console.error("Erro ao ler arquivo:", error);
      statusDiv.innerHTML = "<p class='text-red-500'>Erro ao ler o arquivo selecionado.</p>";
  };

  reader.readAsDataURL(file);
}

function prepararCorpoEmail() {
  return alunos.map(aluno => 
      `Aluno: ${aluno.nomeAluno}\n` +
      `Data da Desistência: ${formatarDataBR(aluno.dataDesistencia)}\n` +
      `Data da Última Frequência: ${aluno.dataUltimaFrequencia ? formatarDataBR(aluno.dataUltimaFrequencia) : 'Não informada'}\n` +
      `Curso: ${aluno.curso}\n` +
      `Código da Turma: ${aluno.codigoTurma}\n` +
      `Professor: ${aluno.nomeProfessor}\n\n`
  ).join('');
}

function abrirJanelaEmail() {
  const emailDialog = document.createElement("div");
  emailDialog.innerHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div class="bg-white rounded-lg p-6 w-96">
              <h2 class="text-lg font-bold mb-4">Enviar E-mail com Anexo</h2>
              <input type="file" id="attachment" class="block w-full mb-4 border rounded-md p-2">
              <div id="status" class="mb-4"></div>
              <div class="flex justify-between">
                  <button onclick="fecharJanelaEmail(this)" class="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">Cancelar</button>
                  <button onclick="enviarEmail()" class="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">Enviar</button>
              </div>
          </div>
      </div>
  `;
  document.body.appendChild(emailDialog);
}

function fecharJanelaEmail(button) {
  const emailDialog = button.closest("div.fixed");
  if (emailDialog) {
      emailDialog.remove();
  }
}

function formatarDataBR(dataISO) {
  if (!dataISO) return '';
  const partes = dataISO.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
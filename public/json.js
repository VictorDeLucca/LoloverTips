const fs = require('fs');
const Papa = require('papaparse');

// Função para calcular as estatísticas de cada equipe no Split Summer
function calcularEstatisticasPartidas(filePath) {
  const teamData = {};
  const totalMencoesPorEquipe = {};

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      return;
    }

    Papa.parse(data, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const rows = results.data.filter(row => row['split'] === 'Summer');

        for (const row of rows) {
          const teamId = row['teamid'];
          const teamName = row['teamname'];
          if (!teamName) {
            continue; // Ignorar linhas sem informações sobre a equipe
          }

          if (!teamData[teamId]) {
            teamData[teamId] = {
              teamName: teamName,
              torres: 0,
              dragoes: 0,
              barons: 0,
              mencoes: 0,
              duracaoPartidas: 0,
              ckpm: 0,
            };
            totalMencoesPorEquipe[teamId] = 0;
          }

          teamData[teamId].torres += row['towers'] || 0;
          teamData[teamId].dragoes += row['dragons'] || 0;
          teamData[teamId].barons += row['barons'] || 0;
          teamData[teamId].mencoes++;
          totalMencoesPorEquipe[teamId]++;
          teamData[teamId].duracaoPartidas += row['gamelength'] || 0;
          teamData[teamId].ckpm += row['ckpm'] || 0;
        }

        console.log('Estatísticas de cada equipe (Split Summer):');
        for (const teamId in teamData) {
          const team = teamData[teamId];
          console.log(`${team.teamName}:`);
          console.log('Torres: ' + team.torres);
          console.log('Média de Torres: ' + (team.torres / (totalMencoesPorEquipe[teamId] / 6)).toFixed(2));
          console.log('Dragões: ' + team.dragoes);
          console.log('Média de Dragões: ' + (team.dragoes / (totalMencoesPorEquipe[teamId] / 6)).toFixed(2));
          console.log('Barons: ' + team.barons);
          console.log('Média de Barons: ' + (team.barons / (totalMencoesPorEquipe[teamId] / 6)).toFixed(2));
          console.log('Total de Partidas: ' + (totalMencoesPorEquipe[teamId] / 6));
          console.log('Média de Duração das Partidas (minutos): ' + (team.duracaoPartidas / (totalMencoesPorEquipe[teamId] * 60)).toFixed(2));
          console.log('CKPM: ' + (team.ckpm / totalMencoesPorEquipe[teamId]).toFixed(2));
          console.log('-------------------------------------');
        }
      },
      error: (err) => {
        console.error('Erro ao fazer o parsing do arquivo CSV:', err);
      }
    });
  });
}

// Chama a função para calcular as estatísticas do arquivo "data.csv"
calcularEstatisticasPartidas('data.csv');

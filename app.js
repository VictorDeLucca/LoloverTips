const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(indexPath);
});

app.get('/data', (req, res) => {
  const dataPath = path.join(__dirname, 'data.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo de dados:', err);
      return res.status(500).json({ error: 'Erro ao carregar os dados.' });
    }
    res.json(JSON.parse(data));
  });
});

function loadJSON(callback) {
  const xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open('GET', '/data', true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status == "200") {
      callback(xhr.responseText);
    }
  };
  xhr.send(null);
}

function loadTeams() {
  const selectedLeague = document.getElementById('leagueSelect').value;
  if (!selectedLeague) {
    return;
  }

  loadJSON(function (response) {
    const data = JSON.parse(response);
    const leagueData = data.find(item => item.league === selectedLeague);

    if (!leagueData) {
      return;
    }

    const teamSelect1 = document.getElementById('teamSelect1');
    const teamSelect2 = document.getElementById('teamSelect2');
    teamSelect1.innerHTML = "<option value=''>Selecione o Time 1</option>";
    teamSelect2.innerHTML = "<option value=''>Selecione o Time 2</option>";

    const teams = leagueData.teams;
    teams.forEach(team => {
      teamSelect1.innerHTML += `<option value="${team.teamName}">${team.teamName}</option>`;
      teamSelect2.innerHTML += `<option value="${team.teamName}">${team.teamName}</option>`;
    });
  });
}

function calculateSum() {
  const selectedLeague = document.getElementById('leagueSelect').value;
  const selectedTeam1 = document.getElementById('teamSelect1').value;
  const selectedTeam2 = document.getElementById('teamSelect2').value;

  if (!selectedLeague || !selectedTeam1 || !selectedTeam2) {
    return;
  }

  loadJSON(function (response) {
    const data = JSON.parse(response);
    const leagueData = data.find(item => item.league === selectedLeague);

    if (!leagueData) {
      return;
    }

    const teams = leagueData.teams;
    const team1 = teams.find(team => team.teamName === selectedTeam1);
    const team2 = teams.find(team => team.teamName === selectedTeam2);

    if (!team1 || !team2) {
      return;
    }

    const sumData = {
      "teamName": "Soma das Equipes",
      "mediaTorres": (parseFloat(team1.mediaTorres) + parseFloat(team2.mediaTorres)).toFixed(2),
      "mediaDragoes": (parseFloat(team1.mediaDragoes) + parseFloat(team2.mediaDragoes)).toFixed(2),
      "mediaBarons": (parseFloat(team1.mediaBarons) + parseFloat(team2.mediaBarons)).toFixed(2),
      "mediaDuracaoPartidas": (parseFloat(team1.mediaDuracaoPartidas) + parseFloat(team2.mediaDuracaoPartidas)).toFixed(2),
      "ckpm": (parseFloat(team1.ckpm) + parseFloat(team2.ckpm)).toFixed(2)
    };

    const result = document.getElementById('result');
    result.innerHTML = `
      <table class="json-table">
        <tr>
          <td>${sumData.teamName}</td>
          <td>${sumData.mediaTorres}</td>
          <td>${sumData.mediaDragoes}</td>
          <td>${sumData.mediaBarons}</td>
          <td>${sumData.mediaDuracaoPartidas}</td>
          <td>${sumData.ckpm}</td>
        </tr>
      </table>
    `;
  });
}

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

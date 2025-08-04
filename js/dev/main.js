let game = new Game;

game.interface.startScreen();

function startGame() {
  let numOfDecks = document.getElementById("gameSettingsDeckCount").value;
  let numOfPlayers = document.getElementById("gameSettingsPlayersCount").value;
  let startingBalance = document.getElementById("gameSettingsStartingBalance").value;
  game.startGame(numOfDecks, numOfPlayers, startingBalance);
  game.startRound();
}

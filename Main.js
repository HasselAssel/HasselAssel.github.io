// Initialize Stockfish
const stockfish = new Worker("stockfish.js");

// Set the Stockfish skill level
stockfish.postMessage("setoption name Skill Level value 20");

// Analyze a position
stockfish.postMessage(`position fen rnbqkbnr/pppp1ppp/8/4p3/5PP1/8/PPPPP2P/RNBQKBNR b KQkq - 0 2`);
stockfish.postMessage("go depth 10");

// Receive the analysis from Stockfish
stockfish.onmessage = function(event) {
  console.log(event.data);
}
function StartProgram(){
    CreateGraphicBoard();
    loadFen(START_FEN);
    //loadFen("6k1/2R5/8/4p1q1/3pP2p/3P3P/4r3/7K w - - 0 1");
    //loadFen("8/PR5p/4pk2/5p2/2B2Pp1/1p2PnP1/3r4/3K4 w - - 10 43");
    //loadFen("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1");
    //loadFen("1k2r3/1P2q3/1Q6/7p/6p1/6Pp/7P/2R3K1 w - - 0 1");//endgame funny test
    //loadFen("kq6/8/8/3K4/8/8/8/8 w - - 0 1");//Double Rook endgame
    console.log(currentPosition);
    currentAvailableMoves = getAvailableMoves(currentPosition);
    console.log(currentAvailableMoves);
    if(currentPosition[-1] != PLAYER_COLOR){
        makeEngineStartMove();
    }


}

window.onload = function() {
    StartProgram();
}

function makeEngineStartMove(){
    setTimeout(function() {
        let generatedMove = generateMove();
        if(generatedMove.move !== null){
            movePiece(generatedMove.move.start, generatedMove.move.goal);
        }
    }, 1000);//Makes Move
}

//Castle issue in position -2 : -17???????? 
// these moves make move: 13 15 happen??? 
/*
1. c3 h5 2. b4 h4 3. Qa4 h3 4. g3 g5 5. Na3 g4 6. Nc4 f5 7. f4 gxf3 8. exf3 f4 9. gxf4 e5 10. fxe5 Bxb4 11. Qxb4 d5 12. Ne3 d4 13. cxd4 Qxd4 14. Qxd4 c5 15. Qxc5 b5 16. Qxb5+ Kf7 17. Qd5+ Ke8 18. Qxa8 a5 19. Qxb8 a4 20. Qxc8+ Kf7 21. Qd7+ Kg6 22. Qxa4 Kf7 23. Bxh3 Rxh3 24. Nxh3
*/
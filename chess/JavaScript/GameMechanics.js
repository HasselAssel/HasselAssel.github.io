function getAvailableMoves(position){
    let availableMoves = [];
    let enemyAttackedSquares = [];
    let kingSquare = 0;

    let enemyKingAttackLines = [];//lines that attacks the king (also for knight and pawn)

    for(let square in position){
        if (position[square] == ((position[-1] == 0) ? 6 : 14)){//find king square
            kingSquare = square;
            break;
        }
    }

    let pinnedPieces  = getPinnedPiecesFormKing(position, kingSquare);
    //console.log("PinnedPieces:");
    //console.log(pinnedPieces);

    for(let square in position){//for enemy attacks
        if(square < 0){
            break;
        }
        if(position[-1] != (position[square] - 8 < 0) ? 0 : 1){//for opponent available moves
            switch(position[square] % 8){
                case 1://pawn
                    evaluateReturnedValueOther(getEnemyPawnAttacks(position, square, kingSquare));
                    break;
                case 2://Rook
                    evaluateReturnedValueSD(getEnemyStraightAttacks(position, square, kingSquare));
                    break;
                case 3://Knight
                    evaluateReturnedValueOther(getEnemyKnightAttacks(position, square, kingSquare));
                    break;
                case 4://Bishop
                    evaluateReturnedValueSD(getEnemyDiagonalAttacks(position, square, kingSquare));
                    break;
                case 5://Queen
                    evaluateReturnedValueSD(getEnemyStraightAttacks(position, square, kingSquare));
                    evaluateReturnedValueSD(getEnemyDiagonalAttacks(position, square, kingSquare));
                    break;
                case 6://King
                    evaluateReturnedValueOther(getEnemyKingAttacks(position, square, kingSquare));
                    break;
                default:
                    break;
            }
            function evaluateReturnedValueSD(value){
                enemyAttackedSquares = [...new Set([...enemyAttackedSquares, ...[].concat(...value[0])])];
                if(value[1] >= 0){
                    let help = value[0][value[1]];
                    help = help.slice(0, help.indexOf(+kingSquare));
                    help.push(+square);
                    enemyKingAttackLines.push(help);
                }
            }
            function evaluateReturnedValueOther(value){
                enemyAttackedSquares = [...new Set([...enemyAttackedSquares, ...value[0]])];
                if(value[1] === true){
                    enemyKingAttackLines.push([+square]);
                }
            }
        }
    }

    for(let square in position){//for available moves
        if(square < 0){
            break;
        }
        if(position[-1] == (position[square] - 8 < 0) ? 0 : 1){
            switch(position[square] % 8){
                case 1://pawn
                    availableMoves.push(...getPawnMoves(position, square, enemyKingAttackLines, pinnedPieces[square] || []));
                    break;
                case 2://Rook
                    availableMoves.push(...getStraightMoves(position, square, enemyKingAttackLines, pinnedPieces[square] || []));
                    break;
                case 3://Knight
                    if(!(square in pinnedPieces)){
                        availableMoves.push(...getKnightMoves(position, square, enemyKingAttackLines));
                    }
                    break;
                case 4://Bishop
                    availableMoves.push(...getDiagonalMoves(position, square, enemyKingAttackLines, pinnedPieces[square] || []));
                    break;
                case 5://Queen
                    availableMoves.push(...[...getStraightMoves(position, square, enemyKingAttackLines, pinnedPieces[square] || []), ...getDiagonalMoves(position, square, enemyKingAttackLines, pinnedPieces[square] || [])]);
                    break;
                case 6://King
                    availableMoves.push(...getKingMoves(position, square, enemyAttackedSquares));
                    break;
                default:
                    break;
            }
        }
    }
    
    //console.log(enemyAttackedSquares);
    //console.log(enemyKingAttackLines);
    //console.log(pinnedPieces);
    //console.log(availableMoves);

    return availableMoves;
}





function movePiece(start, goal){
    if(goal == null || start == null || gameOver || currentDisplayNumber != wholeGame.length - 1){
        return false;
    }else if(start == goal || !(isAvailableMove(start, goal))){
        return false;
    }
    currentPosition = getNewPosition(currentPosition, start, goal);

    if(currentDisplayNumber == wholeGame.length - 1){//if it is looking at currentPosition
        currentDisplayNumber++;
    }
    //adds position to memory
    wholeGame.push(currentPosition);
    UiNoteMove(start, goal)
    updateBoard();

    currentAvailableMoves = getAvailableMoves(currentPosition);

    if(currentPosition[-4] >= 100 || currentAvailableMoves.length == 0){//50 move rule(100 total piece movements)
        gameOver = true;
        DisplayGameOver();
        return true;
    }

    /*let generatedMove = generateMove();//its a 1v1 between the computer only
    if(generatedMove.move !== null){
        setTimeout(function() {
            movePiece(generatedMove.move.start, generatedMove.move.goal);
          }, 1000);//Makes Move
    }*/

    //console.log(currentPosition);
    //console.log(currentAvailableMoves);
    
    if(currentPosition[-1] != PLAYER_COLOR){//evaluate next computer move
        setTimeout(function() {
            let generatedMove = generateMove();
            if(generatedMove.move !== null){
                movePiece(generatedMove.move.start, generatedMove.move.goal);//Makes opponent Move
            }
        }, 50);
    }
    return true;

    function isAvailableMove(start, goal){//looks for move in currentAvailableMoves
        if(Array.isArray(goal)){
            for (let i = 0; i < currentAvailableMoves.length; i++){
                if(currentAvailableMoves[i].start == start && currentAvailableMoves[i].goal[0] == goal[0] && currentAvailableMoves[i].goal[1] == goal[1]){
                    return true;
                }
            }
        } else{
            for (let i = 0; i < currentAvailableMoves.length; i++){
                if(currentAvailableMoves[i].start == start && currentAvailableMoves[i].goal == goal){
                    return true;
                }
            }
        }  
        return false;
    }
}

class Move {
    constructor(start, goal) {
        this.start = start;
        this.goal = goal;
    }
}

/*function SearchPossibilities(position, depth){
    let possibilities = 0;
    if(depth <= 1){
        return getAvailableMoves(position).length;
    }
    for(let move of getAvailableMoves(position)){
        possibilities += +SearchPossibilities(getNewPosition(position, move.start, move.goal), depth - 1);
    }
    return possibilities;
}

function SearchHelp(position, depth){
    for(let move of getAvailableMoves(position)){
        console.log(move.start + " " + move.goal + " " + SearchPossibilities(getNewPosition(position, move.start, move.goal), depth));
    }
}*/



//for counting purposes only
let count = 0;

function generateMove(){
    /*let currentBestMove = null;
    let currentDepth = 1;
    var startTime = Date.now();

    while (Date.now() - startTime < SEARCH_TIME) {
        const promise = new Promise((resolve, reject) => {
            resolve(getBestMoveByDepth(depth++));
        });
        promise.then((value) => {
            currentBestMove = value;
        });
    }
    return currentBestMove;*/
    return getBestMoveByDepth(SEARCH_DEPTH);
}


function getBestMoveByDepth(depth){
    count = 0;
    let bestMove = new Move(0, 0);
    let bestMoveValue = -Infinity;
    let bestMoveDepth = 0;
    let time = Date.now();

    let availableMoves = returnOptimizedMoveOrder(getAvailableMoves(currentPosition), currentPosition);

    for(let move of availableMoves){
        /*Explanation of parameters:
        next: in Search(), Search() gets called with parameters: alpha = -beta, beta = -alpha;
        An alpha-beta-pruning function gets initially called with parameters: alpha = -Infinity, beta = Infinity;
        And in this function down there, you can replace alpha with bestMoveValue,
        because thats the minimal Value the maximizing player can guarantee.
        So I give the function down here the parameters like in Search():
        alpha = -Infinity (like -beta for beta = Infinity),
        beta = -bestMoveValue (like -alpha for alpha = bestMoveValue))
        */
        let eval = Search(getNewPosition(currentPosition, move.start, move.goal), depth - 1, -Infinity, Infinity);
        eval.value *= -1;//flip the sign
        //- Search(or - value) because there is already one move made so without the minus its looking for good opponent moves
        //Eval is bestMoveValue if the move is worse or same valued as previous bestMoveValue

        //console.log("Move: " + move.start + " " + move.goal + ", Eval: " + eval.value + " " + eval.depth + ", P. BMV: " + bestMoveValue + ", P.BM: " + bestMove.start + " " + bestMove.goal + " " + bestMoveDepth);
        if(eval.value > bestMoveValue || (eval.value == bestMoveValue && eval.depth >= bestMoveDepth)){
            bestMoveValue = eval.value;
            bestMove = move;
            bestMoveDepth = eval.depth;
        }
    }
    time = Date.now() - time;
    console.log("Positions evaluated: " + count);
    console.log("Time spend: " + time);
    console.log("Pos per milli sec: " + Math.floor(count / time));
    console.log(currentPosition[-4]);
    console.log({value: bestMoveValue, move: bestMove});
    console.log("------------");
    return {value: bestMoveValue, move: bestMove};
}

/*function Search(position, depth, alpha, beta){//Search function with alpha beta pruning
    if(depth <= 0){
        count++;
        return Evaluate(position);
    }

    let availableMoves;
    //get optimized move order at high depth
    if(depth >= 2){
        availableMoves = returnOptimizedMoveOrder(getAvailableMoves(position), position);
    } else{
        availableMoves = getAvailableMoves(position);
    }
    

    if(availableMoves.length === 0){//if check or stalemate
        if(isCheck(position)){
            return -Infinity;
        }
        return 0;
    }

    for(let move of availableMoves){
        let eval = -Search(getNewPosition(position, move.start, move.goal), depth - 1, -beta, -alpha);
        if(eval >= beta){
            return beta;
        }
        alpha = Math.max(alpha, eval);
    }
    return alpha;
}*/

function Search(position, depth, alpha, beta){//Search function with alpha beta pruning
    if(depth <= 0){
        count++;
        return {value: Evaluate(position), depth: depth};
    }

    let availableMoves;
    //get optimized move order at high depth
    if(depth >= 2){
        availableMoves = returnOptimizedMoveOrder(getAvailableMoves(position), position);
    } else{
        availableMoves = getAvailableMoves(position);
    }
    

    if(availableMoves.length === 0){//if check or stalemate
        if(isCheck(position)){
            return {value: -Infinity, depth: depth};
        }
        return {value: 0, depth: depth};
    }

    let bestMoveBrunches = 0;//If the eval.value is the same the move gets chosen by the depth it is in the move tree.
    for(let move of availableMoves){
        let eval = Search(getNewPosition(position, move.start, move.goal), depth - 1, -beta, -alpha);
        eval.value *= -1;//flip sign
        if(eval.value >= beta){
            return {value: beta, depth: eval.depth};
        }
        if(eval.value === Infinity){
            return {value: eval.value, depth: eval.depth};
        }
        if(bestMoveBrunches < eval.depth){
            bestMoveBrunches = eval.depth;
        }
        alpha = Math.max(alpha, eval.value);
    }
    return {value: alpha, depth: bestMoveBrunches};
}


function Evaluate(position){//Evaluates one position
    let preferEdgeBias = 15;
    let centerControlMulti = 0.4;
    let getKingToOpponentKingBias = 25;

    let whiteKingSquare;
    let blackKingSquare;

    let whitePieceEval = 0;
    let whitePieceCount = 0;
    let whiteCenterControlEval = 0;
    let whiteEndGameKingsPositionEval = 0;

    let blackPieceEval = 0;
    let blackPieceCount = 0;
    let blackCenterControlEval = 0;
    let blackEndGameKingsPositionEval = 0;

    for(let square in position){//Calculate Piece Value
        if(square >= 0){
            switch (position[square]){
                case 1://White Pawn
                    whitePieceEval += PAWN_VALUE;
                    whitePieceCount++;
                    break;
                case 2://White Rook
                    whitePieceEval += ROOK_VALUE;
                    whitePieceCount++;
                    break;
                case 3://White Knight
                    whitePieceEval += KNIGHT_VALUE;
                    whitePieceCount++;
                    break;
                case 4://White Bishop
                    whitePieceEval += BISHOP_VALUE;
                    whitePieceCount++;
                    break;
                case 5://White Queen
                    whitePieceEval += QUEEN_VALUE;
                    whitePieceCount++;
                    break;
                case 6://White King
                    whiteKingSquare = square;
                    break;
                case 9://Black Pawn
                    blackPieceEval += PAWN_VALUE;
                    blackPieceCount++;
                    break;
                case 10://Black Rook
                    blackPieceEval += ROOK_VALUE;
                    blackPieceCount++;
                    break;
                case 11://Black Knight
                    blackPieceEval += KNIGHT_VALUE;
                    blackPieceCount++;
                    break;
                case 12://Black Bishop
                    blackPieceEval += BISHOP_VALUE;
                    blackPieceCount++;
                    break;
                case 13://Black Queen
                    blackPieceEval += QUEEN_VALUE;
                    blackPieceCount++;
                    break;
                case 14://Black King
                    blackKingSquare = square;
                    break;
                default:
                    break;
            }
        } else {
            break;
        }
    }

    let whiteDistanceFromCenter = Math.floor(distanceFromCenter(whiteKingSquare) / 4 * preferEdgeBias);
    let blackDistanceFromCenter = Math.floor(distanceFromCenter(blackKingSquare) / 4 * preferEdgeBias);
    let distanceKings = Math.floor((14 - distanceFromCenterCustomCenter(blackKingSquare, whiteKingSquare)) * getKingToOpponentKingBias);
    //white king at edge so better for black
    blackEndGameKingsPositionEval = +whiteDistanceFromCenter - (+whiteDistanceFromCenter * ((+whitePieceEval + 1) / ALL_PIECE_VALUE));
    //black king at edge so better for white
    whiteEndGameKingsPositionEval = +blackDistanceFromCenter - (+blackDistanceFromCenter * ((+blackPieceEval + 1) / ALL_PIECE_VALUE));

    //blacks king wants to come closer to whites king
    blackEndGameKingsPositionEval += (+distanceKings - (+distanceKings * ((+whitePieceEval + 1) / ALL_PIECE_VALUE)));
    //whites king wants to come closer to blacks king
    whiteEndGameKingsPositionEval += +distanceKings - (+distanceKings * ((+blackPieceEval + 1) / ALL_PIECE_VALUE));
    //TO DO BRING KING W MORE MATERIAL TOWARDS KING WITH LESS!!!!


    for (let square in position){//Calculate Controlled Squares
        if(square >= 0){
            switch(position[square] % 8){//the straight and diagonal arrays have arrays in it the others don't. By using ... on some of them now they are all arrays of arrays.
                case 1://pawn
                    evalControlledSquares([getEnemyPawnAttacks(position, square, -1)[0]], 1);
                    break;
                case 2://Rook
                    evalControlledSquares([...getEnemyStraightAttacks(position, square, -1)[0]], 0.5);
                    break;
                case 3://Knight
                    evalControlledSquares([getEnemyKnightAttacks(position, square, -1)[0]], 1);
                    break;
                case 4://Bishop
                    evalControlledSquares([...getEnemyDiagonalAttacks(position, square, -1)[0]], 1);
                    break;
                case 5://Queen
                    evalControlledSquares([...getEnemyStraightAttacks(position, square, -1)[0]], 0.3);
                    evalControlledSquares([...getEnemyDiagonalAttacks(position, square, -1)[0]], 0.3);
                    break;
                case 6://King
                    //do king edge endgame stuff
                    break;
                default:
                    break;
            }
            //console.log("next control square:");
            //console.log(controlledSquares);
            function evalControlledSquares(array, impact){
                if(position[square] - 8 > 0){//for black piece
                    for (let innerArray of array){
                        for (let n of innerArray){
                            blackCenterControlEval += Math.floor(((3 - distanceFromCenter(+n)) * impact * ((whitePieceEval + 1) / ALL_PIECE_VALUE)) * centerControlMulti);
                        }
                    }
                } else {//for white piece
                    for (let innerArray of array){
                        for (let n of innerArray){
                            whiteCenterControlEval += Math.floor(((3 - distanceFromCenter(+n)) * impact * ((+blackPieceEval + 1) / ALL_PIECE_VALUE)) * centerControlMulti);
                        }
                    }
                }
            }
        
        }
    }
    let whiteEval = +whitePieceEval + whiteCenterControlEval + whiteEndGameKingsPositionEval;
    let blackEval = +blackPieceEval + blackCenterControlEval + blackEndGameKingsPositionEval;

    let eval = (position[-1] == 0) ? +whiteEval - blackEval : +blackEval - whiteEval;
    return eval;
}

function isCheck(position){
    let returnedValue = false;
    for(let square in position){
        if (position[square] == ((position[-1] == 0) ? 6 : 14)){//find king square
            kingSquare = square;
            break;
        }
    }
    for(let square in position){//for enemy attacks
        if(square < 0){
            break;
        }
        if(position[-1] != (position[square] - 8 < 0) ? 0 : 1){//for opponent available moves
            switch(position[square] % 8){
                case 1://pawn
                    evaluateReturned(getEnemyPawnAttacks(position, square, kingSquare));
                    break;
                case 2://Rook
                    evaluateReturned(getEnemyStraightAttacks(position, square, kingSquare));
                    break;
                case 3://Knight
                    evaluateReturned(getEnemyKnightAttacks(position, square, kingSquare));
                    break;
                case 4://Bishop
                    evaluateReturned(getEnemyDiagonalAttacks(position, square, kingSquare));
                    break;
                case 5://Queen
                    evaluateReturned(getEnemyStraightAttacks(position, square, kingSquare));
                    evaluateReturned(getEnemyDiagonalAttacks(position, square, kingSquare));
                    break;
                case 6://King
                    evaluateReturned(getEnemyKingAttacks(position, square));
                    break;
                default:
                    break;
            }
            function evaluateReturned(value){
                if(value[1] !== false && value[1] !== -1){
                    returnedValue = true;
                }
            }
        }
    }
    return returnedValue;
}

function distanceFromCenter(field) {
    const x = field % 8;
    const y = Math.floor(field / 8);
    const centerX = 3.5;
    const centerY = 3.5;
    return Math.max(Math.abs(+x - centerX), Math.abs(+y - centerY)) - 0.5;
}

function distanceFromCenterCustomCenter(number, center) {
    const x1 = number % 8;
    const y1 = Math.floor(number / 8);
    const x2 = center % 8;
    const y2 = Math.floor(center / 8);
    const distanceX = Math.abs(x1 - x2);
    const distanceY = Math.abs(y1 - y2);
    return +distanceX + distanceY;
  }


function returnOptimizedMoveOrder(moves, position){
    moves.sort(function(a, b){
        return +getMoveValue(b, position) - getMoveValue(a, position);
    });
    return moves;

    function getMoveValue(move, position){
        let moveValue = 0;
        if(!isNaN(move.goal)){//if not promotion
            if(move.goal in position){//capture
                moveValue += 2 * pieceValuesMap[position[move.goal] % 8] - (pieceValuesMap[position[move.start] % 8] || 0);
            }
            if(position[move.start] % 8 == 1){//if Pawn Move
                if(position[-1] == 0){//if pawn attacks goal
                    if(((move.goal % 8 != 0 && position[+move.goal - 9] == 9) || (move.goal % 8 != 7 && position[+move.goal - 7] == 9))){
                        //black pawn attacks piece
                        moveValue -= pieceValuesMap[position[move.start] % 8] || 0;
                    }
                } else {
                    if(((move.goal % 8 != 0 && position[+move.goal + 7] == 1) || (move.goal % 8 != 7 && position[+move.goal + 9] == 1))){
                        //white pawn attacks piece
                        moveValue -= pieceValuesMap[position[move.start] % 8] || 0;
                    }
                }
            }
        } else{//promotion
            moveValue += pieceValuesMap[move.goal[1]] || 0;
        }
        return moveValue;
    }
}
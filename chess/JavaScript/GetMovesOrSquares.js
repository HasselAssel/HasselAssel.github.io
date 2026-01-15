function getNewPosition(position, start, goal){
    let promotionVar;
    if(Array.isArray(goal)){
        promotionVar = goal[1];
        goal = goal[0];
    }
    let newPosition = {...position};
    newPosition[goal] = position[start]
    delete newPosition[start];

    if(goal == newPosition[-3] && position[start] % 8 == 1){//if EP MAYBE NOT WORKING!!!!!
        delete newPosition[(goal > 31) ? goal - 8 : +goal + 8];
    } else if(newPosition[goal] % 8 == 6){//if king move(for castle only)
        if(goal - start == 2){//short castle
            newPosition[+goal - 1] = position[+goal + 1];
            delete newPosition[+goal + 1];
        } else if(start - goal == 2){//long castle
            newPosition[+goal + 1] = position[+goal - 2];
            delete newPosition[+goal - 2];
        }
        //remove the castle rights for given color
        newPosition[-2] -= (newPosition[-1] == 0) ? (+((position[-2] & 2) > 0 ? 2 : 0) + ((position[-2] & 1) > 0 ? 1 : 0)) : (+((position[-2] & 4) > 0 ? 4 : 0) + ((position[-2] & 8) > 0 ? 8 : 0));
    } else if(position[start] % 8 == 2){
        //for rook move(for castle)
        if(start == 0 && (newPosition[-2] & 8) > 0){
            newPosition[-2] -= 8;
        } else if(start == 7 && (newPosition[-2] & 4) > 0){
            newPosition[-2] -= 4;
        } else if(start == 56 && (newPosition[-2] & 2) > 0){
            newPosition[-2] -= 2;
        } else if(start == 63 && (newPosition[-2] & 1) > 0){
            newPosition[-2] -= 1;
        }
    }
    if(position[goal] % 8 == 2){
        //for rook capture(for castle)
        if(goal == 0 && (newPosition[-2] & 8) > 0){
            newPosition[-2] -= 8;
        } else if(goal == 7 && (newPosition[-2] & 4) > 0){
            newPosition[-2] -= 4;
        } else if(goal == 56 && (newPosition[-2] & 2) > 0){
            newPosition[-2] -= 2;
        } else if(goal == 63 && (newPosition[-2] & 1) > 0){
            newPosition[-2] -= 1;
        }
    }
    //promotion
    if(Math.floor(goal / 8) == (position[-1] == 0 ? 0 : 7) && newPosition[goal] == (position[-1] == 0 ? 1 : 9)){
        newPosition[goal] = promotionVar;
    }
    //change turn
    newPosition[-1] = (newPosition[-1] == 0) ? 1 : 0;
    //check is was double pawn move FOR EP
    newPosition[-3] = (newPosition[goal] % 8 == 1 && Math.abs(Math.floor(goal / 8) - Math.floor(start / 8)) == 2) ? ((goal > 31) ? +goal + 8 : goal - 8) : -1;
    //move increments
    newPosition[-4] = (!(goal in position || position[start] == 1 || position[start] == 9)) ? newPosition[-4] + 1 : 0;
    if((newPosition[-1] == 0)){//gets incremented after blacks turn
        newPosition[-5]++;
    }
    return newPosition;
}

function isInList(list, value) {
    if (list.length === 0) {
      return true;
    }
  
    for (let i = 0; i < list.length; i++) {
      if (list[i] === value) {
        return true;
      }
    }
  
    return false;
  }

function checkNumberInAllLists(lists, number) {
    if (lists.length === 0) {
      return true;
    }
  
    return lists.every(list => list.includes(number));
}


function getStraightMoves(position, square, enemyKingAttackLines, ifPinnedSquares){
    let moves = [];
    for(let a of [1, -1, 8, -8]){//for all 4 directions
        for(let ts = Number(square) + a; ts >= 0 && ts <= 63 && (ts % 8 == (Number(ts) - a) % 8 || Math.floor(ts / 8) == Math.floor((Number(ts) - a) / 8)); ts += a){//ts for testSquare
            //for loop cancel if piece "jumps" ranks (ex. 7 -> 8)
            if(ts in position){
                if(Math.floor(position[ts] / 8) != position[-1]){//if piece is different color as turn color
                    if(checkNumberInAllLists(enemyKingAttackLines, ts) && isInList(ifPinnedSquares, ts)){moves.push(new Move(square, ts))};
                }
                break;
            }
            if(checkNumberInAllLists(enemyKingAttackLines, ts) && isInList(ifPinnedSquares, ts)){moves.push(new Move(square, ts))};
        }
    }
    return moves;
}

function getDiagonalMoves(position, square, enemyKingAttackLines, ifPinnedSquares){
    let moves = [];
    for(let a of [7, 9, -7, -9]){//for all 4 directions
        for(let ts = Number(square) + a; ts >= 0 && ts <= 63 && Math.abs(ts % 8 - (Number(ts) - a) % 8) == 1/* && Math.abs(Math.floor(ts / 8) - Math.floor((Number(ts) - a) / 8)) == 1*/; ts += a){//ts for testSquare
            //for loop cancel checks if rank and file are both exactly 1 of;
            if(ts in position){
                if(Math.floor(position[ts] / 8) != position[-1]){//if piece is different color as turn color
                    if(checkNumberInAllLists(enemyKingAttackLines, ts) && isInList(ifPinnedSquares, ts)){moves.push(new Move(square, ts))};
                }
                break;
            }
            if(checkNumberInAllLists(enemyKingAttackLines, ts) && isInList(ifPinnedSquares, ts)){moves.push(new Move(square, ts))};
        }
    }
    return moves;
}

function getKnightMoves(position, square, enemyKingAttackLines){
    let moves = [];
    for(let a of [-17, -15, -6, 10, 17, 15, 6, -10]){
        let difFile = Math.abs(square % 8 - (Number(square) + a) % 8);
        let difRank = Math.abs(Math.floor(square / 8) - Math.floor((Number(square) + a) / 8));
        if((difFile == 1 || difFile == 2) && (difRank == 1 || difRank == 2) && Number(square) + a >= 0 && Number(square) + a <= 63){
            if((Number(square) + a) in position){
                if(Math.floor(position[(Number(square) + a)] / 8) != position[-1]){//if piece is different color as turn color
                    if(checkNumberInAllLists(enemyKingAttackLines, +square + a)){moves.push(new Move(square, Number(square) + a))};
                }
                continue;
            }
            if(checkNumberInAllLists(enemyKingAttackLines, +square + a)){moves.push(new Move(square, Number(square) + a))};
        }
    }
    return moves;
}

function getKingMoves(position, square, enemyAttackedSquares){
    let moves = [];
    for(let a of [1, -1, 8, -8, 7, -7, 9, -9]){
        let difFile = Math.abs(square % 8 - (Number(square) + a) % 8);
        let difRank = Math.abs(Math.floor(square / 8) - Math.floor((Number(square) + a) / 8));
        if(difFile <= 1 && difRank <= 1 && Number(square) + a >= 0 && Number(square) + a <= 63){
            if((Number(square) + a) in position){
                if(Math.floor(position[(Number(square) + a)] / 8) != position[-1]){//if piece is different color as turn color
                    if(!(enemyAttackedSquares.includes(Number(square) + a))){
                        moves.push(new Move(square, Number(square) + a));
                    }
                }
                continue;
            }
            if(!(enemyAttackedSquares.includes(Number(square) + a))){
                moves.push(new Move(square, Number(square) + a));
            }
        }
    }
    if(position[square] / 8 < 1){//castle for white
        if((position[-2] & 1) > 0 && !((+square + 1) in position) && !((+square + 2) in position)){
            //short castle
            if(!(enemyAttackedSquares.includes(+square + 2)) 
            && !(enemyAttackedSquares.includes(+square + 1)) 
            && !(enemyAttackedSquares.includes(+square))){
                moves.push(new Move(square, +square + 2));
            }
        }
        if((position[-2] & 2) > 0 && !((+square - 1) in position) && !((+square - 2) in position) && !((+square - 3) in position)){
            //long castle
            if(!(enemyAttackedSquares.includes(+square - 2)) 
            && !(enemyAttackedSquares.includes(+square - 1)) 
            && !(enemyAttackedSquares.includes(+square))){
                moves.push(new Move(square, +square - 2));
            }
        }
    }else {//castle for black
        if((position[-2] & 4) > 0 && !((+square + 1) in position) && !((+square + 2) in position)){
            //short castle
            if(!(enemyAttackedSquares.includes(+square + 2)) 
            && !(enemyAttackedSquares.includes(+square + 1)) 
            && !(enemyAttackedSquares.includes(+square))){
                moves.push(new Move(square, +square + 2));
            }
        }
        if((position[-2] & 8) > 0 && !((+square - 1) in position) && !((+square - 2) in position) && !((+square - 3) in position)){
            //long castle
            if(!(enemyAttackedSquares.includes(+square - 2)) 
            && !(enemyAttackedSquares.includes(+square - 1)) 
            && !(enemyAttackedSquares.includes(+square))){
                moves.push(new Move(square, +square - 2));
            }
        }
    }
    return moves;
}

function getPawnMoves(position, square, enemyKingAttackLines, ifPinnedSquares){
    let moves = [];
    let a = (position[-1] == 0) ? -8 : 8;
    if(!((+square + a) in position)){//1 forward
        if(checkNumberInAllLists(enemyKingAttackLines, +square + a) && isInList(ifPinnedSquares, +square + a)){moves.push(new Move(square, +square + a))};
        if(Math.floor(square / 8) == ((position[-1] == 0/*if white*/) ? 6 : 1) && !((+square + a + a) in position)){//2 forward
            if(checkNumberInAllLists(enemyKingAttackLines, +square + a + a) && isInList(ifPinnedSquares, +square + a + a)){moves.push(new Move(square, +square + a + a))};
        }
    }
    if(+square % 8 != 7/*not on the right side of the board to prevent rank jumping*/
        && (position[-3] === (+square + a + 1) 
        || ((+square + a + 1) in position && Math.floor(position[+square + a + 1] / 8) != position[-1]))){//for take right side
            if(checkNumberInAllLists(enemyKingAttackLines, +square + a + 1) && isInList(ifPinnedSquares, +square + a + 1)){moves.push(new Move(square, +square + a + 1))};
    }
    if(+square % 8 != 0/*not on the left side of the board to prevent rank jumping*/
        && (position[-3] === (+square + a - 1) 
        || ((+square + a - 1) in position && Math.floor(position[+square + a - 1] / 8) != position[-1]))){//for take left side
            if(checkNumberInAllLists(enemyKingAttackLines, +square + a - 1) && isInList(ifPinnedSquares, +square + a - 1)){moves.push(new Move(square, +square + a - 1))};
    }
    for(let move of [...moves]){
        if (Math.floor(move.goal / 8) == (position[-1] == 0 ? 0 : 7)){//if on opposite side of board(promotion)
            let a = 0;
            if(position[-1] != 0){
                a = 8;
            }
            moves.push(new Move(move.start, [move.goal, +3 + a]));
            moves.push(new Move(move.start, [move.goal, +4 + a]));
            moves.push(new Move(move.start, [move.goal, +5 + a]));
            move.goal = [move.goal, +2 + a];
        }
    }
    return moves;
}

//The enemy attacks pierce through the king

function getEnemyPawnAttacks(position, square, kingsSquare){
    let squares = [];
    let hitsKing = false;
    if(+square % 8 != 7){
        let ts = +square + ((position[square] / 8 < 1) ? -7 : 9);
        squares.push(+ts);
        if(+ts === +kingsSquare){//if opponent king
            hitsKing = true;
            squares.push(+ts);
        }
    }
    if(+square % 8 != 0){
        let ts = +square + ((position[square] / 8 < 1) ? -9 : 7);
        squares.push(+ts);
        if(+ts === +kingsSquare){//if opponent king
            hitsKing = true;
            squares.push(+ts);
        }
    }
    return [squares, hitsKing];
}

function getEnemyStraightAttacks(position, square, kingsSquare){
    let squares = [];
    let hitsKing = -1;
    let helpNumber = 0;
    for(let a of [1, -1, 8, -8]){//for all 4 directions
        let helpList = [];
        for(let ts = Number(square) + a; ts >= 0 && ts <= 63 && (ts % 8 == (Number(ts) - a) % 8 || Math.floor(ts / 8) == Math.floor((Number(ts) - a) / 8)); ts += a){//ts for testSquare
            //for loop cancel if piece "jumps" ranks (ex. 7 -> 8)
            if(ts in position){
                if(Math.floor(position[ts] / 8) != position[-1]){//if piece is different color as turn color
                    helpList.push(+ts);
                }
                if(+ts === +kingsSquare){//if opponent king
                    helpList.push(+ts);
                    hitsKing = helpNumber;
                    continue;
                }
                break;
            }
            helpList.push(+ts);
        }
        if(helpList.length !== 0){
            squares.push(helpList);
            helpNumber++;
        }
    }
    return [squares, hitsKing];
}

function getEnemyDiagonalAttacks(position, square, kingsSquare){
    let squares = [];
    let hitsKing = -1;
    let helpNumber = 0;
    for(let a of [7, 9, -7, -9]){//for all 4 directions
        let helpList = [];
        for(let ts = Number(square) + a; ts >= 0 && ts <= 63 && Math.abs(ts % 8 - (Number(ts) - a) % 8) == 1/* && Math.abs(Math.floor(ts / 8) - Math.floor((Number(ts) - a) / 8)) == 1*/; ts += a){//ts for testSquare
            //for loop cancel checks if rank and file are both exactly 1 of;
            if(ts in position){
                if(Math.floor(position[ts] / 8) != position[-1]){//if piece is different color as turn color
                    helpList.push(+ts);
                }
                if(+ts === +kingsSquare){//if opponent king
                    helpList.push(+ts);
                    hitsKing = helpNumber;
                    continue;
                }
                break;
            }
            helpList.push(+ts);
        }
        if(helpList.length !== 0){
            squares.push(helpList);
            helpNumber++;
        }
    }
    return [squares, hitsKing];
}

function getEnemyKnightAttacks(position, square, kingsSquare){
    let squares = [];
    let hitsKing = false;
    for(let a of [-17, -15, -6, 10, 17, 15, 6, -10]){
        let difFile = Math.abs(square % 8 - (Number(square) + a) % 8);
        let difRank = Math.abs(Math.floor(square / 8) - Math.floor((Number(square) + a) / 8));
        if((difFile == 1 || difFile == 2) && (difRank == 1 || difRank == 2) && Number(square) + a >= 0 && Number(square) + a <= 63){
            if((Number(square) + a) in position){
                if(Math.floor(position[(Number(square) + a)] / 8) != position[-1]){//if piece is different color as turn color
                    squares.push(Number(square) + a);
                    
                }
                if(+square + a === +kingsSquare){//if opponent king
                    hitsKing = true;
                    squares.push(+square + a);
                }
                continue;
            }
            squares.push(Number(square) + a);
        }
    }
    return [squares, hitsKing];
}

function getEnemyKingAttacks(position, square){
    let squares = [];
    for(let a of [1, -1, 8, -8, 7, -7, 9, -9]){
        let difFile = Math.abs(square % 8 - (Number(square) + a) % 8);
        let difRank = Math.abs(Math.floor(square / 8) - Math.floor((Number(square) + a) / 8));
        if(difFile <= 1 && difRank <= 1 && Number(square) + a >= 0 && Number(square) + a <= 63){
            if((Number(square) + a) in position){
                if(Math.floor(position[(Number(square) + a)] / 8) != position[-1]){//if piece is different color as turn color
                    squares.push(Number(square) + a);
                }
                continue;
            }
            squares.push(Number(square) + a);
        }
    }
    return [squares, false];
}

function getPinnedPiecesFormKing(position, kingSquare){
    let pinnedPieces = {};
    for(let a of [1, -1, 8, -8]){//Straight
        let tempPinned = -1;
        let tempSquares = [];
        let disableEP = false;
        for(let ts = +kingSquare + a; ts >= 0 && ts <= 63 && (ts % 8 == (+ts - a) % 8 || Math.floor(ts / 8) == Math.floor((+ts - a) / 8)); ts += a){//ts for testSquare
            tempSquares.push(+ts);
            if(ts in position){
                if(Math.floor(position[ts] / 8) == position[-1]){
                    //if piece is same color as turn color
                    if(tempPinned != -1){//if there was already a tempPiece
                        break;
                    }
                    tempPinned = ts;
                } else if(position[ts] == (position[-1] == 0 ? 9 : 1) && position[-3] == +ts + (position[-1] == 0 ? -8 : 8)){
                    //if the piece is enemy pawn and can be taken ep
                    disableEP = true;

                }else if(tempPinned != -1 && (position[ts] == (position[-1] != 0 ? 2 : 10) || position[ts] == (position[-1] != 0 ? 5 : 13))){
                    //if Rook or Queen
                    if(position[tempPinned] == (position[-1] == 0 ? 1 : 9) && disableEP){
                        position[-3] = -1;
                    } else{
                        pinnedPieces[tempPinned] = tempSquares;
                    }
                    break;
                } else{
                    break;
                }
            }
        }
    }
    for(let a of [7, 9, -7, -9]){//for all 4 directions
        let tempPinned = -1;
        let tempSquares = [];
        for(let ts = +kingSquare + a; ts >= 0 && ts <= 63 && Math.abs(ts % 8 - (+ts - a) % 8) == 1/* && Math.abs(Math.floor(ts / 8) - Math.floor((+ts - a) / 8)) == 1*/; ts += a){//ts for testSquare
            tempSquares.push(+ts);
            if(ts in position){
                if(Math.floor(position[ts] / 8) == position[-1]){
                    //if piece is same color as turn color
                    if(tempPinned != -1){//if there was already a tempPiece
                        break;
                    }
                    tempPinned = ts;
                } else if(tempPinned != -1 && (position[ts] == (position[-1] != 0 ? 4 : 12) || position[ts] == (position[-1] != 0 ? 5 : 13))){
                    //if Rook or Queen
                    if(tempPinned in pinnedPieces){//if the piece has been pinned straight before
                        pinnedPieces[tempPinned].push(...tempSquares);
                    } else {
                        pinnedPieces[tempPinned] = tempSquares;
                    }
                    break;
                } else{
                    break;
                }
            }
        }
    }
    return pinnedPieces;
}

//DON'T CASTLE OUT OF CHECK
//KNIGHT DOESN'T MOVE???
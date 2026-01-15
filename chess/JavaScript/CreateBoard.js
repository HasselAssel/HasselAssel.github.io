var imagesOnBoard = {};
var board = [];

window.addEventListener("keydown", function(event) {//adds key listener
    if (event.keyCode === 37) {//left arrow
        updateDisplayedPosition("l");
    } else if (event.keyCode === 39) {//right arrow
        updateDisplayedPosition("r");
    }
});

function CreateGraphicBoard(){
    for(let rank = 0; rank < 8; rank++){
        for(let file = 0; file < 8; file++){
            let squareColor = ((file + rank) % 2 == 0) ? "rgb(245, 181, 147)" :  "rgb(168, 77, 32)";
            board.push(DrawSquare(squareColor, file, rank));
        }
    }
}

function DisplayGameOver(){
    const text = document.createElement("div");
    text.innerHTML = (!isCheck(currentPosition) || currentPosition[-4] >= 50) ? "DRAW" : (((currentPosition[-1] != 0) ? "WHITE" : "BLACK") + "<br>" + "WON");
    text.classList.add("victoryDisplay");
    document.getElementById("container").appendChild(text);
}

function UiNoteMove(start, goal){
		let history = document.getElementById("history");
		function getSquareNotation(square) {
			const row = 8 - Math.floor(square / 8);
			const column = String.fromCharCode(97 + (square % 8));
			return column + row
		}
		history.innerHTML += "<br>" + getSquareNotation(start)
											+ " -> " + getSquareNotation(goal);
}

function DrawSquare(squareColor, x, y){
    let rectangle = document.createElement("div");
    rectangle.style.position = "absolute";
    rectangle.style.left = SQUARE_SIZE * x + BOARD_BUFFER_LEFT + "px"; 
    rectangle.style.top = SQUARE_SIZE * y + BOARD_BUFFER_TOP + "px";
    rectangle.style.width = SQUARE_SIZE + "px";
    rectangle.style.height = SQUARE_SIZE + "px";
    rectangle.style.backgroundColor = squareColor;
    rectangle.dataset.number = y * 8 + x;
    //rectangle.textContent = y * 8 + x;
    document.getElementById("container").appendChild(rectangle);
    return rectangle;
}

function DrawPiece(piece, number){
    let img = document.createElement("img");
    img.src = piece;
    img.style.position = "absolute";
    img.style.left = Math.trunc(number % 8) * SQUARE_SIZE + BOARD_BUFFER_LEFT + "px";
    img.style.top = Math.trunc(number / 8) * SQUARE_SIZE + BOARD_BUFFER_TOP + "px";
    img.style.width = SQUARE_SIZE + "px";
    img.style.height = SQUARE_SIZE + "px";
    img.classList.add("piece");
    img.draggable = true;
    img.dataset.squareOn = number;
    img.dataset.originalLeft = img.offsetLeft;
    img.dataset.originalTop = img.offsetTop;
    img.ondragstart = function(event){
        event.dataTransfer.setData("text", event.target.id);
        /*var dragImage = document.createElement("img");
        img.src = "http://kryogenix.org/images/hackergotchi-simpler.png";
        event.dataTransfer.setDragImage(dragImage, 5000, 5000);*/
        this.dataset.originalLeft = img.offsetLeft;
        this.dataset.originalTop = img.offsetTop;
        this.style.zIndex = document.getElementById("container").childNodes.length;
    }

    img.ondrag = function(event) {
        event.preventDefault();
        this.style.left = event.pageX - SQUARE_SIZE / 2 + "px";
        this.style.top = event.pageY - SQUARE_SIZE / 2 + "px";
    }

    img.ondragend = async function(event){
        event.preventDefault();
        let goal = null;
        for(let i = 0; i < board.length; i++){
            let square = board[i].getBoundingClientRect();
            if(event.pageX >= square.left && event.pageX <= square.right && event.pageY >= square.top && event.pageY <= square.bottom){
                goal = board[i].dataset.number;
                break;
            }
        }
        if (currentPosition[this.dataset.squareOn] == (currentPosition[-1] == 0 ? 1 : 9) && Math.floor(goal / 8) == (currentPosition[-1] == 0 ? 0 : 7)){
            goal = [+goal, (currentPosition[-1] == 0 ? 
                +(await promotionPopUp())
              :
              +(await promotionPopUp()) + 8
              )];
        }
        if(!movePiece(this.dataset.squareOn, goal)){
            this.style.left = this.dataset.originalLeft + "px";
            this.style.top = this.dataset.originalTop + "px";
        }
    }    
    document.getElementById("container").appendChild(img);
    return img;
}

function updateBoard(){
    for(let key in imagesOnBoard){
        document.getElementById("container").removeChild(imagesOnBoard[key]);
    }
    imagesOnBoard = {};
    for(let key in wholeGame[currentDisplayNumber]){
        if(key < 0){
            break;
        }
        /*console.log(currentDisplayNumber + " " + key);
        console.log(wholeGame[currentDisplayNumber]);
        console.log(currentAvailableMoves);
        console.log(pieceNumFileDirection[wholeGame[currentDisplayNumber][key]]);*/
        imagesOnBoard[key] = DrawPiece(pieceNumFileDirection[wholeGame[currentDisplayNumber][key]], key);
    }
}

function updateDisplayedPosition(direction){//view previous position
    if(direction == "r"){
        if(currentDisplayNumber < wholeGame.length - 1){
            currentDisplayNumber++;
        }
    } else if(direction == "l"){
        if(currentDisplayNumber > 0){
            currentDisplayNumber--;
        }
    }
    updateBoard();
}

function promotionPopUp() {
    return new Promise(resolve => {
      let popup = document.createElement("div");
      popup.style.position = "fixed";
      popup.style.top = "50%";
      popup.style.left = "50%";
      popup.style.transform = "translate(-50%, -50%)";
      popup.style.backgroundColor = "#fff";
      popup.style.padding = "20px";
      popup.style.border = "1px solid #000";
    
    let pieceMap = {
        "Queen": 5,
        "Rook": 2,
        "Bishop": 4,
        "Knight": 3
    }

      let options = ["Queen", "Rook", "Bishop", "Knight"];
      options.forEach(function(option) {
        let button = document.createElement("button");
        button.innerHTML = option;
        button.style.margin = "10px 0";
        button.style.padding = "10px 20px";
        button.style.backgroundColor = "#000";
        button.style.color = "#fff";
        button.style.border = "none";
        button.style.cursor = "pointer";
        button.addEventListener("click", function() {
          document.body.removeChild(popup);
          resolve(pieceMap[option]);
        });
        popup.appendChild(button);
      });
    
      document.body.appendChild(popup);
    });
  }

function loadFen(fen){
    for (let key in imagesOnBoard) {
        let image = imagesOnBoard[key];
        document.getElementById("container").removeChild(image);
    }
    imagesOnBoard = {};
    currentPosition = {};
    let number = 0;
    let splittedFen = fen.split(" ");
    for(const c of splittedFen[0]){
        if(!isNaN(parseInt(c))){
            number += parseInt(c);
            continue;
        } else if(c == '/'){
            continue;
        }
        currentPosition[number] = fenNumber[c];
        imagesOnBoard[number] = DrawPiece(fenFileDirection[c], number++);
    }
    currentPosition[-1] = (splittedFen[1] == "w") ? 0 : 1;
    currentPosition[-2] = splittedFen[2].split('').reduce((acc, cur) => acc + fenCastle[cur], 0);
    currentPosition[-3] = (splittedFen[3] != "-") ? (8 - parseInt(splittedFen[3].charAt(1))) * 8 + fenEP[splittedFen[3].charAt(0)] : -1;
    currentPosition[-4] = parseInt(splittedFen[4]);
    currentPosition[-5] = parseInt(splittedFen[5]);
    wholeGame = [];
    wholeGame.push(currentPosition);//don*t need???
    //-1 turn, -2 castleRights, -3 EP square, -4 half moves no captures for 50 move rule, -5 moves in total
}

const SQUARE_SIZE = 70;
const BOARD_BUFFER_LEFT = (window.innerWidth - SQUARE_SIZE * 8) / 2;
const BOARD_BUFFER_TOP = (window.innerHeight - SQUARE_SIZE * 8) / 2;
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const Pawn = 1;
const Rook = 2;
const Knight = 3;
const Bishop = 4;
const Queen = 5;
const King = 6;

const White = 0;
const Black = 8;

const PAWN_VALUE = 100;
const ROOK_VALUE = 500;
const KNIGHT_VALUE = 300;
const BISHOP_VALUE = 305;
const QUEEN_VALUE = 850;
const ALL_PIECE_VALUE = PAWN_VALUE * 8 + ROOK_VALUE * 2 + KNIGHT_VALUE * 2 + BISHOP_VALUE * 2 + QUEEN_VALUE;

const SEARCH_DEPTH = 4;
const SEARCH_TIME = 10000;//in ms
const PLAYER_COLOR = 0;//0 for white, 1 for black

const fenFileDirection = {
    'r': "Images/BlackRook.png",
    'n': "Images/BlackKnight.png",
    'b': "Images/BlackBishop.png",
    'q': "Images/BlackQueen.png",
    'k': "Images/BlackKing.png",
    'p': "Images/BlackPawn.png",
    'R': "Images/WhiteRook.png",
    'N': "Images/WhiteKnight.png",
    'B': "Images/WhiteBishop.png",
    'Q': "Images/WhiteQueen.png",
    'K': "Images/WhiteKing.png",
    'P': "Images/WhitePawn.png"
}

const pieceNumFileDirection = {
    10: "Images/BlackRook.png",
    11: "Images/BlackKnight.png",
    12: "Images/BlackBishop.png",
    13: "Images/BlackQueen.png",
    14: "Images/BlackKing.png",
    9: "Images/BlackPawn.png",
    2: "Images/WhiteRook.png",
    3: "Images/WhiteKnight.png",
    4: "Images/WhiteBishop.png",
    5: "Images/WhiteQueen.png",
    6: "Images/WhiteKing.png",
    1: "Images/WhitePawn.png"
}

const fenNumber = {
    'P': 1,
    'R': 2,
    'N': 3,
    'B': 4,
    'Q': 5,
    'K': 6,
    'p': 9,
    'r': 10,
    'n': 11,
    'b': 12,
    'q': 13,
    'k': 14
}

const fenCastle = {
    'K': 1,
    'Q': 2,
    'k': 4,
    'q': 8,
    '-': 0
}

const fenEP = {
    'a': 0,
    'b': 1,
    'c': 2,
    'd': 3,
    'e': 4,
    'f': 5,
    'g': 6,
    'h': 7,
}

const pieceValuesMap = {
    1: PAWN_VALUE,
    2: ROOK_VALUE,
    3: KNIGHT_VALUE,
    4: BISHOP_VALUE,
    5: QUEEN_VALUE
}

var currentPosition = {};

var gameOver = false;

var currentColorMove = 0;

var currentAvailableMoves = [];

var wholeGame = [];

var currentDisplayNumber = 0;
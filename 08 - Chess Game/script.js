//Aguarde o DOM ser totalmente carregado antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
    let board = null; // Inicializa o tabuleiro de xadrez
    const game = new Chess(); // Cria uma nova instância do jogo Chess.js
    const moveHistory = document.getElementById('move-history'); // Obtém o contêiner do histórico de movimentação
    let moveCount = 1; // Inicializa a contagem de movimentos
    let userColor = 'w'; // Inicializa a cor do usuário como branco

    //Função para fazer um movimento aleatório para o computador
    const makeRandomMove = () => {
        const possibleMoves = game.moves();

        if (game.game_over()) {
            alert("Checkmate!");
        } else {
            const randomIdx = Math.floor(Math.random() * possibleMoves.length);
            const move = possibleMoves[randomIdx];
            game.move(move);
            board.position(game.fen());
            recordMove(move, moveCount); // Registra e exibe o movimento com contagem de movimentos
            moveCount++; //Aumenta a contagem de movimentos
        }
    };

    //Função para registrar e exibir um movimento no histórico de movimentos
    const recordMove = (move, count) => {
        const formattedMove = count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`;
        moveHistory.textContent += formattedMove + ' ';
        moveHistory.scrollTop = moveHistory.scrollHeight; // Rola automaticamente para o último movimento
    };
    
    //Função para lidar com o início de uma posição de arrastar
    const onDragStart = (source, piece) => {  
        //Permitir que o usuário arraste apenas suas próprias peças com base na cor
        return !game.game_over() && piece.search(userColor) === 0;
    };

    //Função para lidar com a queda de uma peça no tabuleiro
    const onDrop = (source, target) => {
        const move = game.move({
            from: source,
            to: target,
            promotion: 'q',
        });

        if (move === null) return 'snapback';

        window.setTimeout(makeRandomMove, 250);
        recordMove(move.san, moveCount); // Registra e exibe o movimento com contagem de movimentos
        moveCount++;
    };

    //Função para lidar com a animação do snap do final de uma peça
    const onSnapEnd = () => {
        board.position(game.fen());
    };
    
    //Opções de configuração do tabuleiro de xadrez
    const boardConfig = {
        showNotation: true,
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed: 'fast',
        snapBackSpeed: 500,
        snapSpeed: 100,
    };
    
    board = Chessboard('board', boardConfig);

    document.querySelector('.play-again').addEventListener('click', () => {
        game.reset();
        board.start();
        moveHistory.textContent = '';
        moveCount = 1;
        userColor = 'w';
    });

    document.querySelector('.set-pos').addEventListener('click', () => {
        const fen = prompt("Enter the FEN notation for the desired position!");
        if (fen !== null) {
            if (game.load(fen)) {
                board.position(fen);
                moveHistory.textContent = '';
                moveCount = 1;
                userColor = 'w';
            } else {
                alert("Invalid FEN notation. Please try again.");
            }
        }
    });

    document.querySelector('.flip-board').addEventListener('click', () => {
        board.flip();
        makeRandomMove();
        userColor = userColor === 'w' ? 'b' : 'w';
    });

});
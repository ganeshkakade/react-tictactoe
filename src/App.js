import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const getBoardRow = (i) => <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />

  let board = [];
  const boardSize = 3;
  for(let i=0; i<boardSize; i++) {
    let boardRow =[];
    for(let j=0; j<boardSize; j++) {
      boardRow.push(getBoardRow(i * boardSize + j));
    }
    board.push(<div key={i} className="board-row">{boardRow}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isDesc, setIsDesc] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleToggle() {
    setIsDesc(!isDesc);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = (currentMove === move ? 'You are at move #' : 'Go to move #') + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        { 
          (move > 0 && currentMove === move) ? description : <button onClick={() => jumpTo(move)}>{description}</button> 
        }
      </li>
    );
  });

  let newMoves = [...moves.slice()];
  if(isDesc) {
    newMoves = [...newMoves.slice(0, 1), ...newMoves.slice(1).reverse()];
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={handleToggle}>{isDesc ? 'Sort by Asc' : 'Sort by Desc'}</button>
        <ol>{newMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function App() {
  return (
    <Game />
  );
}

export default App;

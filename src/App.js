import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick, style }) {
  return (
    <button className="square" onClick={onSquareClick} style={style}>
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
    onPlay(nextSquares, i);
  }

  const winResult = calculateWinner(squares);
  let status;
  let winningLine;
  let winner;

  if (winResult) {
    winner = winResult[0];
    winningLine = winResult[1];
    status = 'Winner: ' + winner;
  } else {
    status = squares.every(ele => ele) ? 'Draw: XO' : 'Next player: ' + (xIsNext ? 'X' : 'O'); 
  }

  const getBoardRow = (i, winningLine = []) => {
    let style;
    if(winningLine.includes(i)) {
      style={
        backgroundColor: 'gray'
      }
    }
    return <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} style={style}/>;
  }

  let board = [];
  const boardSize = 3;
  for(let i=0; i<boardSize; i++) {
    let boardRow =[];
    for(let j=0; j<boardSize; j++) {
      boardRow.push(getBoardRow((i * boardSize + j), winningLine));
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
  const [history, setHistory] = useState([{squares: Array(9).fill(null), lastMoved: null}]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isDesc, setIsDesc] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, i) {
    const nextHistory = [...history.slice(0, currentMove + 1), {squares: nextSquares, lastMoved: i}];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleToggle() {
    setIsDesc(!isDesc);
  }

  const moves = history.map((h, move) => {
    let description;
    let lastMoved = h.lastMoved;
    let boardSize = 3;
    if (move > 0) {
      description = (currentMove === move ? 'You are at move #' : 'Go to move #') + `${move}(${Math.floor(lastMoved/boardSize)}, ${lastMoved%boardSize})`;
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
      return [squares[a], lines[i]];
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

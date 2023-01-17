import { useState } from "react";

function Square(props) {
  return (
    <button
      className={`${props.winner ? "highlight-square" : ""} square`}
      onClick={props.onSquareClicked}
    >
      {props.value}
    </button>
  );
}

function Board({ xIsNext, square, onPlay, findCoordinates }) {
  const winner = calculateWinner(square);
  let status;

  if (winner) {
    status = "Winner: " + (winner && winner.player);
  } else {
    status = "Next move: " + (xIsNext ? "X" : "O");
  }

  // Added extra functionality of "where you are at" as a part of challenge 1
  function BoardRow({ num1, num2, num3 }) {
    return (
      <div className="board-row">
        {[num1, num2, num3].map((el) => (
          <Square
            winner={
              winner && winner.winSquares && winner.winSquares.includes(el)
            }
            key={el}
            value={square[el]}
            onSquareClicked={() => handleClick(el)}
          />
        ))}
      </div>
    );
  }

  const boardStructure = [];
  for (let counter = 0; counter < 9; counter += 3) {
    boardStructure.push(
      <BoardRow
        key={counter}
        num1={counter}
        num2={counter + 1}
        num3={counter + 2}
      />
    );
  }

  function handleClick(index) {
    if (square[index] || calculateWinner(square)) {
      return;
    }

    const nextSq = square.slice();
    if (xIsNext) {
      nextSq[index] = "X";
    } else {
      nextSq[index] = "O";
    }
    findCoordinates(index);
    onPlay(nextSq);
  }
  return (
    <>
      <div className="status">{status}</div>
      {/* WAY 3 */}
      {boardStructure}
      {/* 
      WAY 2
      <BoardRow num1={0} num2={1} num3={2} />
      <BoardRow num1={3} num2={4} num3={5} />
      <BoardRow num1={6} num2={7} num3={8} /> */}
    </>
  );

  // Shortening the board WAY 1
  // <div className="board-row">
  //   <Square value={square[3]} onSquareClicked={() => handleClick(3)} />
  //   <Square value={square[4]} onSquareClicked={() => handleClick(4)} />
  //   <Square value={square[5]} onSquareClicked={() => handleClick(5)} />
  // </div>
  // <div className="board-row">
  //   <Square value={square[6]} onSquareClicked={() => handleClick(6)} />
  //   <Square value={square[7]} onSquareClicked={() => handleClick(7)} />
  //   <Square value={square[8]} onSquareClicked={() => handleClick(8)} />
  // </div>
}

function calculateWinner(square) {
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
    let [a, b, c] = lines[i];
    if (square[a] && square[a] === square[b] && square[a] === square[c]) {
      return { player: square[a], winSquares: lines[i] };
    }
  }
  return;
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [toggleMoves, setToggleMoves] = useState(true);
  const [squareCordinates, setSquareCordinates] = useState([["", ""]]);

  const currentSquares = history[currentMove];
  // let squareCoordinate;

  function handlePlay(nextSq) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSq];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    // setHistory([...history, nextSq]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);

    // const tempHistory = history.slice();
    // tempHistory.length = nextMove + 1;
    // setHistory(tempHistory);
  }

  function findCoordinates(index) {
    const coordinates = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3],
    ];
    const nextCordinate = squareCordinates.slice();
    nextCordinate.push(coordinates[index]);
    setSquareCordinates(nextCordinate);
  }

  // Added extra functionality of "where you are at" as a part of challenge 1
  const moves = history.map((_, move, totalMoves) => {
    let description;
    if (move > 0) {
      if (move !== totalMoves.length - 1) {
        description = "Go to move #" + move;
      } else {
        description = "You are at move #" + move;
      }
    } else {
      description = "Go to Start";
    }

    if (totalMoves.length === 1) {
      description = "You are at the Start";
    }

    return move !== totalMoves.length - 1 ? (
      <tr key={move}>
        <td>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </td>
        {move !== 0 && (
          <td>
            <span style={{ marginLeft: "25px" }}>
              Column and Row{" "}
              {`(${squareCordinates[move][0]}, ${squareCordinates[move][1]})`}
            </span>
          </td>
        )}
      </tr>
    ) : (
      <tr key={move}>
        <td>{description}</td>
        {move !== 0 && (
          <td>
            <span style={{ marginLeft: "25px" }}>
              Column and Row{" "}
              {`(${squareCordinates[move][0]}, ${squareCordinates[move][1]})`}
            </span>
          </td>
        )}
      </tr>
    );
  });

  //Challenge 3 - Toggle functionality
  function toggleSortForMoves() {
    setToggleMoves(!toggleMoves);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          square={currentSquares}
          onPlay={handlePlay}
          findCoordinates={findCoordinates}
        />
      </div>
      <div className="game-info">{toggleMoves ? moves : moves.reverse()}</div>
      <div className="game-info"></div>
      <div className="game-info">
        <button onClick={toggleSortForMoves}>
          {toggleMoves ? "Descending" : "Ascending"}
        </button>
      </div>
    </div>
  );
}

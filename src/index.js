import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const Square = (props) => {
  const className = props.isWinner ? "square winnerSquare" : "square";

  return (
    <button key={props.id} className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
};

class Board extends React.Component {
  renderSquare(i, isWinner) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinner={isWinner}
      />
    );
  }

  render() {
    const rowsIdxs = [0, 1, 2];

    return (
      <div>
        {rowsIdxs.map((rowIdx) => (
          <div className="board-row" key={rowIdx}>
            {[3 * rowIdx, 3 * rowIdx + 1, 3 * rowIdx + 2].map((squareIdx) =>
              this.props.winCondition
                ? this.props.winCondition.includes(squareIdx)
                  ? this.renderSquare(squareIdx, true)
                  : this.renderSquare(squareIdx, false)
                : this.renderSquare(squareIdx, false)
            )}
          </div>
        ))}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          stepLocation: null,
        },
      ],
      currentStep: 0,
      xIsNext: true,
      isAscOrder: true,
    };
  }

  getLocation(i) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    return [col, row];
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.currentStep + 1);

    let squares = history[history.length - 1].squares.slice();

    const [winner] = this.calculateWinner(squares);

    if (winner || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat({
        squares: squares,
        location: this.getLocation(i),
      }),
      xIsNext: !this.state.xIsNext,
      currentStep: this.state.currentStep + 1,
    });
  }

  calculateWinner(squares) {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const winCondition of winConditions) {
      let [a, b, c] = winCondition;
      if (
        squares[a] === squares[b] &&
        squares[b] === squares[c] &&
        squares[a] !== null &&
        squares[b] !== null &&
        squares[c] !== null
      ) {
        return [squares[a], winCondition];
      }
    }

    if (squares.reduce((acc, cur) => !!acc && !!cur)) {
      return ["draw", null];
    }
    return [null, null];
  }

  moveToStep(stepIdx) {
    this.setState({
      currentStep: stepIdx,
      xIsNext: stepIdx % 2 === 0,
    });
  }

  changeOrder() {
    this.setState({ isAscOrder: !this.state.isAscOrder });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.currentStep];
    const squares = current.squares.slice();
    let moves = history.map((timeFragment, idx) => {
      const location = timeFragment.location || "clear board";
      return (
        <li key={idx}>
          <button onClick={() => this.moveToStep(idx)}>
            {idx === this.state.currentStep ? (
              <b>{`Move to step ${idx}, location (${location})`}</b>
            ) : (
              `Move to step ${idx}, location (${location})`
            )}
          </button>
        </li>
      );
    });

    if (!this.state.isAscOrder) {
      moves = moves.reverse();
    }

    const [winner, winCondition] = this.calculateWinner(squares);

    let status;
    if (winner === "draw") {
      status = `-!- Draw -!-`;
    } else if (winner) {
      status = `${winner} won!`;
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={squares}
            winCondition={winCondition}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>
            <button onClick={() => this.changeOrder()}>change order</button>
          </div>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

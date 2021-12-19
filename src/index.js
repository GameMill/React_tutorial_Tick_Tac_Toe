import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

  class Board extends React.Component {
    
    renderSquare(i) {
      return (
        <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />
        );
    }
  
    render() {
      let rows = []
      for (let X = 0; X < this.props.X; X++)
      {
        let row = []
        for (let Y = 0; Y < this.props.Y; Y++)
        {
          row.push(this.renderSquare(X*(Y*this.props.X)));
        }
        rows.push(<div className="board-row">{row}</div>)
      }
      return (
        <div>
          {rows}
        </div>
      )

      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
      constructor(props) {
          super(props);
          this.state = {
              history:[
                  { squares:Array(9).fill(null) }
              ],
              xIsNext: true,
              stepNumber: 0,

          }
      }
      handleClick(i){
        const history = this.state.history.slice(0,this.state.stepNumber + 1)
        const current = history[history.length - 1]
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
              squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
          });
    }
    jumpTo(step) {
        this.setState({
            stepNumber:step,
            xIsNext: (step % 2) === 0,
        })
    }
    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)
        
        const moves = history.map((step,move) => {
            const desc = move ?
              
              (move == this.state.stepNumber) ? 
                  <b> Go to move #{move} </b> :
                  'Go to move #' + move 
                :
                (step == current.stepNumber-1) ? 
                  <b> Go to game start </b> :
                  'Go to game start' 
                ;
            if(step == current.stepNumber-1)
              desc = "<b>"+desc+"</b>";
                return (
                    <li key={move}>
                      <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                  );
        })


        let status;
        if (winner) {
            status = 'Winner: '+ winner;
        } else {
          if(checkHasMoves(current.squares))
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
          else
            status = 'Draw. Better luck next time'
        }

    return (
        <div className="game">
          <div className="game-board">
          <Board
            X={this.props.X}
            Y={this.props.Y}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game X={3} Y={3}  />,
    document.getElementById('root')
  );

  function checkHasMoves(squares)
  {
    let status = false;
    squares.forEach(element => {
      if (element == null)
        status = true
    });
    return status;
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
        return lines[i];
      }
    }
    return null;
  }
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button key={"5"+props.index} className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

  class Board extends React.Component {
    
    renderSquare(i) {
      return (
        <Square 
            index={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />
        );
    }
  
    render() {
      return (
        <div>
          {Array(this.props.Y).fill(null).map((v,y)=>{
            return(
              <div className="board-row" key={"r"+y}>
              {
                Array(this.props.X).fill(null).map((v,x)=>{
                  const i = (x+1)+(y*this.props.Y)
                  return this.renderSquare(i)
                })
              
              }
            </div>
          )})}
        </div>
      )

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
          let lastMove;
          let XY
          if (this.state.history.length > 1 && move > 0) {
            lastMove = getLastMove(this.state.history[move-1].squares,this.state.history[move].squares)
            XY = getXY(lastMove,this.props.X,this.props.Y)
          }
          else{
            lastMove = null
            XY = ""
          }
          

            let desc = move ?
              (move === this.state.stepNumber) ? 
                  <b> Go to move #{move} {XY} </b> :
                  'Go to move #' + move + " "+XY
                :
                (step === current.stepNumber-1) ? 
                  <b> Go to game start </b> :
                  'Go to game start' 
                ;
              

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

  function getLastMove(LastMove,Current) {  
    for (let i = 0; i < LastMove.length; i++) {
      if (LastMove[i] !== Current[i]) {
        return i;
      }
    }
    return null;
  }
  function getXY(index,X,Y)
  {
    console.log(index,X,Y);
    let x = Math.floor(index % X);
    let y = ((index-x) / Y)+1
    if (x === 0){
      x = 3
    }

    return "("+x+","+y+")";
  }
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
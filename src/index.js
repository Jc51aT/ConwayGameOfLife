import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Button, ButtonToolbar ,Dropdown, DropdownButton } from 'react-bootstrap';


class Box extends React.Component{
  
  selectBox = ()  => {
    this.props.selectBox(this.props.row, this.props.col);
  }

  render(){
    return(
      <div 
        className={this.props.boxClass}
        id={this.props.boxId}
        onClick={this.selectBox}
        />
    );
  }

}

class Grid extends React.Component{
  
  render(){

      const width = (this.props.cols * 14) ;
      //const height = this.props.rows;
      let rowsArr = [];
      let boxClass = '';

      for(let i = 0; i < this.props.rows; i++){
        for(let j = 0; j < this.props.cols; j++){
            let boxId = i + '_' + j;

            boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
            rowsArr.push(
              <Box 
                boxClass = {boxClass}
                key = {boxId}
                id = {boxId}
                row = {i} 
                col = {j}
                selectBox = {this.props.selectBox}
                />
            );
        }
      }
    console.log(width);
     return(
       <div className='grid' style={{width: width}}>
        {rowsArr}
       </div>
     )
  }
}

class Buttons extends React.Component{

  handleSelect = (e) => {
    this.props.gridSize(e)
  }

  render(){
    return(
      <div className='center'>
        <ButtonToolbar>
          <Button className="btn btn-default" onClick={this.props.playButton}> Play </Button>
          <Button className="btn btn-default" onClick={this.props.pauseButton}> Pause </Button>
          <Button className="btn btn-default" onClick={this.props.clear}> Clear </Button>
          <Button className="btn btn-default" onClick={this.props.slow}> Slow </Button>
          <Button className="btn btn-default" onClick={this.props.fast}> Fast </Button>
          <Button className="btn btn-default" onClick={this.props.seed}> Seed </Button>
          <DropdownButton title="Grid Size" id="size-menu" onSelect={this.handleSelect}>
            <Dropdown.Item eventKey='1'>20x10</Dropdown.Item>
            <Dropdown.Item eventKey='2'>50x30</Dropdown.Item>
            <Dropdown.Item eventKey='3'>70x50</Dropdown.Item>
          </DropdownButton>
        </ButtonToolbar>
      </div>
    );
  }
}

class Main extends React.Component{

  constructor(props){
    super();

    this.speed = 100;
    this.rows = 30;
    this.cols = 50;

    this.state = {
      generation: 0,
      gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
    }
  }

  selectBox = (row,col) => {
    let gridCopy = arrayClone(this.state.gridFull);
    gridCopy[row][col] = !gridCopy[row][col];
    this.setState({
      gridFull: gridCopy
    });
  }

  seed = () => {
    let gridCopy = arrayClone(this.state.gridFull);
    for(let i=0 ; i < this.rows; i++){
      for(let j=0 ; j < this.cols; j++){
        if(Math.floor(Math.random() * 4) === 1){
          gridCopy[i][j] = true;
        }
      } 
    }
    this.setState({
      gridFull: gridCopy
    });
  }

  playButton = () => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.play, this.speed);
  }

  pauseButton = () => {
    clearInterval(this.intervalId);
  }

  play = () => {
    let g = this.state.gridFull;
    let g2 = arrayClone(this.state.gridFull);

    for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
		    let count = 0;
		    if (i > 0) if (g[i - 1][j]) count++;
		    if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
		    if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
		    if (j < this.cols - 1) if (g[i][j + 1]) count++;
		    if (j > 0) if (g[i][j - 1]) count++;
		    if (i < this.rows - 1) if (g[i + 1][j]) count++;
		    if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
		    if (i < this.rows - 1 && j < this.cols - 1) if (g[i + 1][j + 1]) count++;
		    if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
		    if (!g[i][j] && count === 3) g2[i][j] = true;
		  }
		}
		this.setState({
		  gridFull: g2,
		  generation: this.state.generation + 1
		});
  }

  slow = () => {
    this.speed = 1000;
    this.playButton()
  }

  fast = () => {
    this.speed  = 100;
    this.playButton()
  }

  clear = () => {
    let grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    this.setState({
      gridFull: grid,
      generation: 0
    });
  }

  gridSize = (size) => {
    switch(size){
      case '1':
        this.cols = 20;
        this.rows = 10;
        break;
      case '2':
        this.cols = 50;
        this.rows  = 50;
        break;
      case '3':
        this.cols = 70;
        this.rows = 50;
        break;
    }
    this.clear();
    this.seed();
  }

  componentDidMount(){
    this.seed();
    this.playButton();
  }

  render(){
      return(
         <div>
            <h1>Conwawy's Game Of Life</h1>
            <Buttons
              playButton = {this.playButton}
              pauseButton = {this.pauseButton}
              slow = {this.slow}
              fast = {this.fast}
              clear = {this.clear}
              seed = {this.seed}
              gridSize = {this.gridSize}
              />
            <Grid 
              rows = {this.rows}
              cols = {this.cols}
              gridFull = {this.state.gridFull}
              selectBox = {this.selectBox}
            />
            <h2>Generations: {this.state.generation}</h2>
         </div>
      );
  }
}

function arrayClone(arr){
  return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById('root')
);



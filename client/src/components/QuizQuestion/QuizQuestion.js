import React, { Component } from 'react';
import './QuizQuestion.css'



// Testing array for questions

export default class QuizQuestion extends Component {
    constructor(props) {
        super(props)
        
        
        this.state = {
            selected: ''
        }

        this.onAnswerSelected = this.onAnswerSelected.bind(this)
    }

    onAnswerSelected(event) {
        this.setState({
            selected: event.currentTarget.value
        })
    }


    render() {
        return (
            <div>
                
                <p><span>{this.props.questionNum}</span>. {this.props.question}</p>
                <ul className="answerColumn">
                    {this.props.options.map((item, iterator) => {
                        return (
                            <li key={item}>
                                <label>
                                    <input className="with-gap" name={`group${iterator}`} type="radio" value={item} checked={this.state.selected === item} onChange={this.onAnswerSelected}  />
                                    <span className="answerChoice">{item}</span>
                                </label>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    } 
}
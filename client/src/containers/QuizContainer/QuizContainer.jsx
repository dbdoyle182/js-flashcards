import React, { Component } from "react";
import API from "../../utils/API";
import QuizQuestion from "../../components/QuizQuestion";
import "./QuizContainer.css";

const answerMap = {};
let totalCorrect = 0;
const incorrect = [];
export default class QuizContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // This will store our array of questions returned from the API call
      arrayOfQuestions: [],
      // This is a state that prevents the flashcards from loading before the API response is received
      apiLoaded: false,
      // Holds the selected tags from the dropdown on change
      selectedTags: this.props.selectedTags,
      // Holds the select checkpoints from the dropdown on change
      selectedCP: this.props.selectedCP,
      // Stores the name of the checkpoint selected
      cpName: "",
      // Holds the score
      totalCorrect: 0,
      // Holds the total incorrect
      totalIncorrect: 0,
      // Triggers results page on submission of quiz
      triggerResults: false
    };

    this.ApiCalls = this.ApiCalls.bind(this);
    this.checkAnswers = this.checkAnswers.bind(this);
    this.trackAnswers = this.trackAnswers.bind(this);
    this.showResults = this.showResults.bind(this);
  }

  componentDidMount() {
    this.ApiCalls();
  }

  ApiCalls() {
    // Takes the array of selected tags and reverts them to lowercase to match values in the database
    // const sort = this.state.selectedTags.map(word => word.toLowerCase())
    // Checks if user has selected any tags and any checkpoints (Utilizes the tags and cp API route)
    if (
      this.state.selectedTags.length > 0 &&
      this.state.selectedCP.length > 0
    ) {
      API.getQuestionsByCpNumAndSubject(
        this.state.selectedCP.join("+"),
        this.state.selectedTags.join("+")
      ) // Joins selections by plus sign for compatability with routes
        .then(res => {
          console.log(res.data);
          this.setState({
            // Passes array of results into the state
            arrayOfQuestions: res.data,
            // Uses state to prevent flashcard from loading before response from API received
            apiLoaded: true
          });
          // console.log(this.state.apiLoaded)
          console.log("both are searched");
        })
        .catch(err => {
          console.log(err);
        });
      // Else if that is activated if user only selects Checkpoints for sorting
    } else if (this.state.selectedCP.length > 0) {
      API.getQuestionsByCpNumber(this.state.selectedCP.join("+"))
        .then(res => {
          this.setState({
            arrayOfQuestions: res.data[0].quiz.questions,
            cpName: res.data[0].quiz.title,
            apiLoaded: true
          });
          console.log("cp is searched");
        })
        .catch(err => {
          console.log(err);
        });
      // Else if that is activated if user only selects Tags for sorting
    } else if (this.state.selectedTags.length > 0) {
      API.getQuestionsBySubject(this.state.selectedTags.join("+"))
        .then(res => {
          console.log(res);
          this.setState({
            arrayOfQuestions: res.data,
            apiLoaded: true
          });
          console.log("tags are searched");
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      // Grabs all of the available questions from the database, currently only is called if the user presses start with no selections made
      API.getCheckpoints()
        .then(res => {
          console.log(res);
          this.setState({
            arrayOfQuestions: res.data[0].quiz.questions,
            cpName: res.data[0].quiz.title,
            apiLoaded: true
          });

          console.log("else is searched");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  checkAnswers(event) {
    event.preventDefault();
    for (let answer in answerMap) {
      let correct = this.state.arrayOfQuestions[answer];
      // console.log(`____Question ${answer}____`)
      // console.log(answer);
      // console.log(answerMap[answer]);
      // console.log(correct.answers[correct.answer])

      if (answerMap[answer] === correct.answers[correct.answer]) {
        totalCorrect += 1
      } else {
        incorrect.push(this.state.arrayOfQuestions[answer])
      }
      
    }

    this.showResults()
    
    console.log(this.state.arrayOfQuestions.length);
  }

  trackAnswers(answer, iterator) {
    answerMap[iterator] = answer;
  }

  showResults() {
    console.log(this.state.totalCorrect);
    this.setState({
      triggerResults: true
    });
  }

  transFormQuestion = question => {
    let newQuestion = question;
    // console.log("orig question");
    newQuestion = newQuestion.replace(/[<]+/g, "&lt;"); // React is interpreting the < and > as tags
    newQuestion = newQuestion.replace(/[>]+/g, "&gt;");
    // console.log(question);
    if (question.indexOf("```") >= 0) {
      newQuestion = newQuestion.replace("```JavaScript", "<pre>"); // this will only replace the first occurance
      newQuestion = newQuestion.replace("```", "</pre>");
      newQuestion = newQuestion.replace(/[`]+/g, ""); // strip out any danglers
      newQuestion = newQuestion.replace("\n", ""); // strip out first \n
      newQuestion = newQuestion.slice(0, newQuestion.lastIndexOf("\n")); // then remove the last one
    }
    newQuestion = newQuestion.replace(/(?:\t)/g, "    "); // grrrr
    // console.log("new question");
    // console.log(newQuestion);
    return newQuestion;
  };

  render() {
    return (
      <div className="container">
        <form action="/">
          <input type="submit" value="HOME" />
        </form>
        {!this.state.triggerResults ? (
          <form className="quiz-form">
            {this.state.arrayOfQuestions.map((question, iterator) => {
              return (
                <QuizQuestion
                  questionNum={iterator + 1}
                  question={question.question}
                  answer={question.answer}
                  options={question.answers}
                  className="row"
                  key={iterator}
                  ref={iterator}
                  trackAnswers={this.trackAnswers}
                />
              );
            })}

            <input className="row" value="Submit" type="submit" onClick={this.checkAnswers} />
          </form>
        ) : (
          <div>
            <div>
            
            <h2 className="score">You scored {(totalCorrect / this.state.arrayOfQuestions.length).toFixed(2) * 100}%</h2>
            </div>
              <ul className="results">
                {incorrect.map((answer, iterator) => {
                  console.log(answer)
                  return (
                  <li key={iterator}>
                    <p>{answer.number}. {this.transFormQuestion(answer.question)}</p>
                    <p>The correct answer is: {answer.answers[answer.answer]}</p>
                    <hr />
                  </li>
                )
                })}
              </ul>
          </div>
        )}
      </div>
    );
  }
}

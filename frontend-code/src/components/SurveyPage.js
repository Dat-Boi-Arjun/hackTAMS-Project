import React from 'react'

class SurveyPage extends React.Component {
    constructor() {
        super()
        this.state = {choice: null, submitMessage: null} 

        this.changeChoice = this.changeChoice.bind(this);
        this.submitChoice = this.submitChoice.bind(this);
    }

    changeChoice(event) {
        this.setState({choice: event.target.value})
    }

    submitChoice(event) {
        this.setState({
            submitMessage: `Let's make your break ${this.state.choice}!`
        })
        event.preventDefault();
        //Go to break suggestions
    }

    render() {
        return (
            <div className="survey">
                <form onSubmit={this.submitChoice}>
                    <label for="choice-select">How do you want to your break to be?</label>
                    <select name="choice-select" value={this.state.choice} onChange={this.changeChoice}>
                        <option value={"productive"}>Productive</option>
                        <option value={"relaxed"}>Relaxed</option>
                    </select>

                    {this.state.choice != null ? <input type="submit" value="Confirm" /> : null}
                    <p>{this.state.choice === null ? "Please choose an option": null}</p>
                </form>

                <p>{this.state.submitMessage}</p>
            </div>
        );
    }
}

export default SurveyPage;
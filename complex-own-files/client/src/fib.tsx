import React from "react";
import axios from "axios";

export class Fib extends React.Component {
  state: any = {
    seenIndexes: [],
    values: {},
    index: ""
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchIndexes() {
    const seenIndexes = await axios.get("/api/values/all");
    this.setState({ seenIndexes: seenIndexes.data });
  }

  async fetchValues() {
    const values = await axios.get("/api/values/current");
    this.setState({ values: values.data });
  }

  //send event to api that's why async
  handleSubmit = async (event: any) => {
    event.preventDefault();

    await axios.post("/api/value", {
      value: this.state.value
    });
    this.setState({ value: "" });
  };

  renderSeenIndexes(): string {
    return this.state.seenIndexes.map((res: any) => res["number"]).join(", ");
  }

  renderValues(): any {
    const entries = [];
    // for (let key in this.state.values) {
    Object.keys(this.state.values).forEach(key => {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      );
    });
    // }
    return this.state.values;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input value={this.state.index} onChange={event => this.setState({ index: event.target.value })} />
          <button>Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}
        <h3>Calcluated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

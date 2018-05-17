import React, { Component } from "react";
import { List, AutoSizer } from "react-virtualized";

class ReviewSummary extends Component {
  render() {
    return (
      //<AutoSizer>
      <div>
        Number of reviews: {this.props.reviews.length}
        {/* <ul>
            {this.props.reviews.map(r => {
              return <li>{r.text}</li>;
            })}
          </ul> */}
      </div>
      //</AutoSizer>
    );
  }
}

export default ReviewSummary;

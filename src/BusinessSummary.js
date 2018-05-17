import React, { Component } from "react";

class BusinessSummary extends Component {
  render() {
    return (
      <div>
        <ul>
          {this.props.businesses.map(b => {
            return <li>{b.name}</li>;
          })}
        </ul>
      </div>
    );
  }
}

export default BusinessSummary;

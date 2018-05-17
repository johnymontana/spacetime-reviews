import React, { Component } from "react";

class BusinessInfo extends Component {
  render() {
    const { business } = this.props;

    return (
      <div>
        <ul>
          <li>
            <strong>Name: </strong> {business.name}
          </li>
        </ul>
      </div>
    );
  }
}

export default BusinessInfo;

import React, { Component } from "react";

class BusinessInfo extends Component {
  render() {
    const { business } = this.props;

    return (
      <div>
        <ul>
          <li>
            {" "}
            <strong>Name: </strong> {business.name}{" "}
          </li>
          <li>
            <strong>Address: </strong> {business.address}{" "}
          </li>
          <li>
            <strong>City: </strong> {business.city}
          </li>
          <li>
            <strong>Categories: </strong> {business.categories.join(", ")}
          </li>
        </ul>
      </div>
    );
  }
}

export default BusinessInfo;

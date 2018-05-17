import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Grid, Cell } from "styled-css-grid";
import Map from "./Map";
import ReviewSummary from "./ReviewSummary";
import BusinessSummary from "./BusinessSummary";
import { DateRangePicker } from "react-dates";
import { START_DATE } from "react-dates/constants";
import neo4j from "neo4j-driver/lib/browser/neo4j-web";
import moment from "moment";

class App extends Component {
  constructor(props) {
    super(props);
    let focusedInput = null;

    this.state = {
      focusedInput,
      startDate: moment("2014-01-01"),
      endDate: moment("2018-01-01"),
      businesses: [],
      reviews: [],
      selectedBusiness: false,
      mapCenter: {
        latitude: 33.33,
        longitude: -111.978,
        zoom: 13
      }
    };

    // FIXME: convert all methods to arrow funcs
    this.onDatesChange = this.onDatesChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
    this.businessSelected = this.businessSelected.bind(this);

    let session = neo4j
      .driver(
        "bolt:///206.189.238.65/:7687",
        neo4j.auth.basic("reviews", "letmein")
      )
      .session();

    this.session = session;
    // Get businesses within range of center of map
    // TODO: draw circle on map
    // TODO: scale distance based on current map zoom
    session
      .run(
        `
      MATCH (b:Business) 
      WHERE distance(b.location, point({latitude: $lat, longitude: $lon})) < 10000 * ( 1.0 / $zoom )
      RETURN b LIMIT 100`,
        {
          lat: this.state.mapCenter.latitude,
          lon: this.state.mapCenter.longitude,
          zoom: this.state.mapCenter.zoom
        }
      )
      .then(result => {
        let businesses = result.records.map(record => {
          return record.get("b").properties;
        });
        this.setState({
          businesses
        });
      })
      .catch(e => {
        // TODO: handle errors.
        console.log(e);
      });
  }

  onDatesChange({ startDate, endDate }) {
    const { stateDateWrapper } = this.props;
    this.setState({
      startDate: startDate,
      endDate: endDate
    });
    this.fetchReviews();
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }

  businessSelected(b) {
    this.setState({
      selectedBusiness: b,
      startDate: moment("2014-01-01"),
      endDate: moment("2018-01-01")
    });
  }

  mapCenterChange = viewport => {
    this.setState({
      mapCenter: {
        latitude: viewport.latitude,
        longitude: viewport.longitude,
        zoom: viewport.zoom
      }
    });
  };

  fetchReviews = () => {
    this.session
      .run(
        `
    MATCH (b:Business {id: $businessId})<-[:REVIEWS]-(r:Review)
    WHERE datetime($startDate) < r.date < datetime($endDate)
    RETURN r ORDER BY r.date LIMIT 10 `,
        {
          businessId: this.state.selectedBusiness.id,
          startDate: this.state.startDate.format("YYYY-MM-DD"),
          endDate: this.state.endDate.format("YYYY-MM-DD")
        }
      )
      .then(result => {
        console.log("got some reviews");
        let reviews = result.records.map(record => {
          return record.get("r").properties;
        });
        console.log(reviews);

        if (reviews.length > 0) {
          this.setState({
            reviews,
            startDate: moment(reviews[0].date.toString()),
            endDate: moment(reviews[reviews.length - 1].date.toString())
          });
        } else {
          this.setState({
            reviews: []
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  componentDidUpdate() {}

  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.mapCenter.latitude !== nextState.mapCenter.latitude ||
      this.state.mapCenter.longitude !== nextState.mapCenter.longitude
    ) {
      // Get businesses within range of center of map
      // TODO: draw circle on map
      // TODO: scale distance based on current map zoom
      this.session
        .run(
          `
      MATCH (b:Business) 
      WHERE distance(b.location, point({latitude: $lat, longitude: $lon})) < 1000
      RETURN b LIMIT 100`,
          {
            lat: this.state.mapCenter.latitude,
            lon: this.state.mapCenter.longitude
          }
        )
        .then(result => {
          let businesses = result.records.map(record => {
            return record.get("b").properties;
          });
          this.setState({
            businesses
          });
        })
        .catch(e => {
          // TODO: handle errors.
          console.log(e);
        });
    }
    //|| (this.state.startDate.toString() !== nextState.startDate.toString()) || (this.state.endDate.toString() !== nextState.endDate.toString())
    if (
      nextState.selectedBusiness &&
      (!this.state.selectedBusiness ||
        this.state.selectedBusiness.id !== nextState.selectedBusiness.id ||
        false ||
        false)
    ) {
      console.log(this.state);
      console.log(nextState);
      this.session
        .run(
          `
        MATCH (b:Business {id: $businessId})<-[:REVIEWS]-(r:Review)
        WHERE datetime($startDate) < r.date < datetime($endDate)
        RETURN r ORDER BY r.date LIMIT 10 `,
          {
            businessId: nextState.selectedBusiness.id,
            startDate: nextState.startDate.format("YYYY-MM-DD"),
            endDate: nextState.endDate.format("YYYY-MM-DD")
          }
        )
        .then(result => {
          console.log("got some reviews");
          let reviews = result.records.map(record => {
            return record.get("r").properties;
          });
          console.log(reviews);

          if (reviews.length > 0) {
            this.setState({
              reviews,
              startDate: moment(reviews[0].date.toString()),
              endDate: moment(reviews[reviews.length - 1].date.toString())
            });
          } else {
            this.setState({
              reviews: []
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  render() {
    return (
      <Grid
        columns={"1fr 100px"}
        rows={"1fr 100px"}
        areas={[
          "header  header",
          "content ads",
          "content ads",
          "footer  footer"
        ]}
        minRowHeight="500px"
      >
        <Cell area="header">
          <DateRangePicker
            startDate={this.state.startDate} ///{this.state.startDate} // momentPropTypes.momentObj or null,
            startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
            endDate={this.state.endDate} //{this.state.endDate} // momentPropTypes.momentObj or null,
            endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
            onDatesChange={this.onDatesChange} // PropTypes.func.isRequired,
            focusedInput={this.state.focusedInput} //{this.state.focusedInput}//{this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
            onFocusChange={this.onFocusChange} // PropTypes.func.isRequired,
            isOutsideRange={day => false}
          />
        </Cell>
        <Cell area="content">
          <Map
            mapCenterChange={this.mapCenterChange}
            mapCenter={this.state.mapCenter}
            businesses={this.state.businesses}
            businessSelected={this.businessSelected}
            selectedBusiness={this.state.selectedBusiness}
          />
        </Cell>

        <Cell area="ads">
          <ReviewSummary
            business={this.state.selectedBusiness}
            reviews={this.state.reviews}
          />
        </Cell>
        <Cell area="footer">
          <BusinessSummary businesses={this.state.businesses} />
        </Cell>
      </Grid>
    );
  }
}

export default App;

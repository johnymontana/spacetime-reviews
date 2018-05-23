import React, { Component } from "react";
import "./App.css";
import { Grid, Cell } from "styled-css-grid";
import Map from "./components/Map";
import ReviewSummary from "./components/ReviewSummary";
import BusinessSummary from "./components/BusinessSummary";
import CategorySummary from "./components/CategorySummary";
import { DateRangePicker } from "react-dates";
import neo4j from "neo4j-driver/lib/browser/neo4j-web";
import { Date } from "neo4j-driver/lib/v1/temporal-types";
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
      starsData: [],
      reviews: [{ day: "2018-01-01", value: 10 }],
      categoryData: [],
      selectedBusiness: false,
      mapCenter: {
        latitude: 33.33,
        longitude: -111.978,
        zoom: 13
      }
    };

    this.driver = neo4j.driver(
      //"bolt://localhost:7687",
      //neo4j.auth.basic("neo4j", "letmein")
      "bolt://reviews.lyonwj.com:17687",
      neo4j.auth.basic("reviews", "letmein"), {encrypted: true}
    );
    this.fetchBusinesses();
    this.fetchCategories();
    this.fetchReviews();
  }

  onDatesChange = ({ startDate, endDate }) => {
    if (startDate && endDate) {
      this.setState(
        {
          startDate,
          endDate
        },
        () => {
          this.fetchBusinesses();
          this.fetchReviews();
          this.fetchCategories();
        }
      );
    } else {
      this.setState({
        startDate,
        endDate
      });
    }
  };

  onFocusChange = focusedInput => this.setState({ focusedInput });

  businessSelected = b => {
    this.setState({
      selectedBusiness: b
    });
  };

  mapCenterChange = viewport => {
    this.setState({
      mapCenter: {
        latitude: viewport.latitude,
        longitude: viewport.longitude,
        zoom: viewport.zoom
      }
    });
  };

  fetchCategories = () => {
    const { mapCenter, startDate, endDate } = this.state;
    const session = this.driver.session();

    session
      .run(
        `MATCH (b:Business)<-[:REVIEWS]-(r:Review)
        WHERE $start <= r.date <= $end AND distance(b.location, point({latitude: $lat, longitude: $lon})) < 10000 * (2/$zoom)
        WITH r,b LIMIT 1000
        WITH DISTINCT b
    OPTIONAL MATCH (b)-[:IN_CATEGORY]->(c:Category)
    WITH c.name AS cat, COUNT(b) AS num ORDER BY num DESC LIMIT 25
    RETURN COLLECT({id: cat, label: cat, value: toFloat(num)}) AS categoryData
    `,
        {
          lat: mapCenter.latitude,
          lon: mapCenter.longitude,
          zoom: mapCenter.zoom,
          start: new Date(
            startDate.year(),
            startDate.month() + 1,
            startDate.date()
          ),
          end: new Date(endDate.year(), endDate.month() + 1, endDate.date())
        }
      )
      .then(result => {
        const categoryData = result.records[0].get("categoryData");
        console.log(categoryData);
        this.setState({
          categoryData
        });
        session.close();
      })
      .catch(e => {
        console.log(e);
        session.close();
      });
  };

  fetchBusinesses = () => {
    // Get businesses within range of center of map
    // TODO: draw circle on map
    // TODO: scale distance based on current map zoom

    const { mapCenter, startDate, endDate } = this.state;
    const session = this.driver.session();
    session
      .run(
        `
        MATCH (b:Business)<-[:REVIEWS]-(r:Review)
        WHERE $start <= r.date <= $end AND distance(b.location, point({latitude: $lat, longitude: $lon})) < 10000 * (2/$zoom)
        WITH r,b LIMIT 1000
        OPTIONAL MATCH (b)-[:IN_CATEGORY]->(c:Category)
        WITH r,b, COLLECT(c.name) AS categories
        WITH COLLECT(DISTINCT b {.*, categories}) AS businesses, COLLECT(DISTINCT r) AS reviews
        UNWIND reviews AS r
        WITH businesses, r.stars AS stars, COUNT(r) AS num ORDER BY stars
        WITH businesses, COLLECT({stars: toString(stars), count:toFloat(num)}) AS starsData
        RETURN businesses, starsData`,
        {
          lat: mapCenter.latitude,
          lon: mapCenter.longitude,
          zoom: mapCenter.zoom,
          start: new Date(
            startDate.year(),
            startDate.month() + 1,
            startDate.date()
          ),
          end: new Date(endDate.year(), endDate.month() + 1, endDate.date())
        }
      )
      .then(result => {
        const record = result.records[0];
        const businesses = record.get("businesses");
        const starsData = record.get("starsData");

        this.setState({
          businesses,
          starsData
        });
        session.close();
      })
      .catch(e => {
        // TODO: handle errors.
        console.log(e);
        session.close();
      });
  };

  fetchReviews = () => {
    const { startDate, endDate, mapCenter } = this.state;

    const session = this.driver.session();

    session
      .run(
        `
          MATCH (b:Business)<-[:REVIEWS]-(r:Review)
          WHERE $start <= r.date <= $end AND distance(b.location, point({latitude: $lat, longitude: $lon})) < 10000 * (2/$zoom)
          WITH r,b LIMIT 1000
          WITH r
          WITH r.date as date, COUNT(*) AS num ORDER BY date
           WITH date.year + "-" + date.month + "-" + date.day AS reviewDate, num
          RETURN COLLECT({day: reviewDate, value: toFloat(num)}) AS reviewData
          
        
          `,
        {
          lat: mapCenter.latitude,
          lon: mapCenter.longitude,
          zoom: mapCenter.zoom,
          start: new Date(
            startDate.year(),
            startDate.month() + 1,
            startDate.date()
          ),
          end: new Date(endDate.year(), endDate.month() + 1, endDate.date())
        }
      )
      .then(result => {
        console.log("got some reviews");
        console.log(result);
        let reviews = result.records[0].get("reviewData");
        console.log(reviews);

        this.setState({
          reviews
        });

        session.close();
      })
      .catch(e => {
        console.log(e);
        session.close();
      });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      this.state.mapCenter.latitude !== prevState.mapCenter.latitude ||
      this.state.mapCenter.longitude !== prevState.mapCenter.longitude
    ) {
      this.fetchBusinesses();
      this.fetchCategories();
      this.fetchReviews();
    }
    if (
      this.state.selectedBusiness &&
      (!prevState.selectedBusiness ||
        this.state.selectedBusiness.id !== prevState.selectedBusiness.id ||
        false ||
        false)
    ) {
      // business is selected
      // TODO: fetch related businesses
    }
  };

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
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
          </div>
        </div>
        <div className="row" style={{ height: "500px" }}>
          <div className="col-sm-7">
            <Map
              mapCenterChange={this.mapCenterChange}
              mapCenter={this.state.mapCenter}
              businesses={this.state.businesses}
              businessSelected={this.businessSelected}
              selectedBusiness={this.state.selectedBusiness}
            />
          </div>
          <div className="col-sm-5">
            {/* <ReviewSummary
              business={this.state.selectedBusiness}
              reviews={this.state.reviews}
              startDate={
                this.state.startDate &&
                this.state.startDate.format("YYYY-MM-DD")
              }
              endDate={
                this.state.endDate && this.state.endDate.format("YYYY-MM-DD")
              }
            /> */}
          </div>
        </div>
        <div className="row">
          <div className="col-sm-7">
            <BusinessSummary
              businesses={this.state.businesses}
              starsData={this.state.starsData}
            />
          </div>

          <div className="col-sm-5">
            <CategorySummary categoryData={this.state.categoryData} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

import React, { Component } from "react";
import { List, AutoSizer } from "react-virtualized";
import { Calendar } from "nivo";

class ReviewSummary extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.startDate || !nextProps.endDate) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    console.log(this.props);
    const reviewCalendar = [
      {
        day: "2015-06-11",
        value: 279
      },
      {
        day: "2015-10-06",
        value: 307
      },
      {
        day: "2016-05-11",
        value: 392
      },
      {
        day: "2015-07-20",
        value: 58
      },
      {
        day: "2016-07-10",
        value: 46
      },
      {
        day: "2016-04-20",
        value: 172
      }
    ];

    return (
      <Calendar
        data={this.props.reviews}
        height={510}
        width={400}
        from={this.props.startDate}
        to={this.props.endDate}
        emptyColor="#eeeeee"
        colors={["#61cdbb", "#97e3d5", "#e8c1a0", "#f47560"]}
        margin={{
          top: 40,
          right: 30,
          bottom: 10,
          left: 30
        }}
        domain="auto"
        yearSpacing={40}
        monthBorderColor="#ffffff"
        //monthLegendOffset={10}
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
        // legends={[
        //   {
        //     anchor: "bottom-right",
        //     direction: "row",
        //     translateY: 36,
        //     itemCount: 4,
        //     itemWidth: 34,
        //     itemHeight: 36,
        //     itemDirection: "top-to-bottom"
        //   }
        // ]}
      />
    );
  }
}

export default ReviewSummary;

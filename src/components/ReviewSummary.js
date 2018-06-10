import React, { Component } from "react";
import { Bar } from "nivo";
import { AutoSizer } from "react-virtualized";

class ReviewSummary extends Component {
  render() {
    return (
      
      <AutoSizer>
            {({ height, width }) => (
      <Bar
        height={height}
        width={width}
        data={this.props.starsData}
        keys={["count"]}
        indexBy="stars"
        margin={{
          top: 25,
          right: 25,
          bottom: 25,
          left: 40
        }}
        padding={0.3}
        colors="nivo"
        colorBy="id"
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "#38bcb2",
            size: 4,
            padding: 1,
            stagger: true
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "#eed312",
            rotation: -45,
            lineWidth: 6,
            spacing: 10
          }
        ]}
        fill={[
          {
            match: {
              id: "count"
            },
            id: "dots"
          },
          {
            match: {
              id: "sandwich"
            },
            id: "lines"
          }
        ]}
        borderColor="inherit:darker(1.6)"
        axisBottom={{
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Review count by stars",
          legendPosition: "center",
          legendOffset: 36
        }}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Num reviews",
          legendPosition: "center",
          legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="inherit:darker(1.6)"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            translateX: 120,
            itemWidth: 100,
            itemHeight: 20,
            itemsSpacing: 2,
            symbolSize: 20
          }
        ]}
        theme={{
          tooltip: {
            container: {
              fontSize: "13px"
            }
          },
          labels: {
            textColor: "#555"
          }
        }}
      />
      )}
      </AutoSizer>
    );
  }
}

export default ReviewSummary;

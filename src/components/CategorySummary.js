import React, { Component } from "react";
import { ResponsivePie } from "nivo";
import { AutoSizer } from "react-virtualized";

class CategorySummary extends Component {
  render() {
    return (
      <ResponsivePie
        height={400}
        //width={width}
        data={this.props.categoryData}
        margin={{
          top: 10,
          right: 10,
          bottom: 10,
          left: 10
        }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors="d320c"
        colorBy="id"
        borderColor="inherit:darker(0.6)"
        radialLabelsSkipAngle={10}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={16}
        radialLabelsLinkHorizontalLength={24}
        radialLabelsLinkStrokeWidth={1}
        radialLabelsLinkColor="inherit"
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor="#333333"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        sortByValue={true}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            translateY: 56,
            itemWidth: 100,
            itemHeight: 14,
            symbolSize: 14,
            symbolShape: "circle"
          }
        ]}
      />
    );
  }
}

export default CategorySummary;

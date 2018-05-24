import React, { Component } from "react";
import { Pie } from "nivo";
import { AutoSizer } from "react-virtualized";

class CategorySummary extends Component {
  render() {
    return (
        <AutoSizer>
            {({ height, width }) => (
                
      <Pie
        height={height}
        width={width}
        data={this.props.categoryData}
        margin={{
          top: 75,
          right: 75,
          bottom: 75,
          left: 75
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
            itemWidth: 75,
            itemHeight: 14,
            symbolSize: 14,
            symbolShape: "circle"
          }
        ]}
      />
    )}
    </AutoSizer>
    );
  }
}

export default CategorySummary;

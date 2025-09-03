
import { Colors } from '@/constants/Colors';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Svg, G, Polygon, Line, Text as SvgText, Circle } from 'react-native-svg';

const FONT_SIZE = 10;
const PADDING = 40;

interface RadarChartProps {
  datasets: {
    data: number[];
    color: string;
    name?: string;
  }[];
  labels: string[];
  size: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ datasets, labels, size }) => {
  const radius = (size - PADDING * 2) / 2;
  const center = size / 2;
  const numAxes = labels.length;
  const angleSlice = (Math.PI * 2) / numAxes;
  const scale = 4; // Because indicator values are 0-4

  const gridColor = Colors.dark.secondary;
  const labelColor = Colors.dark.text;

  // 1. Calculate coordinates for axes and labels
  const axes = labels.map((label, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    const labelX = center + (radius + PADDING / 2) * Math.cos(angle);
    const labelY = center + (radius + PADDING / 2) * Math.sin(angle);
    return { x, y, label, labelX, labelY };
  });

  // 2. Draw the concentric grid levels (0-4)
  const gridLevels = Array.from({ length: scale + 1 }).map((_, levelIndex) => {
    const levelRadius = (radius / scale) * levelIndex;
    const points = labels.map((__, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = center + levelRadius * Math.cos(angle);
      const y = center + levelRadius * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
    return <Polygon key={`level-${levelIndex}`} points={points} fill="none" stroke={gridColor} strokeWidth="1" />;
  });

  // 3. Draw the data polygons
  const dataPolygons = datasets.map((dataset, datasetIndex) => {
    const points = dataset.data.map((value, i) => {
      const pointRadius = (value / scale) * radius;
      const angle = angleSlice * i - Math.PI / 2;
      const x = center + pointRadius * Math.cos(angle);
      const y = center + pointRadius * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');

    const dataPoints = dataset.data.map((value, i) => {
        const pointRadius = (value / scale) * radius;
        const angle = angleSlice * i - Math.PI / 2;
        const x = center + pointRadius * Math.cos(angle);
        const y = center + pointRadius * Math.sin(angle);
        return <Circle key={`point-${datasetIndex}-${i}`} cx={x} cy={y} r="3" fill={dataset.color} />;
    });

    return (
      <G key={`dataset-${datasetIndex}`}>
        <Polygon
          points={points}
          fill={dataset.color}
          fillOpacity="0.3"
          stroke={dataset.color}
          strokeWidth="2"
        />
        {dataPoints}
      </G>
    );
  });

  return (
    <View style={styles.container}>
      <Svg height={size} width={size}>
        <G>
          {/* Grid and Axes */}
          {gridLevels}
          {axes.map((axis, i) => (
            <Line key={`axis-${i}`} x1={center} y1={center} x2={axis.x} y2={axis.y} stroke={gridColor} strokeWidth="1" />
          ))}

          {/* Data */}
          {dataPolygons}

          {/* Labels */}
          {axes.map((axis, i) => (
            <SvgText
              key={`label-${i}`}
              x={axis.labelX}
              y={axis.labelY}
              fontSize={FONT_SIZE}
              fill={labelColor}
              textAnchor={axis.labelX > center ? 'start' : axis.labelX < center ? 'end' : 'middle'}
              alignmentBaseline="middle"
            >
              {axis.label}
            </SvgText>
          ))}
          
          {/* Scale Labels (0-4) */}
          {Array.from({ length: scale }).map((_, i) => {
              const level = i + 1;
              const levelRadius = (radius / scale) * level;
              return (
                <SvgText key={`scale-label-${i}`} x={center + 5} y={center - levelRadius - 2} fontSize="10" fill={labelColor} opacity="0.7">
                    {level}
                </SvgText>
              )
          })}
        </G>
      </Svg>
      {datasets.length > 1 && (
        <View style={styles.legendContainer}>
            {datasets.map(d => (
                <View key={d.name} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: d.color }]} />
                    <Text style={[styles.legendText, { color: labelColor }]}>{d.name}</Text>
                </View>
            ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
  }
});

export default RadarChart;

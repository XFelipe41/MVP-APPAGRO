
import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Circle, G, Line, Polygon, Svg, Text as SvgText, TSpan } from 'react-native-svg';

const FONT_SIZE = 10;
const PADDING = 40;

// Helper function to wrap text
const wrapText = (text: string, maxChars: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + word).length > maxChars) {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
            currentLine += word + ' ';
        }
    });
    lines.push(currentLine.trim());
    return lines;
};


interface RadarChartProps {
  datasets: {
    data: number[];
    color: string;
    name?: string;
  }[];
  labels: { question: string; dimension: string }[];
  size: number;
  theme?: 'light' | 'dark';
}

const RadarChart: React.FC<RadarChartProps> = ({ datasets, labels, size, theme = 'dark' }) => {
  const radius = (size - PADDING * 2) / 2;
  const center = size / 2;
  const numAxes = labels.length;
  const angleSlice = (Math.PI * 2) / numAxes;
  const scale = 4; // Because indicator values are 0-4

  const isLightTheme = theme === 'light';
  const gridColor = isLightTheme ? Colors.light.secondary : Colors.dark.secondary;
  const labelColor = isLightTheme ? Colors.light.text : Colors.dark.text;

  // 1. Calculate coordinates for axes and labels
  const axes = labels.map((label, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    const labelX = center + (radius + PADDING / 2) * Math.cos(angle);
    const labelY = center + (radius + PADDING / 2) * Math.sin(angle);
    return { x, y, label: label.question, labelX, labelY, dimension: label.dimension };
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

  // 4. Group axes by dimension for labels
  const dimensionGroups = labels.reduce((acc, label, i) => {
    if (!acc[label.dimension]) {
      acc[label.dimension] = [];
    }
    acc[label.dimension].push(i);
    return acc;
  }, {} as Record<string, number[]>);

  const dimensionLabels = Object.keys(dimensionGroups).map(dimension => {
    const indices = dimensionGroups[dimension];
    const firstAngle = angleSlice * indices[0] - Math.PI / 2;
    const lastAngle = angleSlice * indices[indices.length - 1] - Math.PI / 2;
    const midAngle = (firstAngle + lastAngle) / 2;

    const labelRadius = radius * 0.5; // Adjust this to position the labels inside the chart
    const x = center + labelRadius * Math.cos(midAngle);
    const y = center + labelRadius * Math.sin(midAngle);

    return (
      <SvgText
        key={dimension}
        x={x}
        y={y}
        fontSize={FONT_SIZE + 2}
        fontWeight="bold"
        fill={labelColor}
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {dimension}
      </SvgText>
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

          {/* Dimension Labels */}
          {dimensionLabels}

          {/* Labels */}
          {axes.map((axis, i) => {
            const wrappedLabel = wrapText(axis.label, 15); // Wrap text at 15 chars
            return (
              <SvgText
                key={`label-${i}`}
                x={axis.labelX}
                y={axis.labelY}
                fontSize={FONT_SIZE}
                fill={labelColor}
                textAnchor={axis.labelX > center + 1 ? 'start' : axis.labelX < center - 1 ? 'end' : 'middle'}
                alignmentBaseline="middle"
              >
                {wrappedLabel.map((line, lineIndex) => (
                  <TSpan key={lineIndex} x={axis.labelX} dy={lineIndex === 0 ? 0 : FONT_SIZE + 2}>
                    {line}
                  </TSpan>
                ))}
              </SvgText>
            );
          })}
          
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

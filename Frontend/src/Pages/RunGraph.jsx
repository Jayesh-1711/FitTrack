import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function RunGraphs({ data }) {
  return (
    <div style={{ width: "100%", height: 350 }}>

      <h3 style={{ textAlign: "center" }}>Run Performance Graph</h3>

      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="distance"
            label={{ value: "Distance (km)", position: "insideBottom", offset: -5 }}
          />

          <YAxis
            label={{ value: "Time / Pace", angle: -90, position: "insideLeft" }}
          />

          <Tooltip />
          <Legend />

          
          <Line
            type="monotone"
            dataKey="time"
            stroke="#ff0000"
            name="Time (min)"
            strokeWidth={3}
          />

          
          <Line
            type="monotone"
            dataKey="pace"
            stroke="#0066ff"
            name="Pace (min/km)"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
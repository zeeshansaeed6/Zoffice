import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
)

/**
 * ChartElement renders embedded slide charts using Chart.js.
 *
 * @param {Object} props
 * @param {Object} props.element
 */
export function ChartElement({ element }) {
  const { properties = {} } = element
  const {
    chartType = 'bar',
    title = 'Sales Performance',
    labels = ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets = [
      {
        label: 'Revenue ($k)',
        data: [120, 190, 300, 500],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
        borderColor: '#1d4ed8',
        borderWidth: 1,
      },
    ],
  } = properties

  const data = { labels, datasets }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 12, font: { size: 10 } } },
      title: { display: !!title, text: title, font: { size: 12, weight: 'bold' } },
    },
  }

  return (
    <div className="shadow-xs h-full w-full rounded border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-900">
      {chartType === 'line' && <Line data={data} options={options} />}
      {chartType === 'pie' && <Pie data={data} options={options} />}
      {chartType !== 'line' && chartType !== 'pie' && <Bar data={data} options={options} />}
    </div>
  )
}

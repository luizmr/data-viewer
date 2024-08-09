import React, { useEffect, useState } from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import formatDateString from '../../utils/formatDateString'
import { useDataContext } from '../../context'
import { Box } from '@mui/material'

const OutOfServiceBarChart: React.FC = () => {
  const { filteredData } = useDataContext()
  const [chartData, setChartData] = useState<{ month: string; count: number }[]>([])

  useEffect(() => {
    const aggregatedData: { [key: string]: number } = {}

    filteredData
      .filter((row) => row?.out_of_service_date)
      .forEach((item) => {
        const monthYear = formatDateString(item.out_of_service_date, true)

        if (aggregatedData[monthYear]) {
          aggregatedData[monthYear]++
        } else {
          aggregatedData[monthYear] = 1
        }
      })

    const chartDataArray = Object.keys(aggregatedData).map((key) => ({
      month: key,
      count: aggregatedData[key],
    }))

    setChartData(chartDataArray)
  }, [filteredData])

  return (
    <Box my={5}>
      <BarChart
        dataset={chartData}
        series={[
          {
            dataKey: 'count',
            label: 'Number of Companies',
          },
        ]}
        xAxis={[
          {
            label: 'Month/Year',
            dataKey: 'month',
            scaleType: 'band',
          },
        ]}
        height={500}
      />
    </Box>
  )
}

export default OutOfServiceBarChart

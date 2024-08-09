import React, { useEffect, useState } from 'react'
import { Box, Container } from '@mui/material'
import Filters from '../../components/Filters'
import { FiltersType } from '../../types'
import PageHeader from '../../components/PageHeader'
import TableRenderers from 'react-pivottable/TableRenderers'
import PivotTableUI from 'react-pivottable/PivotTableUI'
import 'react-pivottable/pivottable.css'
import { useDataContext } from '../../context'
import { useSearchParams } from 'react-router-dom'
import { getYear, getMonth, getISOWeek } from 'date-fns'
import Plot from 'react-plotly.js'
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers'

const PlotlyRenderers = createPlotlyRenderers(Plot)

const preprocessDate = (dateStr: any, key: string) => {
  if (!dateStr) return { year: null, month: null, week: null }

  const date = new Date(dateStr)
  const yearKey = `${key}_year`
  const monthKey = `${key}_month`
  const weekKey = `${key}_week`

  return {
    [yearKey]: getYear(date),
    [monthKey]: getMonth(date) + 1,
    [weekKey]: getISOWeek(date),
  }
}

const PivotDataViewer: React.FC = () => {
  const { filteredData, filters, pivotSharedData, setPivotSharedData } = useDataContext()
  const [pivotState, setPivotState] = useState<any>({
    ...(pivotSharedData?.rows
      ? {
          rows: pivotSharedData?.rows,
        }
      : {}),
    ...(pivotSharedData?.cols
      ? {
          cols: pivotSharedData?.cols,
        }
      : {}),
    renderers: Object.assign({}, TableRenderers),
    rendererName: 'Table',
  })
  const [pivotChartState, setPivotChartState] = useState<any>({
    ...(pivotSharedData?.rows
      ? {
          rows: pivotSharedData?.rows,
        }
      : {}),
    ...(pivotSharedData?.cols
      ? {
          cols: pivotSharedData?.cols,
        }
      : {}),
    renderers: Object.assign({}, PlotlyRenderers),
    rendererName: 'Grouped Column Chart',
  })
  const [isPivotLoaded, setIsPivotLoaded] = useState<boolean>(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const pivotData = filteredData.map(
    ({ created_dt, data_source_modified_dt, out_of_service_date, ...row }) => ({
      ...row,
      ...preprocessDate(created_dt, 'created_dt'),
      ...preprocessDate(data_source_modified_dt, 'data_source_modified_dt'),
      ...preprocessDate(out_of_service_date, 'out_of_service_date'),
    }),
  )

  useEffect(() => {
    const params: { [key: string]: string } = {}

    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof FiltersType]) {
        params[key] = filters[key as keyof FiltersType] as string
      }
    })
    if (pivotSharedData?.rows) params['rows'] = JSON.stringify(pivotSharedData.rows)
    if (pivotSharedData?.cols) params['cols'] = JSON.stringify(pivotSharedData.cols)

    setSearchParams(params)
  }, [filters, pivotSharedData, setSearchParams])

  useEffect(() => {
    if (!isPivotLoaded) {
      const params = new URLSearchParams(searchParams)
      const rows = params.get('rows')
      const cols = params.get('cols')

      if (rows || cols) {
        const rowsParsed = rows ? JSON.parse(rows) : []
        const colsParsed = cols ? JSON.parse(cols) : []

        setPivotState({
          ...pivotState,
          rows: rowsParsed,
          cols: colsParsed,
        })
        setPivotChartState({
          ...pivotChartState,
          rows: rowsParsed,
          cols: colsParsed,
        })

        setPivotSharedData({
          rows: rowsParsed,
          cols: colsParsed,
        })
      }
      setIsPivotLoaded(true)
    }
  }, [searchParams, isPivotLoaded])

  return (
    <Container>
      <PageHeader title={'Pivot Table Data Viewer'} />
      <Filters />
      <Box my={5}>
        <PivotTableUI
          {...pivotState}
          renderers={Object.assign({}, TableRenderers)}
          data={pivotData as any}
          onChange={(s) => {
            console.log('s1', s)
            setPivotState(s)

            setPivotChartState({
              ...s,
              rendererName: pivotChartState?.rendererName,
              renderers: pivotChartState?.renderers,
            })

            setPivotSharedData({
              rows: s.rows,
              cols: s.cols,
            })
          }}
        />
      </Box>
      <Box my={5}>
        <PivotTableUI
          {...pivotChartState}
          renderers={Object.assign({}, PlotlyRenderers)}
          data={pivotData as any}
          onChange={(s) => {
            console.log('s2', s)
            setPivotChartState(s)

            setPivotState({
              ...s,
              rendererName: pivotState?.rendererName,
              renderers: pivotState?.renderers,
            })

            setPivotSharedData({
              rows: s.rows,
              cols: s.cols,
            })
          }}
        />
      </Box>
    </Container>
  )
}

export default PivotDataViewer

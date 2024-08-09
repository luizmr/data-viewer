import React, { useEffect, useState } from 'react'
import {
  TextField,
  Grid,
  Button,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from '@mui/material'
import { FiltersType } from '../../types/'
import { ENTITY_TYPES, OPERATING_STATUS, USER_FILTERS_KEY } from '../../constants'
import { useDataContext } from '../../context'
import { useLocation } from 'react-router-dom'
import { saveFiltersToLocalStorage } from '../../utils/localStorageFunctions'

const Filters: React.FC = () => {
  const [temporaryFilters, setTemporaryFilters] = useState<FiltersType>({})
  const [isFiltersLoaded, setIsFiltersLoaded] = useState<boolean>(false)
  const { filters, setFilters } = useDataContext()
  const location = useLocation()

  useEffect(() => {
    if (!isFiltersLoaded) {
      const queryParams = new URLSearchParams(location.search)
      const parsedFilters: Partial<Record<string, any>> = { ...filters }

      queryParams.forEach((value, key) => {
        if (
          key in
          {
            created_dt: '',
            data_source_modified_dt: '',
            entity_type: '',
            operating_status: '',
            legal_name: '',
            dba_name: '',
            physical_address: '',
            phone: '',
            usdot_number: 0,
            mc_mx_ff_number: '',
            power_units: 0,
            out_of_service_date: '',
          }
        ) {
          if (key === 'usdot_number' || key === 'power_units') {
            parsedFilters[key] = Number(value) as FiltersType[keyof FiltersType]
          } else {
            parsedFilters[key] = value as FiltersType[keyof FiltersType]
          }
        }
      })

      setTemporaryFilters(parsedFilters as FiltersType)
      setFilters(parsedFilters as FiltersType)
      saveFiltersToLocalStorage(parsedFilters, USER_FILTERS_KEY)
      setIsFiltersLoaded(true)
    }
  }, [location.search, isFiltersLoaded, setFilters])

  const handleChange =
    (field: keyof FiltersType) =>
    (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      setTemporaryFilters({ ...temporaryFilters, [field]: event.target.value as string })
    }

  const handleSelectChange = (field: keyof FiltersType) => (event: SelectChangeEvent) => {
    setTemporaryFilters({ ...temporaryFilters, [field]: event.target.value as string })
  }

  const handleApplyFilters = () => {
    setFilters(temporaryFilters)
    saveFiltersToLocalStorage(temporaryFilters, USER_FILTERS_KEY)
  }

  const handleRemoveFilters = () => {
    setTemporaryFilters({})
    setFilters({})
    saveFiltersToLocalStorage({}, USER_FILTERS_KEY)
  }

  const {
    created_dt = '',
    data_source_modified_dt = '',
    entity_type = 'ALL',
    operating_status = 'ALL',
    legal_name = '',
    dba_name = '',
    physical_address = '',
    phone = '',
    usdot_number = '',
    mc_mx_ff_number = '',
    power_units = '',
    out_of_service_date = '',
  } = temporaryFilters

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Created Date"
          type="date"
          fullWidth
          onChange={handleChange('created_dt')}
          value={created_dt}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Modified Date"
          type="date"
          fullWidth
          onChange={handleChange('data_source_modified_dt')}
          value={data_source_modified_dt}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <FormControl fullWidth>
          <InputLabel>Entity Type</InputLabel>
          <Select
            label="Entity Type"
            value={entity_type}
            onChange={handleSelectChange('entity_type')}
          >
            <MenuItem value="ALL">ALL</MenuItem>
            {ENTITY_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <FormControl fullWidth>
          <InputLabel>Operating Status</InputLabel>
          <Select
            label="Operating Status"
            value={operating_status}
            onChange={handleSelectChange('operating_status')}
          >
            <MenuItem value="ALL">ALL</MenuItem>
            {OPERATING_STATUS.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Legal Name"
          fullWidth
          onChange={handleChange('legal_name')}
          value={legal_name}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="DBA Name"
          fullWidth
          onChange={handleChange('dba_name')}
          value={dba_name}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Physical Address"
          fullWidth
          onChange={handleChange('physical_address')}
          value={physical_address}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField label="Phone" fullWidth onChange={handleChange('phone')} value={phone} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="DOT"
          type="number"
          fullWidth
          onChange={handleChange('usdot_number')}
          value={usdot_number}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="MC/MX/FF"
          fullWidth
          onChange={handleChange('mc_mx_ff_number')}
          value={mc_mx_ff_number}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Power Units"
          type="number"
          fullWidth
          onChange={handleChange('power_units')}
          value={power_units}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Out of Service Date"
          type="date"
          fullWidth
          onChange={handleChange('out_of_service_date')}
          value={out_of_service_date}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" marginTop={2}>
          <Button variant="contained" onClick={handleApplyFilters}>
            Apply Filters
          </Button>

          <Button
            variant="outlined"
            color="error"
            disabled={Object.keys(temporaryFilters).length === 0}
            onClick={handleRemoveFilters}
          >
            Clear Filters
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Filters

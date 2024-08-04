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
import { DataRowType, FiltersType } from '../../types/'
import { ENTITY_TYPES, OPERATING_STATUS } from '../../constants'

interface FiltersProps {
  onApplyFilters: (filters: FiltersType) => void
  data: DataRowType[]
}

const Filters: React.FC<FiltersProps> = ({ onApplyFilters, data }) => {
  const [filters, setFilters] = useState<FiltersType>({})

  const handleChange =
    (field: keyof FiltersType) =>
    (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      setFilters({ ...filters, [field]: event.target.value as string })
    }

  const handleSelectChange = (field: keyof FiltersType) => (event: SelectChangeEvent) => {
    setFilters({ ...filters, [field]: event.target.value as string })
  }

  const handleApplyFilters = () => {
    onApplyFilters(filters)
  }

  const handleRemoveFilters = () => {
    setFilters({})
    onApplyFilters({})
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
  } = filters

  useEffect(() => {
    data.length === 0 && handleRemoveFilters()
  }, [data])

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
          <Button variant="contained" disabled={data.length === 0} onClick={handleApplyFilters}>
            Apply Filters
          </Button>

          <Button
            variant="outlined"
            color="error"
            disabled={data.length === 0 || (Object.keys(filters).length === 0 && data.length !== 0)}
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

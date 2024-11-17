import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { deleteContacts, fetchContacts } from '../services/api';
import { Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorPage from './ErrorPage';

interface Data {
  id: number;
  name:string;
  email:string;
  phone:string;
  company:string;
  job_title:string;
}


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'email',
    numeric: true,
    disablePadding: false,
    label: 'Email',
  },
  {
    id: 'phone',
    numeric: true,
    disablePadding: false,
    label: 'Phone',
  },
  {
    id: 'company',
    numeric: true,
    disablePadding: false,
    label: 'Company',
  },
  {
    id: 'job_title',
    numeric: true,
    disablePadding: false,
    label: 'Job title',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: Readonly<EnhancedTableProps>) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
interface EnhancedTableToolbarProps {
  numSelected: number;
  selected:string[];
  handleDelete: (ids:string[])=>void;
  handleEdit:(id:string)=>void;
}
function EnhancedTableToolbar(props: Readonly<EnhancedTableToolbarProps>) {
  const { numSelected, selected, handleDelete, handleEdit } = props;
  
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Contacts
        </Typography>
      )}
      {numSelected > 0 ? (
        <div className='flex'>
          {numSelected===1 &&(
            <div onClick={()=>{handleEdit(selected[0])}}>
              <Tooltip title="Edit">
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </div>
          )}
          <div 
            onClick={async ()=>{
              await handleDelete(selected)
            }}
          >
            <Tooltip title="Delete">
              <IconButton>
                <DeleteIcon/>
              </IconButton>
            </Tooltip> 
          </div>
        </div>
      ) : (
        <></>
      )}
    </Toolbar>
  );
}
function ContactDisplay() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('name');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows,setRows]=React.useState<any>([])
  const [isLoading,setLoading]=React.useState(false)
  const [error,setError]=React.useState("")
  const navigate=useNavigate()
  React.useEffect(()=>{
    const loadContacts = async () => {
      setLoading(true)
      const result = await fetchContacts()
      if (result[0]?.message) {
        setError(result[0].message)
      } 
      else {
        setRows(result)
      }
      setLoading(false)
    };

    loadContacts();
  },[])

  const handleContactsDelete=async (selected:string[])=>{
    setLoading(true)
    const res=await deleteContacts({ids:selected})
    if (res[0]?.message) {
      setError(res[0].message)
    } 
    else{
      setRows(res)
    }
    setLoading(false)
  }
  const handleContactsEdit=(id:string)=>{
    navigate(`/update-contact/${id}`)
  }
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n:any) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage,rows],
  );

  return (
    <div>
      {isLoading? (
        <div className=' h-screen w-screen flex justify-center items-center'>
          <CircularProgress size="3rem" />
        </div>
      ):(
        <div className=' h-screen w-screen bg-slate-100'>
          {error?(
            <ErrorPage
              errorMessage={error}
            />
          ):(
            <div>
              <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                  <EnhancedTableToolbar 
                    numSelected={selected.length}
                    selected={selected} 
                    handleDelete={handleContactsDelete}
                    handleEdit={handleContactsEdit}
                  />
                  <TableContainer>
                    <Table
                      sx={{ minWidth: 750 }}
                      aria-labelledby="tableTitle"
                      size={dense ? 'small' : 'medium'}
                    >
                      <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                      />
                      <TableBody>
                        {visibleRows.map((row, index) => {
                          const isItemSelected = selected.includes(row._id);
                          const labelId = `enhanced-table-checkbox-${index}`;
          
                          return (
                            <TableRow
                              hover
                              onClick={(event) => handleClick(event, row._id)}
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row._id}
                              selected={isItemSelected}
                              sx={{ cursor: 'pointer' }}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  color="primary"
                                  checked={isItemSelected}
                                  inputProps={{
                                    'aria-labelledby': labelId,
                                  }}
                                />
                              </TableCell>
                              <TableCell
                                component="th"
                                id={labelId}
                                scope="row"
                                padding="none"
                              >
                                {row.name}
                              </TableCell>
                              <TableCell align="right">{row.email}</TableCell>
                              <TableCell align="right">{row.phone}</TableCell>
                              <TableCell align="right">{row.company}</TableCell>
                              <TableCell align="right">{row.job_title}</TableCell>
                            </TableRow>
                          );
                        })}
                        {emptyRows > 0 && (
                          <TableRow
                            style={{
                              height: (dense ? 33 : 53) * emptyRows,
                            }}
                          >
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
                
              </Box>
              <div className='flex justify-center'>
                <Button onClick={()=>{navigate('/create-contact')}} className='w-80' variant="contained">+ Add New Contact</Button>
              </div>

            </div>
          )}
        </div>
  
      )}

    </div>
  );
}

export default ContactDisplay
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

interface Column {
    id: 'name' | 'avatar' | 'status' | 'party' | 'channelInstanceId' | 'instanceId' | 'action';
    label: string;
    minWidth?: number;
    align?: 'right';
}

const columns: Column[] = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'avatar', label: 'Avatar', minWidth: 100 },
    {
        id: 'status',
        label: 'Status',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'party',
        label: 'Party',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'channelInstanceId',
        label: "Channel Instance",
        minWidth: 170,
        align: 'right'
    },
    {
        id: 'instanceId',
        label: 'Instance',
        minWidth: 170,
        align: 'right'
    },
    {
        id: 'action',
        label: 'Action',
        minWidth: 170,
        align: 'right',
    },
];

interface Data {
    name: string;
    avatar: string;
    status: string;
    party: string;
    channelInstanceId: string,
    instanceId: string,
    action: any
}





const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: "80vh",
    },
    actionStyle: {
        textDecoration: "none",
        color: "#000",
        marginRight: "10px"
    }
});

interface Props {
    adminUsers: any
}

const UserTable = (props: Props) => {
    const { adminUsers } = props;
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const createData = (name: string, avatar: string, status: string, party: string, channelInstanceId: string, instanceId: string): Data => {

        return {
            name,
            avatar,
            status,
            party,
            channelInstanceId,
            instanceId,
            action: (
                <>
                    <a href="#h" className={classes.actionStyle}> View </a>
                    <a href="#h" className={classes.actionStyle}> Edit </a>
                    <a href="#h" className={classes.actionStyle}> Delete </a>
                </>
            )
        };
    };

    

    const rows = adminUsers.map(el => createData(el.name, el.avatarId || "coming soon", el.userRole, el.partyId || "", el.channelInstanceId || "", el.instanceId || "" ));

    return (
        <div className={classes.root}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.size}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </div>
    );
};


export default UserTable;
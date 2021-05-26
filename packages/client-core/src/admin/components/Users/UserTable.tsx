import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { removeUserAdmin, fetchUsersAsAdmin } from '../../reducers/admin/service';
import { bindActionCreators, Dispatch } from "redux";
import { connect } from 'react-redux';
import { selectAuthState } from '../../../user/reducers/auth/selector';
import { selectAdminState } from '../../reducers/admin/selector';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ViewUser from "./ViewUser";
import { useStyle } from "./styles";

interface Column {
    id: 'name' | 'avatar' | 'status' | 'location' | 'inviteCode' | 'instanceId' | 'action';
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
        id: 'location',
        label: 'Location',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'inviteCode',
        label: "Invite code",
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
    id: string;
    user: any;
    name: string;
    avatar: string;
    status: string;
    location: string;
    inviteCode: string,
    instanceId: string,
    action: any
}
interface Props {
    removeUserAdmin?: any;
    authState?: any;
    adminState?: any;
    fetchUsersAsAdmin?: any
}

const mapStateToProps = (state: any): any => {
    return {
        authState: selectAuthState(state),
        adminState: selectAdminState(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch): any => ({
    removeUserAdmin: bindActionCreators(removeUserAdmin, dispatch),
    fetchUsersAsAdmin: bindActionCreators(fetchUsersAsAdmin, dispatch)
});

const UserTable = (props: Props) => {
    const { removeUserAdmin, fetchUsersAsAdmin, authState, adminState } = props;
    const classes = useStyle();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [popConfirmOpen, setPopConfirmOpen] = React.useState(false);
    const [userId, setUserId] = React.useState("");
    const [viewModel, setViewModel] = React.useState(false);
    const [userAdmin, setUserAdmin] = React.useState("");

    const user = authState.get("user");
    const adminUsers = adminState.get("users").get("users");
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    React.useEffect(() => {
        const fetchData = async () => {
            await fetchUsersAsAdmin();
        };
        if ((adminState.get('users').get('updateNeeded') === true) && user.id) fetchData();

    }, [adminState, user, fetchUsersAsAdmin]);

    const openViewModel = (open: boolean, user: any) =>
        (
            event: React.KeyboardEvent | React.MouseEvent,
        ) => {
            if (
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }
            setUserAdmin(user);
            setViewModel(open);
        };

    const closeViewModel = (open) => {
        setViewModel(open);
    };

    const createData = (id: any, user: any, name: string, avatar: string, status: string, location: string, inviteCode: string, instanceId: string): Data => {
        return {
            id,
            user,
            name,
            avatar,
            status,
            location,
            inviteCode,
            instanceId,
            action: (
                <>
                    <a href="#h" className={classes.actionStyle} onClick={openViewModel(true, user)}> View </a>
                    <a href="#h" className={classes.actionStyle} onClick={() => { setPopConfirmOpen(true); setUserId(id); }}> <span className={classes.spanDange}>Delete</span> </a>
                </>
            )
        };
    };

    const rows = adminUsers.map(el => {
        const loc = el.party.id ? el.party.location : null;
        const loca = loc ? loc.name || <span className={classes.spanNone}>None</span> : <span className={classes.spanNone}>None</span>;
        const ins = el.party.id ? el.party.instance : null;
        const inst = ins ? ins.ipAddress || <span className={classes.spanNone}>None</span> : <span className={classes.spanNone}>None</span>;

        return createData(el.id, el, el.name, el.avatarId || <span className={classes.spanNone}>None</span>, el.userRole || <span className={classes.spanNone}>None</span>, loca, el.inviteCode || <span className={classes.spanNone}>None</span>, inst);
    });


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
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, id) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
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
            <Dialog
                open={popConfirmOpen}
                onClose={() => setPopConfirmOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Confirm to delete this user!</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setPopConfirmOpen(false)} className={classes.spanNone}>
                        Cancel
                    </Button>
                    <Button className={classes.spanDange} onClick={async () => { await removeUserAdmin(userId); setPopConfirmOpen(false); }} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            {
                userAdmin &&
                <ViewUser
                    open={viewModel}
                    handleClose={openViewModel}
                    userAdmin={userAdmin}
                    closeViewModel={closeViewModel}
                />
            }
        </div>
    );
};


export default connect(mapStateToProps, mapDispatchToProps)(UserTable);
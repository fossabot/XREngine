import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { createUser as createUserAction } from "../../reducers/admin/user/service";
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { fetchUserRole } from "../../reducers/admin/user/service";
import { selectAdminState } from "../../reducers/admin/selector";
import DialogContentText from '@material-ui/core/DialogContentText';
import CreateUserRole from "./CreateUserRole";
import DialogActions from '@material-ui/core/DialogActions';
import Container from '@material-ui/core/Container';
import DialogTitle from '@material-ui/core/DialogTitle';
import { formValid } from "./validation";
import { selectAuthState } from "../../../user/reducers/auth/selector";
import { fetchAdminInstances } from '../../reducers/admin/instance/service';
import { fetchAdminParty } from "../../reducers/admin/party/service";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useStyles, useStyle } from "./styles";
import { selectAdminUserState } from '../../reducers/admin/user/selector';
import { selectAdminInstanceState } from "../../reducers/admin/instance/selector";
import { selectAdminPartyState } from "../../reducers/admin/party/selector";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

interface Props {
    open: boolean;
    handleClose: any;
    adminState?: any;
    createUserAction?: any;
    authState?: any;
    patchUser?: any;
    fetchUserRole?: any;
    fetchAdminInstances?: any;
    fetchAdminParty?: any;
    closeViewModel: any;
    adminUserState?: any;
    adminInstanceState?: any;
    adminPartyState?: any
}
const mapStateToProps = (state: any): any => {
    return {
        adminState: selectAdminState(state),
        authState: selectAuthState(state),
        adminUserState: selectAdminUserState(state),
        adminInstanceState: selectAdminInstanceState(state),
        adminPartyState: selectAdminPartyState(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch): any => ({
    createUserAction: bindActionCreators(createUserAction, dispatch),
    fetchUserRole: bindActionCreators(fetchUserRole, dispatch),
    fetchAdminInstances: bindActionCreators(fetchAdminInstances, dispatch),
    fetchAdminParty: bindActionCreators(fetchAdminParty, dispatch)
});



const CreateUser = (props: Props) => {
    const {
        open,
        handleClose,
        createUserAction,
        closeViewModel,
        authState,
        fetchAdminInstances,
        fetchUserRole,
        fetchAdminParty,
        adminUserState,
        adminInstanceState,
        adminPartyState
    } = props;

    const classes = useStyles();
    const classesx = useStyle();
    const [openCreateaUserRole, setOpenCreateUserRole] = React.useState(false);
    const [state, setState] = React.useState({
        name: "",
        inviteCode: "",
        avatar: "",
        userRole: "",
        instance: "",
        party: "",
        formErrors: {
            name: "",
            inviteCode: "",
            avatar: "",
            userRole: "",
            instance: "",
            party: "",
        }
    });
    const [openWarning, setOpenWarning] = React.useState(false);
    const [error, setError] = React.useState("");

    const user = authState.get("user");
    const userRole = adminUserState.get("userRole");
    const userRoleData = userRole ? userRole.get("userRole") : [];
    const adminInstances = adminInstanceState.get('instances');
    const instanceData = adminInstances.get("instances");
    const adminParty = adminPartyState.get("parties");
    const adminPartyData = adminParty.get("parties").data ? adminParty.get("parties").data : [];

    React.useEffect(() => {
        const fetchData = async () => {
            await fetchUserRole();
        };
        const role = userRole ? userRole.get('updateNeeded') : false;
        if ((role === true) && user.id) fetchData();

        if (user.id && adminInstances.get("updateNeeded")) {
            fetchAdminInstances();
        }

        if (user.id && adminParty.get('updateNeeded') == true) {
            fetchAdminParty();
        }
    }, [adminUserState, adminInstanceState, adminPartyState, user]);

    const data = [];
    instanceData.forEach(element => {
        data.push(element);
    });

    const partyData = adminPartyData.map(el => ({ ...el, label: `Location: ${el.location.name || ""}  ____  Instance: ${el.instance.ipAddress || ""}` }));

    const createUserRole = () => {
        setOpenCreateUserRole(true);
    };

    const handleUserRoleClose = () => {
        setOpenCreateUserRole(false);
    };

    const handleCloseWarning = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenWarning(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let temp = state.formErrors;
        switch (name) {
            case "name":
                temp.name = value.length < 2 ? "Name is required!" : "";
                break;
            case "inviteCode":
                temp.inviteCode = value.length < 2 ? "Invite code is required!" : "";
                break;
            case "avatar":
                temp.avatar = value.length < 2 ? "Avatar is required!" : "";
                break;
            case "userRole":
                temp.userRole = value.length < 2 ? "User role is required!" : "";
                break;
            case "instance":
                temp.instance = value.length < 2 ? "Instance is required!" : "";
                break;
            case "party":
                temp.party = value.length < 2 ? "Party is required!" : "";
                break;
            default:
                break;
        }
        setState({ ...state, [name]: value, formErrors: temp });
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: state.name,
            avatarId: state.avatar,
            inviteCode: state.inviteCode,
            instanceId: state.instance,
            userRole: state.userRole,
            partyId: state.party
        };
        let temp = state.formErrors;
        if (!state.name) {
            temp.name = "Name can't be empty";
        }
        if (!state.avatar) {
            temp.avatar = "Avatar can't be empty";
        }
        if (!state.instance) {
            temp.instance = "Instance can't be empty";
        }
        if (!state.party) {
            temp.party = "Party can't be empty";
        }
        if (!state.inviteCode) {
            temp.inviteCode = "Invite code can't be empty";
        }
        if (!state.userRole) {
            temp.userRole = "User role can't be empty";
        }
        setState({ ...state, formErrors: temp });
        if (formValid(state, state.formErrors)) {
            createUserAction(data);
            closeViewModel(false);
            setState({
                ...state,
                name: "",
                inviteCode: "",
                avatar: "",
                userRole: "",
                instance: "",
                party: "",
            })
        } else {
            setError("Please fill all required field");
            setOpenWarning(true);
        }
    }

    return (
        <React.Fragment >
            <Drawer
                classes={{ paper: classesx.paper }}
                anchor="right"
                open={open}
                onClose={handleClose(false)}
            >
                <Container maxWidth="sm" className={classes.marginTp}>
                    <DialogTitle id="form-dialog-title" className={classes.texAlign} >Create New User</DialogTitle>
                    <form onSubmit={handleSubmit}>

                        <label>Name</label>
                        <Paper component="div" className={state.formErrors.name.length > 0 ? classes.redBorder : classes.createInput}>
                            <InputBase
                                className={classes.input}
                                name="name"
                                placeholder="Enter name"
                                style={{ color: "#fff" }}
                                autoComplete="off"
                                value={state.name}
                                onChange={handleChange}
                            />
                        </Paper>
                        <label>Invite code</label>
                        <Paper component="div" className={state.formErrors.inviteCode.length > 0 ? classes.redBorder : classes.createInput}>
                            <InputBase
                                className={classes.input}
                                name="inviteCode"
                                placeholder="Enter invite code"
                                style={{ color: "#fff" }}
                                autoComplete="off"
                                value={state.inviteCode}
                                onChange={handleChange}
                            />
                        </Paper>
                        <label>Avatar</label>
                        <Paper component="div" className={state.formErrors.avatar.length > 0 ? classes.redBorder : classes.createInput}>
                            <InputBase
                                className={classes.input}
                                name="avatar"
                                placeholder="Enter avatar"
                                style={{ color: "#fff" }}
                                autoComplete="off"
                                value={state.avatar}
                                onChange={handleChange}
                            />
                        </Paper>
                        <label>User role</label>
                        <Paper component="div" className={state.formErrors.userRole.length > 0 ? classes.redBorder : classes.createInput}>
                            <FormControl fullWidth>
                                <Select
                                    labelId="demo-controlled-open-select-label"
                                    id="demo-controlled-open-select"
                                    value={state.userRole}
                                    fullWidth
                                    displayEmpty
                                    onChange={handleChange}
                                    className={classes.select}
                                    name="userRole"
                                    MenuProps={{ classes: { paper: classesx.selectPaper } }}
                                >
                                    <MenuItem value="" disabled>
                                        <em>Select user role</em>
                                    </MenuItem>
                                    {
                                        userRoleData.map(el => <MenuItem value={el.role} key={el.role}>{el.role}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        </Paper>

                        <DialogContentText className={classes.marginBottm}>  <span className={classes.select}>Don't see user role? </span> <a href="#h" className={classes.textLink} onClick={createUserRole}>Create One</a>  </DialogContentText>

                        <label>Instance</label>
                        <Paper component="div" className={state.formErrors.instance.length > 0 ? classes.redBorder : classes.createInput}>
                            <FormControl fullWidth>
                                <Select
                                    labelId="demo-controlled-open-select-label"
                                    id="demo-controlled-open-select"
                                    value={state.instance}
                                    fullWidth
                                    displayEmpty
                                    onChange={handleChange}
                                    className={classes.select}
                                    name="instance"
                                    MenuProps={{ classes: { paper: classesx.selectPaper } }}
                                >
                                    <MenuItem value="" disabled>
                                        <em>Select instance</em>
                                    </MenuItem>
                                    {
                                        data.map(el => <MenuItem value={el.id} key={el.id}>{el.ipAddress}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        </Paper>
                        <DialogContentText className={classes.marginBottm}> <span className={classes.select}> Don't see Instance? </span> <a href="/admin/instance" className={classes.textLink}>Create One</a>  </DialogContentText>

                        <label>Party</label>
                        <Paper component="div" className={state.formErrors.party.length > 0 ? classes.redBorder : classes.createInput}>
                            <FormControl fullWidth>
                                <Select
                                    labelId="demo-controlled-open-select-label"
                                    id="demo-controlled-open-select"
                                    value={state.party}
                                    fullWidth
                                    displayEmpty
                                    onChange={handleChange}
                                    className={classes.select}
                                    name="party"
                                    MenuProps={{ classes: { paper: classesx.selectPaper } }}
                                >
                                    <MenuItem value="" disabled>
                                        <em>Select party</em>
                                    </MenuItem>
                                    {
                                        partyData.map(el => <MenuItem value={el.id} key={el.id}>{el.label}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        </Paper>

                        <DialogContentText className={classes.marginBottm}><span className={classes.select}>  Don't see Party?</span> <a href="/admin/parties" className={classes.textLink}>Create One</a>  </DialogContentText>

                        <DialogActions>
                            <Button
                                className={classesx.saveBtn}
                                type="submit"
                            >
                                Submit
                            </Button>
                            <Button
                                onClick={ handleClose(false)}
                                className={classesx.saveBtn}
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                    </form>
                    <Snackbar
                        open={openWarning}
                        autoHideDuration={6000}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert onClose={handleCloseWarning} severity="warning"> {error} </Alert>
                    </Snackbar>
                </Container>
            </Drawer>
            <CreateUserRole
                open={openCreateaUserRole}
                handleClose={handleUserRoleClose}
            />
        </React.Fragment>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser);

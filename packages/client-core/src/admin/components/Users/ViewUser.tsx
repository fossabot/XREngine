import React from 'react';
import Drawer from "@material-ui/core/Drawer";
import Container from '@material-ui/core/Container';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Chip from '@material-ui/core/Chip';
import { Edit, Save } from "@material-ui/icons";
import Skeleton from '@material-ui/lab/Skeleton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { selectAdminState } from "../../reducers/admin/selector";
import { selectAuthState } from "../../../user/reducers/auth/selector";
import { bindActionCreators, Dispatch } from 'redux';
import { fetchUserRole } from "../../reducers/admin/service";
import { connect } from 'react-redux';
import { client } from "../../../feathers";
import { fetchAdminParty, updateUserRole } from "../../reducers/admin/service";
import { useFormik } from 'formik';
import { useStyles, useStyle } from "./styles";
import { validationSchema } from "./validation";
import { patchUser } from "../../reducers/admin/service";


interface Props {
    open: boolean;
    handleClose: any;
    userAdmin: any;
    adminState?: any;
    authState?: any;
    fetchUserRole?: any;
    fetchAdminParty?: any;
    patchUser?: any;
    closeViewModel?: any;
    updateUserRole?: any
}

const mapStateToProps = (state: any): any => {
    return {
        adminState: selectAdminState(state),
        authState: selectAuthState(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch): any => ({
    fetchUserRole: bindActionCreators(fetchUserRole, dispatch),
    fetchAdminParty: bindActionCreators(fetchAdminParty, dispatch),
    patchUser: bindActionCreators(patchUser, dispatch),
    updateUserRole: bindActionCreators(updateUserRole, dispatch)
});

const ViewUser = (props: Props) => {
    const classx = useStyle();
    const classes = useStyles();
    const { open, handleClose, closeViewModel, fetchUserRole, adminState, authState, userAdmin, fetchAdminParty, patchUser, updateUserRole } = props;
    const [openDialog, setOpenDialog] = React.useState(false);
    const [status, setStatus] = React.useState("");
    const [editMode, setEditMode] = React.useState(false);
    const [party, setParty] = React.useState(userAdmin?.party);
    const [instance, setInstance] = React.useState(userAdmin?.party?.instance);

    const user = authState.get("user");
    const userRole = adminState.get("userRole");
    const userRoleData = userRole ? userRole.get("userRole") : [];
    const adminParty = adminState.get("parties");
    const adminPartyData = adminParty.get("parties").data ? adminParty.get("parties").data : [];
    const adminInstances = adminState.get('instances');
    const instanceData = adminInstances.get("instances");

    const handleClick = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    React.useEffect(() => {
        const fetchData = async () => {
            await fetchUserRole();
        };
        if ((adminState.get('users').get('updateNeeded') === true) && user.id) fetchData();

        if (user.id && adminParty.get('updateNeeded') == true) {
            fetchAdminParty();
        }
    }, [adminState, user]);


    const defaultProps = {
        options: userRoleData,
        getOptionLabel: (option: any) => option.role,
    };

    const partyData = adminPartyData.map(el => ({ ...el, label: el.location.name }));
    const PartyProps = {
        options: partyData,
        getOptionLabel: (option: any) => option.label
    };

    const data = [];
    instanceData.forEach(element => {
        data.push(element);
    });

    const InstanceProps = {
        options: data,
        getOptionLabel: (option: any) => option.ipAddress
    };


    const patchUserRole = async (user: any, role: string) => {
        await updateUserRole(user, role);
        handleCloseDialog();
    };

    const initialValue = {
        name: userAdmin.name,
        avatar: userAdmin.avatarId,
        inviteCode: userAdmin.inviteCode || "",
    };

    const formik = useFormik({
        initialValues: initialValue,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const data = {
                name: values.name,
                avatarId: values.avatar,
                inviteCode: values.inviteCode,
                instanceId: instance.id,
                partyId: party.id
            };
            patchUser(userAdmin.id, data);
            closeViewModel(false);
        }
    });

    return (
        <React.Fragment>
            <Drawer
                anchor="right"
                open={open}
                onClose={handleClose(false)}
                classes={{ paper: classx.paper }}
            >
                <form onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit(e);
                }}>
                    {userAdmin &&
                        <Paper elevation={3} className={classes.paperHeight} >
                            <Container maxWidth="sm">
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Avatar className={classes.large}>{
                                            !userAdmin.avatarId ? <Skeleton animation="wave" variant="circle" width={40} height={40} /> : userAdmin.avatarId.charAt(0).toUpperCase()
                                        }
                                        </Avatar>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <div className={classes.mt20}>
                                            <Typography variant="h4" component="span">{userAdmin.name}</Typography><br />
                                            {
                                                userAdmin.userRole ?
                                                    <Chip
                                                        label={userAdmin.userRole}
                                                        onDelete={handleClick}
                                                        deleteIcon={<Edit />}
                                                    />
                                                    :
                                                    <Chip
                                                        label="None"
                                                        onDelete={handleClick}
                                                        deleteIcon={<Edit />}
                                                    />
                                            }
                                        </div>
                                    </Grid>
                                </Grid>
                            </Container>
                            <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Do you really want to change role for {userAdmin.name}? </DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        In order to change role for {userAdmin.name} search from the list or select user role and submit.
                                </DialogContentText>
                                    <Autocomplete
                                        onChange={(e, newValue) => {
                                            if (newValue) {
                                                setStatus(newValue.role as string);
                                            } else {
                                                setStatus("");
                                            }
                                        }}
                                        {...defaultProps}
                                        id="debug"
                                        debug
                                        renderInput={(params) => <TextField {...params} label="User Role" />}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDialog} color="primary">
                                        Cancel
                                </Button>
                                    <Button onClick={() => {
                                        patchUserRole(userAdmin.id, status);
                                    }} color="primary">
                                        Submit
                                </Button>
                                </DialogActions>
                            </Dialog>
                        </Paper>
                    }
                    <Container maxWidth="sm">
                        {
                            editMode ?
                                <div className={classes.mt10}>
                                    <Typography variant="h4" component="h4" className={classes.mb10}> Update personal Information  </Typography>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Name"
                                        type="text"
                                        fullWidth
                                        value={formik.values.name}
                                        className={classes.mb20px}
                                        onChange={formik.handleChange}
                                        error={formik.touched.name && Boolean(formik.errors.name)}
                                        helperText={formik.touched.name && formik.errors.name}
                                    />
                                    <Autocomplete
                                        className={classes.mb20px}
                                        onChange={(e, newValue) => {
                                            if (newValue) {
                                                setParty(newValue as string);
                                            } else {
                                                setParty("");
                                            }
                                        }}
                                        defaultValue={{ label: party?.location.name || "" }}
                                        {...PartyProps}
                                        id="debug"
                                        debug
                                        renderInput={(params) => <TextField {...params} label="Location" defaultValue={party?.location?.name || ""} />}
                                    />
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="avatar"
                                        label="Avatar"
                                        type="text"
                                        fullWidth
                                        value={formik.values.avatar}
                                        className={classes.mb20px}
                                        onChange={formik.handleChange}
                                        error={formik.touched.avatar && Boolean(formik.errors.avatar)}
                                        helperText={formik.touched.avatar && formik.errors.avatar}
                                    />
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="inviteCode"
                                        label="Invite code"
                                        type="text"
                                        fullWidth
                                        value={formik.values.inviteCode}
                                        className={classes.mb20px}
                                        onChange={formik.handleChange}
                                        error={formik.touched.inviteCode && Boolean(formik.errors.inviteCode)}
                                        helperText={formik.touched.inviteCode && formik.errors.inviteCode}
                                    />
                                    <Autocomplete
                                        className={classes.mb10}
                                        onChange={(e, newValue) => {
                                            if (newValue) {
                                                setInstance(newValue as string);
                                            } else {
                                                setInstance("");
                                            }
                                        }}
                                        {...InstanceProps}
                                        defaultValue={{ label: instance.ipAddress || "" }}
                                        id="debug"
                                        debug
                                        renderInput={(params) => <TextField {...params} label="Instance" defaultValue={instance.ipAddress || ""} />}
                                    />
                                </div>
                                :
                                <Grid container spacing={3} className={classes.mt10}>
                                    <Typography variant="h4" component="h4" className={classes.mb20px}>Personal Information  </Typography>
                                    <Grid item xs={6}>
                                        <Typography variant="h5" component="h5" className={classes.mb10}>Location:</Typography>
                                        <Typography variant="h5" component="h5" className={classes.mb10}>Avatar:</Typography>
                                        <Typography variant="h5" component="h5" className={classes.mb10}>Invite Code:</Typography>
                                        <Typography variant="h5" component="h5" className={classes.mb10}>Instance:</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="h6" component="h6" className={classes.mb10} >{userAdmin?.party?.location?.name || <span className={classx.spanNone}>None</span>}</Typography>
                                        <Typography variant="h6" component="h6" className={classes.mb10}>{userAdmin?.avatarId || <span className={classx.spanNone}>None</span>}</Typography>
                                        <Typography variant="h6" component="h6" className={classes.mb10}>{userAdmin?.inviteCode || <span className={classx.spanNone}>None</span>}</Typography>
                                        <Typography variant="h6" component="h6" className={classes.mb10}>{userAdmin?.party?.instance?.ipAddress || <span className={classx.spanNone}>None</span>}</Typography>
                                    </Grid>
                                </Grid>
                        }

                        <DialogActions className={classes.mb10}>
                            {
                                editMode ?
                                    <div>
                                        <Button type="submit" color="primary" >
                                            <span style={{ marginRight: "15px" }}><Save /></span> Submit
                                        </Button>
                                        <Button onClick={() => setEditMode(false)} color="primary">
                                            Clear
                                        </Button>
                                    </div>
                                    :
                                    <div>
                                        <a href="#h" className={classx.actionStyle} style={{ fontSize: "1.2rem", marginRight: "25px" }} onClick={() => setEditMode(true)}>
                                            EDIT
                                        </a>
                                        <a href="#h" onClick={handleClose(false)} className={classx.actionStyle} style={{ fontSize: "1.2rem" }}>
                                            CANCEL
                                        </a>
                                    </div>
                            }
                        </DialogActions>
                    </Container>
                </form>
            </Drawer>
        </React.Fragment>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewUser);
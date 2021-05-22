import React, { useState, useEffect } from 'react';
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
// @ts-ignore
import styles from '../Admin.module.scss';
import Backdrop from "@material-ui/core/Backdrop";
import classNames from 'classnames';
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { bindActionCreators, Dispatch } from 'redux';
import { fetchAdminLocations } from "../../reducers/admin/service";
import { connect } from 'react-redux';
import { selectAdminState } from '../../reducers/admin/selector';
import { selectAuthState } from '../../../user/reducers/auth/selector';
import { fetchAdminInstances, createAdminParty } from '../../reducers/admin/service';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

interface Props {
    open: boolean;
    handleClose: any;
    fetchAdminLocations: any;
    adminState?: any;
    authState?: any;
    fetchAdminInstances?: any;
    createAdminParty?: any
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        marginBottm: {
            marginBottom: "15px"
        },
        textLink: {
            marginLeft: "5px",
            textDecoration: "none",
            color: "#ff9966"
        },
        marginTop: {
            marginTop: "30px"
        }
    })
);

const mapStateToProps = (state: any): any => {
    return {
        authState: selectAuthState(state),
        adminState: selectAdminState(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch): any => ({
    fetchAdminLocations: bindActionCreators(fetchAdminLocations, dispatch),
    fetchAdminInstances: bindActionCreators(fetchAdminInstances, dispatch),
    createAdminParty: bindActionCreators(createAdminParty, dispatch)
});


const CreateParty = (props: Props) => {
    const classes = useStyles();

    const { open, handleClose, createAdminParty, fetchAdminLocations, authState, adminState, fetchAdminInstances } = props;

    const [location, setLocation] = useState("");
    const [instance, setInstance] = React.useState("");


    const user = authState.get('user');
    const adminLocation = adminState.get('locations');
    const locationData = adminLocation.get("locations");
    const adminInstances = adminState.get('instances');
    const instanceData = adminInstances.get("instances");

    useEffect(() => {
        if (user?.id != null && adminLocation.get('updateNeeded') === true) {
            fetchAdminLocations();
        }

        if (user.id && adminInstances.get("updateNeeded")) {
            fetchAdminInstances();
        }

    }, [authState, adminState]);

    const defaultProps = {
        options: locationData,
        getOptionLabel: (option: any) => option.name,
    };

    const data = [];
    instanceData.forEach(element => {
        data.push(element);
    });

    const InstanceProps = {
        options: data,
        getOptionLabel: (option: any) => option.ipAddress
    };

    const submitParty = async (e) => {
        e.preventDefault();
        await createAdminParty({
            locationId: location,
            instanceId: instance
        });
        setLocation("");
        setInstance("");
        handleClose();
    };

    return (
        <React.Fragment>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={styles.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500
                }}
            >
                <Fade in={props.open}>
                    <div className={classNames({
                        [styles.paper]: true,
                        [styles['modal-content']]: true
                    })}>
                        <Typography variant="h5" gutterBottom={true} className={classes.marginTop}>
                            Create new party
                        </Typography>
                        <form >
                            <Autocomplete
                                onChange={(e, newValue) => setLocation(newValue.id as string)}
                                {...defaultProps}
                                id="debug"
                                debug
                                renderInput={(params) => <TextField {...params} label="Locations" className={classes.marginBottm} />}
                            />

                            <Autocomplete
                                onChange={(e, newValue) => setInstance(newValue.id as string)}
                                {...InstanceProps}
                                id="debug"
                                debug
                                renderInput={(params) => <TextField {...params} label="Instance" className={classes.marginBottm} />}
                            />

                            <DialogContentText className={classes.marginBottm}>  Don't see Instance? <a href="/admin/instance" className={classes.textLink}>Create One</a>  </DialogContentText>


                            <DialogActions>
                                <Button type="submit" color="primary" onClick={(e) => submitParty(e)}>
                                    Submit
                            </Button>
                                <Button onClick={handleClose} color="primary">
                                    Cancel
                            </Button>
                            </DialogActions>
                        </form>
                    </div>
                </Fade>
            </Modal>
        </React.Fragment>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateParty);
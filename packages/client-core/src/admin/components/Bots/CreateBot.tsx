import React from 'react';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import { Dispatch, bindActionCreators } from "redux";
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { useStylesForBots as useStyles, useStyle } from "./styles";
import CardContent from "@material-ui/core/CardContent";
import Grid from '@material-ui/core/Grid';
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { Face, Save } from '@material-ui/icons';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { selectAdminInstanceState } from "../../reducers/admin/instance/selector";
import { fetchAdminInstances } from "../../reducers/admin/instance/service";
import { fetchAdminLocations } from "../../reducers/admin/location/service";
import { connect } from 'react-redux';
import { selectAuthState } from '../../../user/reducers/auth/selector';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { createBotAsAdmin } from "../../reducers/admin/bots/service";
import { selectAdminLocationState } from "../../reducers/admin/location/selector";
import { formValid } from "./validation";

interface Props {
    fetchAdminInstances?: any;
    adminInstanceState?: any;
    authState?: any;
    createBotAsAdmin?: any;
    adminLocationState?: any;
    fetchAdminLocations?: any;
}

const mapStateToProps = (state: any): any => {
    return {
        adminInstanceState: selectAdminInstanceState(state),
        authState: selectAuthState(state),
        adminLocationState: selectAdminLocationState(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch): any => ({
    fetchAdminInstances: bindActionCreators(fetchAdminInstances, dispatch),
    createBotAsAdmin: bindActionCreators(createBotAsAdmin, dispatch),
    fetchAdminLocations: bindActionCreators(fetchAdminLocations, dispatch)
});

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const CreateBot = (props: Props) => {
    const {
        adminInstanceState,
        authState,
        fetchAdminInstances,
        createBotAsAdmin,
        fetchAdminLocations,
        adminLocationState,
    } = props;
    const [command, setCommand] = React.useState({
        name: "",
        description: ""
    });
    const [commandData, setCommandData] = React.useState([]);
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [instance, setInstance] = React.useState("");
    const [location, setLocation] = React.useState("");
    const [error, setError] = React.useState("");
    const [formErrors, setFormErrors] = React.useState({
        name: "",
        description: "",
    });
    const [state, setState] = React.useState({
        name: "",
        description: "",
    });
    const classes = useStyles();
    const classx = useStyle();
    const user = authState.get("user");
    const adminInstances = adminInstanceState.get('instances');
    const instanceData = adminInstances.get("instances");
    const adminLocation = adminLocationState.get('locations');
    const locationData = adminLocation.get("locations");

    React.useEffect(() => {
        if (user.id && adminInstances.get("updateNeeded")) {
            fetchAdminInstances();
        }
        if (user?.id != null && adminLocation.get('updateNeeded') === true) {
            fetchAdminLocations();
        }
    }, [user, adminInstanceState]);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const data = [];
    instanceData.forEach(element => {
        data.push(element);
    });


    const temp = [];
    locationData.forEach(el => {
        temp.push(el);
    });

    const handleSubmit = () => {
        const data = {
            name: state.name,
            instanceId: instance,
            userId: user.id,
            command: commandData,
            description: state.description,
            locationId: location
        };
        let temp = formErrors;
        if (!state.name) {
            temp.name = "Name can't be empty";
        }
        if (!state.description) {
            temp.description = "Description can't be empty";
        }

        setFormErrors(temp);
        if (instance && location && formValid(state, formErrors)) {
            createBotAsAdmin(data);
            setState({ name: "", description: "" });
            setCommandData([]);
            setInstance("");
            setLocation("");
        } else {
            setError("Please fill all required field");
            setOpen(true);
        }
    };

    const handleInputChange = (e) => {
        const names = e.target.name;
        const value = e.target.value;
        let temp = formErrors;
        switch (names) {
            case "name":
                temp.name = value.length < 2 ? "Name is required!" : "";
                break;
            case "description":
                temp.description = value.length < 2 ? "Description is required!" : "";
                break;
            default:
                break;
        }
        setFormErrors(temp);
        setState({ ...state, [names]: value });
    };

    return (
        <Card className={classes.rootLeft}>
            <Paper className={classes.header} style={{ display: "flex" }}>
                <Typography className={classes.title} >
                    <Face /> <span style={{ marginLeft: "10px" }}>  Create new bot </span>
                </Typography>

                <Button
                    variant="contained"
                    disableElevation
                    type="submit"
                    style={{ marginLeft: "auto", background: "#43484F", color: "#fff", width: "150px" }}
                    onClick={handleSubmit}
                >
                    <Save style={{ marginRight: "10px" }} />  save
                </Button>
            </Paper>
            <CardContent>
                <Typography className={classes.secondaryHeading} component="h1">
                    Add more bots in the system.
                </Typography>
                <form style={{ marginTop: "40px" }}>
                    <label>Name</label>
                    <Paper component="div" className={formErrors.name.length > 0 ? classes.redBorder : classes.createInput}>
                        <InputBase
                            name="name"
                            className={classes.input}
                            placeholder="Enter name"
                            style={{ color: "#fff" }}
                            value={state.name}
                            onChange={handleInputChange}
                        />
                    </Paper>


                    <label>Description</label>
                    <Paper component="div" className={formErrors.description.length > 0 ? classes.redBorder : classes.createInput}>
                        <InputBase
                            className={classes.input}
                            name="description"
                            placeholder="Enter description"
                            style={{ color: "#fff" }}
                            value={state.description}
                            onChange={handleInputChange}
                        />
                    </Paper>


                    <label>Instance</label>
                    <Paper component="div" className={classes.createInput}>
                        <FormControl className={classes.createInput} >
                            <Select
                                labelId="demo-controlled-open-select-label"
                                id="demo-controlled-open-select"
                                // open={open}
                                //  onClose={handleClose}
                                //onOpen={handleOpen}
                                value={instance}
                                className={classes.inputSelect}
                                onChange={(e) => setInstance(e.target.value as string)}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {
                                    data.map(el => <MenuItem value={el.id} key={el.id}>{el.ipAddress}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    </Paper>


                    <label>Location</label>
                    <Paper component="div" className={classes.createInput}>
                        <FormControl className={classes.createInput} >
                            <Select
                                labelId="demo-controlled-open-select-label"
                                id="demo-controlled-open-select"
                                // open={open}
                                //  onClose={handleClose}
                                //onOpen={handleOpen}
                                className={classes.inputSelect}
                                value={location}
                                onChange={(e) => setLocation(e.target.value as string)}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {
                                    temp.map(el => <MenuItem value={el.id} key={el.id}>{el.name}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    </Paper>





                    {/* <label>Instance</label>
                    <Autocomplete
                        id="combo-box-demo"
                        {...InstanceProps}
                        onChange={(e, newValue) => setInstance(newValue?.id as string)}
                        className={classes.createInput}
                        debug
                        classes={{ paper: classx.autPaper }}
                        renderInput={(params) => <TextField {...params} className={classes.input} style={{ color: "#fff" }} value={instance} placeholder="Select instance" />}
                    />
                    <label>Location</label>
                    <Autocomplete
                        id="combo-box-demo"
                        {...defaultProps}
                        classes={{ paper: classx.autPaper }}
                        onChange={(e, newValue) => setLocation(newValue?.id as string)}
                        className={classes.createInput}
                        debug
                        renderInput={(params) => <TextField {...params} className={classes.input} style={{ color: "#fff" }} placeholder="Select location" value={location} />}
                    /> */}
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <label>Command</label>
                            <Paper component="div" className={classes.createInput}>
                                <InputBase
                                    className={classes.input}
                                    placeholder="Enter command"
                                    style={{ color: "#fff" }}
                                    value={command.name}
                                    onChange={(e) => setCommand({ ...command, name: e.target.value })}
                                />
                            </Paper>

                        </Grid>
                        <Grid item xs={8}>
                            <label>Description</label>
                            <Paper component="div" className={classes.createInput}>
                                <InputBase
                                    className={classes.input}
                                    placeholder="Enter description"
                                    style={{ color: "#fff" }}
                                    value={command.description}
                                    onChange={(e) => setCommand({ ...command, description: e.target.value })}
                                />
                            </Paper>
                        </Grid>
                    </Grid>

                    <Button
                        variant="contained"
                        fullWidth={true}
                        style={{ color: "#fff", background: "#3a4149", marginBottom: "20px" }}
                        onClick={() => {
                            if (command.name) {
                                setCommandData([...commandData, command]);
                                setCommand({ name: "", description: "" });
                            } else {
                                setError("Fill in command is required!");
                                setOpen(true);
                            }
                        }}
                    >
                        Add command
                    </Button>


                    <div
                        className={commandData.length > 0 ? classes.alterContainer : classes.createAlterContainer}
                    >
                        {
                            commandData.map((el, i) => {
                                return (
                                    <List dense={true} key={i}>
                                        <ListItem>
                                            <ListItemText
                                                primary={`${i + 1}. /${el.name} --> ${el.description} `}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" aria-label="delete">
                                                    <DeleteIcon style={{ color: "#fff" }} />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </List>
                                );
                            })
                        }
                    </div>
                </form>
            </CardContent>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleClose} severity="warning"> {error} </Alert>
            </Snackbar>
        </Card>

    );
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateBot);
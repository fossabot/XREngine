import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SuperviosorAccount from "@material-ui/icons/SupervisorAccount";
import DirectionRun from "@material-ui/icons/DirectionsRun";
import DashboardIcon from "@material-ui/icons/Dashboard";
import NearMe from "@material-ui/icons/NearMe";
import { useRouter } from "next/router";
import { Forum, GroupAdd, DragIndicator, PersonAdd, CalendarViewDay } from '@material-ui/icons';
import Link from "next/link";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const drawerWidth = 200;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            backgroundColor: "#43484F"
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: 36,
            color: "white"
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            backgroundColor: "#1f252d",
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9) + 1,
            },
            backgroundColor: "#1f252d",
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            backgroundColor: "#15171B",
            minHeight: "100vh"
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        }
    }),
);

export default function Dashboard({ children }) {
    const router = useRouter();
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const changeComponent = () => {
        setLoading(true);
        setTimeout(()=>{
            setLoading(false);
        }, 2000);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        style={{ color: "white" }}
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <Link href="/admin">
                            <ListItem style={{ color: "white" }} onClick={changeComponent} button>
                                <ListItemIcon >
                                    <DashboardIcon style={{ color: "white" }} />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItem>
                    </Link>
                    <Link href="/admin/users" >
                        <ListItem style={{ color: "white" }} onClick={changeComponent} button>
                            <ListItemIcon >
                                <SuperviosorAccount style={{ color: "white" }} />
                            </ListItemIcon>
                            <ListItemText primary="Users" />
                        </ListItem>
                    </Link>
                    <Link href="/admin/instance">
                        <ListItem style={{ color: "white"}} onClick={changeComponent} button>
                            <ListItemIcon >
                                <DirectionRun style={{ color: "white" }} />
                            </ListItemIcon>
                            <ListItemText primary="Instance" />
                        </ListItem>
                    </Link>
                    <Link href="/admin/locations">
                        <ListItem style={{ color: "white"}} onClick={changeComponent}  button>
                            <ListItemIcon >
                                <NearMe style={{ color: "white" }} />
                            </ListItemIcon>
                            <ListItemText primary="Locations" />
                        </ListItem>
                    </Link>
                    <Link href="/admin/invites">
                        <ListItem style={{ color: "white" }} onClick={changeComponent} button>
                            <ListItemIcon >
                                <PersonAdd style={{ color: "white" }} />
                            </ListItemIcon>
                            <ListItemText primary="Invites" />
                        </ListItem>
                    </Link>
                    <Link href="/admin/sessions">
                        <ListItem style={{ color: "white"}} onClick={changeComponent} button>
                            <ListItemIcon >
                                <DragIndicator style={{ color: "white" }} />
                            </ListItemIcon>
                            <ListItemText primary="Sessions" />
                        </ListItem>
                    </Link>
                    <Link href="/admin/groups">
                        <ListItem style={{color: "white"}} onClick={changeComponent} button>
                            <ListItemIcon >
                                <GroupAdd style={{ color: "white" }} />
                            </ListItemIcon>
                            <ListItemText primary="Groups" />
                        </ListItem>
                    </Link>
                    <Link href="/admin/parties">
                        <ListItem style={{ color: "white"}} onClick={changeComponent} button>
                            <ListItemIcon >
                                <CalendarViewDay style={{ color: "white" }} />
                            </ListItemIcon>
                            <ListItemText primary="Parties" />
                        </ListItem>
                    </Link>
                    <Link href="/admin/chats">
                        <ListItem style={{ color: "white" }} onClick={changeComponent} button>
                            <ListItemIcon >
                                <Forum style={{ color: "white" }} />
                            </ListItemIcon>
                            <ListItemText primary="Chats" />
                        </ListItem>
                    </Link>
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div>
                    {children}
                </div>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            </main>
        </div>
    );
}

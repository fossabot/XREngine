import { AppProps } from 'next/app';
import React, { useEffect } from 'react';
//import './Admin.module.scss';
import { Button } from '@material-ui/core';
import NoSSR from 'react-no-ssr';
import { connect } from 'react-redux';
import { Store, Dispatch, bindActionCreators } from 'redux';
import Loading from '../components/scenes/loading';
import Scene from '../components/scenes/scene';
import Layout from '../components/ui/Layout';
import { selectAppState } from '../redux/app/selector';
import { selectAuthState } from '../redux/auth/selector';
import { selectInstanceConnectionState } from '../redux/instanceConnection/selector';
import { selectPartyState } from '../redux/party/selector';
import { selectLocationState } from '../redux/location/selector';
import { doLoginAuto } from '../redux/auth/service';
import {
    getLocation,
    joinLocationParty
} from '../redux/location/service';
import {
    connectToInstanceServer,
    provisionInstanceServer,
} from '../redux/instanceConnection/service';
import { client } from "../redux/feathers";

interface Props {
    appState?: any;
    authState?: any;
    locationState?: any;
    partyState?: any;
    instanceConnectionState?: any;
    doLoginAuto?: typeof doLoginAuto;
    getLocation?: typeof getLocation;
    joinLocationParty?: typeof joinLocationParty;
    connectToInstanceServer?: typeof connectToInstanceServer;
    provisionInstanceServer?: typeof provisionInstanceServer;
}

const arenaLocationId = 'a98b8470-fd2d-11ea-bc7c-cd4cac9a8d61';

const mapStateToProps = (state: any): any => {
    return {
        appState: selectAppState(state),
        authState: selectAuthState(state),
        instanceConnectionState: selectInstanceConnectionState(state),
        locationState: selectLocationState(state),
        partyState: selectPartyState(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch): any => ({
    doLoginAuto: bindActionCreators(doLoginAuto, dispatch),
    getLocation: bindActionCreators(getLocation, dispatch),
    joinLocationParty: bindActionCreators(joinLocationParty, dispatch),
    connectToInstanceServer: bindActionCreators(connectToInstanceServer, dispatch),
    provisionInstanceServer: bindActionCreators(provisionInstanceServer, dispatch)
});

export const ArenaPage = (props: Props): any => {
    const {
        appState,
        authState,
        locationState,
        partyState,
        instanceConnectionState,
        doLoginAuto,
        getLocation,
        joinLocationParty,
        connectToInstanceServer,
        provisionInstanceServer
    } = props;
    const appLoaded = appState.get('loaded');
    const selfUser = authState.get('user');
    const party = partyState.get('party');
    const instanceId = selfUser.instanceId != null ? selfUser.instanceId : party?.instanceId != null ? party.instanceId : null;

    const userBanned = selfUser?.locationBans?.find(ban => ban.locationId === arenaLocationId) != null;
    useEffect(() => {
        doLoginAuto(true);
    }, []);

    useEffect(() => {
        const currentLocation = locationState.get('currentLocation').get('location');
        if (authState.get('isLoggedIn') === true && authState.get('user').id != null && authState.get('user').id.length > 0 && currentLocation.id == null && userBanned === false && locationState.get('fetchingCurrentLocation') !== true) {
            getLocation(arenaLocationId);
        }
    }, [authState]);

    useEffect(() => {
        const currentLocation = locationState.get('currentLocation').get('location');
        if (currentLocation.id != null &&
            userBanned === false &&
            instanceConnectionState.get('instanceProvisioned') !== true &&
            instanceConnectionState.get('instanceProvisioning') === false)
                provisionInstanceServer(currentLocation.id);
    }, [locationState]);

    useEffect(() => {
        console.log("instanceConnectionState", instanceConnectionState)
        if (
            instanceConnectionState.get('instanceProvisioned') === true &&
            instanceConnectionState.get('updateNeeded') === true &&
            instanceConnectionState.get('instanceServerConnecting') === false &&
            instanceConnectionState.get('connected') === false
        ) {
            console.log('Calling connectToInstanceServer from arena page')

            connectToInstanceServer();
        }
        else {
            console.log(instanceConnectionState.get('instanceProvisioned'))
            console.log(instanceConnectionState.get('updateNeeded'))
            console.log(instanceConnectionState.get('instanceServerConnecting'))
            console.log(instanceConnectionState.get('connected'))
        }
    }, [instanceConnectionState]);

    useEffect(() => {
        if (appLoaded === true && instanceConnectionState.get('instanceProvisioned') === false && instanceConnectionState.get('instanceProvisioning') === false) {
            if (instanceId != null) {
                client.service('instance').get(instanceId)
                    .then((instance) => {
                        console.log('Provisioning instance from arena page init useEffect');
                        provisionInstanceServer(instance.locationId);
                    });
            }
        }
    }, [appState]);

    // <Button className="right-bottom" variant="contained" color="secondary" aria-label="scene" onClick={(e) => { setSceneVisible(!sceneIsVisible); e.currentTarget.blur(); }}>scene</Button>

    return (
        <Layout pageTitle="Home" login={false}>
            <NoSSR onSSR={<Loading />}>
                {userBanned === false ? (<Scene />) : null}
                {userBanned !== false ? (<div className="banned">You have been banned from this location</div>) : null}
            </NoSSR>
        </Layout>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ArenaPage);

import {
    Backdrop,
    Button,
    Fade,
    FormControl,
    FormGroup,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    TextField
} from '@material-ui/core';
import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from "redux";
import { selectAdminState } from "../../../../redux/admin/selector";
import { selectAppState } from "../../../../redux/app/selector";
import { selectAuthState } from "../../../../redux/auth/selector";
import { selectContentPackState } from "../../../../redux/contentPack/selector";
import styles from './Scenes.module.scss';
import {
    addSceneToContentPack,
    createContentPack,
    fetchContentPacks,
    uploadAvatars
} from "../../../../redux/contentPack/service";
import {
    Create,
    Edit
} from "@material-ui/icons";
import {
    ToggleButton,
    ToggleButtonGroup
} from "@material-ui/lab";
import {Cache} from "three";
import add = Cache.add;


interface Props {
    open: boolean;
    handleClose: any;
    scene: any;
    adminState?: any;
    contentPackState?: any;
    uploadAvatar?: any;
}

const mapStateToProps = (state: any): any => {
    return {
        appState: selectAppState(state),
        authState: selectAuthState(state),
        adminState: selectAdminState(state),
        contentPackState: selectContentPackState(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch): any => ({
    addSceneToContentPack: bindActionCreators(addSceneToContentPack, dispatch),
    createContentPack: bindActionCreators(createContentPack, dispatch),
    fetchContentPacks: bindActionCreators(fetchContentPacks, dispatch),
    uploadAvatars: bindActionCreators(uploadAvatars, dispatch)
});


const AddToContentPackModal = (props: Props): any => {
    const {
        addSceneToContentPack,
        createContentPack,
        open,
        handleClose,
        adminState,
        scene,
        uploadAvatars,
        contentPackState,
        fetchContentPacks
    } = props;

    const [contentPackUrl, setContentPackUrl] = useState('');
    const [error, setError] = useState('');
    const [createOrPatch, setCreateOrPatch] = useState('patch');
    const [contentPackName, setContentPackName] = useState('');
    const [newContentPackName, setNewContentPackName] = useState('');
    const contentPacks = contentPackState.get('contentPacks');

    const showError = (err: string) => {
        setError(err);
        setTimeout(() => {
            setError('');
        }, 3000);
    }

    const handleCreateOrPatch = (event: React.MouseEvent<HTMLElement>, newValue: string | null) => {
        setCreateOrPatch(newValue);
    };

    const addCurrentSceneToContentPack = () => {
        addSceneToContentPack({
            scene: scene,
            contentPack: contentPackName
        });
    }

    const createNewContentPack = () => {
        createContentPack({
            scene: scene,
            contentPack: newContentPackName
        })
    }

    const closeModal = () => {
        setContentPackName('');
        setNewContentPackName('');
        handleClose();
    }

    useEffect(() => {
        console.log('contenPackState changed');
        console.log(contentPackState);
        if (contentPackState.get('updateNeeded') === true) {
            console.log('call fetchContentPacks');
            fetchContentPacks();
        }
    }, [contentPackState]);

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={styles.modal}
                open={open}
                onClose={closeModal}
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
                        <ToggleButtonGroup
                            value={createOrPatch}
                            exclusive
                            onChange={handleCreateOrPatch}
                            aria-label="Create or Edit Content Pack"
                        >
                            <ToggleButton value="patch" aria-label="Add to existing content pack">
                                <Edit />
                                Add to existing content pack
                            </ToggleButton>
                            <ToggleButton value="create" aria-label="Create new content pack">
                                <Create />
                                Create New Content Pack
                            </ToggleButton>
                        </ToggleButtonGroup>
                        { createOrPatch === 'patch' &&
                            <div>
                                <FormControl>
                                    <InputLabel id="contentPackSelect">Content Pack</InputLabel>
                                    <Select
                                        labelId="Content Pack"
                                        id="contentPackSelect"
                                        value={contentPackName}
                                        onChange={(e) => setContentPackName(e.target.value as string)}
                                    >
                                        {contentPacks.map(contentPack => <MenuItem key={contentPack} value={contentPack}>{contentPack}</MenuItem>)}
                                    </Select>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        onClick={addCurrentSceneToContentPack}
                                    >
                                        Update Content Pack
                                    </Button>
                                </FormControl>
                            </div>
                        }
                        { createOrPatch === 'create' &&
                            <div>
                                <FormControl>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        id="newContentPack"
                                        label="Content Pack Name"
                                        placeholder="content_pack1"
                                        name="name"
                                        required
                                        value={newContentPackName}
                                        onChange={(e) => setNewContentPackName(e.target.value)}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        onClick={createNewContentPack}
                                    >
                                        Create Content Pack
                                    </Button>
                                </FormControl>
                            </div>
                        }
                        { error && error.length > 0 && <h2>{error}</h2> }
                    </div>
                </Fade>
            </Modal>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToContentPackModal);
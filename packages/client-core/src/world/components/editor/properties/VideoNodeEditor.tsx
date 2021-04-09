// @ts-nocheck
import React from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import SelectInput from "../inputs/SelectInput";
import { VideoProjection } from "@xr3ngine/engine/src/scene/classes/Video";
import VideoInput from "../inputs/VideoInput";
import { Video } from "@styled-icons/fa-solid/Video";
import AudioSourceProperties from "./AudioSourceProperties";
import useSetPropertySelected from "./useSetPropertySelected";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

/**
 * videoProjectionOptions contains VideoProjection options.
 * 
 * @author Robert Long
 * @type {object}
 */
const videoProjectionOptions = Object.values(VideoProjection).map(v => ({ label: v, value: v }));


/**
 * VideoNodeEditor used to render editor view for property customization.
 * 
 * @author Robert Long
 * @param       {any} props
 * @constructor
 */
export default function VideoNodeEditor(props) {
  const { editor, node } = props;
  const { t } = useTranslation();

  VideoNodeEditor.description = t('editor:properties.video.description');
  //function to handle changes in src property
  const onChangeSrc = useSetPropertySelected(editor, "src");

  //function to handle change in projection property
  const onChangeProjection = useSetPropertySelected(editor, "projection");

   //editor view for VideoNode
  return (
    <NodeEditor description={VideoNodeEditor.description} {...props}>
      { /* @ts-ignore */ }
      <InputGroup name="Video" label={t('editor:properties.video.lbl-video')}>
        <VideoInput value={node.src} onChange={onChangeSrc} />
      </InputGroup>
      { /* @ts-ignore */ }
      <InputGroup name="Projection" label={t('editor:properties.video.lbl-projection')}>
      { /* @ts-ignore */ }
        <SelectInput options={videoProjectionOptions} value={node.projection} onChange={onChangeProjection} />
      </InputGroup>
      <AudioSourceProperties {...props} />
    </NodeEditor>
  );
}

// declairing propTypes for VideoNodeEditor
VideoNodeEditor.propTypes = {
  editor: PropTypes.object,
  node: PropTypes.object,
  multiEdit: PropTypes.bool
};

// setting iconComponent with icon name
VideoNodeEditor.iconComponent = Video;

// setting description will appears on editor view
VideoNodeEditor.description = i18n.t('editor:properties.video.description');

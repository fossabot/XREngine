// @ts-nocheck
import React from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import SelectInput from "../inputs/SelectInput";
import { VideoProjection } from "../../objects/Video";
import VideoInput from "../inputs/VideoInput";
import { Video } from "@styled-icons/fa-solid/Video";
import AudioSourceProperties from "./AudioSourceProperties";
import useSetPropertySelected from "./useSetPropertySelected";

const videoProjectionOptions = Object.values(VideoProjection).map(v => ({ label: v, value: v }));

export default function VideoNodeEditor(props) {
  const { editor, node } = props;
  const onChangeSrc = useSetPropertySelected(editor, "src");
  const onChangeProjection = useSetPropertySelected(editor, "projection");

  return (
    <NodeEditor description={VideoNodeEditor.description} {...props}>
      { /* @ts-ignore */ }
      <InputGroup name="Video">
        <VideoInput value={node.src} onChange={onChangeSrc} />
      </InputGroup>
      { /* @ts-ignore */ }
      <InputGroup name="Projection">
      { /* @ts-ignore */ }
        <SelectInput options={videoProjectionOptions} value={node.projection} onChange={onChangeProjection} />
      </InputGroup>
      <AudioSourceProperties {...props} />
    </NodeEditor>
  );
}

VideoNodeEditor.propTypes = {
  editor: PropTypes.object,
  node: PropTypes.object,
  multiEdit: PropTypes.bool
};

VideoNodeEditor.iconComponent = Video;

VideoNodeEditor.description = "Dynamically loads a video.";

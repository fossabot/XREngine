import { HandPaper } from "@styled-icons/fa-solid/HandPaper";
import i18n from "i18next";
import React from "react";
import { withTranslation } from "react-i18next";
import BooleanInput from "../inputs/BooleanInput";
import InputGroup from "../inputs/InputGroup";
import SelectInput from "../inputs/SelectInput";
import StringInput from "../inputs/StringInput";
import NodeEditor from "./NodeEditor";
/**
 * [BoxColliderNodeEditor is used to provide properties to customize box collider element]
 * @type {[component class]}
 */

export function GameNodeEditor(props: {
  editor?: any;
  node?: any;
  t: any
}) {
  console.log("Props are", props);
  const { node, editor, t } = props;

  // function to handle changes in payloadName property
  const onChangePayloadGameMode = (payloadGame, selected) => {
    editor.setPropertySelected("gameMode", selected.label);
  };

  const onChangeMinPlayers = payloadMinPlayers => {
    editor.setPropertySelected("minPlayers", payloadMinPlayers);
  };
  const onChangeMaxPlayers = payloadMaxPlayers => {
    editor.setPropertySelected("maxPlayers", payloadMaxPlayers);
  };

  const onChangeIsGlobal = payloadIsGlobal => {
    editor.setPropertySelected("isGlobal", payloadIsGlobal);
  };

  //defining description and shows this description in NodeEditor  with title of elementt,
  // available to add in scene in assets.
  const description = i18n.t('editor:properties.game.description');

  const selectValues = Object.keys(editor.Engine.supportedGameModes).map((key, index) => { return { label: key, value: index }; });
  return (
    <NodeEditor {...props} description={description}>
      { /* @ts-ignore */}
      <InputGroup
        name="Game Mode"
        label={t('editor:properties.game.lbl-gameMode')}
              >
        { /* @ts-ignore */}
        <SelectInput
          options={selectValues}
          value={selectValues.findIndex(v => v.label === node.gameMode)}
          onChange={onChangePayloadGameMode}
        />
      </InputGroup>

      { /* @ts-ignore */}
      <InputGroup
        name="Is Global?"
        label={t('editor:properties.game.lbl-isGlobal')}
        info={t('editor:properties.game.info-isGlobal')}
      >
        <BooleanInput value={node.isGlobal} onChange={onChangeIsGlobal} />
      </InputGroup>
      { /* @ts-ignore */}
      { /* @ts-ignore */}
        <InputGroup name="Min Players" label={t('editor:properties.model.lbl-minPlayers')}>
      <StringInput
        /* @ts-ignore */
        value={node.minPlayers}
        onChange={onChangeMinPlayers}
      />
      </InputGroup>
      { /* @ts-ignore */}
      <InputGroup name="Max Players" label={t('editor:properties.model.lbl-maxPlayers')}>
      <StringInput
        /* @ts-ignore */
        value={node.maxPlayers}
        onChange={onChangeMaxPlayers}
      />
            </InputGroup>
    </NodeEditor>
  );
}

GameNodeEditor.iconComponent = HandPaper;

export default withTranslation()(GameNodeEditor);

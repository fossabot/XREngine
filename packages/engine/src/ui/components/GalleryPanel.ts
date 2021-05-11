import { createItem, createCol, createRow, createButton, makeLeftItem } from '../functions/createItem';
import { Block, Text } from "../../assets/three-mesh-ui";
import { UIBaseElement, UI_ELEMENT_SELECT_STATE } from "./UIBaseElement";
import {totalWidth, totalHeight, itemWidth, itemHeight, gap, url} from '../constants/Constant';

export const createGallery = (param) => {
    const marketPlaceItemClickCB = param.marketPlaceItemClickCB;
    const libraryItemClickCB = param.libraryItemClickCB;

    let urlIndex = 0;

    let ov = createItem({
        title: "Scene Title",
        description: "Scene Description\nSecode line of description",
        imageUrl: url(urlIndex++),
        width: totalWidth,
        height: 0.8,
        selectable: true
    });
    ov.addEventListener(UI_ELEMENT_SELECT_STATE.SELECTED, marketPlaceItemClickCB(ov));

    let cols = [];
    cols.push(ov);

    for (let j = 0; j < 2; j++) {
        let rows = [];
        for (let i = 0; i < 3; i++) {
            const panel = createItem({
                title: "Scene Title",
                description: "Scene Description",
                imageUrl: url(urlIndex++),
                width: itemWidth,
                height: itemHeight,
                selectable: true
            });
            rows.push(panel);

            panel.addEventListener(UI_ELEMENT_SELECT_STATE.SELECTED, marketPlaceItemClickCB(panel));
        }
        cols.push(createRow(totalWidth, itemHeight, rows, gap));
    }

    let marketPlace = createCol(totalWidth, totalHeight, cols, gap);

    cols = [];
    for (let j = 0; j < 3; j++) {
        let rows = [];
        for (let i = 0; i < 3; i++) {
            const panel = createItem({
                title: "Scene Title",
                description: "Scene Description",
                imageUrl: url(urlIndex++),
                width: itemWidth,
                height: itemHeight,
                selectable: true
            });
            rows.push(panel);

            panel.addEventListener(UI_ELEMENT_SELECT_STATE.SELECTED, libraryItemClickCB(panel));
        }
        cols.push(createRow(totalWidth, itemHeight, rows, gap));
    }

    const buttonHeight = 0.1;
    let dummy = new Block({
        width: itemWidth,
        height: buttonHeight,
        backgroundOpacity: 0.0,
    });
    let buttonNext = createButton({ title: "Next" });
    let buttonBar = createRow(totalWidth, buttonHeight, [dummy, buttonNext], 0);
    buttonBar.set({
        alignContent: 'center',
        justifyContent: 'end',
    });
    cols.push(buttonBar);

    let library = createCol(totalWidth, totalHeight, cols, gap);

    buttonNext.addEventListener(UI_ELEMENT_SELECT_STATE.SELECTED, () => {
        library.visible = false;
        marketPlace.visible = true;
    });
  
    return {
        marketPlace: marketPlace,
        library: library,
    }
}
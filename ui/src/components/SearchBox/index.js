import React, { useState } from "react";
import Downshift from "downshift";
import { Paper, Popper } from "@material-ui/core";
import _ from "lodash";
import { navigate } from "@reach/router";

import * as S from "./styled";

function renderInput(inputProps) {
  const { InputProps, ref, ...other } = inputProps;

  return (
    <S.Input
      InputProps={{
        inputRef: ref,
        ...InputProps
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestionProps) {
  const {
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem
  } = suggestionProps;
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || "").indexOf(suggestion.label) > -1;

  if (isSelected) {
    navigate(`/${suggestion.value}`);
  } else {
    return (
      <S.MenuItem
        {...itemProps}
        key={suggestion.label}
        selected={isHighlighted}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400
        }}
      >
        {suggestion.label}
      </S.MenuItem>
    );
  }
}

function getSuggestions(value, { showEmpty = false } = {}, suggestions) {
  const inputValue = _.deburr(value.trim()).toLowerCase();
  if (inputValue.length < 2 && !showEmpty) {
    return [];
  }
  return suggestions.filter(suggestion => {
    const suggestionLabel = _.deburr(suggestion.label.trim()).toLowerCase();
    return suggestionLabel.includes(inputValue);
  });
}

let popperNode;

export default function SearchBox({ suggestions, children }) {
  const [value, setValue] = useState("");

  function stateReducer(state, changes) {
    switch (changes.type) {
      case Downshift.stateChangeTypes.changeInput:
        setValue(changes.inputValue);
        return changes;
      default:
        return changes;
    }
  }

  return (
    <Downshift inputValue={value} stateReducer={stateReducer}>
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        highlightedIndex,
        inputValue,
        isOpen,
        selectedItem
      }) => {
        const { onBlur, onFocus, ...inputProps } = getInputProps({
          placeholder: "Search Pokémon..."
        });

        return (
          <div>
            <div>
              {renderInput({
                fullWidth: true,
                InputProps: { onBlur, onFocus },
                InputLabelProps: getLabelProps({ shrink: true }),
                inputProps,
                ref: node => {
                  popperNode = node;
                }
              })}
              <Popper open={isOpen} anchorEl={popperNode}>
                <div
                  {...(isOpen
                    ? getMenuProps({}, { suppressRefError: true })
                    : {})}
                >
                  <Paper
                    square
                    style={{
                      marginTop: 8,
                      width: popperNode ? popperNode.clientWidth : undefined
                    }}
                  >
                    {getSuggestions(inputValue, {}, suggestions).map(
                      (suggestion, index) =>
                        renderSuggestion({
                          suggestion,
                          index,
                          itemProps: getItemProps({
                            item: suggestion.label
                          }),
                          highlightedIndex,
                          selectedItem
                        })
                    )}
                  </Paper>
                </div>
              </Popper>
            </div>
            {children(inputValue)}
          </div>
        );
      }}
    </Downshift>
  );
}

import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import _ from "lodash";

import SearchBox from "../../components/SearchBox";
import PokemonCard from "../../components/PokemonCard";
import * as S from "./styled";

const PokemonTypes = [
  "Grass",
  "Poison",
  "Flying",
  "Fire",
  "Water",
  "Bug",
  "Normal",
  "Electric",
  "Ground",
  "Fighting",
  "Pyschic",
  "Rock"
];

export default function HomeScreen() {
  const { loading, error, data } = useQuery(gql`
    {
      pokemonMany {
        name
        num
        img
        type
        weaknesses
      }
    }
  `);
  const [selectedTypes, setSelectedTypes] = useState([...PokemonTypes]);

  if (loading)
    return (
      <S.Container>
        <p>Loading...</p>
      </S.Container>
    );
  if (error)
    return (
      <S.Container>
        <p>Error :(</p>
      </S.Container>
    );
  return (
    <S.Container>
      <h1>Pokédex</h1>
      <SearchBox
        suggestions={data.pokemonMany.map(pokemon => ({
          label: pokemon.name,
          value: pokemon.num
        }))}
      >
        {searchValue => (
          <>
            <fieldset>
              <legend>Include Types</legend>
              {PokemonTypes.map(type => (
                <label key={type}>
                  {type}
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => {
                      if (selectedTypes.includes(type)) {
                        setSelectedTypes(
                          selectedTypes.filter(
                            selectedType => selectedType !== type
                          )
                        );
                      } else {
                        setSelectedTypes([...selectedTypes, type]);
                      }
                    }}
                  />
                </label>
              ))}
            </fieldset>
            <S.Grid>
              {data.pokemonMany
                .filter(pokemon =>
                  searchValue
                    ? _.deburr(pokemon.name.toLowerCase()).includes(
                        _.deburr(searchValue.toLowerCase())
                      )
                    : true
                )
                .map(pokemon => (
                  <S.CardContainer key={pokemon.num}>
                    <S.CardLink to={`/${pokemon.num}`}>
                      <PokemonCard
                        key={pokemon.num}
                        pokemon={pokemon}
                        isSmall
                        animateHovering
                      />
                    </S.CardLink>
                  </S.CardContainer>
                ))}
            </S.Grid>
          </>
        )}
      </SearchBox>
    </S.Container>
  );
}

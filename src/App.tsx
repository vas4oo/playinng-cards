import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper } from '@material-ui/core';
import { HandModel } from './models/handModel';
import "./App.css";

const createDeck = () => {
  var suits = ["S", "D", "C", "H"]; //Spade, Diamond, Club, Heart
  var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  let deck = new Array<string>();
  for (let suit of suits) {
    for (let value of values) {
      var card = suit + "-" + value;
      deck.push(card);
    }
  }

  shuffleDeck(deck);
  return deck;
};

const shuffleDeck = (deck: Array<string>) => {
  let count = deck.length;
  while (count) {
    deck.push(deck.splice(Math.floor(Math.random() * count), 1)[0]);
    count -= 1;
  }
}

const App = () => {
  const [deck, setDeck] = useState<Array<string>>(new Array<string>());
  const [persons, setPersons] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [hands, setHands] = useState<Array<HandModel>>(new Array<HandModel>());

  useEffect(() => {
    setDeck(createDeck());
  }, []);

  const giveDeckOut = () => {
    if (persons <= 0) {
      setError("Input value does not exist or value is invalid");
      // The error message will go away after 4 seconds
      setTimeout(() => {
        setError('');
      }, 4000);
      return;
    }

    let hands = new Array<HandModel>();
    let indx = 0;

    deck.forEach((card, index) => {
      if (hands[indx] && hands[indx].id) {
        hands[indx].cards.push(card);
      }
      else {
        let hand = new HandModel();
        hand.id = index + 1;
        hand.cards = new Array<string>();
        hand.cards.push(card);
        hands.push(hand);
      }

      indx = indx < persons - 1 ? indx + 1 : 0;
    });

    // if there are more people than cards, add them to array with 0 cards 
    if (persons - hands.length > 0) {
      let delta = persons - hands.length;
      for (let i = 0; i < delta; i++) {
        hands.push({ id: indx + 1 + i, cards: new Array<string>() });
      }
    }

    setHands(hands);
  }

  return (
    <div className="App">
      {error !== "" ? <div className="error">{error}</div> : null}
      <Paper style={{ padding: '5px 10px 10px 10px' }}>
        <h2 style={{ marginTop: 5 }}>Inputs</h2>
        <div>
          <TextField style={{ width: 200 }}
            name="person"
            label="Number of Persons"
            type="number"
            value={persons ? persons : ''}
            onChange={e => setPersons(+e.target.value)} />
        </div>
        <Button color="primary" onClick={giveDeckOut} variant="contained" style={{ marginTop: 10 }}>
          Give deck out
        </Button>
      </Paper>

      {hands && hands.length > 0 ?
        <Paper style={{ padding: '5px 10px 10px 10px', marginTop: 10 }}>
          {hands.map(hand => {

            return <div key={hand.id}>
              {hand.id} - {hand.cards.length > 0 ? hand.cards.join(', ') : 'No cards'}
            </div>
          })}
        </Paper>
        : null}

    </div>
  );
}

export default App;

var actions = require('./actions');
var update = require('react-addons-update');
var store = require('./store');

var initialState = [{
  guesses: [],
  secretNumber: Math.floor((Math.random() * 100) + 1),
  winner: false,
  feedbackText: '',
  scores: []
}];

var gameReducer = function(state, action) {
  state = state || initialState;
  if (action.type === actions.SHOW_INSTRUCTIONS) {
    return actions.showInstructions.text;
  }

  else if (action.type === actions.NEW_GAME) {
    return state.concat({
      guesses: [],
      secretNumber: Math.floor((Math.random() * 100) + 1),
      winner: false,
      feedbackText: '',
      scores: []
    });
  }

  else if (action.type === actions.MAKE_GUESS) {
    if (typeof action.guess === 'number' && (action.guess >= 1 && action.guess <= 100)) {
      console.log(state);
      var currentState = update(state, {
        [state.length - 1]: {
          guesses: {
            $push: [action.guess]
          },
          feedbackText: {
            $set: ''
          },
          score: {
            $set: [state.length + 1]
          }
        }
        });


      console.log(currentState);
      var secretNumber = state[state.length - 1].secretNumber;
      var distance = Math.abs(action.guess - secretNumber);

      if (distance === 0) {
        currentState[currentState.length - 1].winner = true;
        currentState[currentState.length-1].feedbackText = 'WINNEERRR!'
        currentState[currentState.length - 1].scores = currentState[currentState.length-1].guesses.length
      }

      else if (distance >= 50) {
        currentState[currentState.length-1].feedbackText = 'Freezing cold, idiot!'
      }

      else if (distance >= 30) {
        currentState[currentState.length-1].feedbackText = 'Pretty cold, moron!'
      }

      else if (distance >= 20) {
        currentState[currentState.length-1].feedbackText = 'Warmish, twat!'
      }

      else if (distance >= 10) {
        currentState[currentState.length-1].feedbackText = 'Warm, shmuck!'
      }

      else if (distance >= 1) {
        currentState[currentState.length-1].feedbackText = 'Super hot, loser!'
      }

      return currentState;
    }
    else {
      var currentState = update(state, {
        [state.length - 1]: {
          feedbackText: {$set: 'You\'re a dumbass!!!!'}
        }
      });
      return currentState;
    }
  }

  else if (action.type === actions.FETCH_SCORES_SUCCESS) {
    console.log('FETCH SCORES SUCCESS!!!', action.scores);
    var currentState = update(state, {
      [state.length - 1]: {
        scores: {$set: action.scores}
      }
    })
    return currentState;
  }

  else if (action.type === actions.FETCH_SCORES_ERROR) {
    console.log('You\'re stupid, and you fail!');
  }


  return state;
};

exports.gameReducer = gameReducer;

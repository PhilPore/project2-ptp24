function CheckEnd(lastind, marker, board) {
  // will use this for a win condition/draw condition
  console.log(`Entering check ${lastind}=${marker}`);
  let fillcount = 0;
  let i = 0;
  if (lastind === 0 || lastind === 3 || lastind === 6) {
    if (board[lastind + 1] === marker && board[lastind + 2] === marker) {
      console.log('We have a winner!');
      return 1;
    }
    if (lastind === 0) {
      if (
        (board[lastind + 4] === marker && board[lastind + 8] === marker)
        || (board[3] === marker && board[6] === marker)
      ) {
        console.log('We have a winner!');
        return 1;
      }
    } else if (lastind === 3) {
      if (board[0] === marker && board[6] === marker) {
        console.log('We have a winner!');
        return 1;
      }
    } else if (
      (board[3] === marker && board[0] === marker)
      || (board[4] === marker && board[2] === marker)
    ) {
      console.log('We have a winner!');
      return 1;
    }
  } else if (lastind === 1 || lastind === 4 || lastind === 7) {
    if (board[lastind - 1] === marker && board[lastind + 1] === marker) {
      console.log('We have a winner!');
      return 1;
    } if (lastind === 4) {
      if (
        (board[0] === marker && board[8] === marker)
        || (board[2] === marker && board[6] === marker)
        || (board[1] === marker && board[7] === marker)
      ) {
        console.log('We have a winner!');
        return 1;
      }
    }
    if (lastind === 1) {
      if (board[4] === marker && board[7] === marker) {
        console.log('We have a winner!');
        return 1;
      }
    }
    if (lastind === 7) {
      if (board[4] === marker && board[1] === marker) {
        console.log('We have a winner!');
        return 1;
      }
    }
  } else if (lastind === 2 || lastind === 5 || lastind === 8) {
    if (board[lastind - 1] === marker && board[lastind - 2] === marker) {
      console.log('We have a winner!');
      return 1;
    } if (lastind === 2) {
      if (
        (board[4] === marker && board[6] === marker)
        || (board[5] === marker && board[8] === marker)
      ) {
        console.log('We have a winner');
        return 1;
      }
    } else if (lastind === 8) {
      if (
        (board[4] === marker && board[0] === marker)
        || (board[5] === marker && board[2] === marker)
      ) {
        console.log('We have a winner');
        return 1;
      }
    }
  }

  for (i = 0; i < 9; i += 1) {
    if (board[i] !== ' ' || i === lastind) {
      fillcount += 1;
    }
  }
  if (fillcount === 9) {
    console.log('Draw!');
    return -1;
  }
  return 0;
}

export default CheckEnd;

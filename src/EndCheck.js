export function CheckEnd(last_ind, marker, board) {
  // will use this for a win condition/draw condition
  console.log(`Entering check ${last_ind}=${marker}`);
  let fillcount = 0;
  let i = 0;
  if (last_ind == 0 || last_ind == 3 || last_ind == 6) {
    if (board[last_ind + 1] == marker && board[last_ind + 2] == marker) {
      console.log('We have a winner!');
      return 1;
    }
    if (last_ind == 0) {
      if (
        (board[last_ind + 4] == marker && board[last_ind + 8] == marker)
        || (board[3] == marker && board[6] == marker)
      ) {
        console.log('We have a winner!');
        return 1;
      }
    } else if (last_ind == 3) {
      if (board[0] == marker && board[6] == marker) {
        console.log('We have a winner!');
        return 1;
      }
    } else if (
      (board[3] == marker && board[0] == marker)
      || (board[4] == marker && board[2] == marker)
    ) {
      console.log('We have a winner!');
      return 1;
    }
  } else if (last_ind == 1 || last_ind == 4 || last_ind == 7) {
    if (board[last_ind - 1] == marker && board[last_ind + 1] == marker) {
      console.log('We have a winner!');
      return 1;
    } if (last_ind == 4) {
      if (
        (board[0] == marker && board[8] == marker)
        || (board[2] == marker && board[6] == marker)
        || (board[1] == marker && board[7] == marker)
      ) {
        console.log('We have a winner!');
        return 1;
      }
    }
    if (last_ind == 1) {
      if (board[4] == marker && board[7] == marker) {
        console.log('We have a winner!');
        return 1;
      }
    }
    if (last_ind == 7) {
      if (board[4] == marker && board[1] == marker) {
        console.log('We have a winner!');
        return 1;
      }
    }
  } else if (last_ind == 2 || last_ind == 5 || last_ind == 8) {
    if (board[last_ind - 1] == marker && board[last_ind - 2] == marker) {
      console.log('We have a winner!');
      return 1;
    } if (last_ind == 2) {
      if (
        (board[4] == marker && board[6] == marker)
        || (board[5] == marker && board[8] == marker)
      ) {
        console.log('We have a winner');
        return 1;
      }
    } else if (last_ind == 8) {
      if (
        (board[4] == marker && board[0] == marker)
        || (board[5] == marker && board[2] == marker)
      ) {
        console.log('We have a winner');
        return 1;
      }
    }
  }

  for (i = 0; i < 9; i++) {
    if (board[i] != ' ' || i == last_ind) {
      fillcount += 1;
    }
  }
  if (fillcount == 9) {
    console.log('Draw!');
    return -1;
  }
  return 0;
}

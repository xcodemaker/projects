export class BubbleSort {
  film = [];

  constructor() {}

  sort(data) {
    var swapCount = 1;
    var film = [];

    var unsortedDataLength = data.length;
    while (swapCount > 0) {
      swapCount = 0;
      for (var i = 1; i < unsortedDataLength; i++) {
        var filmActions = {
          blur: previousFocus,
          focus: [i - 1, i],
          increaseComparisons: true,
        };
        var previousFocus = filmActions.focus;
        film.push(filmActions);

        if (data[i - 1] > data[i]) {
          var temp = data[i - 1];
          data[i - 1] = data[i];
          data[i] = temp;
          swapCount++;

          film.push({
            swap: filmActions.focus,
            increaseSwaps: true
          });
        }
      }
      unsortedDataLength--;
    }

    return film;
  }
}
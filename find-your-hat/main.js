

// const animals = ['bears', 'cats', 'dogs', 'elephants', 'giraffes'];

// console.log(animals.some(animal => animal.length < 5));

// const randomNums = [1, 123, 25, 90, 3543, 42];
 
// const foundElement = randomNums.findIndex(num => num > 200);

const currencies = {
    diram: {
      countries: ['UAE', 'Morocco'],
    },
    real: {
      countries: ['Brazil'],
    },
    dinar: {
      countries: ['Algeria', 'Bahrain', 'Jordan', 'Kuwait'],
    },
    vatu: {
      countries: ['Vanuatu'],
    },
    shilling: {
      countries: ['Tanzania', 'Uganda', 'Somalia', 'Kenya'],
    },
  };


console.log(currencies.dinar.countries[currencies.dinar.countries.length-1]);
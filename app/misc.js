exports.doSomeCode = () => {
  for (let x = 0; x < 20000; x += 1) {
    Math.sqrt(x * x);
  }
};

//--------------------------------------------------
exports.multiObject = {
  foo: 'Yeah, piece of cake!',
  bar: {
    Adriana: {
      age: 19,
      hair: 'blonde',
    },
    Beverly: {
      age: 32,
      hair: 'brunette',
    },
    Carmen: {
      age: 27,
      hair: 'redhead',
    },
  },
  baz: {
    friday: 'Beer, dancing, more beer!',
    nextMorning: 'Damn, what day is it today?',
  },
};

//--------------------------------------------------
exports.allTypesObject = {
  boolean: true,
  number: 100500,
  string: 'Your face, your ass, what\'s the difference?',
  array: ['foo', 'bar', '123'],
  object: { foo: 'bar' },
  function: () => {
    const bar = this.allTypesObject.number;
    const baz = parseInt(this.allTypesObject.array[2], 10);
    return bar + baz;
  },
  undefined,
  null: null,
  NaN,
  infinityP: Infinity,
  infinityM: -Infinity,
};

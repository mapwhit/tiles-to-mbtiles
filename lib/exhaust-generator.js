module.exports = exhaustGenerator;

function exhaustGenerator(generator, task, limit, fn) {
  let doneCounter = limit;
  let reported = false;

  while(limit--) {
    step();
  }

  function step(err) {
    if (reported) {
      return;
    }
    if (err) {
      reported = true;
      return fn(err);
    }
    const { done, value } = generator.next();
    if (!done) {
      return task(value, step);
    }
    if (--doneCounter === 0) {
      fn();
    }
  }
}

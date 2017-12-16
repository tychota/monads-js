const R = require("ramda");
const { Identity, Maybe, Right, Left, either, IO } = require("./monads");

test("Identities have a unit/lift function", () => {
  expect(Identity.of("3").__value).toEqual("3");
  expect(Identity.of(Identity.of("yoda")).__value.__value).toEqual("yoda");
});

test("Identities have a map function", () => {
  expect(Identity.of(2).map(n => n + 2)).toEqual(Identity.of(4));
  expect(Identity.of("flamethrowers").map(s => s.toUpperCase())).toEqual(
    Identity.of("FLAMETHROWERS")
  );
});

test("Identities have a join function", () => {
  expect(
    Identity.of(2)
      .map(n => n + 2)
      .join()
  ).toEqual(4);
});

test("Maybe have a unit/lift function", () => {
  expect(Maybe.of("3")).toEqual({ __value: "3" });
  expect(Maybe.of(null)).toEqual({ __value: null });
  expect(Maybe.of(Maybe.of("yoda"))).toEqual({
    __value: { __value: "yoda" }
  });
});

test("Maybe have a map function", () => {
  expect(Maybe.of("Cocktail Molotov").map(R.match(/o/gi))).toEqual({
    __value: ["o", "o", "o", "o"]
  });
});

test("Maybe(x).map returns Maybe(null) when x is null", () => {
  expect(Maybe.of(null).map(R.match(/a/gi))).toEqual(Maybe.of(null));
});

test("either(Fn_a, Fn_b, Either<A, B> call Fn_a if Either is Left, Fn_B if right", () => {
  const fn = jest.fn();
  expect(either(fn, n => n + 2, Right.of(3))).toEqual(5);
  expect(either(fn, n => n + 2, Left.of("Error"))).toEqual(undefined);
  expect(fn).toHaveBeenCalledWith("Error");
});

test("IO monad should wrap side effect", () => {
  const io_window = new IO(() => global);
  expect(
    io_window
      .map(R.prop("Math"))
      .map(R.prop("PI"))
      .unsafePerformIO()
  ).toBeCloseTo(3.141592, 5);
});

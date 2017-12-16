// @flow
const R = require("ramda");

// -- Identities -----------------------------------------------------

class Identity<A: mixed> {
  +__value: A;
  constructor(x: A) {
    this.__value = x;
  }
  static of(x: A): Identity<A> {
    return new Identity(x);
  }
  map<B: *>(f: (_: A) => B): Identity<B> {
    return Identity.of(f(this.__value));
  }
  join(): A {
    return this.__value;
  }
  toString(): string {
    return `Identity(${+this.__value})`;
  }
}

// -- Maybe ----------------------------------------------------------

class Maybe<A: *> {
  +__value: A;
  constructor(x: A) {
    this.__value = x;
  }
  static of(x: A): Maybe<A> {
    return new Maybe(x);
  }
  isNothing(): boolean {
    return this.__value === null || this.__value === undefined;
  }
  map<B: *>(f: (_: A) => B): Maybe<B | null> {
    return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
  }
  join(): Maybe<null> | A {
    return this.isNothing() ? Maybe.of(null) : this.__value;
  }
  toString(): string {
    return `Maybe(${+this.__value})`;
  }
}

const maybe = R.curry(function<A, B>(x: B, f: A => B, m: Maybe<A>) {
  return m.isNothing() ? x : f(m.__value);
});

// -- Either ---------------------------------------------------------

class HKT<F, A> {}
type HKT2<F, A, B> = HKT<HKT<F, A>, B>;

class Left<A: *> {
  +__value: A;
  constructor(x: A) {
    this.__value = x;
  }
  static of(x: A): Left<A> {
    return new Left(x);
  }
  map<B: *>(f: (_: A) => B): Left<A> {
    return this;
  }
  toString(): string {
    return `Left(${+this.__value})`;
  }
}

class Right<A: *> {
  +__value: A;
  constructor(x: A) {
    this.__value = x;
  }
  static of(x: A): Right<A> {
    return new Right(x);
  }
  map<B: *>(f: (_: A) => B): Right<B> {
    return Right.of(f(this.__value));
  }
  toString(): string {
    return `Right(${+this.__value})`;
  }
}

type Either<A, B> = Left<A> | Right<B>;

function either<A, B, C>(f: A => C, g: B => C, e: Either<A, B>): C {
  if (e instanceof Left) {
    return f(e.__value);
  }
  return g(e.__value);
}

// -- IO ------------------------------------------------------------

class IO<A: Function> {
  +unsafePerformIO: A;
  constructor(x: A) {
    this.unsafePerformIO = x;
  }
  static of(x: A): IO<() => A> {
    return new IO(() => x);
  }
  map<B: *>(f: (_: A) => B): IO<() => B> {
    return new IO(R.compose(f, this.unsafePerformIO));
  }
  toString(): string {
    return `IO(${+this.unsafePerformIO})`;
  }
}

module.exports = { Identity, Maybe, maybe, Right, Left, either, IO };

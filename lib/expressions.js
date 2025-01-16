'use strict';

const OPERATORS = require('./operators.js');

const BOOL = {
  t: true,
  nil: false,
  true: true,
  false: false,
};

class BooleanExpression {
  constructor(value) {
    this.type = 'boolean';
    if (!(value in BOOL)) {
      throw new Error(`Unknown boolean value: ${value}`);
    }
    this.value = BOOL[value];
  }

  interpret() {
    return this.value;
  }
}

class NumberExpression {
  constructor(value) {
    this.type = 'number';
    this.value = parseFloat(value);
  }

  interpret() {
    return this.value;
  }
}

class VariableExpression {
  constructor(name) {
    this.type = 'variable';
    this.name = name;
  }

  interpret(context) {
    if (!(this.name in context)) {
      throw new Error(`Variable "${this.name}" is not defined`);
    }
    return context[this.name];
  }
}

class OperationExpression {
  constructor(operator, operands) {
    this.type = 'operation';
    this.operator = operator;
    this.operands = operands;
  }

  interpret(context) {
    const toValues = (operand) => operand.interpret(context);
    const args = this.operands.map((x) => toValues(x));
    const operator = OPERATORS[this.operator];
    if (!operator) throw new Error(`Unknown operator: ${operator}`);
    if (this.operator.length > 1) return operator(...args);
    return args.reduce(operator);
  }
}

const expressions = {
  number: NumberExpression,
  variable: VariableExpression,
  boolean: BooleanExpression,
  operation: OperationExpression,
};

const getExpressionClass = (token) => {
  if (Array.isArray(token)) return expressions.operation;
  if (!isNaN(token)) return expressions.number;
  if (token in BOOL) return expressions.boolean;
  return expressions.variable;
};

module.exports = {
  NumberExpression,
  VariableExpression,
  OperationExpression,
  BooleanExpression,
  BOOL,
  expressions,
  getExpressionClass,
};

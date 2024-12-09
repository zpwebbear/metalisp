'use strict';

const OPERATORS = require('./operators.js');

const BOOL = {
  t: true,
  nil: false,
  true: true,
  false: false,
};

class BooleanExpression {
  type = 'boolean';

  constructor(value) {
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
  type = 'number';

  constructor(value) {
    this.value = parseFloat(value);
  }

  interpret() {
    return this.value;
  }
}

class VariableExpression {
  type = 'variable';

  constructor(name) {
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
  type = 'operation';

  constructor(operator, operands) {
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

const expressionType = {
  number: 'number',
  variable: 'variable',
  operation: 'operation',
  boolean: 'boolean',
};

const getExpressionType = (token) => {
  if (Array.isArray(token)) return expressionType.operation;
  if (!isNaN(token)) return expressionType.number;
  if (token in BOOL) return expressionType.boolean;
  return expressionType.variable;
};

module.exports = {
  NumberExpression,
  VariableExpression,
  OperationExpression,
  BooleanExpression,
  BOOL,
  expressions,
  expressionType,
  getExpressionType,
};

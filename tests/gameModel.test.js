import {
  TOTAL_QUESTIONS,
  buildQuestionPool,
  createInitialState,
  formatElapsedTime,
  getProgressPercent,
  getScorePercent,
  isAnswerCorrect,
  isTaskAllowed,
  sanitizeNumericValue,
  shuffle
} from "../src/model.js";
import { describe, expect, test } from "vitest";

describe("model.createInitialState", () => {
  test("creates default state", () => {
    expect(createInitialState()).toEqual({
      max: 30,
      count: 0,
      correct: 0,
      startTime: null,
      current: null,
      questions: []
    });
  });

  test("creates state with custom max", () => {
    expect(createInitialState(50).max).toBe(50);
  });
});

describe("model.isTaskAllowed", () => {
  test("returns true when result fits selected max", () => {
    expect(isTaskAllowed(3, 4, 20)).toBe(true);
  });

  test("returns false when result exceeds selected max", () => {
    expect(isTaskAllowed(7, 8, 50)).toBe(false);
  });
});

describe("model.isAnswerCorrect", () => {
  test("accepts numeric correct answer", () => {
    expect(isAnswerCorrect(12, 12)).toBe(true);
  });

  test("accepts string correct answer", () => {
    expect(isAnswerCorrect("12", 12)).toBe(true);
  });

  test("rejects wrong answer", () => {
    expect(isAnswerCorrect("11", 12)).toBe(false);
  });
});

describe("model.sanitizeNumericValue", () => {
  test("keeps only digits", () => {
    expect(sanitizeNumericValue("1a2-3 ")).toBe("123");
  });
});

describe("model.shuffle", () => {
  test("returns a new array with the same items", () => {
    const input = [1, 2, 3, 4, 5];
    const output = shuffle(input);

    expect(output).toHaveLength(input.length);
    expect([...output].sort()).toEqual([...input].sort());
    expect(output).not.toBe(input);
  });
});

describe("model.buildQuestionPool", () => {
  test("returns exactly 10 questions", () => {
    expect(buildQuestionPool(30)).toHaveLength(TOTAL_QUESTIONS);
  });

  test("returns only questions allowed by selected max", () => {
    const questions = buildQuestionPool(30);
    expect(questions.every((question) => question.answer <= 30)).toBe(true);
  });

  test("returns normalized question shape", () => {
    const questions = buildQuestionPool(50);
    expect(
      questions.every(
        (question) =>
          typeof question.a === "number" &&
          typeof question.b === "number" &&
          typeof question.answer === "number"
      )
    ).toBe(true);
  });
});

describe("model.progress and score helpers", () => {
  test("calculates progress percentage", () => {
    expect(getProgressPercent(5)).toBe(50);
  });

  test("calculates score percentage", () => {
    expect(getScorePercent(7)).toBe(70);
  });
});

describe("model.formatElapsedTime", () => {
  test("formats elapsed time to one decimal place", () => {
    expect(formatElapsedTime(0, 2345)).toBe("2.3");
  });
});

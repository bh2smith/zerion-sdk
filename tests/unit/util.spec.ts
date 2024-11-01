import { isBase64, toBase64 } from "../../src/util";

describe("isBase64", () => {
  it("returns true for valid base64 strings", () => {
    expect(isBase64("aGVsbG8=")).toBe(true);
    expect(isBase64("dGVzdA==")).toBe(true);
    expect(isBase64("YWJjZA==")).toBe(true);
  });

  it("returns false for non-base64 strings", () => {
    expect(isBase64("hello")).toBe(false);
    expect(isBase64("test!@#")).toBe(false);
    expect(isBase64("zk_dev_12345678910")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isBase64("")).toBe(false);
  });
});

describe("toBase64", () => {
  it("correctly encodes strings to base64", () => {
    expect(toBase64("hello")).toBe("aGVsbG8=");
    expect(toBase64("test")).toBe("dGVzdA==");
    expect(toBase64("abc:")).toBe("YWJjOg==");
  });

  it("correctly encodes API key format", () => {
    expect(toBase64("zk_dev_12345678910:")).toBe(
      "emtfZGV2XzEyMzQ1Njc4OTEwOg=="
    );
  });

  it("handles empty string", () => {
    expect(toBase64("")).toBe("");
  });
});

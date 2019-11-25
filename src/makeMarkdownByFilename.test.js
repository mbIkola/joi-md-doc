const joi = require('@hapi/joi');
const makeMarkdownByFilename = require('./makeMarkdownByFilename');

describe(`makeMarkdownByFilename`, () => {
  describe(`unit`, () => {
    it(`should support primitive type`, () => {
      const joiSchema = {
        describe: () => ({
          metas: [{ name: 'Test', filename: 'test' }],
          keys: {
            foo: { type: 'number' },
            bar: { type: 'string' },
            baz: { type: 'boolean' },
          },
        }),
      };

      expect(makeMarkdownByFilename(joiSchema)).toMatchSnapshot();
    });

    it(`should support nested schemas/objects`, () => {
      const joiSchema = {
        describe: () => ({
          metas: [{ name: 'Parent', filename: 'parent' }],
          keys: {
            foo: {
              type: 'object',
              metas: [{ name: 'Child', filename: 'child' }],
              keys: {
                foo: { type: 'number' },
              },
            },
          },
        }),
      };

      expect(makeMarkdownByFilename(joiSchema)).toMatchSnapshot();
    });

    it(`should support list of single primitive type`, () => {
      const joiSchema = {
        describe: () => ({
          metas: [{ name: 'Test', filename: 'test' }],
          keys: {
            stringList: {
              type: 'array',
              items: [{ type: 'string' }],
            },
          },
        }),
      };

      expect(makeMarkdownByFilename(joiSchema)).toMatchSnapshot();
    });

    it(`should support list of various primitive types`, () => {
      const joiSchema = {
        describe: () => ({
          metas: [{ name: 'Test', filename: 'test' }],
          keys: {
            stringList: {
              type: 'array',
              items: [
                { type: 'string' },
                { type: 'number' },
                { type: 'boolean' },
              ],
            },
          },
        }),
      };

      expect(makeMarkdownByFilename(joiSchema)).toMatchSnapshot();
    });

    it(`should support nested list of single schema/object type`, () => {
      const joiSchema = {
        describe: () => ({
          metas: [{ name: 'Test', filename: 'test' }],
          keys: {
            stringList: {
              type: 'array',
              items: [
                {
                  type: 'object',
                  metas: [{ name: 'List Item', filename: 'listItem' }],
                  keys: { listItemKey: { type: 'string' } },
                },
              ],
            },
          },
        }),
      };

      expect(makeMarkdownByFilename(joiSchema)).toMatchSnapshot();
    });

    it(`should mark required fields`, () => {
      const joiSchema = {
        describe: () => ({
          metas: [{ name: 'Test', filename: 'test' }],
          keys: {
            foo: {
              type: 'number',
              flags: {
                presence: 'required',
              },
            },
          },
        }),
      };

      expect(makeMarkdownByFilename(joiSchema)).toMatchSnapshot();
    });

    it(`should support descriptions`, () => {
      const joiSchema = {
        describe: () => ({
          metas: [{ name: 'Test', filename: 'test' }],
          keys: {
            foo: {
              type: 'number',
              flags: {
                description: 'This is a description.',
              },
            },
          },
        }),
      };

      expect(makeMarkdownByFilename(joiSchema)).toMatchSnapshot();
    });

    it(`should support default meta tags`, () => {
      const joiSchema = {
        describe: () => ({
          metas: [{ name: 'Test', filename: 'test' }],
          keys: {
            foo: {
              type: 'number',
              metas: [{ default: 1 }],
            },
          },
        }),
      };

      expect(makeMarkdownByFilename(joiSchema)).toMatchSnapshot();
    });

    it(`should support whitelisting valid values`, () => {
      const joiSchema = {
        describe: () => ({
          metas: [{ name: 'Test', filename: 'test' }],
          keys: {
            foo: {
              type: 'string',
              allow: ['valid1', 'valid2'],
            },
          },
        }),
      };

      expect(makeMarkdownByFilename(joiSchema)).toMatchSnapshot();
    });

    it(`should support blacklisting invalid values`, () => {
      const joiSchema = {
        describe: () => ({
          metas: [{ name: 'Test', filename: 'test' }],
          keys: {
            foo: {
              type: 'string',
              invalid: ['invalid1', 'invalid2'],
            },
          },
        }),
      };

      expect(makeMarkdownByFilename(joiSchema)).toMatchSnapshot();
    });

    it(`negative: should throw when no name meta tag`, () => {
      const joiSchema = {
        describe: () => ({
          metas: [{ filename: 'test' }],
        }),
      };

      expect(() => makeMarkdownByFilename(joiSchema)).toThrowError(
        'Required name meta tag not provided.',
      );
    });

    it(`negative: should throw when no filename meta tag`, () => {
      const joiSchema = {
        describe: () => ({
          metas: [{ name: 'Test' }],
        }),
      };

      expect(() => makeMarkdownByFilename(joiSchema)).toThrowError(
        'Required filename meta tag not provided.',
      );
    });
  });

  describe(`integration`, () => {
    it(`should support appended schemas`, () => {
      const baseSchema = joi.object().keys({
        base: joi.boolean(),
      });

      const extendedSchema = baseSchema
        .append({
          extended: joi.boolean(),
        })
        .meta({
          name: 'Extends from Base',
          filename: 'extendedFromBase',
        });

      expect(makeMarkdownByFilename(extendedSchema)).toMatchSnapshot();
    });
  });
});

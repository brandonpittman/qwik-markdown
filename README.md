# Qwik Markdown

## Command List

```sh
generate, g
    Generate a Markdown route using Qwik City's built-in generator

validate, v
    Validate Markdown route's frontmatter using Valibot
```

## Generate

### Example

`npx qwik-markdown generate`

### Description

Lets you generate Markdown routes with a named folder and an enclosed `index.md` or `index.mdx`.

Currently interactive only. Passing params coming soon.

## Validate

### Example

`npx qwik-markdown validate`

### Description

Searches for `schema.ts` files that export a Valibot object schema called `schema` in a route root. The schema file for a route populates the generator options.
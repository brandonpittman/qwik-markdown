# Qwik Markdown

🚨 Requires Qwik v1.2.8 or higher.

## Available Commands

### generate, g

Generate a Markdown route using the built-in generator in Qwik City.

### validate, v

Validate Markdown route's frontmatter using Valibot

## Setup

Both of the commands above require you to define [Valibot][] schemas in the root of your routes that contain Markdown routes.

Say you have a tree structure like this:

```sh
src
  routes
    posts
      schema.ts
      hello-world
        index.md
```

In `schema.ts`, you might have a Valibot schema like this:

```ts
import { object, string, minLength } from "valibot";

export const schema = object({
  title: string([minLength(1, "Title required")]),
});
```

Let's say your `hello-world/index.md` contains this:

```md
This is my first post!
```

If you run `qwik-markdown validate`, it will fail because you don't have a `title` defined. So change the front matter to:

```md
---
title: "Hello World
---
```

If you run `qwik-markdown validate` again, validation will pass and nothing will be displayed. Helpful to run before `qwik build` to ensure all your Markdown files have the necessary frontmatter defined. Currently, `string(), enumType(), boolean(), and optional()` validations are supported.

## Generate New Markdown Routes

With your `schema.ts` files set up, Qwik Markdown can infer the type of frontmatter you need for each route. If you run `qwik-markdown generate`, a series of prompts will be shown to gather info about the filename to use and each frontmatter value to be used. The filename you provide should:

1. Consist of numbers or lowercase letters, separated by hyphens
2. End in `.md` or `.mdx`

If you provide a filename like `my-second-post.md`, you'll get a new route at `src/routes/posts/my-second-post/index.md`. The frontmatter will then be populated with the values you provide in the following prompts.

## Known Issues

- `generate` command is interactive-only. May support passing command-line params in the future.
- `validate` errors aren't formatted as well as they could be. Will be addressed in the future.

[valibot]: https://valibot.dev

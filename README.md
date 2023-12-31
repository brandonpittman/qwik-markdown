# Qwik Markdown

<p align="center">
  <img width="642" alt="CleanShot 2023-09-16 at 0 02 48@2x" src="https://github.com/brandonpittman/qwik-markdown/assets/967145/0288ab67-ba8a-4cba-9dac-0d4a0eaa541b">
</p>

🚨 Requires Qwik v1.2.8 or higher.

## Available Commands

### generate, g

Generate a Markdown route

### validate, v

Validate frontmatter using Valibot

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
title: "Hello World"
---
```

If you run `qwik-markdown validate` again, validation will pass and nothing will be displayed. Helpful to run before `qwik build` to ensure all your Markdown files have the necessary frontmatter defined. <!--Currently, `string(), enumType(), boolean(), and optional()` validations are supported.-->

## Generate New Markdown Routes

With your `schema.ts` files set up, Qwik Markdown can infer the type of frontmatter you need for each route. If you run `qwik-markdown generate`, a series of prompts will be shown to gather info about the filename to use and each frontmatter value to be used. The filename you provide should:

1. Consist of numbers or lowercase letters, separated by hyphens
2. End in `.md` or `.mdx`

If you provide a filename like `my-second-post.md`, you'll get a new route at `src/routes/posts/my-second-post/index.md`. The frontmatter will then be populated with the values you provide in the following prompts.

## Known Issues

- [ ] `generate` command is interactive-only. May support passing command-line params in the future.
- [ ] `validate` errors aren't formatted as well as they could be. Will be addressed in the future.
- [x] ~Doesn't check if Qwik 1.2.8 or higher is installed.~
- [ ] If you want to have a non-string or non-boolean type like `date()`, you'll need to use [`coerce`][coerce].

[valibot]: https://valibot.dev
[coerce]: https://valibot.dev/guides/methods/#coerce

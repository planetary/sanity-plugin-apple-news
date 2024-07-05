# sanity-plugin-apple-news

> This is a **Sanity Studio v3** plugin.

Generate Apple News JSON directly from within [Sanity CMS](https://www.sanity.io).

![Screenshot 2024-07-05 at 11 30 08@2x](https://github.com/planetary/sanity-plugin-apple-news/assets/1646307/9aa85f9c-0262-4fca-8db6-ffd0229e60f7)

## Installation

```sh
npm install @planetary/sanity-plugin-apple-news
```

## Usage

Add it as a plugin in `sanity.config.ts` (or .js):

```ts
import {defineConfig} from 'sanity'
import {appleNews} from '@planetary/sanity-plugin-apple-news'

export default defineConfig({
  //...
  plugins: [
    // ...other plugins
    appleNews({
      // Use default configuration for
      article: {},
      blogPost: {
        fields: {
          thumbnail: 'featuredImage',
        },
      },
    }),
  ],
})
```

A more advanced configuration might look something like this:

```ts
import {defineConfig} from 'sanity'
import {appleNews, defaultTheme} from '@planetary/sanity-plugin-apple-news'

appleNews({
  schema: {
    article: {
      fields: {
        // Map Sanity field names to those expected by the Apple News plugin
        title: 'headline',
        subtitle: 'subHeadline',
        body: 'content',
        thumbnail: 'coverImage',
      },
      query: `
        *[_id == $documentId][0] {
          ...,
          # Resolve author references
          "authors": authors[]-> {
            name
          },
        }
      `,
    },
  },
  theme: {
    componentTextStyles: {
      ...defaultTheme.componentTextStyles,
      titleStyle: {
        textAlignment: 'left',
        fontName: 'DINCondensed-Bold',
        fontSize: 42,
        lineHeight: 54,
        textColor: '#4da68c',
      },
    },
  },
})
```

### Configuration options

The plugin accepts the following configuration options.

| Option         | Required | Description                                                                                        |
| -------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `schema`       | `false`  | Object keyed by the Sanity schema type names, and its respective configuration.                    |
| `theme`        | `false`  | Style overrides when generating the article.                                                       |
| `customBlocks` | `false`  | Handle rendering custom block content when converting Portable Text to Apple News compatible HTML. |
| `callback`     | `false`  | Callback to run after generating an article.                                                       |

#### `schema`

This is the primary configuration you will work work with, and defines how to map your specific schema structure to that
expected by Apple News JSON.

Enable the Apple News generation for your desired schema by adding it as a key to the `schema` object.

E.g. to enable this plugin for schema called `blogPost` the configuration object would be

```
appleNews({
  schema: {
    blogPost: {}
  }
})
```

##### `schema.fields`

Creates a mapping between the Apple News JSON keys and those of the Sanity schema,
allowing the plugin to integrate with your existing schema structures.

```ts
Record<'metadata' | 'subtitle' | 'title' | 'authors' | 'body' | 'thumbnail', string>

// e.g. custom blog schema
appleNews({
  schema: {
    blogPost: {
      schema: {
        // Can be a partial mapping
        thumbnail: 'heroImage',
      },
    },
  },
})
```

##### `schema.query`

This is an advanced feature, allowing you to provide a custom GROQ query to execute when fetching documents.

This is primarily used for resolving item references in your documents.
Note that the `$documentId` variable placeholder will be automatically injected by the plugin.

```ts
appleNews({
  schema: {
    article: {
      query: `
        *[_id == $documentId][0] {
          ...,
          # Resolve author references
          "authors": authors[]-> {
            name
          },
        }
      `,
    },
  },
})
```

#### `theme`

Customize the appearance of the generated article by configuring the Apple News JSON styles by extending the default theme.
Please refer to the TypeScript type definitions for available options, as well as the official [Apple News documentation](https://developer.apple.com/documentation/apple_news/apple_news_format/enhancing_your_articles_with_styles).

#### `customBlocks`

This can be used to render custom components in the generated article.
Optional mapping between your custom Block Content schema, and their Apple News compatible HTML representation.

This is passed directly to [`@portabletext/to-html`](https://github.com/portabletext/to-html), so please refer to the documentation there.

#### `callback`

A handler function to call when successfully generating an article.

This can be used to integrate with publishing workflows for example by trigger Webhooks or Zapier workflows.

It receives the generated Apple News article JSON as the first and only parameter.

## Previewing

The only official method of preview Apple News articles is through the News Preview application [which can be downloaded here](https://developer.apple.com/apple-news/resources/).

The News Preview expects a JSON document titled `article.json` and a connected device with Apple News installed.

- In Sanity Studio, navigate to the article you want to preview
- Click the `More / …` button next to the document Publish button
- Click `Generate Apple News article`
- Open the News Preview application
- Click on the big plus (`+`) icon in the application window, or the file menu bar `File > Open…`
- Selected the downloaded `article.json`
- From the right sidebar in the News Preview app, select a device to preview the article on
- The article should open in Apple News
- If you overwrite the `article.json` file, the Apple News preview will automatically update

### Troubleshooting

At times Apple News Preview fails to load an article for unknown reasons.

Restarting the computer seems to resolve these issues.

If you’re still encountering issues after a restart, please verify that the syntax of the generated
`article.json` is indeed valid. This could be due to issues with custom mappings between Block Content
and Apple News HTML.

If issues persist after verifying the syntax, feel free to create an

## Publishing

Publishing to Apple News requires an Apple Developer account and various publishing channels provisions.

Configuring these are beyond the scope of this starter kit, however you can utilize
the `callback` configuration of this plugin to call the [Apple News API](https://developer.apple.com/documentation/apple_news/apple_news_api/).

Use the [Sanity Studio Secrets](https://github.com/sanity-io/sanity-studio-secrets) plugin for securely embedding any required secrets and API keys within your Studio.

## Relevant links

- Apple News developer resources: https://developer.apple.com/apple-news/resources/
- Apple News JSON documentation: https://developer.apple.com/documentation/apple_news/apple_news_format

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.

## License

[MIT](LICENSE) © [Planetary Corporation](https://planetary.co)

import {BinaryDocumentIcon} from '@sanity/icons'
import type AppleNews from '@wanews/apple-news-format'
import {definePlugin} from 'sanity'

import {documentHandler} from './documentHandler'
import {AppleNewsArticleFields} from './makeAppleNewsArticle'
import {CustomBlockRenderer} from './portableTextToAppleHtml'
import {Theme} from './theme/default'

export interface AppleNewsConfig {
  /**
   * Mapping of schemas and their configurations which this plugin should be enabled for.
   */
  schema: Record<
    string,
    {
      query?: string
      fields?: Partial<
        Omit<Record<keyof AppleNewsArticleFields, string>, 'theme' | 'author' | 'byline'> & {
          authors: string
        }
      >
    }
  >

  /**
   * Default styles used when generating Apple News Articles
   * The article theme and typography can be customized by setting overrides
   * @see https://developer.apple.com/documentation/apple_news/apple_news_format/enhancing_your_articles_with_styles
   * @see https://developer.apple.com/documentation/apple_news/apple_news_format/text_styles
   */
  theme?: Partial<Theme>

  /**
   * Optional mapping of custom block components to render when converting Portable Text to HTML.
   * This can be used to render custom components in the generated article.
   */
  customBlocks?: CustomBlockRenderer

  /**
   * Optional callback to run after generating an article.
   * This can be used to integrate with publishing workflows
   * (e.g. trigger Webhooks or Zapier workflows).
   *
   * @param article The generated Apple News JSON
   */
  callback?: (article: AppleNews.ArticleDocument) => void
}

const defaultConfig: AppleNewsConfig = {
  schema: {
    article: {},
  },
}

/**
 * Usage in `sanity.config.ts` (or .js)
 *
 * @example
 * ```ts
 * import {defineConfig} from 'sanity'
 * import {appleNews} from '@planetary/sanity-plugin-apple-news'
 *
 * export default defineConfig({
 *   //...
 *   plugins: [
 *     // ...other plugins
 *     appleNews({
 *       // Use default configuration for
 *       article: {},
 *       blogPost: {
 *         fields: {
 *           thumbnail: 'featuredImage',
 *         },
 *       },
 *     }),
 *   ],
 * })
 * ```
 */
export const appleNews = definePlugin<AppleNewsConfig>((config = defaultConfig) => {
  return {
    name: 'sanity-plugin-apple-news',
    document: {
      actions: (prev, ctx) => {
        return [
          ...prev,
          () => {
            const client = ctx.getClient({apiVersion: '2021-06-07'}).withConfig({
              perspective: 'previewDrafts',
            })

            const schemaConfig = config.schema[ctx.schemaType]

            if (!schemaConfig || !ctx.documentId) {
              return null
            }

            return {
              label: 'Generate Apple News article',
              icon: BinaryDocumentIcon,
              onHandle: documentHandler({
                sanityClient: client,
                documentId: ctx.documentId,
                schema: schemaConfig,
                theme: config.theme,
                customBlocks: config.customBlocks,
                callback: config.callback,
              }),
            }
          },
        ]
      },
    },
  }
})

export {defaultTheme} from './theme/default'

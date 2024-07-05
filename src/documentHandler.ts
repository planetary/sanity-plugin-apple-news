import {SanityClient} from 'sanity'
import {SanityDocument} from 'sanity/migrate'

import {AppleNewsConfig} from '.'
import {imgBuilder} from './imageBuilder'
import {makeAppleNewsArticle} from './makeAppleNewsArticle'
import {portableTextToAppleHtml} from './portableTextToAppleHtml'

type DocumentHandlerParams = {
  /**
   * The Sanity client to use for fetching the document.
   */
  sanityClient: SanityClient
  /**
   * Id of the document to generate an Apple News article from.
   */
  documentId: string
  /**
   * Mapping of schemas and their configurations which this plugin should be enabled for.
   */
  schema: AppleNewsConfig['schema'][number]
  /**
   * Default styles used when generating Apple News Articles
   * The article theme and typography can be customized by setting overrides
   * @see https://developer.apple.com/documentation/apple_news/apple_news_format/enhancing_your_articles_with_styles
   * @see https://developer.apple.com/documentation/apple_news/apple_news_format/text_styles
   */
  theme?: AppleNewsConfig['theme']
  /**
   * Optional mapping of custom block components to render when converting Portable Text to HTML.
   * This can be used to render custom components in the generated article.
   */
  customBlocks?: AppleNewsConfig['customBlocks']
  /**
   * Optional callback to run after generating an article.
   * This can be used to integrate with publishing workflows
   * (e.g. trigger Webhooks or Zapier workflows).
   *
   * @param article The generated Apple News JSON
   */
  callback?: AppleNewsConfig['callback']
}

/**
 * Generate an Apple News article from a Sanity document
 */
export const documentHandler =
  ({sanityClient, documentId, schema, theme, callback, customBlocks}: DocumentHandlerParams) =>
  async (): Promise<void> => {
    const query = schema.query ? schema.query : `*[_id == $documentId][0]`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc: SanityDocument & Record<string, any> = await sanityClient.fetch(query, {
      documentId,
    })

    const getFieldValue = <
      K extends keyof NonNullable<AppleNewsConfig['schema'][string]['fields']>,
    >(
      key: K,
    ) => {
      return doc[schema.fields?.[key] ?? key]
    }

    // const authors = doc[schema.fields?.authors ?? 'authors']
    const authors = getFieldValue('authors')

    const article = makeAppleNewsArticle({
      metadata: {
        ...doc.metadata,
        dateCreated: doc._createdAt,
        datePublished: doc._updatedAt,
        dateModified: doc._updatedAt,
      },
      author: {name: authors?.[0]?.name},
      byline:
        authors > 1
          ? authors.slice(1).map((author: {name: string}) => ({name: author.name}))
          : undefined,
      title: `${Date.now().toString()}: ${getFieldValue('title')}`,
      thumbnail: imgBuilder({
        dataset: sanityClient.config().dataset ?? '',
        projectId: sanityClient.config().projectId ?? '',
      })
        .image(getFieldValue('thumbnail'))
        .url(),
      subtitle: getFieldValue('subtitle') ?? '',
      body: portableTextToAppleHtml(getFieldValue('body') || [], {
        customBlocks,
      }),
      theme,
    })

    // If a callback is provided, call it with the article
    if (callback) {
      return callback(article)
    }

    // Otherwise, download the article as a JSON file
    try {
      const blob = new Blob([JSON.stringify(article)], {type: 'application/json'})
      const url = URL.createObjectURL(blob)
      const a = window.document.createElement('a')
      a.href = url
      a.download = 'article.json'
      a.click()
    } catch (error) {
      let errorMessage = 'An unknown error occurred'
      if (error instanceof Error) {
        errorMessage = error.message
        console.error(errorMessage)
      }

      // eslint-disable-next-line no-alert
      alert('Something went wrong. See browser console for details.')
    }

    return undefined
  }

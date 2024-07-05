import {toHTML} from '@portabletext/to-html'

type ContentBlock = Parameters<typeof toHTML>[0]
export type CustomBlockRenderer = NonNullable<Parameters<typeof toHTML>[1]>['components']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toCustomHtml = (
  block: ContentBlock,
  {
    customBlocks,
  }: {
    customBlocks: CustomBlockRenderer
  } = {
    customBlocks: {},
  },
) =>
  toHTML(block, {
    onMissingComponent: false,
    /* optional object of custom components to use */
    components: customBlocks,
  })

export const portableTextToAppleHtml = (
  content: ContentBlock,
  {
    customBlocks,
  }: {
    customBlocks: CustomBlockRenderer
  } = {
    customBlocks: {},
  },
): {
  readonly role: 'body'
  readonly text: string
  readonly format: 'html'
  readonly layout: 'bodyLayout'
  readonly textStyle: 'bodyStyle'
}[] => {
  return (Array.isArray(content) ? content : [content]).map(
    (block) =>
      ({
        role: 'body',
        text: toCustomHtml(block, {customBlocks}),
        format: 'html',
        layout: 'bodyLayout',
        textStyle: 'bodyStyle',
      }) as const,
  )
}

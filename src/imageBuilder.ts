import imageUrlBuilder from '@sanity/image-url'
import {ImageUrlBuilder} from 'sanity'

export const imgBuilder = ({
  projectId,
  dataset,
}: {
  projectId: string
  dataset: string
}): ImageUrlBuilder =>
  imageUrlBuilder({
    projectId,
    dataset,
  })

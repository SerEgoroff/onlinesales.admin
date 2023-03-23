import { createMap, forMember, mapFrom, createMapper } from "@automapper/core";
import { pojos, PojosMetadataMap } from "@automapper/pojos";
import { 
  ContentDetailsDto, 
  ContentUpdateDto, 
  ContentCreateDto
} from "@lib/network/swagger-client.generated";
import { ContentDetails } from "@features/blog/ContentEdit/validation";

export const Automapper = createMapper({
  strategyInitializer: pojos(),
});

PojosMetadataMap.create<ContentDetailsDto>("ContentDetailsDto", {
  title: String,
  description: String,
  body: String,
  coverImageUrl: String,
  coverImageAlt: String,
  slug: String,
  type: String,
  author: String,
  language: String,
  categories: String,
  tags: String,
  allowComments: Boolean,
  id: Number,
  createdAt: String,
  updatedAt: String,
});

PojosMetadataMap.create<ContentDetails>("ContentDetails", {
  tags: [String],
  categories: [String],
  id: Number,
  allowComments: Boolean,
  createdAt: String,
  updatedAt: String,
  description: String,
  body: String,
  coverImageUrl: String,
  coverImageAlt: String,
  slug: String,
  type: String,
  author: String,
  language: String,
});

PojosMetadataMap.create<ContentUpdateDto>("ContentUpdateDto", {
  title: String,
  description: String,
  body: String,
  coverImageUrl: String,
  coverImageAlt: String,
  slug: String,
  type: String,
  author: String,
  language: String,
  categories: String,
  tags: String,
  allowComments: Boolean,
});
PojosMetadataMap.create<ContentCreateDto>("ContentCreateDto", {
  title: String,
  description: String,
  body: String,
  coverImageUrl: String,
  coverImageAlt: String,
  slug: String,
  type: String,
  author: String,
  language: String,
  categories: String,
  tags: String,
  allowComments: Boolean,
});

createMap<ContentDetailsDto, ContentDetails>(
  Automapper,
  "ContentDetailsDto",
  "ContentDetails",
  forMember(
    d => d.tags,
    mapFrom(s => s.tags?.split(";") ?? [])
  ),
  forMember(
    d => d.categories,
    mapFrom(s => s.categories?.split(";") ?? [])
  )
);
createMap<ContentDetails, ContentUpdateDto>(
  Automapper,
  "ContentDetails",
  "ContentUpdateDto",
  forMember(
    d => d.tags,
    mapFrom(s => s.tags.join(";"))
  ),
  forMember(
    d => d.categories,
    mapFrom(s => s.categories.join(";"))
  )
);
createMap<ContentDetails, ContentCreateDto>(
  Automapper,
  "ContentDetails",
  "ContentCreateDto",
  forMember(
    d => d.tags,
    mapFrom(s => s.tags.join(";"))
  ),
  forMember(
    d => d.categories,
    mapFrom(s => s.categories.join(";"))
  )
);
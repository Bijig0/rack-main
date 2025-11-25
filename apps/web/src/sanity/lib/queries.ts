import { groq } from "next-sanity";

export const POSTS_QUERY = groq`*[_type == "post" && defined(slug)] {
 ...,
 "author": author->,
 "excerpt": array::join(string::split((pt::text(body)), "")[0..255], "") + "...",
 "categories": categories[]->{title}
}`;

export const POST_QUERY = groq`*[_type == "post" && slug.current == $slug][0] {
 ...,
 "author": author->,
 "excerpt": array::join(string::split((pt::text(body)), "")[0..255], "") + "...",
 "categories": categories[]->{title}
}`;

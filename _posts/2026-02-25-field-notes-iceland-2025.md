---
title: "Field Notes: Iceland 2025"
subtitle: "Landscape, geology, and light at the edge of the Arctic Circle"
tags: [travel, photography, video, visual]
math: true
toc: true
image: "assets/images/posts/iceland-hero.webp"
image_alt: "Aerial view of Icelandic lava fields at golden hour"
description: "A visual journey through Iceland — images, video, and prose working together."
---

> **Note:** This post was generated with Gemini for the sole purpose of demonstrating the rich typographic and mathematical capabilities of the Eyvan Jekyll template.

The air at the edge of the Arctic Circle does not merely fill your lungs; it shocks the senses into a state of acute clarity. In the late autumn of 2025, I found myself standing on the basalt cliffs of Reykjanes, watching the North Atlantic smash itself to foam against rocks that are, geologically speaking, still in their infancy. Iceland is a landscape stripped of all ornamentation. Here, the planet’s molten spine breaks through the crust, creating a chaotic laboratory of steam, sulfur, and stone. To travel through this terrain with a camera and a notebook is to realize that the earth is not a static stage upon which life plays out, but a living, breathing entity undergoing perpetual transformation[^1].

This post serves as both a creative field journal and a practical stress test for the Eyvan Jekyll template's reusable media tools: numbered figures, responsive image grids, embedded video, table captions, and cross-references. When documenting a landscape defined by scale and contrast, standard web layouts often fail to capture the sheer kinetic energy of the environment. Over the course of three weeks, I sought to blend long-form descriptive prose with diverse visual formats—ranging from high-resolution static frames and multi-image structural grids to responsive, high-definition video captures. The goal was simple: to build an immersive digital archive where text, imagery, and moving pictures do not merely coexist, but actively enrich one another's narrative weight.

## The Textures of Liquid Rock

To understand the Icelandic interior, one must learn to read the language of lava. The landscape is dominated by two primary forms of basaltic flows: *hella-hraun* (smooth, ropey pahoehoe) and *apal-hraun* (jagged, blocky aa). Walking across an ancient *apal-hraun* field is a lesson in tactile geography. Every surface is razor-sharp, encrusted with a brittle layer of grey-green wool-moss (*Racomitrium lanuginosum*) that takes centuries to establish itself over the black glass. The contrast is conceptually striking—the softest, most fragile biological pioneer clinging to the hardest, most violent geological foundation.

{% include figure.html
   id="fig-basalt"
   src="assets/images/posts/iceland-basalt.webp"
   alt="Hexagonal columns of dark volcanic basalt catching golden evening light"
   loading="eager"
   caption="The geometric perfection of columns at Reynisfjara. These basalt structures form via columnar jointing as thick lava flows cool slowly over months, contracting into distinct hexagonal geometric prisms. Image from [Pexels](https://www.pexels.com/photo/rock-formations-on-the-beach-7614602/) by Batın Özen, used under the Pexels License."
%}

When you isolate these structures through a lens, the scale becomes ambiguous. A close-up of a basalt joint looks identical to an aerial view of an entire canyon system. It is a fractal landscape where the micro mirrors the macro. This spatial disorientation is compounded by the quality of the Arctic light. During the shoulder seasons, the sun never rises high into the sky; instead, it scrapes along the horizon for six continuous hours, casting elongated, dramatic shadows that reveal micro-topographies invisible under a standard midday sun. Every grain of silica, every microscopic fissure in the stone, stands out in high relief.

## Juxtaposition: Fire and Ice

Nowhere is the paradox of Iceland more evident than at the boundaries where active geothermal areas collide with glacial runoff. In the southern valleys, one can stand with one foot immersed in a freezing meltwater stream while the back of your neck is warmed by a plume of boiling, sulfurous steam rising from an unseen vent in the earth. The color palette of these zones defies the traditional expectations of a volcanic wasteland. Far from being monochrome, the earth bleeds deep ochres, vivid turquoise, and brilliant copper greens, all synthesized by the extreme chemical interactions occurring just meters beneath the surface.

To capture this intense material contrast, the post uses a two-column responsive figure grid. The side-by-side structure in {% include ref.html id="fig-fire-ice" cref="true" %} provides an ideal framework for examining how these opposing environmental forces occupy the same geographic coordinates.

{% include figure.html
   id="fig-fire-ice"
   cols="2"
   caption="Fire and ice in the same frame: geothermal venting at Námafjall, where minerals stain the clay (left), and compressed ancient ice calving into the dark waters of Jökulsárlón (right). The left image from [Pexels](https://www.pexels.com/photo/brown-ground-near-body-of-water-464399/) by Francesco Ungaro (Jun. 29, 2017), used under the Pexels License, and the right image adapted from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Jokulsarlon_lake,_Iceland.jpg) by Kenny Muir (May 7, 2006), licensed under Creative Commons CC BY 2.0."
   images="
     assets/images/posts/iceland-vent.webp    | A boiling geothermal mud pot venting thick sulfurous steam in Námafjall
     assets/images/posts/iceland-glacier.webp | Deep blue glacial ice calving into a grey glacial lagoon under an overcast sky
   "
%}

In the image on the left, the earth is actively destroying itself—acidic steam dissolving solid rock into bubbling, grey mud pools that smell intensely of elemental sulfur. In the image on the right, the process is reversed; centuries of compressed snowfall are preserved in the dense, oxygen-starved blue ice of the Breiðamerkurjökull tongue, slowly sliding toward its demise in a warming ocean. Both images represent different states of time. The geothermal vent is instantaneous, volatile, and immediate. The glacier is slow, historical, and structural, holding within its crystalline matrix the atmospheric data of past millennia.

## Kinetic Horizons: The Moving Frame

While a photograph can freeze the stark geometries of the landscape, it fundamentally strips away the element of time. Iceland is not silent, nor is it still. It is a land of continuous, roaring motion. The wind is a permanent physical presence, molding the waves, driving the low clouds, and forcing the waterfalls to blow backward over the edges of the escarpments. To truly convey this sensory environment, video must be woven directly into the fabric of the text, functioning as an extension of the prose rather than an afterthought or an external link.

The embed in {% include ref.html id="fig-coast-video" cref="true" %} uses the reusable video include in third-party mode, maintaining a strict 16:9 widescreen aspect ratio across all viewports to preserve the cinematic horizon of the southern coast.

{% include video.html
   provider="youtube"
   embed="https://www.youtube.com/embed/BSQArfDLB88?si=MpNFWwXdhv5DcZ-r"
   ratio="16-9"
   title="YouTube video player"
   caption="The southern coast in motion — surf retreating across black volcanic sand at Reynisfjara."
   id="fig-coast-video" 
%}

Watching the motion of water on black sand reveals patterns that a camera shutter can never capture. The white surf retreats over the volcanic grains, creating fleeting, intricate networks of fluid dynamics that mimic the branch-like structures of regional river deltas seen from space. This convergence of scales—where the motion of a single wave echoes the geometry of a continental drainage basin—is central to the experience of the Arctic landscape. The video framework must be robust enough to handle these complex high-frequency textures without compressing them into digital artifacts.

## Testing Proportions and Spatial Dynamics

Different stories demand different frames. While the 16:9 widescreen aspect ratio is excellent for capturing expansive coastlines and panoramic horizons, it often compresses the vertical majesty of Iceland’s interior canyons and towering waterfalls. To ensure our Jekyll template maintains its visual integrity across varying cinematic standard layouts, we must also evaluate narrower or alternative aspect ratios.

The Vimeo capture in {% include ref.html id="fig-canyon-video" cref="true" %} uses the same video include with an alternate `cinema` ratio, allowing us to evaluate the layout’s ability to scale elements proportionally without breaking typography margins or causing vertical text overlap.

{% include video.html
   id="fig-canyon-video"
   provider="vimeo"
   embed="https://player.vimeo.com/video/76979871"
   ratio="16-9"
   title="Basalt strata in a glacially carved rift valley"
   caption="A taller cinematic frame tracing ancient basalt strata up the wall of a glacially carved rift valley."
%}

In this footage, the focus shifts from horizontal openness to vertical depth. Scaling a canyon wall requires the viewer's eye to move upwards against gravity, tracing the paths of ancient basalt strata that have been sliced open by centuries of glacial erosion. The responsive container ensures that whether this page is viewed on an ultra-wide desktop monitor or a handheld mobile device, the frame retains its proportional balance, keeping the viewer anchored in the deep spatial geometry of the rift valley.

## The Triptych: Elements in Sequence

When compiling field notes, individual frames often gain meaning when placed in immediate sequence with others. A single photo of a landscape can feel isolated; a triptych, however, creates a visual sentence, encouraging the eye to scan from left to right, parsing relationships, shifts in light, and thematic connections. The three-column gallery in {% include ref.html id="fig-triptych" cref="true" %} demonstrates our template’s capacity to handle dense spatial clusters, maintaining clean, uniform margins between independent visual assets.

{% include figure.html
   id="fig-triptych"
   cols="3"
   caption="Three scales of the Icelandic experience: the micro-texture of black volcanic sand, the lone timber church at Búðir dwarfed by ancient volcanic masonry, and the macro-scale aurora lighting the sub-arctic sky. The left image adapted from [Imaggeo](https://imaggeo.egu.eu/view/12544/) by Simon Thivet (Feb. 18, 2014), licensed under Creative Commons CC BY 3.0., the middle image from [Pexels](https://www.pexels.com/photo/wooden-church-on-a-steppe-21700769/) by Bogdan Giurca (Oct. 28, 2023), used under the Pexels License, and the right image adapted from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Aurora_Borealis_activity_on_top_of_the_Kirkjufell_mountain_in_September_2018.jpg) by Vaidyanathan and Archana (Sep. 15, 2018), licensed under Creative Commons CC BY-SA 4.0."
   images="
     assets/images/posts/frozen-volcanic-ash.webp     | Close-up of frozen volcanic ash formations resembling black sand structures
     assets/images/posts/church-at-Buoirdwarfed.webp  | A single solitary wooden church standing against a vast mountain backdrop
     assets/images/posts/Aurora-Borealis.webp         | The glowing green curtains of the Aurora Borealis arching over a dark sea
   "
%}

This sequence encapsulates the three distinct scales of the Icelandic experience: first, the micro-texture of the black volcanic sand beneath your boots; second, the isolated human architectural mark—a lonely timber church at Búðir—dwarfed by the ancient volcanic masonry behind it; and finally, the macro-scale of the cosmos, where the earth's magnetic shield interacts with solar winds, lighting up the sub-arctic sky in brilliant green curtains of aurora. By aligning these frames in parallel, the template mirrors the cognitive process of exploration, shifting fluidly between the intimate, the cultural, and the universal.

## Field Summary

A condensed log of the formats tested across the three-week expedition is given in {% include ref.html id="tbl-formats" cref="true" %}.

{% include table-caption.html
   caption="Media formats stress-tested in this post, with their aspect ratios and narrative role."
   id="tbl-formats" %}

| Media tool | Example | Aspect ratio / layout | Narrative role |
|:-----------|:--------|:----------------------|:---------------|
| `figure.html` | {% include ref.html id="fig-basalt" %} | Single image | Isolated geological detail |
| `figure.html` | {% include ref.html id="fig-fire-ice" %} | 2-column grid | Direct visual comparison |
| `video.html` | {% include ref.html id="fig-coast-video" %} | 16:9 embed | Expansive coastal horizons |
| `video.html` | {% include ref.html id="fig-canyon-video" %} | Cinematic embed | Vertical canyon depth |
| `figure.html` | {% include ref.html id="fig-triptych" %} | 3-column grid | Sequential scale shifts |
{: .c-prose-table}

## Epilogue: The Transience of Stone

As the final light fades from the Reykjanes peninsula, the horizon dissolves into a continuous gradient of deep indigo and soft violet. It is easy to look at Iceland and see a wilderness that is brutal, cold, and utterly indifferent to human presence. Yet, there is a profound quietness that settles over these fields once the wind dies down. The stones, cold to the touch, still hold the abstract memory of the earth's core. They remind us that our human structures, our personal timelines, and our technological frameworks are fleeting anomalies on a planet that measures its age in epochs and cycles of ash. Documenting this landscape is an exercise in humility; we do not capture the land, we merely record our brief passage across its surface.

## Endnotes

[^1]: Cover image from [Pexels](https://www.pexels.com/photo/scenic-landscape-with-dramatic-cloud-formation-37251300/) by Veronika Benz (Apr. 25, 2026), used under the Pexels License.
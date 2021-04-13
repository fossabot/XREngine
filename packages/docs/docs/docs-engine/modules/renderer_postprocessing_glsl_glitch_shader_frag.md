---
id: "renderer_postprocessing_glsl_glitch_shader_frag"
title: "Module: renderer/postprocessing/glsl/glitch/shader.frag"
sidebar_label: "renderer/postprocessing/glsl/glitch/shader.frag"
custom_edit_url: null
hide_title: true
---

# Module: renderer/postprocessing/glsl/glitch/shader.frag

## Properties

### default

• **default**: *uniform sampler2D perturbationMap;

uniform bool active;
uniform float columns;
uniform float random;
uniform vec2 seed;
uniform vec2 distortion;

void mainUv(inout vec2 uv) {

	if(active) {

		if(uv.y < distortion.x + columns && uv.y > distortion.x - columns * random) {

			float sx = clamp(ceil(seed.x), 0.0, 1.0);
			uv.y = sx * (1.0 - (uv.y + distortion.y)) + (1.0 - sx) * distortion.y;

		}

		if(uv.x < distortion.y + columns && uv.x > distortion.y - columns * random) {

			float sy = clamp(ceil(seed.y), 0.0, 1.0);
			uv.x = sy * distortion.x + (1.0 - sy) * (1.0 - (uv.x + distortion.x));

		}

		vec2 normal = texture2D(perturbationMap, uv * random * random).rg;
		uv += normal * seed * (random * 0.2);

	}

}
*

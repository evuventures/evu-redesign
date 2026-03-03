varying vec2 vUv;
uniform vec2 uResolution;
uniform vec3 uColor;

const vec2 fontSize = vec2(32, 32); // or 16×16
float asciiShape(float brightness, vec2 uv) {
    if (brightness < 0.3) {
        return 1.0; // block
    } else if (brightness < 0.6) {
        return step(abs(uv.y - 0.5), 0.1); // line
    } else {
        float d = distance(uv, vec2(0.5));
        return step(d, 0.2); // dot
    }
}

void main() {

    vec2 invViewport = 1.0 / uResolution;

    // 🔥 Snap to ASCII grid
    vec2 gridUV = vUv - mod(vUv, fontSize * invViewport);

    // 🔥 Local position inside cell (0→1)
    vec2 localUV = mod(gl_FragCoord.xy, fontSize) / fontSize;

    vec3 color = uColor;

    // 🔥 IMPORTANT: use UV for variation (otherwise flat)
    float brightness = vUv.y;

    float mask = asciiShape(brightness, localUV);

    gl_FragColor = vec4(color * mask, 1.0);
}
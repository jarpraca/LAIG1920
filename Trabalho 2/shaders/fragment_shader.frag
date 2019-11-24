#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D camera;

uniform float time;

void main() {
    vec2 mirrored_coords = vec2(vTextureCoord.x, 1.0-vTextureCoord.y);
    
	gl_FragColor = texture2D(camera, mirrored_coords);

    vec4 gradient = vec4(0.0, 0.0, 0.0, 1.0);

    vec4 white_stripes = vec4(1.0, 1.0, 1.0, 1.0);

    gl_FragColor = mix(gl_FragColor, gradient, sqrt((vTextureCoord.x-0.5)*(vTextureCoord.x-0.5) + (vTextureCoord.y-0.5)*(vTextureCoord.y-0.5)));

    
    gl_FragColor = mix(gl_FragColor, white_stripes,  
            (sin(-(vTextureCoord.y + time) * 20.0) * sin(-(vTextureCoord.y + time) * 20.0) * sin(-(vTextureCoord.y + time) * 20.0) * sin(-(vTextureCoord.y + time) * 20.0))/2.0 - 0.05
    );
    
}



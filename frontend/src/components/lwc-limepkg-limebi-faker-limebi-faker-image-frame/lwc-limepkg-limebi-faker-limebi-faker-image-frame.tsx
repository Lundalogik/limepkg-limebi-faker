import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
} from '@limetech/lime-web-components';

import { Component, h, Prop } from '@stencil/core';

@Component({
    tag: 'lwc-limebi-faker-image-frame',
    shadow: true,
    styleUrl: 'lwc-limepkg-limebi-faker-limebi-faker-image-frame.scss',
})
export class LwcLimeBiFakerImageFrame implements LimeWebComponent {
    /**
     * @inherit
     */
    @Prop()
    public platform: LimeWebComponentPlatform;

    /**
     * @inherit
     */
    @Prop()
    public context: LimeWebComponentContext;

    @Prop()
    public imageUrl: string;

    public render() {
        return <img class="metabase-Iframe" src={this.imageUrl} />;
    }
}

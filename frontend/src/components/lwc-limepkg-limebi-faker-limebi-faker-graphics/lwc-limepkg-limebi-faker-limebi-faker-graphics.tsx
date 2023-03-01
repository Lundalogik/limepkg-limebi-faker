import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
    PlatformServiceName,
    HttpClient,
    LimeType,
    SelectLimeTypes,
    SelectConfig,
} from '@limetech/lime-web-components';
import { Component, h, Prop, State } from '@stencil/core';

interface LimeobjectResponse {
    _links: { next: { href: string } };
    _embedded: { limeobjects: any[] };
}
interface ImageData {
    filename: string;
    label: string;
    src: string;
}

const DOCUMENT_LIMETYPE_FILE_PROPERTY = 'document';

@Component({
    tag: 'lwc-limebi-faker-graphics',
    shadow: true,
    styleUrl: 'lwc-limepkg-limebi-faker-limebi-faker-graphics.scss',
})
export class LwcLimebiFakerGraphics implements LimeWebComponent {
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
    public config: string;

    @SelectConfig({ name: 'limepkg_limebi_faker' })
    @State()
    private addonConfig;

    @SelectLimeTypes()
    @State()
    public limetypes: { [name: string]: LimeType };

    @State()
    private imageData: ImageData = null;

    private http: HttpClient;

    public async componentWillLoad() {
        const documentid =
            this.addonConfig.fake_grid_images[`fake_document_id${this.config}`];

        this.http = this.platform.get(PlatformServiceName.Http);
        this.imageData = await this.getImages(this.http, documentid);
    }

    public render() {
        const label = this.imageData.label;

        return (
            <div class="lime-bi-container">
                <div class="header">
                    <limel-icon
                        name="bar_chart"
                        size="small"
                        badge={true}
                        class="Lime-bi"
                    />
                    <div class="lime-bi-text">{label}</div>
                    <limel-icon-button
                        class="expand"
                        label="expand"
                        icon="expand"
                        // onClick={this.openDialog}
                    />
                </div>
                {this.renderImage()}
                <div />
            </div>
        );
    }

    private renderImage = () => {
        return <lwc-limebi-faker-image-frame imageUrl={this.imageData.src} />;
    };

    private performRequest = async (
        http: HttpClient,
        requestUrl: string
    ): Promise<LimeobjectResponse> => {
        return http.get(requestUrl);
    };
    private getImages = async (
        http: HttpClient,
        id: number
    ): Promise<ImageData> => {
        const url = `api/v1/limeobject/document/${id}/?_embed=${DOCUMENT_LIMETYPE_FILE_PROPERTY}`;
        const currentResponse = await this.performRequest(http, url);

        return this.mapToImage(currentResponse);
    };

    private mapToImage = (imageData: any): any => {
        const fileMeta =
            // eslint-disable-next-line no-underscore-dangle
            imageData._embedded[`relation_${DOCUMENT_LIMETYPE_FILE_PROPERTY}`];

        return {
            filename: fileMeta.filename,
            label: fileMeta.filename.replace(`.${fileMeta.extension}`, ''),
            // eslint-disable-next-line no-underscore-dangle
            src: fileMeta._links.contents.href,
        };
    };
}

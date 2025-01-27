/* tslint:disable */
/* eslint-disable */
// Generated by Microsoft Kiota
// @ts-ignore
import { MultipartBody, serializeMultipartBody, type BaseRequestBuilder, type Parsable, type ParsableFactory, type RequestConfiguration, type RequestInformation, type RequestsMetadata } from '@microsoft/kiota-abstractions';

/**
 * Builds and executes requests for operations under /handle-form
 */
export interface HandleFormRequestBuilder extends BaseRequestBuilder<HandleFormRequestBuilder> {
    /**
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {Promise<ArrayBuffer>}
     */
     post(body: MultipartBody, requestConfiguration?: RequestConfiguration<object> | undefined) : Promise<ArrayBuffer | undefined>;
    /**
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns {RequestInformation}
     */
     toPostRequestInformation(body: MultipartBody, requestConfiguration?: RequestConfiguration<object> | undefined) : RequestInformation;
}
/**
 * Uri template for the request builder.
 */
export const HandleFormRequestBuilderUriTemplate = "{+baseurl}/handle-form";
/**
 * Metadata for all the requests in the request builder.
 */
export const HandleFormRequestBuilderRequestsMetadata: RequestsMetadata = {
    post: {
        uriTemplate: HandleFormRequestBuilderUriTemplate,
        adapterMethodName: "sendPrimitive",
        responseBodyFactory:  "ArrayBuffer",
        requestBodyContentType: "multipart/form-data",
        requestBodySerializer: serializeMultipartBody,
        requestInformationContentSetMethod: "setContentFromParsable",
    },
};
/* tslint:enable */
/* eslint-enable */

/**
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

import powerbi from "powerbi-visuals-api";
import IEnumMember = powerbi.IEnumMember;
import IViewport = powerbi.IViewport;
import ISelectionId = powerbi.visuals.ISelectionId;

import { SeriesSettings } from "../../settings/seriesSettings";
import { DataRepresentationScale } from "./dataRepresentationScale";

export interface IDataRepresentationPoint {
    x: Date;
    y: number;
    index: number;
}

export enum DataRepresentationPointGradientType {
    line = "line",
    area = "area",
}

export interface IEnumMemberWithDisplayNameKey extends IEnumMember{
    key: string;
}

export const dataRepresentationOptions : IEnumMemberWithDisplayNameKey[] = [
    {value : DataRepresentationPointGradientType[DataRepresentationPointGradientType.area], displayName : "Area", key: "Visual_Area"},
    {value : DataRepresentationPointGradientType[DataRepresentationPointGradientType.line], displayName : "Line", key: "Visual_Line"}
];

export type DataRepresentationAxisValueType = Date | number;

export interface IDataRepresentationAxis {
    min: DataRepresentationAxisValueType;
    initialMin: DataRepresentationAxisValueType;
    max: DataRepresentationAxisValueType;
    initialMax: DataRepresentationAxisValueType;
    scale: DataRepresentationScale;
}

export interface IDataRepresentationSeries {
    name: string;
    index: number;
    points: IDataRepresentationPoint[]; // All data points as is
    smoothedPoints: IDataRepresentationPoint[]; // Interpolated data points
    current: IDataRepresentationPoint;
    x: IDataRepresentationAxis;
    y: IDataRepresentationAxis;
    ySparkline: IDataRepresentationAxis;
    variance: number;
    formattedVariance: string;
    formattedDate: string;
    dateDifference: number;
    staleDateDifference?: number;
    tooltip: string;
    formattedTooltip: string;
    selectionId: ISelectionId;
    settings: SeriesSettings;
    isLine: boolean; // There is a bag in SVG that hide line that has gradient attachment. The mark indicate to apply workaround
}

export enum ViewportSize {
    tiny = "tiny",
    small = "small",
    medium = "medium",
    normal = "normal",
    big = "big",
    huge = "huge",
    enormous = "enormous",
}

export interface IDataRepresentation {
    series: IDataRepresentationSeries[];
    sortedSeries: IDataRepresentationSeries[];
    warningState: number;
    latestDate: Date;
    staleDateDifference?: number;
    percentCalcDate: Date;
    subtitle?: string;
    viewport: IViewport;
    viewportSize: ViewportSize;
}

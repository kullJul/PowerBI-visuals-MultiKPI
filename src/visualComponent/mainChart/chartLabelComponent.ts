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
import IViewport = powerbi.IViewport;

import { FormatDescriptor } from "../../settings/descriptors/formatDescriptor";
import { KpiDescriptor } from "../../settings/descriptors/kpi/kpiDescriptor";

import { IDataRepresentationSeries } from "../../converter/data/dataRepresentation";

import { IVisualComponentConstructorOptions } from "../visualComponentConstructorOptions";

import { ChartLabelBaseComponent } from "./chartLabelBaseComponent";

import { getFormattedValueWithFallback } from "../../converter/data/dataFormatter";
import { EventName } from "../../event/eventName";
import { isValueValid } from "../../utils/isValueValid";

export interface IChartLabelComponentRenderOptions {
    dateSettings: FormatDescriptor;
    kpiSettings: KpiDescriptor;
    series: IDataRepresentationSeries;
    viewport: IViewport;
}

export class ChartLabelComponent extends ChartLabelBaseComponent<IChartLabelComponentRenderOptions> {
    private componentClassName: string = "chartLabelComponent";

    constructor(options: IVisualComponentConstructorOptions) {
        super(options);

        this.element.classed(
            this.getClassNameWithPrefix(this.componentClassName),
            true,
        );

        this.constructorOptions.eventDispatcher.on(
            `${EventName.onMouseMove}.${this.componentClassName}`,
            this.hide.bind(this),
        );

        this.constructorOptions.eventDispatcher.on(
            `${EventName.onMouseOut}.${this.componentClassName}`,
            this.show.bind(this),
        );
    }

    public render(options: IChartLabelComponentRenderOptions): void {
        const {
            series,
            kpiSettings,
        } = options;

        this.updateFormatting(this.element, options.kpiSettings);

        if (!series || !series.points) {
            this.hide();

            return;
        } else {
            this.show();
        }

        const value: number = series.current ? series.current.y : NaN;

        this.renderGroup(
            this.headerSelector,
            [
                {
                    color: kpiSettings.seriesNameColor.value.value,
                    data: series.name,
                    fontSizeInPt: kpiSettings.autoAdjustFontSize.value
                        ? null
                        : kpiSettings.seriesNameFontSize.value,
                    isShown: kpiSettings.isSeriesNameShown.value,
                },
            ],
        );

        const isVarianceValid: boolean = isValueValid(series.variance);

        this.renderGroup(
            this.bodySelector,
            [
                {
                    color: kpiSettings.valueColor.value.value,
                    data: getFormattedValueWithFallback(value, series.settings.values),
                    fontSizeInPt: kpiSettings.autoAdjustFontSize.value
                        ? null
                        : kpiSettings.valueFontSize.value,
                    isShown: kpiSettings.isValueShown.value,
                },
                {
                    color: isVarianceValid
                        ? kpiSettings.varianceColor.value.value
                        : kpiSettings.varianceNotAvailableColor.value.value,
                    data: `(${series.formattedVariance})`,
                    fontSizeInPt: kpiSettings.autoAdjustFontSize.value
                        ? null
                        : isVarianceValid 
                            ? kpiSettings.varianceFontSize.value
                            : kpiSettings.varianceNotAvailableFontSize.value,
                    isShown: kpiSettings.isVarianceShown.value,
                    selector: isVarianceValid || !kpiSettings.autoAdjustFontSize.value
                        ? undefined
                        : this.varianceNotAvailableSelector,
                },
            ],
        );

        this.renderGroup(
            this.footerSelector,
            [
                {
                    color: kpiSettings.dateColor.value.value,
                    data: `${series.dateDifference} days`,
                    fontSizeInPt: kpiSettings.autoAdjustFontSize.value
                        ? null
                        : kpiSettings.dateFontSize.value,
                    isShown: kpiSettings.isDateShown.value,
                },
            ],
        );
    }
}

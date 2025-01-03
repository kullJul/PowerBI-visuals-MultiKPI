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
import ValidatorType = powerbi.visuals.ValidatorType;

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import FormattingSettingsSlice = formattingSettings.Slice;
import NumUpDown = formattingSettings.NumUpDown;
import ToggleSwitch = formattingSettings.ToggleSwitch;

import { BaseDescriptor } from "./baseDescriptor";
import { IDescriptor } from "./descriptor";

export class GridDescriptor extends BaseDescriptor implements IDescriptor{
    public static MaxColumns: number = 15;
    public name: string = "grid";
    public displayNameKey: string = "Visual_SparklineGrid";

    private minColumns: number = 1;

    public columns: NumUpDown = new NumUpDown({
        name: "columns",
        displayNameKey: "Visual_Columns",
        value: null,
        options: {
            minValue: {
                type: ValidatorType.Min,
                value: this.minColumns
            },
            maxValue: {
                type: ValidatorType.Max,
                value: GridDescriptor.MaxColumns
            }
        }
    });

    public toggleSparklineOnHover: ToggleSwitch = new ToggleSwitch({
        name: "toggleSparklineOnHover",
        displayNameKey: "Visual_ToggleSparklineOnHover",
        descriptionKey: "Visual_ToggleSparklineOnHoverDescription",
        value: true
    });

    public slices: FormattingSettingsSlice[] = [this.columns, this.toggleSparklineOnHover];

    public parse(): void {
        this.columns.value = isNaN(this.columns.value) || this.columns.value === null
            ? this.columns.value
            : Math.max(
                Math.min(this.columns.value, GridDescriptor.MaxColumns),
                this.minColumns,
            );
    }
}

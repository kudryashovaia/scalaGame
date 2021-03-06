declare module "react-maskedinput" {
    // Type definitions for react-maskedinput 4.0
    // Project: https://github.com/insin/react-maskedinput
    // Definitions by: Karol Janyst <https://github.com/LKay>,
    //     Adam Lavin <https://github.com/lavoaster>
    // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
    // TypeScript Version: 2.3

    import * as React from "react";

    export interface FormatCharacter {
        validate(char: string): string;
        transform?(char: string): string;
    }

    export interface CharsFormatters {
        [char: string]: FormatCharacter;
    }

    export interface MaskedInputProps extends React.HTMLAttributes<any> {
        mask: string;
        value?: string;
        placeholder?: string;
        formatCharacter?: CharsFormatters;
        placeholderChar?: string;
    }

    declare class MaskedInput extends React.Component<MaskedInputProps> {}
    export default MaskedInput;
}

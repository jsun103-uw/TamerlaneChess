import React from "react";

type PositionedCSSProperties = React.CSSProperties & {
    "--x"?: string;
    "--y"?: string;
};

export default PositionedCSSProperties;
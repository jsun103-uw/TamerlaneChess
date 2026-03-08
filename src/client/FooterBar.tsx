import React from "react";
import ChangeableText from "./ChangeableText";

export interface FooterBarProperties {
    readonly onChanged?: (text: string) => (void);
}
export default function FooterBar(props: FooterBarProperties) {
    return (
        <footer className="d-flex flex-row-reverse align-items-center">
            <ChangeableText 
                onChanged={(text: string): (void) => {
                    console.log("changed");
                    props.onChanged?.(text);
                }
            } />
        </footer>
    )
}
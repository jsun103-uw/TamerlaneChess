import React from "react";
import ChangeableText from "./ChangeableText";

export default function FooterBar() {
    return (
        <footer className="d-flex flex-row-reverse align-items-center">
            <ChangeableText 
                onChanged={(text: string): (void) => {
                    console.log("changed");
                }
            } />
        </footer>
    )
}
import React from "react";
import { useState } from "react"

export interface ChangeableTextProperties {
    onChanged: (text: string) => (void);
}
export default function ChangeableText(props: ChangeableTextProperties) {
    const [text, setText] = useState<string>("")
    const [changing, setChanging] = useState<boolean>(false);

    if (changing) {
        return (
            <>
                <button onClick={() => setChanging(false)}>C</button>
                <input 
                    type="text" 
                    value={text} 
                    onChange={(e) => {
                        setText(e.target.value);
                    }
                }/>
            </>
        )
    }
    else {
        return (
            <>
                <button onClick={() => setChanging(true)}>C</button>
                <p>{text}</p>
            </>
        )
    }
}